import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import { Badge } from "react-bootstrap";
import { X, Star, ChatRightText, HeartFill, SendFill } from "react-bootstrap-icons";

const WorkDetail = () => {
    const { workId } = useParams();
    const navigate = useNavigate();

    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [likes, setLikes] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchDetail = async () => {
            try {
                // 1. 作品の詳細情報を取得
                const result = await ApiCommunication.fetchWorkDetail(jwt, workId);
                setWork(result);
                setLikes(result.likesCount || 0);

                // 2. 認証付きで画像データを取得
                const imageRes = await fetch(`http://localhost:8080/api/works/${workId}/file`, {
                    headers: { "Authorization": `Bearer ${jwt}` }
                });
                if (imageRes.ok) {
                    const blob = await imageRes.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                }
            } catch (err) {
                console.error("データ取得失敗:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [workId, navigate]);

    const handleLike = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            const newCount = await ApiCommunication.addLike(jwt, workId);
            setLikes(newCount);
        } catch (err) {
            console.error("いいね失敗:", err);
        }
    };

    const handleAddAlbum = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            await ApiCommunication.addToAlbum(jwt, workId);
            alert("マイアルバムに追加しました！");
        } catch (err) {
            alert("既に追加されているか、失敗しました");
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;
        try {
            const jwt = localStorage.getItem("jwt");
            await ApiCommunication.addComment(jwt, workId, commentText);
            setCommentText("");
            window.location.reload();
        } catch (err) {
            alert("コメント送信に失敗しました");
        }
    };

    if (loading) return <p className="text-center mt-5">読み込み中...</p>;
    if (!work) return <p className="text-center mt-5">作品が見つかりません</p>;

    return (
        <div className="d-flex w-100" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            {/* サイドバー */}
            <aside className="d-none d-md-block" style={{ width: "240px", backgroundColor: "#e0e0e0", position: "fixed", height: "100vh", zIndex: 1000 }}>
                <div className="text-center py-4">
                    <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
                    <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px auto" }} />
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "40px", width: "calc(100% - 240px)" }}>

                {/* カスタムCSS */}
                <style>{`
                    @media (max-width: 767px) {
                        main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; }
                    }
                    .fixed-close-btn {
                        position: fixed; 
                        top: 25px; 
                        right: 30px; 
                        z-index: 2001;
                        background-color: #ffffff; /* 白背景 */
                        border: 1px solid #ddd;
                        border-radius: 50%; 
                        padding: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* 影をつけて浮き立たせる */
                        transition: transform 0.2s ease;
                    }
                    .fixed-close-btn:hover {
                        transform: scale(1.1);
                        background-color: #f8f9fa;
                    }
                    .action-btn:hover { opacity: 0.7; transition: 0.2s; }
                `}</style>

                {/* 右上固定 ×ボタン（黒色に修正） */}
                <button
                    className="fixed-close-btn"
                    onClick={() => showComments ? setShowComments(false) : navigate(-1)}
                    title="閉じる"
                >
                    <X size={40} color="#000000" /> {/* 黒色指定 */}
                </button>

                <div className="mb-4">
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{work.title}</h1>
                    <hr style={{ width: "100%", maxWidth: "450px", borderTop: "2px solid #000", opacity: 1 }} />
                </div>

                {/* プレビューエリア */}
                <div className="mb-5 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                    style={{ width: "100%", aspectRatio: "21 / 9", backgroundColor: "#aaddff", borderRadius: "8px" }}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Work Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span className="text-muted" style={{ fontSize: "1.5rem" }}>No Preview</span>
                    )}
                </div>

                {/* 下部カードエリア */}
                <div style={{ backgroundColor: "#f2f2f2", padding: "35px", borderRadius: "15px", minHeight: "450px" }}>
                    {!showComments ? (
                        <div className="animate__animated animate__fadeIn">
                            <div className="mb-4 p-4 bg-white border shadow-sm text-center" style={{ borderRadius: "10px" }}>
                                <p className="mb-0" style={{ fontSize: "1.2rem", color: "#333" }}>{work.explanation}</p>
                            </div>

                            <div className="d-flex flex-wrap justify-content-between align-items-center mt-5">
                                <div className="d-flex gap-2">
                                    {work.tags?.map(t => (
                                        <Badge key={t.tagId} pill bg="secondary" className="px-3 py-2 text-dark" style={{ backgroundColor: "#d1d1d1", fontSize: "0.9rem" }}>
                                            {t.tagName}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="d-flex gap-4 align-items-center">
                                    <div className="text-center action-btn" onClick={handleAddAlbum} style={{ cursor: "pointer" }}>
                                        <Star size={42} color="#f1c40f" />
                                        <div style={{ fontSize: "0.75rem", marginTop: "5px", fontWeight: "bold" }}>マイアルバム</div>
                                    </div>
                                    <div className="text-center action-btn" onClick={() => setShowComments(true)} style={{ cursor: "pointer" }}>
                                        <ChatRightText size={42} color="#333" />
                                        <div style={{ fontSize: "0.75rem", marginTop: "5px", fontWeight: "bold" }}>コメント</div>
                                    </div>
                                    <div className="d-flex align-items-center p-2 px-4 rounded-pill shadow-sm action-btn"
                                        style={{ backgroundColor: "#ffb6c1", cursor: "pointer" }} onClick={handleLike}>
                                        <HeartFill size={26} color="#e91e63" className="me-2" />
                                        <span className="fw-bold" style={{ fontSize: "1.2rem" }}>{likes}</span>
                                        <div className="ms-2" style={{ fontSize: "0.75rem", fontWeight: "bold" }}>いいね</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 p-3 border-start border-4 border-dark bg-white shadow-sm">
                                <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                                    <strong>投稿者:</strong> {work.username || "Unknown"}
                                </small>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column h-100 animate__animated animate__fadeIn">
                            <h3 className="border-bottom border-2 border-dark pb-2 mb-4">Comments</h3>
                            <div className="flex-grow-1 overflow-auto my-2" style={{ maxHeight: "450px", paddingRight: "10px" }}>
                                {work.comments?.length > 0 ? (
                                    work.comments.map((c, i) => (
                                        <div key={i} className="mb-4">
                                            <div className="bg-white p-3 shadow-sm" style={{ borderRadius: "18px 18px 18px 0", maxWidth: "80%", border: "1px solid #eee" }}>
                                                {c.content}
                                            </div>
                                            <small className="ms-2 text-muted" style={{ fontSize: "0.8rem" }}>
                                                <strong>@{c.username}</strong> • {c.sentAt}
                                            </small>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <p style={{ fontSize: "1.2rem" }}>まだコメントはありません。最初のコメントを書き込みましょう！</p>
                                    </div>
                                )}
                            </div>
                            <div className="position-relative mt-4">
                                <textarea className="form-control shadow-sm" rows="3"
                                    placeholder="ここにテキスト入力して送信は右下のアイコンをクリック..."
                                    value={commentText} onChange={e => setCommentText(e.target.value)}
                                    style={{ borderRadius: "15px", paddingRight: "60px", border: "2px solid #ddd" }} />
                                <button onClick={handleSendComment}
                                    style={{ position: "absolute", right: "15px", bottom: "10px", border: "none", background: "none", padding: "5px" }}>
                                    <SendFill size={30} color="#333" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WorkDetail;
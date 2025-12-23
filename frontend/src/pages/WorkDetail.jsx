// src/pages/WorkDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiCommunicationExample from "../api/ApiCommunicationExample";
import AuthenticatedImage from "../components/AuthenticatedImage";
import { Badge } from "react-bootstrap";
import { House, Search, Upload, Images, Person, Star, StarFill, X, ChatRightText, HeartFill, SendFill } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";

const WorkDetail = () => {
    const { workId } = useParams();
    const navigate = useNavigate();

    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [likes, setLikes] = useState(0);

    // アルバム登録状態
    const [isInAlbum, setIsInAlbum] = useState(false);
    // いいね登録状態
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchDetail = async () => {
            try {
                // 1. 作品詳細の取得
                const result = await ApiCommunicationExample.fetchWorkDetail(jwt, workId);
                setWork(result);
                setLikes(result.likesCount || 0);

                // 2. アルバムに既にあるかチェック
                const albumList = await ApiCommunicationExample.fetchMyAlbum(jwt);
                const existsInAlbum = albumList.some(item => String(item.id) === String(workId));
                setIsInAlbum(existsInAlbum);

                // 3. いいね済みかチェック
                const likedStatus = localStorage.getItem(`liked_${workId}`) === "true";
                setIsLiked(likedStatus);

            } catch (err) {
                console.error("データ取得失敗:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [workId, navigate]);

    // --- ハンドラー関数 ---
    const handleToggleAlbum = async () => {
        const jwt = localStorage.getItem("jwt");
        try {
            if (!isInAlbum) {
                await ApiCommunicationExample.addToAlbum(jwt, workId);
                setIsInAlbum(true);
            } else {
                await ApiCommunicationExample.removeFromAlbum(jwt, workId);
                setIsInAlbum(false);
            }
        } catch (err) {
            console.error("アルバム操作失敗:", err);
        }
    };

    const handleToggleLike = async () => {
        const jwt = localStorage.getItem("jwt");
        try {
            if (!isLiked) {
                const newCount = await ApiCommunicationExample.addLike(jwt, workId);
                setLikes(newCount);
                setIsLiked(true);
                localStorage.setItem(`liked_${workId}`, "true");
            } else {
                const newCount = await ApiCommunicationExample.removeLike(jwt, workId);
                setLikes(newCount);
                setIsLiked(false);
                localStorage.removeItem(`liked_${workId}`);
            }
        } catch (err) {
            console.error("いいね操作失敗:", err);
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;
        try {
            const jwt = localStorage.getItem("jwt");
            await ApiCommunicationExample.addComment(jwt, workId, commentText);
            setCommentText("");
            window.location.reload();
        } catch (err) {
            console.error("コメント送信失敗:", err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white p-5">
                <div style={{ width: "100%", maxWidth: "800px" }}>
                    <h2 className="text-center mb-4 fw-bold" style={{ fontSize: "2.5rem" }}>作品を読み込み中...</h2>
                    <div className="progress shadow-sm" style={{ height: "60px", borderRadius: "30px" }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-dark" style={{ width: "100%", fontSize: "1.8rem" }}>Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!work) return <p className="text-center mt-5 fs-3">作品が見つかりません</p>;

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            {/* サイドバー */}
            <Sidebar />

            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px 60px 20px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .fixed-close-btn { position: fixed; top: 25px; right: 30px; z-index: 2001; background-color: #fff; border: 1px solid #ddd; border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; cursor: pointer; }
                    .detail-card { background-color: #f2f2f2; padding: 50px; border-radius: 25px; width: 100%; margin-top: 40px; border: 1px solid #eee; }
                    .info-display-box { background-color: #fff; border: 2px solid #ddd; border-radius: 15px; padding: 30px; font-size: 1.4rem; min-height: 180px; text-align: left; }
                    .action-item { cursor: pointer; transition: all 0.2s ease-in-out; display: flex; flex-direction: column; align-items: center; position: relative; }
                    .like-count-badge { position: absolute; top: -8px; right: -12px; background-color: #e91e63; color: white; border-radius: 20px; padding: 2px 10px; font-size: 0.9rem; font-weight: bold; border: 2px solid white; }
                `}</style>

                <button className="fixed-close-btn" onClick={() => showComments ? setShowComments(false) : navigate(-1)}><X size={40} color="#000" /></button>

                <div className="mb-5 text-start">
                    <h1 className="fw-bold" style={{ fontSize: "3.5rem" }}>{work.title}</h1>
                    <hr style={{ width: "100%", maxWidth: "800px", borderTop: "5px solid #000", opacity: 1 }} />
                </div>

                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-12 col-xl-11">
                            {/* ★ AuthenticatedImage コンポーネントを使用 */}
                            <div className="mb-2 shadow-sm overflow-hidden d-flex align-items-center justify-content-center border border-2 border-dark"
                                style={{ width: "100%", aspectRatio: "21 / 9", backgroundColor: "#aaddff", borderRadius: "15px" }}>
                                <AuthenticatedImage
                                    workId={workId}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>

                            <div className="detail-card shadow-sm">
                                {!showComments ? (
                                    <div className="animate__animated animate__fadeIn">
                                        <section className="mb-5 text-start">
                                            <h4 className="fw-bold mb-3" style={{ fontSize: "1.6rem" }}>■ 作品説明</h4>
                                            <div className="info-display-box shadow-sm">{work.explanation || "（説明はありません）"}</div>
                                        </section>

                                        <div className="row align-items-center g-4 text-start">
                                            <div className="col-12 col-lg-6">
                                                <h4 className="fw-bold mb-3" style={{ fontSize: "1.6rem" }}>■ カテゴリー</h4>
                                                <div className="d-flex flex-wrap gap-3 mt-2">
                                                    {work.tags?.map(t => (
                                                        <Badge
                                                            key={t.tagId}
                                                            pill
                                                            className="px-4 py-2 text-dark border border-dark"
                                                            style={{
                                                                backgroundColor: "#d0d0d0",
                                                                fontSize: "1.1rem", // ★ 文字サイズを固定
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            {t.tagName}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6 d-flex justify-content-lg-end gap-5">
                                                <div className="action-item" onClick={handleToggleAlbum}>
                                                    {isInAlbum ? <StarFill size={50} color="#f1c40f" /> : <Star size={50} color="#333" />}
                                                    <div className="fw-bold mt-2" style={{ color: isInAlbum ? "#f1c40f" : "#333" }}>アルバム</div>
                                                </div>
                                                <div className="action-item" onClick={() => setShowComments(true)}>
                                                    <ChatRightText size={50} color="#333" />
                                                    <div className="fw-bold mt-2">コメント</div>
                                                </div>
                                                <div className="action-item" onClick={handleToggleLike}>
                                                    <HeartFill size={50} color={isLiked ? "#e91e63" : "#333"} />
                                                    <div className="fw-bold mt-2" style={{ color: isLiked ? "#e91e63" : "#333" }}>いいね</div>
                                                    <span className="like-count-badge">{likes}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-top border-2 border-dark">
                                            <span className="fs-4 fw-bold text-muted">投稿者: @{work.username || "Unknown"}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column h-100 animate__animated animate__fadeIn text-start">
                                        <h2 className="fw-bold border-bottom border-4 border-dark pb-3 mb-4">Comments</h2>
                                        <div className="flex-grow-1 overflow-auto my-2 pe-3" style={{ maxHeight: "500px" }}>
                                            {work.comments?.length > 0 ? (
                                                work.comments.map((c, i) => (
                                                    <div key={i} className="mb-4 d-flex flex-column align-items-start">
                                                        <div className="bg-white p-4 shadow-sm border border-2" style={{ borderRadius: "20px 20px 20px 0", maxWidth: "80%", fontSize: "1.3rem" }}>{c.content}</div>
                                                        <small className="mt-2 ms-2 fw-bold text-muted fs-6">@{c.username} • {c.sentAt}</small>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="fs-3 text-muted py-5 text-center w-100">まだコメントはありません。</p>
                                            )}
                                        </div>
                                        <div className="position-relative mt-4">
                                            <textarea className="form-control shadow-sm border-2 fs-4" rows="3" placeholder="メッセージを入力..." value={commentText} onChange={e => setCommentText(e.target.value)} style={{ borderRadius: "20px", paddingRight: "100px" }} />
                                            <button onClick={handleSendComment} style={{ position: "absolute", right: "25px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none" }}>
                                                <SendFill size={45} color="#333" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WorkDetail;
// src/pages/MyAlbum.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";

const MyAlbum = () => {
    const navigate = useNavigate();
    const [albumWorks, setAlbumWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchAlbum = async () => {
            try {
                // バックエンドの GET /api/works/album を叩く
                const data = await ApiCommunication.fetchMyAlbum(jwt);
                setAlbumWorks(data);
            } catch (error) {
                console.error("アルバム取得エラー:", error);
                if (error.message.includes("401")) navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [navigate]);

    const handleRemove = async (e, workId) => {
        e.stopPropagation(); // 詳細画面への遷移を防ぐ
        if (!window.confirm("アルバムから削除しますか？")) return;
        try {
            const jwt = localStorage.getItem("jwt");
            await ApiCommunication.removeFromAlbum(jwt, workId);
            setAlbumWorks(albumWorks.filter(w => w.id !== workId));
        } catch (error) {
            alert("削除に失敗しました");
        }
    };

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            {/* サイドバー: 左端固定 */}
            <aside className="d-none d-md-block shadow-sm" style={{
                width: "240px",
                backgroundColor: "#e0e0e0",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100vh",
                zIndex: 1000
            }}>
                <div className="text-center py-4">
                    <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
                    <div className="mx-auto" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px 0" }} />
                </div>

                <ul className="list-group list-group-flush mt-2 px-3">
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}><House className="me-3" size={24} /> ホーム</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/find")}><Search className="me-3" size={24} /> 見つける</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/upworks")}><Upload className="me-3" size={24} /> 作品投稿</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/pastworks")}><Images className="me-3" size={24} /> 過去作品</li>
                    {/* マイアルバムをアクティブ状態に */}
                    <li className="list-group-item border-0 py-4 fw-bold active text-dark" style={{ backgroundColor: "#d0d0d0", borderRadius: "10px" }}>
                        <Star className="me-3" size={24} color="#f1c40f" /> マイアルバム
                    </li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }}><Person className="me-3" size={24} /> プロフィール</li>
                </ul>

                <div className="position-absolute bottom-0 w-100 p-3 mb-3">
                    <button className="btn btn-outline-danger w-100 border-2 py-2 fw-bold" onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}>
                        <BoxArrowRight className="me-2" /> ログアウト
                    </button>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1" style={{
                marginLeft: "240px",
                padding: "60px 40px",
                width: "calc(100% - 240px)",
                minWidth: 0
            }}>

                <style>{`
                    @media (max-width: 767px) {
                        main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; }
                    }
                    .fixed-close-btn {
                        position: fixed; top: 25px; right: 30px; z-index: 2001;
                        background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; 
                        padding: 8px; display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease;
                    }
                    .fixed-close-btn:hover { transform: scale(1.1); background-color: #f8f9fa; }
                    .work-card {
                        border-radius: 15px; overflow: hidden; transition: all 0.3s ease;
                        background: #f8f9fa; border: 2px solid #eee; position: relative;
                    }
                    .work-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
                        border-color: #333;
                    }
                    .image-container {
                        width: 100%; aspect-ratio: 1 / 1; background-color: #f0f0f0;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .remove-btn-overlay {
                        position: absolute; top: 15px; right: 15px; z-index: 10;
                        background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
                        width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: 0.2s;
                    }
                    .remove-btn-overlay:hover { background: #ff4d4d; color: white; transform: scale(1.1); }
                    .empty-card {
                        border-radius: 15px; border: 2px dashed #ddd;
                        background: #fafafa; aspect-ratio: 1 / 1;
                    }
                `}</style>

                {/* 右上固定 ×ボタン */}
                <button className="fixed-close-btn" onClick={() => navigate("/home")} title="閉じる">
                    <X size={40} color="#000000" />
                </button>

                {/* タイトルセクション */}
                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>マイアルバム</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                {/* 作品グリッド */}
                <div className="row g-4 g-md-5">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div className="col-12 col-md-6 col-xl-4" key={i}>
                                <div className="placeholder-glow">
                                    <div className="placeholder w-100" style={{ aspectRatio: "1/1", borderRadius: "15px" }} />
                                </div>
                            </div>
                        ))
                    ) : albumWorks.length > 0 ? (
                        albumWorks.map((work) => (
                            <div className="col-12 col-md-6 col-xl-4" key={work.id}>
                                <div className="work-card shadow-sm h-100" onClick={() => navigate(`/works/${work.id}`)} style={{ cursor: "pointer" }}>
                                    {/* 削除ボタン */}
                                    <button className="remove-btn-overlay" onClick={(e) => handleRemove(e, work.id)}>
                                        <X size={24} />
                                    </button>

                                    <div className="image-container">
                                        <img
                                            src={`http://localhost:8080/api/works/${work.id}/file`}
                                            alt={work.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<span class="text-muted fs-3">No Image</span>';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4 bg-white d-flex justify-content-between align-items-center border-top">
                                        <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                            <span className="fw-bold fs-3 d-block text-truncate">{work.title}</span>
                                            <small className="text-muted">@{work.username || "Unknown"}</small>
                                        </div>
                                        <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 mt-5 rounded" style={{ backgroundColor: "#f9f9f9", border: "2px dashed #ddd" }}>
                            <p className="text-muted fs-4 mb-0">アルバムは空です。作品詳細から追加してください！</p>
                        </div>
                    )}

                    {/* 作品が少ない場合でもグリッドを埋める (最低6枚分) */}
                    {!loading && albumWorks.length > 0 && albumWorks.length < 6 && (
                        [...Array(6 - albumWorks.length)].map((_, i) => (
                            <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                                <div className="empty-card d-flex align-items-center justify-content-center">
                                    <span className="text-muted fw-bold">Empty Slot</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyAlbum;
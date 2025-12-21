// src/pages/MyAlbum.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, XCircle } from "react-bootstrap-icons";

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
                // バックエンドの GET /api/works/album を叩く想定
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

    const handleRemove = async (workId) => {
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
        <div className="d-flex vh-100 bg-white">
            {/* サイドバー */}
            <aside className="d-none d-md-flex flex-column text-white shadow" style={{ width: "260px", backgroundColor: "#343a40", flexShrink: 0 }}>
                <div className="text-center py-4 border-bottom">
                    <h4 className="fw-bold">PortFolio SNS</h4>
                    <div className="mx-auto mt-3 rounded-circle bg-secondary" style={{ width: "100px", height: "100px" }} />
                </div>
                <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}><House className="me-2" /> ホーム</li>
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/find")}><Search className="me-2" /> 見つける</li>
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/upworks")}><Upload className="me-2" /> 作品投稿</li>
                    <li className="list-group-item bg-dark text-white border-0"><Images className="me-2" /> 過去作品</li>
                    {/* マイアルバムをアクティブ状態に */}
                    <li className="list-group-item bg-dark text-white border-0 active"><Star className="me-2" color="#f1c40f" /> マイアルバム</li>
                    <li className="list-group-item bg-dark text-white border-0"><Person className="me-2" /> マイプロフィール</li>
                </ul>
                <div className="mt-auto p-3">
                    <button className="btn btn-outline-danger w-100" onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}>
                        <BoxArrowRight className="me-2" /> ログアウト
                    </button>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
                <style>{`
                    .album-card {
                        transition: transform 0.2s;
                        border-radius: 8px;
                        overflow: hidden;
                        background-color: #f8f9fa;
                    }
                    .album-card:hover {
                        transform: translateY(-5px);
                    }
                    .remove-btn {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        z-index: 10;
                        background: rgba(255,255,255,0.8);
                        border: none;
                        border-radius: 20px;
                        padding: 2px 8px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }
                    .remove-btn:hover {
                        background: #fff;
                        color: red;
                    }
                `}</style>

                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ width: "100%", maxWidth: "450px" }}>
                        <h1 className="display-5 fw-bold mb-0">マイアルバム</h1>
                        <hr style={{ borderTop: "3px solid #000", opacity: 1 }} />
                    </div>
                    <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
                        <span className="fs-3 fw-bold me-2">3</span>
                        <span className="fs-4 fw-bold">ホーム</span>
                    </div>
                </div>

                <div className="row g-4 mt-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={i}>
                                <div className="placeholder-glow">
                                    <div className="placeholder w-100" style={{ aspectRatio: "4/3", borderRadius: "8px" }} />
                                </div>
                            </div>
                        ))
                    ) : albumWorks.length > 0 ? (
                        albumWorks.map((work) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={work.id}>
                                <div className="position-relative album-card shadow-sm">
                                    {/* 削除ボタン */}
                                    <button className="remove-btn shadow-sm" onClick={(e) => handleRemove(work.id)}>
                                        <span>2</span> <XCircle size={18} />
                                    </button>

                                    {/* 作品画像エリア */}
                                    <div
                                        onClick={() => navigate(`/works/${work.id}`)}
                                        style={{ aspectRatio: "4/3", cursor: "pointer", backgroundColor: "#eee" }}
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <img
                                            src={`http://localhost:8080/api/works/${work.id}/file`}
                                            alt={work.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                                        />
                                    </div>

                                    {/* タイトル表示 */}
                                    <div className="p-2 text-center bg-white border-top">
                                        <span className="fw-bold text-truncate d-block">{work.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5 w-100">
                            <p className="text-muted fs-5">マイアルバムは空です。作品詳細から追加してください！</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyAlbum;
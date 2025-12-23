// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchHomeData = async () => {
            try {
                const data = await ApiCommunication.searchWorks(jwt, "", []);
                setWorks(data);
            } catch (error) {
                console.error("データ取得エラー:", error);
                if (error.message.includes("401")) {
                    localStorage.removeItem("jwt");
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, [navigate]);

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            <Sidebar />

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
                    .work-card {
                        border-radius: 15px; overflow: hidden; transition: all 0.3s ease;
                        background: #f8f9fa; border: 2px solid #eee;
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
                    .empty-card {
                        border-radius: 15px; border: 2px dashed #ddd;
                        background: #fafafa; aspect-ratio: 1 / 1;
                    }
                `}</style>

                {/* タイトルセクション: 位置合わせ修正済み */}
                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>✨ New Arrivals</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                    <p className="text-muted fs-5 mt-3">最新の注目作品をチェックしましょう</p>
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
                    ) : (
                        works.map((item) => (
                            <div className="col-12 col-md-6 col-xl-4" key={item.id}>
                                <div className="work-card shadow-sm h-100" onClick={() => navigate(`/works/${item.id}`)} style={{ cursor: "pointer" }}>
                                    <div className="image-container">
                                        <img
                                            src={`http://localhost:8080/api/works/${item.id}/file`}
                                            alt={item.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<span class="text-muted fs-3">No Image</span>';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4 bg-white d-flex justify-content-between align-items-center border-top">
                                        <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                            <span className="fw-bold fs-3 d-block text-truncate">{item.title}</span>
                                            <small className="text-muted">@{item.username}</small>
                                        </div>
                                        <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* グリッドを埋める空カード */}
                    {!loading && works.length < 6 && (
                        [...Array(6 - works.length)].map((_, i) => (
                            <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                                <div className="empty-card d-flex align-items-center justify-content-center">
                                    <span className="text-muted fw-bold">No Data</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
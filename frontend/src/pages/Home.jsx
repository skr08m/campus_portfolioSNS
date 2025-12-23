// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";

// --- 認証付き画像表示コンポーネント ---
const HomeWorkImage = ({ workId }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        let isMounted = true;
        const jwt = localStorage.getItem("jwt");
        const fetchImage = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/works/${workId}/file`, {
                    headers: { "Authorization": `Bearer ${jwt}` }
                });
                if (!res.ok) throw new Error();
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                if (isMounted) setImageUrl(objectUrl);
            } catch (err) {
                if (isMounted) setError(true);
            }
        };
        fetchImage();
        return () => { isMounted = false; if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, [workId]);
    if (error) return <span className="text-muted fw-bold">No Image</span>;
    if (!imageUrl) return <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>;
    return <img src={imageUrl} alt="Work" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
};

const Home = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) { navigate("/"); return; }
        const fetchHomeData = async () => {
            try {
                const data = await ApiCommunication.searchWorks(jwt, "", []);
                setWorks(data);
            } catch (error) {
                console.error("データ取得エラー:", error);
            } finally { setLoading(false); }
        };
        fetchHomeData();
    }, [navigate]);

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Sidebar />
            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .custom-card { border: 2px solid #eee; border-radius: 20px; overflow: hidden; transition: all 0.3s ease; background-color: #fff; height: 100%; }
                    .custom-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); border-color: #333; }
                    .card-img-container { width: 100%; aspect-ratio: 1 / 1; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid #eee; }
                    .empty-card { border-radius: 20px; border: 2px dashed #ddd; background: #fafafa; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
                `}</style>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>✨ New Arrivals</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                    <p className="text-muted fs-5 mt-3">最新の注目作品をチェックしましょう</p>
                </div>

                <div className="row g-4 g-md-5">
                    {loading ? [...Array(6)].map((_, i) => (
                        <div className="col-12 col-md-6 col-xl-4" key={i}>
                            <div className="card custom-card placeholder-glow"><div className="placeholder w-100" style={{ aspectRatio: "1/1" }} /></div>
                        </div>
                    )) : (
                        works.map((item) => (
                            <div className="col-12 col-md-6 col-xl-4" key={item.id}>
                                <div className="card custom-card shadow-sm" onClick={() => navigate(`/works/${item.id}`)} style={{ cursor: "pointer" }}>
                                    <div className="card-img-container">
                                        <HomeWorkImage workId={item.id} />
                                    </div>
                                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                        <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                            <h3 className="card-title fw-bold mb-1 text-truncate" style={{ fontSize: "1.8rem" }}>{item.title}</h3>
                                            <p className="card-text text-muted mb-0 fs-5">@{item.username}</p>
                                        </div>
                                        <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && works.length < 6 && [...Array(6 - works.length)].map((_, i) => (
                        <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                            <div className="empty-card shadow-sm"><span className="text-muted fw-bold fs-4">Empty Slot</span></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
export default Home;
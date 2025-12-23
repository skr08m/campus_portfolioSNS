// src/pages/PastWork.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";
import { X } from "react-bootstrap-icons";

// --- 認証付き画像表示コンポーネント ---
const PastWorkImage = ({ workId }) => {
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
            } catch (err) { if (isMounted) setError(true); }
        };
        fetchImage();
        return () => { isMounted = false; if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, [workId]);
    if (error) return <span className="text-muted fw-bold">No Image</span>;
    if (!imageUrl) return <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>;
    return <img src={imageUrl} alt="Work" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
};

const PastWork = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) { navigate("/"); return; }
        const fetchPastWorks = async () => {
            try {
                const data = await ApiCommunication.fetchMyWorks(jwt);
                setWorks(data);
            } catch (error) { console.error("取得失敗:", error); } finally { setLoading(false); }
        };
        fetchPastWorks();
    }, [navigate]);

    const handleWorkClick = (workId, currentLikes, currentCommentsCount) => {
        localStorage.setItem(`seen_likes_${workId}`, currentLikes);
        localStorage.setItem(`seen_comments_${workId}`, currentCommentsCount);
        navigate(`/works/${workId}`);
    };

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Sidebar />
            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .fixed-close-btn { position: fixed; top: 25px; right: 30px; z-index: 2001; background-color: #fff; border: 1px solid #ddd; border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; cursor: pointer; }
                    .custom-card { border: 2px solid #eee; border-radius: 20px; overflow: hidden; transition: all 0.3s ease; background-color: #fff; position: relative; height: 100%; }
                    .custom-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); border-color: #333; }
                    .card-img-container { width: 100%; aspect-ratio: 1 / 1; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid #eee; position: relative; }
                    .empty-card { border-radius: 20px; border: 2px dashed #ddd; background: #fafafa; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
                    .notification-dot { position: absolute; top: 15px; right: 15px; z-index: 999; width: 16px; height: 16px; border: 2px solid #fff; border-radius: 50%; }
                    .dot-red { background-color: #ff4d4d; box-shadow: 0 0 10px rgba(255, 77, 77, 0.8); }
                    .dot-green { background-color: #2ecc71; box-shadow: 0 0 8px rgba(46, 204, 113, 0.5); }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/home")}><X size={40} color="#000" /></button>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>過去作品</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="row g-4 g-md-5">
                    {works.map((item) => {
                        const curL = Number(item.likesCount || 0);
                        const curC = Number(item.comments ? item.comments.length : 0);
                        const seenL = Number(localStorage.getItem(`seen_likes_${item.id}`) || 0);
                        const seenC = Number(localStorage.getItem(`seen_comments_${item.id}`) || 0);
                        const isUnread = (curL > seenL) || (curC > seenC);
                        const hasActivity = (curL > 0) || (curC > 0);

                        return (
                            <div className="col-12 col-md-6 col-xl-4" key={item.id}>
                                <div className="card custom-card shadow-sm" onClick={() => handleWorkClick(item.id, curL, curC)} style={{ cursor: "pointer" }}>
                                    <div className="card-img-container">
                                        {isUnread && <div className="notification-dot dot-red"></div>}
                                        {!isUnread && hasActivity && <div className="notification-dot dot-green"></div>}
                                        <PastWorkImage workId={item.id} />
                                    </div>
                                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                        <div className="text-truncate" style={{ maxWidth: '85%' }}>
                                            <h3 className="card-title fw-bold mb-1 text-truncate" style={{ fontSize: "1.8rem" }}>{item.title}</h3>
                                            <p className="card-text text-muted mb-0 fs-5">自己作品</p>
                                        </div>
                                        <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {(loading || works.length < 9) && [...Array(Math.max(0, 9 - works.length))].map((_, i) => (
                        <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                            <div className="empty-card shadow-sm">
                                {loading ? <div className="spinner-border text-secondary"></div> : <span className="text-muted fw-bold fs-4">Empty Slot</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
export default PastWork;
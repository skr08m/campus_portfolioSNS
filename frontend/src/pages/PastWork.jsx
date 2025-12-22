// src/pages/PastWork.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";
import { X } from "react-bootstrap-icons";

const PastWork = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchPastWorks = async () => {
            try {
                const data = await ApiCommunication.fetchMyWorks(jwt);
                setWorks(data);

                // デバッグ用：取得したデータの状態を確認
                console.log("作品データ一覧:", data.map(d => ({
                    id: d.id,
                    likes: d.likesCount,
                    comments: d.comments?.length || 0
                })));
            } catch (error) {
                console.error("取得失敗:", error);
            } finally {
                setLoading(false);
            }
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
                    .work-card { border-radius: 15px; overflow: hidden; transition: all 0.3s ease; background: #f8f9fa; border: 2px solid #eee; position: relative; }
                    .work-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; border-color: #333; }
                    .image-container { width: 100%; aspect-ratio: 1 / 1; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; position: relative; }
                    .empty-card { border-radius: 15px; border: 2px dashed #ddd; background: #fafafa; aspect-ratio: 1 / 1; }

                    /* ★ お知らせドット：z-indexを上げて絶対に見えるようにする */
                    .notification-dot {
                        position: absolute; 
                        top: 15px; 
                        right: 15px; 
                        z-index: 999; /* 最前面へ */
                        width: 16px; 
                        height: 16px; 
                        border: 2px solid #fff; 
                        border-radius: 50%;
                        display: block !important;
                    }
                    .dot-red { background-color: #ff4d4d !important; box-shadow: 0 0 10px rgba(255, 77, 77, 0.8); }
                    .dot-green { background-color: #2ecc71 !important; box-shadow: 0 0 8px rgba(46, 204, 113, 0.5); }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/home")}><X size={40} color="#000" /></button>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>過去作品</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="row g-4 g-md-5">
                    {works.map((item) => {
                        // 型エラーを防ぐため Number() で確実に数値化
                        const curL = Number(item.likesCount || 0);
                        const curC = Number(item.comments ? item.comments.length : 0);
                        const seenL = Number(localStorage.getItem(`seen_likes_${item.id}`) || 0);
                        const seenC = Number(localStorage.getItem(`seen_comments_${item.id}`) || 0);

                        // 判定
                        const isUnread = (curL > seenL) || (curC > seenC);
                        const hasActivity = (curL > 0) || (curC > 0);

                        return (
                            <div className="col-12 col-md-6 col-xl-4" key={item.id}>
                                <div className="work-card shadow-sm h-100" onClick={() => handleWorkClick(item.id, curL, curC)} style={{ cursor: "pointer" }}>

                                    <div className="image-container">
                                        {/* ★ 描画判定をシンプルに */}
                                        {isUnread && <div className="notification-dot dot-red"></div>}
                                        {!isUnread && hasActivity && <div className="notification-dot dot-green"></div>}

                                        <img
                                            src={`http://localhost:8080/api/works/${item.id}/file`}
                                            alt={item.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="p-4 bg-white d-flex justify-content-between align-items-center border-top">
                                        <span className="fw-bold fs-3 text-truncate" style={{ maxWidth: '85%' }}>{item.title}</span>
                                        <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {(loading || works.length < 9) && (
                        [...Array(Math.max(0, 9 - works.length))].map((_, i) => (
                            <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                                <div className="empty-card d-flex align-items-center justify-content-center">
                                    {loading ? <div className="spinner-border text-secondary"></div> : <span className="text-muted fw-bold">Empty Slot</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default PastWork;
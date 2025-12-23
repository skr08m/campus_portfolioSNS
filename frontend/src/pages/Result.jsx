// src/pages/Result.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";
import { Row, Col } from "react-bootstrap";
import { X } from "react-bootstrap-icons";

// --- 認証付き画像表示コンポーネント ---
const ResultWorkImage = ({ workId }) => {
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

        return () => {
            isMounted = false;
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [workId]);

    if (error) return <span className="text-muted fw-bold">No Image</span>;
    if (!imageUrl) return <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>;

    return (
        <img
            src={imageUrl}
            alt="Work"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
    );
};

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { keyword, tags } = location.state || {};

    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchWorks = async () => {
            try {
                const result = await ApiCommunication.searchWorks(jwt, keyword, tags);
                setWorks(result);
            } catch (err) {
                console.error(err);
                alert("検索に失敗しました");
            } finally {
                // プログレスバー演出のための遅延
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchWorks();
    }, [keyword, tags, navigate]);

    // プログレスバー表示
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white p-5">
                <div style={{ width: "100%", maxWidth: "800px" }}>
                    <h2 className="text-center mb-5 fw-bold" style={{ fontSize: "2.5rem", color: "#333" }}>作品をさがしています...</h2>
                    <div className="progress shadow-sm" style={{ height: "60px", borderRadius: "30px", backgroundColor: "#f0f0f0" }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-dark" style={{ width: "100%", fontSize: "1.8rem", fontWeight: "bold" }}>
                            Searching...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const MIN_CARDS = 12;
    const displayWorks = [...works];
    while (displayWorks.length < MIN_CARDS) {
        displayWorks.push({ id: `empty-${displayWorks.length}`, isEmpty: true });
    }

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Sidebar />

            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .fixed-close-btn { position: fixed; top: 25px; right: 30px; z-index: 2001; background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; cursor: pointer; }
                    .fixed-close-btn:hover { transform: scale(1.1); background-color: #f8f9fa; }
                    
                    .custom-card { border: 2px solid #eee; border-radius: 20px; overflow: hidden; transition: all 0.3s ease; background-color: #fff; height: 100%; }
                    .custom-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); border-color: #333; }
                    
                    .card-img-container { width: 100%; aspect-ratio: 1 / 1; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid #eee; }
                    .empty-card { border-radius: 20px; border: 2px dashed #ddd; background: #fafafa; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/find")} title="戻る">
                    <X size={40} color="#000000" />
                </button>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>こんな感じ？</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                    <p className="text-muted fs-5 mt-3">キーワード「{keyword || "指定なし"}」の検索結果です</p>
                </div>

                <div className="container-fluid p-0">
                    <Row className="g-4 g-md-5">
                        {displayWorks.map((work) => (
                            <Col xs={12} md={6} xl={4} key={work.id}>
                                {work.isEmpty ? (
                                    <div className="empty-card shadow-sm">
                                        <span className="text-muted fw-bold fs-4">Empty Slot</span>
                                    </div>
                                ) : (
                                    <div className="card custom-card shadow-sm" onClick={() => navigate(`/works/${work.id}`)} style={{ cursor: "pointer" }}>
                                        <div className="card-img-container">
                                            <ResultWorkImage workId={work.id} />
                                        </div>
                                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                            <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                                <h3 className="card-title fw-bold mb-1 text-truncate" style={{ fontSize: "1.8rem" }}>{work.title}</h3>
                                                <p className="card-text text-muted mb-0 fs-5">@{work.username || "Unknown"}</p>
                                            </div>
                                            <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                        </div>
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>
                </div>
            </main>
        </div>
    );
};

export default Result;
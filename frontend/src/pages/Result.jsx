import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import { Row, Col } from "react-bootstrap";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { keyword, tags } = location.state || {};

    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        const fetchWorks = async () => {
            try {
                const result = await ApiCommunication.searchWorks(jwt, keyword, tags);
                setWorks(result);
            } catch (err) {
                console.error(err);
                alert("検索に失敗しました");
            } finally {
                // 通信が早すぎる場合に備えて少しだけ待機時間を設けると、
                // プログレスバーが綺麗に見えます（任意）
                setTimeout(() => setLoading(false), 800);
            }
        };

        if (jwt) {
            fetchWorks();
        } else {
            navigate("/");
        }
    }, [keyword, tags, navigate]);

    // ローディング中（プログレスバーのみ表示）のレンダリング
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white p-5">
                <div style={{ width: "100%", maxWidth: "800px" }}>
                    <h2 className="text-center mb-5 fw-bold" style={{ fontSize: "2.5rem", color: "#333" }}>作品をさがしています...</h2>
                    <div
                        className="progress shadow-sm"
                        role="progressbar"
                        aria-label="Searching"
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ height: "60px", borderRadius: "30px", backgroundColor: "#f0f0f0" }}
                    >
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-dark"
                            style={{ width: "100%", fontSize: "1.8rem", fontWeight: "bold" }}
                        >
                            Searching...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 読み込み完了後のレンダリング（サイドバーありの通常画面）
    const MIN_CARDS = 12;
    const displayWorks = [...works];
    while (displayWorks.length < MIN_CARDS) {
        displayWorks.push({ id: `empty-${displayWorks.length}`, isEmpty: true });
    }

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            {/* サイドバー */}
            <aside className="d-none d-md-block shadow-sm" style={{
                width: "240px", backgroundColor: "#e0e0e0", position: "fixed",
                left: 0, top: 0, height: "100vh", zIndex: 1000
            }}>
                <div className="text-center py-4">
                    <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
                    <div className="mx-auto" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px 0" }} />
                </div>
                <ul className="list-group list-group-flush mt-2 px-3">
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}><House className="me-3" size={24} /> ホーム</li>
                    <li className="list-group-item border-0 py-4 fw-bold active text-dark" style={{ backgroundColor: "#d0d0d0", borderRadius: "10px" }} onClick={() => navigate("/find")}><Search className="me-3" size={24} /> 見つける</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/upworks")}><Upload className="me-3" size={24} /> 作品投稿</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/pastworks")}><Images className="me-3" size={24} /> 過去作品</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/album")}><Star className="me-3" size={24} color="#f1c40f" /> マイアルバム</li>
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }}><Person className="me-3" size={24} /> プロフィール</li>
                </ul>
                <div className="position-absolute bottom-0 w-100 p-3 mb-3">
                    <button className="btn btn-outline-danger w-100 border-2 py-2 fw-bold" onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}>
                        <BoxArrowRight className="me-2" /> ログアウト
                    </button>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .fixed-close-btn {
                        position: fixed; top: 25px; right: 30px; z-index: 2001;
                        background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; 
                        padding: 8px; display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease;
                    }
                    .fixed-close-btn:hover { transform: scale(1.1); background-color: #f8f9fa; }
                    .work-card { border-radius: 15px; overflow: hidden; transition: all 0.3s ease; background: #f8f9fa; border: 2px solid #eee; }
                    .work-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; border-color: #333; }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/find")} title="戻る">
                    <X size={40} color="#000000" />
                </button>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>こんな感じ？</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="container-fluid p-0">
                    <Row className="g-4 g-md-5">
                        {displayWorks.map((work) => (
                            <Col xs={12} md={6} xl={4} key={work.id}>
                                {work.isEmpty ? (
                                    <div style={{ aspectRatio: "1 / 1", backgroundColor: "#fafafa", border: "2px dashed #ddd", borderRadius: "15px" }} />
                                ) : (
                                    <div className="work-card shadow-sm h-100" onClick={() => navigate(`/works/${work.id}`)} style={{ cursor: "pointer" }}>
                                        <div style={{ width: "100%", aspectRatio: "1 / 1", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <img src={`http://localhost:8080/api/works/${work.id}/file`} alt={work.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <div className="p-4 bg-white d-flex justify-content-between align-items-center border-top">
                                            <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                                <span className="fw-bold fs-3 d-block text-truncate">{work.title}</span>
                                                <small className="text-muted">@{work.username || "Unknown"}</small>
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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import { Row, Col } from "react-bootstrap";

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
                setLoading(false);
            }
        };

        if (jwt) {
            fetchWorks();
        } else {
            setLoading(false);
        }
    }, [keyword, tags]);

    // ★最低表示数を12個に変更
    const MIN_CARDS = 12;
    const displayWorks = [...works];
    while (displayWorks.length < MIN_CARDS) {
        displayWorks.push({ id: `empty-${displayWorks.length}`, isEmpty: true });
    }

    return (
        <div className="d-flex w-100" style={{ minHeight: "100vh", backgroundColor: "white" }}>

            {/* サイドバー */}
            <aside
                className="d-none d-md-block"
                style={{
                    width: "240px",
                    backgroundColor: "#e0e0e0",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1000
                }}
            >
                <div className="text-center py-4">
                    <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
                    <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px auto" }} />
                </div>
                <ul className="list-group list-group-flush" style={{ backgroundColor: "transparent" }}>
                    <li className="list-group-item" style={{ backgroundColor: "transparent", cursor: "pointer" }} onClick={() => navigate("/home")}>ホーム</li>
                    <li className="list-group-item active" style={{ backgroundColor: "white", color: "black", border: "none" }}>見つける</li>
                </ul>
            </aside>

            {/* メインエリア */}
            <main
                className="flex-grow-1"
                style={{
                    marginLeft: "240px",
                    padding: "60px", // 余白を少し広げてゆとりを持たせる
                    width: "calc(100% - 240px)"
                }}
            >
                <style>{`
                    @media (max-width: 767px) {
                        main { 
                            margin-left: 0 !important; 
                            width: 100% !important;
                            padding: 20px !important;
                        }
                    }
                `}</style>

                <div className="mb-5">
                    <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>こんな感じ？</h2>
                    <hr style={{ width: "400px", borderTop: "2px solid #000", opacity: 1, margin: "15px 0" }} />
                </div>

                {loading ? (
                    <p className="text-center mt-5">読み込み中...</p>
                ) : (
                    <div className="container-fluid p-0">
                        {/* ★g-5 でカード間の隙間を広げ、1列を2〜3枚に調整 */}
                        <Row className="g-5">
                            {displayWorks.map((work) => (
                                // xs=12 (1列), md=6 (2列), xl=4 (3列)
                                // 大きく見せたい場合は md=6 を維持してください
                                <Col xs={12} md={6} xl={4} key={work.id}>
                                    {work.isEmpty ? (
                                        <div style={{
                                            aspectRatio: "1 / 1",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #eee"
                                        }} />
                                    ) : (
                                        <div
                                            className="d-flex flex-column justify-content-center align-items-center text-center shadow-sm"
                                            style={{
                                                aspectRatio: "1 / 1",
                                                backgroundColor: "#d9d9d9",
                                                padding: "30px",
                                                cursor: "pointer",
                                                transition: "0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                                            }}
                                            onClick={() => navigate(`/works/${work.id}`)}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#cccccc"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#d9d9d9"}
                                        >
                                            <h4 className="mb-3 fw-bold text-truncate w-100">{work.title}</h4>
                                            <p className="mb-0" style={{ fontSize: "1rem", color: "#555" }}>投稿者: {work.username}</p>
                                        </div>
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Result;
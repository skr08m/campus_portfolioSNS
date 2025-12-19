// src/pages/Find.jsx
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const Find = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* サイドバー（Homeと共通想定） */}
            <aside style={{ width: "240px", backgroundColor: "#e0e0e0" }}>
                <div className="text-center py-4">
                    <h4>PortFolio</h4>
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            margin: "20px auto",
                        }}
                    />
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item" onClick={() => navigate("/home")}>
                        ホーム
                    </li>
                    <li className="list-group-item active">見つける</li>
                </ul>
            </aside>

            {/* メイン */}
            <main className="flex-grow-1 p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>どんな作品をさがす？</h2>
                    <span>ホーム</span>
                </div>

                <hr />

                {/* 条件1 */}
                <section className="mb-5">
                    <h5>1 ■ 条件検索</h5>
                    <Form.Control className="mt-3" placeholder="キーワードを入力" />
                </section>

                {/* 条件2 */}
                <section className="mb-5">
                    <h5>2 ■ 条件検索</h5>
                    <Row className="mt-4 g-3">
                        {[
                            "webアプリ",
                            "ゲーム",
                            "CG",
                            "IoT",
                            "メタ",
                            "音楽",
                        ].map((tag) => (
                            <Col xs={6} md={4} key={tag} className="text-center">
                                <Button
                                    variant="outline-secondary"
                                    className="rounded-pill px-4"
                                >
                                    {tag}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* 検索 */}
                <div className="text-end mt-5">
                    <Button variant="secondary" className="rounded-pill px-5">
                        検索
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default Find;
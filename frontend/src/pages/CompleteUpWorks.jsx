// src/pages/CompleteUpWorks.jsx
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { CheckCircleFill, HouseFill, Images } from "react-bootstrap-icons";

const CompleteUpWorks = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 p-3" style={{ backgroundColor: "#f0f2f5" }}>
            {/* 画面全体の最大幅を LoginPage と同様に 1000px に設定 */}
            <Container style={{ maxWidth: '1000px' }}>
                <div className="bg-white shadow-lg rounded-5 overflow-hidden">
                    <Row className="g-0">

                        {/* 左側：メッセージエリア (LoginPageの黒背景スタイルを継承) */}
                        <Col lg={5} className="bg-dark text-white d-flex flex-column justify-content-center p-5 text-center text-lg-start">
                            <CheckCircleFill size={60} className="mb-4 text-success" />
                            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: "-2px" }}>
                                Thank You!
                            </h1>
                            <p className="fs-4 opacity-75 mb-0">
                                作品の投稿が<br className="d-none d-lg-block" />
                                正常に完了しました。
                            </p>
                        </Col>

                        {/* 右側：アクションエリア */}
                        <Col lg={7} className="p-4 p-md-5 d-flex align-items-center bg-white">
                            <div className="w-100 px-lg-4">
                                <h2 className="fw-bold mb-2" style={{ fontSize: "2.8rem" }}>投稿完了</h2>
                                <hr className="mb-5 ms-0" style={{ width: "60px", borderTop: "5px solid #000", opacity: 1 }} />

                                <div className="mb-5">
                                    <p className="fs-4 text-muted mb-4">
                                        素晴らしい作品を共有していただきありがとうございます。<br />
                                        あなたのポートフォリオが新しく更新されました。
                                    </p>
                                </div>

                                {/* アクションボタン群 */}
                                <div className="d-grid gap-3">
                                    <Button
                                        variant="dark"
                                        className="py-3 fw-bold fs-4 shadow-sm d-flex align-items-center justify-content-center"
                                        style={{ borderRadius: "50px", height: "70px" }}
                                        onClick={() => navigate("/home")}
                                    >
                                        <HouseFill className="me-2" /> ホームへ戻る
                                    </Button>

                                    <Button
                                        variant="outline-dark"
                                        className="py-3 fw-bold fs-4 shadow-sm d-flex align-items-center justify-content-center"
                                        style={{ borderRadius: "50px", height: "70px", borderWidth: "2px" }}
                                        onClick={() => navigate("/pastworks")}
                                    >
                                        <Images className="me-2" /> 自分の投稿を確認する
                                    </Button>
                                </div>

                                {/* 補足リンク */}
                                <div className="text-center mt-5">
                                    <span className="fs-5 text-muted">
                                        続けて投稿しますか？
                                        <button
                                            onClick={() => navigate("/upworks")}
                                            className="ms-2 btn btn-link p-0 text-dark fw-bold text-decoration-none border-bottom border-dark pb-1 fs-5"
                                            style={{ verticalAlign: 'baseline' }}
                                        >
                                            新しい作品を投稿
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default CompleteUpWorks;
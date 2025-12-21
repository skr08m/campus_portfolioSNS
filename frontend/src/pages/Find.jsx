// src/pages/Find.jsx
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";

const Find = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    // 他の画面と共通のカテゴリーリスト
    const categoryList = ["webアプリ", "ゲーム", "CG", "IoT", "メタ", "音楽", "VR", "AI", "3Dモデル"];

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            {/* サイドバー: 左端固定 */}
            <aside className="d-none d-md-block shadow-sm" style={{
                width: "240px",
                backgroundColor: "#e0e0e0",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100vh",
                zIndex: 1000
            }}>
                <div className="text-center py-4">
                    <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
                    <div className="mx-auto" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px 0" }} />
                </div>

                <ul className="list-group list-group-flush mt-2 px-3">
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}><House className="me-3" size={24} /> ホーム</li>
                    <li className="list-group-item border-0 py-4 fw-bold active text-dark" style={{ backgroundColor: "#d0d0d0", borderRadius: "10px" }}><Search className="me-3" size={24} /> 見つける</li>
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
                    .fixed-close-btn {
                        position: fixed; top: 25px; right: 30px; z-index: 2001;
                        background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; 
                        padding: 8px; display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease;
                    }
                    .fixed-close-btn:hover { transform: scale(1.1); background-color: #f8f9fa; }
                    
                    .tag-btn {
                        border-radius: 30px; padding: 12px 40px;
                        font-weight: bold; border: 2px solid #ddd;
                        background-color: #f8f9fa; transition: 0.2s;
                        font-size: 1.1rem; color: #000 !important;
                        text-align: center; width: 100%;
                    }
                    .tag-btn.active {
                        background-color: #d0d0d0; border-color: #000;
                    }
                    .search-input {
                        border-radius: 15px; background-color: #f2f2f2; 
                        font-size: 1.3rem; padding: 20px; border: 2px solid #eee;
                        color: #000;
                    }
                `}</style>

                {/* 右上固定 ×ボタン */}
                <button className="fixed-close-btn" onClick={() => navigate("/home")} title="閉じる">
                    <X size={40} color="#000000" />
                </button>

                {/* タイトルセクション: 左端揃え */}
                <div className="mb-5 text-start p-0">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>どんな作品をさがす？</h1>
                    <hr className="ms-0" style={{ width: "100%", maxWidth: "800px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-12 col-xl-11">

                            {/* 条件1: キーワード検索 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-4 m-0 p-0" style={{ fontSize: "1.6rem" }}>1 ■ 条件検索</h4>
                                <Form.Control
                                    className="search-input shadow-sm w-100"
                                    placeholder="キーワードを入力"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </section>

                            {/* 条件2: カテゴリー（タグ）検索 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-4 m-0 p-0" style={{ fontSize: "1.6rem" }}>2 ■ 条件検索</h4>
                                <Row className="g-4">
                                    {categoryList.map((tag) => (
                                        <Col xs={6} lg={4} xl={3} key={tag}>
                                            <button
                                                type="button"
                                                className={`tag-btn shadow-sm ${selectedTags.includes(tag) ? "active" : ""}`}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </button>
                                        </Col>
                                    ))}
                                </Row>
                            </section>

                            {/* 検索実行ボタン */}
                            <div className="text-end mt-5 pb-5">
                                <Button
                                    className="shadow px-5 py-3 fw-bold fs-2"
                                    variant="dark"
                                    style={{ borderRadius: "50px", minWidth: "350px" }}
                                    onClick={() => {
                                        navigate("/result", {
                                            state: { keyword, tags: selectedTags },
                                        });
                                    }}
                                >
                                    検索
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Find;
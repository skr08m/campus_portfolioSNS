// src/pages/Find.jsx
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";

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
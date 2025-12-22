// src/pages/Find.jsx
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { X } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";

const Find = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    // 警告表示の状態管理
    const [showAlert, setShowAlert] = useState(false);

    // 他の画面と共通のカテゴリーリスト
    const categoryList = ["webアプリ", "ゲーム", "CG", "IoT", "メタ", "音楽", "VR", "AI", "3Dモデル"];

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
        // 条件が選択されたら警告を消す
        if (showAlert) setShowAlert(false);
    };

    // 検索実行ボタンの処理
    const handleSearch = () => {
        // キーワードが空（空白除く）かつ、タグも未選択の場合
        if (keyword.trim() === "" && selectedTags.length === 0) {
            setShowAlert(true);
            // 3秒後に自動で閉じる設定（任意）
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        // 条件がある場合は結果画面へ
        navigate("/result", {
            state: { keyword, tags: selectedTags },
        });
    };

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            <Sidebar />

            {/* メインコンテンツ */}
            <main className="flex-grow-1" style={{
                marginLeft: "240px",
                padding: "60px 40px",
                width: "calc(100% - 240px)",
                minWidth: 0,
                position: "relative"
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
                        cursor: pointer;
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
                    /* アラートを画面上部に浮かせるスタイル */
                    .floating-alert {
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 3000;
                        min-width: 350px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        border-radius: 15px;
                        text-align: center;
                        font-weight: bold;
                    }
                `}</style>

                {/* 条件未入力時のBootstrap Alert */}
                {showAlert && (
                    <Alert
                        variant="danger"
                        className="floating-alert"
                        onClose={() => setShowAlert(false)}
                        dismissible
                    >
                        検索条件が入力されていません
                    </Alert>
                )}

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
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                        if (showAlert) setShowAlert(false); // 入力し始めたら警告を消す
                                    }}
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
                                    onClick={handleSearch}
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
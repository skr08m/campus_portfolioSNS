// src/pages/UpWorks.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";

const UpWorks = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState("");
    const [categories, setCategories] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const categoryList = ["IoT", "メタ", "音楽", "VR", "Webアプリ", "ゲーム", "AI", "3Dモデル"];

    const toggleCategory = (cat) => {
        setCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleConfirm = () => {
        if (!file) {
            alert("ファイルを選択してください");
            return;
        }
        navigate("/confirm", {
            state: { file, detail, categories },
        });
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
                    <li className="list-group-item bg-transparent border-0 py-4" style={{ cursor: "pointer" }} onClick={() => navigate("/find")}><Search className="me-3" size={24} /> 見つける</li>
                    <li className="list-group-item border-0 py-4 fw-bold active text-dark" style={{ backgroundColor: "#d0d0d0", borderRadius: "10px" }}><Upload className="me-3" size={24} /> 作品投稿</li>
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

            {/* メインコンテンツ: 左右のマージンを整え、サイドバーに寄せる */}
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
                    .drop-zone {
                        height: 300px; width: 100%;
                        transition: 0.3s; border-radius: 15px;
                        font-size: 1.5rem; font-weight: bold;
                    }
                    .category-btn {
                        border-radius: 30px; padding: 12px 50px;
                        font-weight: bold; border: 2px solid #ddd;
                        background-color: #f8f9fa; transition: 0.2s;
                        font-size: 1.1rem; color: #000 !important;
                    }
                    .category-btn.active {
                        background-color: #d0d0d0; border-color: #000;
                    }
                `}</style>

                {/* 右上固定 ×ボタン */}
                <button className="fixed-close-btn" onClick={() => navigate("/home")} title="閉じる">
                    <X size={40} color="#000000" />
                </button>

                {/* タイトルセクション: 左端揃え */}
                <div className="mb-5 text-start p-0">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>作品を投稿しよう！</h1>
                    <hr className="ms-0" style={{ width: "100%", maxWidth: "800px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                {/* コンテンツエリア: 左側のパディングを 0 にして見出しを揃える */}
                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-12 col-xl-11">

                            {/* ファイルアップロード */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ ファイル</h4>
                                <div
                                    className="drop-zone shadow-sm border border-2 border-dark d-flex flex-column align-items-center justify-content-center"
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    style={{ background: dragOver ? "#9fd0ff" : "#b7dcff" }}
                                >
                                    {file ? (
                                        <div className="text-center px-3">
                                            <Upload size={60} className="mb-3" />
                                            <p className="mb-0 text-break fs-4 text-black">{file.name}</p>
                                        </div>
                                    ) : (
                                        "ここにドラッグ＆ドロップ"
                                    )}
                                </div>
                                <div className="text-end mt-3">
                                    <Form.Label htmlFor="file-upload" className="btn btn-light border shadow-sm px-5 py-2 fw-bold" style={{ cursor: "pointer", borderRadius: "10px", fontSize: "1.2rem", color: "#000" }}>
                                        ファイルを選択
                                    </Form.Label>
                                    <Form.Control id="file-upload" type="file" className="d-none" onChange={(e) => setFile(e.target.files[0])} />
                                </div>
                            </section>

                            {/* 詳細入力 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ 詳細</h4>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    className="shadow-sm border-2 w-100"
                                    style={{
                                        borderRadius: "15px",
                                        backgroundColor: "#f2f2f2",
                                        fontSize: "1.3rem",
                                        padding: "25px",
                                        lineHeight: "1.5",
                                        color: "#000"
                                    }}
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    placeholder="作品の詳細な説明を入力してください..."
                                />
                            </section>

                            {/* カテゴリー選択 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ カテゴリー</h4>
                                <div className="d-flex flex-wrap gap-4 mt-2 p-0">
                                    {categoryList.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            className={`category-btn shadow-sm ${categories.includes(cat) ? "active" : ""}`}
                                            onClick={() => toggleCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 確認ボタン */}
                            <div className="text-end mt-5 pb-5">
                                <Button
                                    className="shadow px-5 py-3 fw-bold fs-2"
                                    variant="dark"
                                    style={{ borderRadius: "50px", minWidth: "350px" }}
                                    onClick={handleConfirm}
                                >
                                    確認
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpWorks;
// src/pages/UpWorks.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, ListGroup } from "react-bootstrap";
import { Upload, X, FileEarmark } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";

const UpWorks = () => {
    const navigate = useNavigate();

    // 1. ファイルを配列で管理するように変更
    const [files, setFiles] = useState([]);
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

    // ファイル追加の共通ロジック
    const addFiles = (newFileList) => {
        const fileArray = Array.from(newFileList);
        setFiles((prev) => [...prev, ...fileArray]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    // 特定のファイルをリストから削除する機能
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        if (files.length === 0) {
            alert("ファイルを選択してください");
            return;
        }
        navigate("/confirm", {
            state: { files, detail, categories }, // files (配列) を渡す
        });
    };

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Sidebar />

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
                        height: 200px; width: 100%;
                        transition: 0.3s; border-radius: 15px;
                        font-size: 1.2rem; font-weight: bold;
                        cursor: pointer;
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
                    .file-item {
                        background: #f8f9fa;
                        border-radius: 10px;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        padding: 10px 15px;
                        border: 1px solid #eee;
                    }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/home")} title="閉じる">
                    <X size={40} color="#000000" />
                </button>

                <div className="mb-5 text-start p-0">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>作品を投稿しよう！</h1>
                    <hr className="ms-0" style={{ width: "100%", maxWidth: "800px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-12 col-xl-11">

                            {/* ファイルアップロードセクション */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ ファイル (複数可)</h4>
                                <div
                                    className="drop-zone shadow-sm border border-2 border-dark d-flex flex-column align-items-center justify-content-center mb-3"
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload').click()}
                                    style={{ background: dragOver ? "#9fd0ff" : "#b7dcff" }}
                                >
                                    <Upload size={40} className="mb-2" />
                                    <span>ファイルをドラッグ＆ドロップ または クリックして追加</span>
                                </div>

                                {/* 2. hidden inputに multiple 属性を追加 */}
                                <Form.Control
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    className="d-none"
                                    onChange={(e) => addFiles(e.target.files)}
                                />

                                {/* 選択されたファイルのリスト表示 */}
                                {files.length > 0 && (
                                    <div className="mb-3">
                                        <p className="fw-bold small text-muted">選択されたファイル:</p>
                                        {files.map((f, index) => (
                                            <div key={index} className="file-item shadow-sm">
                                                <FileEarmark className="me-2" />
                                                <span className="flex-grow-1 text-truncate">{f.name}</span>
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-danger"
                                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                >
                                                    <X size={24} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
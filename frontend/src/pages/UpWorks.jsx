// src/pages/UpWorks.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const UpWorks = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState("");
    const [categories, setCategories] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const categoryList = ["IoT", "メタ", "音楽"];

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

    /** ★ 確認画面へ */
    const handleConfirm = () => {
        if (!file) {
            alert("ファイルを選択してください");
            return;
        }

        navigate("/confirm", {
            state: {
                file,
                detail,
                categories,
            },
        });
    };

    return (
        <main className="p-5">
            <h2 className="fw-bold mb-4">作品を投稿しよう！</h2>

            {/* ファイル */}
            <section className="mb-4">
                <h5>■ ファイル</h5>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                        height: 240,
                        background: dragOver ? "#9fd0ff" : "#b7dcff",
                        border: "2px dashed #666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {file ? file.name : "ここにドラッグ＆ドロップ"}
                </div>
                <Form.Control
                    type="file"
                    className="mt-2"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </section>

            {/* 詳細 */}
            <section className="mb-4">
                <h5>■ 詳細</h5>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                />
            </section>

            {/* カテゴリ */}
            <section className="mb-5">
                <h5>■ カテゴリー</h5>
                <div className="d-flex gap-3 mt-2">
                    {categoryList.map((cat) => (
                        <Button
                            key={cat}
                            variant={
                                categories.includes(cat)
                                    ? "secondary"
                                    : "outline-secondary"
                            }
                            className="rounded-pill px-4"
                            onClick={() => toggleCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </section>

            <div className="text-end">
                <Button
                    className="rounded-pill px-5"
                    variant="secondary"
                    onClick={handleConfirm}
                >
                    確認
                </Button>
            </div>
        </main>
    );
};

export default UpWorks;

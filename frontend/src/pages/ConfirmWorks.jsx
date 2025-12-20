// src/pages/ConfirmWorks.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const ConfirmWorks = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { file, detail, categories } = location.state || {};

    if (!file) {
        navigate("/upworks");
        return null;
    }

    /** ★ API送信 */
    const handleSubmit = async () => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            alert("ログイン情報がありません");
            navigate("/");
            return;
        }

        const formData = new FormData();
        formData.append("title", file.name);
        formData.append("explanation", detail);
        formData.append("workExtension", file.name.split(".").pop());
        formData.append("workData", file);
        categories.forEach((c) => formData.append("tags", c));

        try {
            const res = await fetch("http://localhost:8080/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error();
            navigate("/complete");
        } catch {
            alert("投稿に失敗しました");
        }
    };

    return (
        <main className="p-5">
            <h2 className="fw-bold mb-4">投稿内容の確認</h2>

            {/* ファイル */}
            <section className="mb-4">
                <h5>■ ファイル</h5>
                <div
                    style={{
                        height: 240,
                        background: "#b7dcff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {file.name}
                </div>
            </section>

            {/* 詳細 */}
            <section className="mb-4">
                <h5>■ 詳細</h5>
                <div className="p-3 bg-light">{detail || "（未入力）"}</div>
            </section>

            {/* カテゴリ */}
            <section className="mb-5">
                <h5>■ カテゴリー</h5>
                <div className="d-flex gap-3">
                    {categories.map((c) => (
                        <span
                            key={c}
                            className="px-4 py-2 rounded-pill border"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </section>

            {/* ボタン */}
            <div className="d-flex justify-content-end gap-3">
                <Button
                    variant="secondary"
                    className="rounded-pill px-4"
                    onClick={() => navigate(-1)}
                >
                    修正
                </Button>
                <Button
                    variant="outline-secondary"
                    className="rounded-pill px-4"
                    onClick={handleSubmit}
                >
                    完了
                </Button>
            </div>
        </main>
    );
};

export default ConfirmWorks;

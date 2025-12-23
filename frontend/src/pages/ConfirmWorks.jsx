// src/pages/ConfirmWorks.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X, FileEarmark } from "react-bootstrap-icons";
import Sidebar from "../components/Sidebar";

const ConfirmWorks = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // UpWorksから渡されたデータを受け取る (file ではなく files)
    const { files, detail, categories } = location.state || {};

    // ファイルがない場合は投稿画面へ戻す
    if (!files || files.length === 0) {
        navigate("/upworks");
        return null;
    }

    /** API送信 */
    const handleSubmit = async () => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            alert("ログイン情報がありません");
            navigate("/");
            return;
        }

        const formData = new FormData();
        // 代表タイトルとして1番目のファイル名を使用（Java側の仕様に合わせる）
        formData.append("title", files[0].name);
        formData.append("explanation", detail);
        formData.append("workExtension", files[0].name.split(".").pop());

        // ★ 複数のファイルをすべて FormData に追加
        files.forEach((f) => {
            formData.append("workData", f);
        });

        // カテゴリーを追加
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
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            <Sidebar />

            {/* メインコンテンツ: サイドバーに寄せる */}
            <main className="flex-grow-1" style={{
                marginLeft: "240px",
                padding: "60px 40px 60px 20px",
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
                        cursor: pointer;
                    }
                    .info-box {
                        width: 100%; border-radius: 15px; background-color: #f2f2f2; 
                        padding: 25px; font-size: 1.3rem; color: #000; border: 2px solid #eee;
                    }
                    .category-tag {
                        border-radius: 30px; padding: 12px 50px; font-weight: bold;
                        border: 2px solid #000; background-color: #d0d0d0;
                        font-size: 1.1rem; color: #000;
                    }
                    .file-confirm-item {
                        background: #fff;
                        border: 1px solid #ddd;
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                    }
                `}</style>

                {/* 右上固定 ×ボタン */}
                <button className="fixed-close-btn" onClick={() => navigate("/upworks")} title="戻る">
                    <X size={40} color="#000000" />
                </button>

                {/* タイトルセクション */}
                <div className="mb-5 text-start p-0">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>投稿内容の確認</h1>
                    <hr className="ms-0" style={{ width: "100%", maxWidth: "800px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-12 col-xl-11">

                            {/* ファイル確認（リスト表示に変更） */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ ファイル ({files.length}件)</h4>
                                <div className="info-box shadow-sm" style={{ backgroundColor: "#b7dcff", border: "2px solid #000" }}>
                                    {files.map((f, index) => (
                                        <div key={index} className="file-confirm-item shadow-sm">
                                            <FileEarmark className="me-3" size={24} />
                                            <span className="fw-bold text-break" style={{ fontSize: "1.2rem" }}>{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 詳細確認 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ 詳細</h4>
                                <div className="info-box shadow-sm" style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}>
                                    {detail || "（未入力）"}
                                </div>
                            </section>

                            {/* カテゴリー確認 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ カテゴリー</h4>
                                <div className="d-flex flex-wrap gap-4 mt-2">
                                    {categories.map((c) => (
                                        <div key={c} className="category-tag shadow-sm">
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* アクションボタン */}
                            <div className="d-flex justify-content-end gap-4 mt-5 pb-5">
                                <Button
                                    variant="light"
                                    className="shadow px-5 py-3 fw-bold fs-2 border-2 border-dark"
                                    style={{ borderRadius: "50px", minWidth: "200px" }}
                                    onClick={() => navigate(-1)}
                                >
                                    修正
                                </Button>
                                <Button
                                    variant="dark"
                                    className="shadow px-5 py-3 fw-bold fs-2"
                                    style={{ borderRadius: "50px", minWidth: "350px" }}
                                    onClick={handleSubmit}
                                >
                                    完了
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConfirmWorks;
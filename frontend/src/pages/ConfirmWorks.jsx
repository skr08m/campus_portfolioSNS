// src/pages/ConfirmWorks.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star, X } from "react-bootstrap-icons";

const ConfirmWorks = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { file, detail, categories } = location.state || {};

    // ファイルがない場合は投稿画面へ戻す
    if (!file) {
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
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>

            {/* サイドバー: 左端固定 (他の画面と共通) */}
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

                            {/* ファイル確認 */}
                            <section className="mb-5 text-start">
                                <h4 className="fw-bold mb-3 m-0 p-0" style={{ fontSize: "1.6rem" }}>■ ファイル</h4>
                                <div className="info-box shadow-sm d-flex align-items-center justify-content-center fw-bold"
                                    style={{ height: "300px", backgroundColor: "#b7dcff", border: "2px solid #000" }}>
                                    {file.name}
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
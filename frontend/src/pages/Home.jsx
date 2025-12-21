// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ファイル名に合わせてApiCommunicationExampleからApiCommunicationなど適宜変更してください
import ApiCommunication from "../api/ApiCommunicationExample";
import { House, Search, Upload, Images, Person, BoxArrowRight, Star } from "react-bootstrap-icons";

const Home = () => {
    const navigate = useNavigate();
    const [works, setWorks] = useState([]); // Ranking表示用の作品リスト
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. ローカルストレージからJWTを取得
        const jwt = localStorage.getItem("jwt");

        // 2. JWTがない場合はログイン画面へ（ガード処理）
        if (!jwt) {
            console.error("JWTが見つかりません。ログイン画面へ戻ります。");
            navigate("/");
            return;
        }

        const fetchHomeData = async () => {
            try {
                // 3. ランキング用として、最新の作品一覧を取得
                const data = await ApiCommunication.searchWorks(jwt, "", []);
                setWorks(data);
            } catch (error) {
                console.error("データ取得エラー:", error);
                // 401エラーの場合はJWTが不正なのでログインへ飛ばす
                if (error.message.includes("401")) {
                    localStorage.removeItem("jwt");
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, [navigate]);

    return (
        <div className="d-flex vh-100 bg-light">
            {/* サイドバー */}
            <aside className="d-flex flex-column text-white" style={{ width: "260px", backgroundColor: "#343a40", flexShrink: 0 }}>
                <div className="text-center py-4 border-bottom">
                    <h4 className="fw-bold">PortFolio SNS</h4>
                    <div className="mx-auto mt-3 rounded-circle bg-secondary" style={{ width: "100px", height: "100px" }} />
                </div>
                <ul className="list-group list-group-flush mt-3">
                    {/* ホーム：現在地なので active */}
                    <li className="list-group-item bg-dark text-white border-0 active" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
                        <House className="me-2" /> ホーム
                    </li>
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/find")}>
                        <Search className="me-2" /> 見つける
                    </li>
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/upworks")}>
                        <Upload className="me-2" /> 作品投稿
                    </li>
                    <li className="list-group-item bg-dark text-white border-0">
                        <Images className="me-2" /> 過去作品
                    </li>
                    {/* ★ 追加項目：マイアルバム */}
                    <li className="list-group-item bg-dark text-white border-0" style={{ cursor: "pointer" }} onClick={() => navigate("/album")}>
                        <Star className="me-2" color="#f1c40f" /> マイアルバム
                    </li>
                    <li className="list-group-item bg-dark text-white border-0">
                        <Person className="me-2" /> マイプロフィール
                    </li>
                </ul>
                <div className="mt-auto p-3">
                    <button className="btn btn-outline-danger w-100" onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}>
                        <BoxArrowRight className="me-2" /> ログアウト
                    </button>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1 p-4 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">🔥 Ranking</h2>
                    <span className="text-muted">最新の投稿を表示中</span>
                </div>

                <div className="row g-4">
                    {loading ? (
                        /* ローディング中のプレースホルダー */
                        [...Array(6)].map((_, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card shadow-sm">
                                    <div className="bg-secondary" style={{ height: "140px" }} />
                                    <div className="card-body">
                                        <p className="placeholder-glow"><span className="placeholder col-6"></span></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* 実際の作品データ表示 */
                        works.map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <div
                                    className="card shadow-sm h-100 card-hover"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/works/${item.id}`)}
                                >
                                    <div className="bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ height: "140px", backgroundColor: "#e9ecef" }}>
                                        {/* プレビュー画像表示 */}
                                        <img
                                            src={`http://localhost:8080/api/works/${item.id}/file`}
                                            alt={item.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<span class="text-muted">No Image</span>';
                                            }}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title fw-bold text-truncate">{item.title}</h6>
                                        <p className="text-muted small mb-1">投稿者: {item.username}</p>
                                        <p className="text-muted small text-truncate">{item.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && works.length === 0 && (
                        <div className="col-12 text-center mt-5">
                            <p className="text-muted">まだ投稿された作品がありません。</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
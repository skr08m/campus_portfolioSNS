// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunicationExample from "../api/ApiCommunicationExample";
import { House, Search, Upload, Images, Person, BoxArrowRight } from "react-bootstrap-icons";

const Home = () => {
    const navigate = useNavigate();
    const [rankingItems, setRankingItems] = useState([]);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate("/");
            return;
        }

        const fetchRanking = async () => {
            try {
                const data = await ApiCommunicationExample.fetchTags(jwt);
                setRankingItems(data);
            } catch (error) {
                console.error(error);
                alert("ランキングデータの取得に失敗しました");
            }
        };

        fetchRanking();
    }, [navigate]);

    return (
        <div className="d-flex vh-100 bg-light">
            {/* サイドバー */}
            <aside
                className="d-flex flex-column text-white"
                style={{ width: "260px", backgroundColor: "#343a40" }}
            >
                <div className="text-center py-4 border-bottom">
                    <h4 className="fw-bold">PortFolio SNS</h4>
                    <div
                        className="mx-auto mt-3 rounded-circle bg-secondary"
                        style={{ width: "100px", height: "100px" }}
                    />
                </div>

                <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item bg-dark text-white border-0 active">
                        <House className="me-2" /> ホーム
                    </li>
                    <li
                        className="list-group-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/find")}
                    >
                        見つける
                    </li>

                    <li className="list-group-item bg-dark text-white border-0">
                        <Upload className="me-2" /> 作品投稿
                    </li>
                    <li className="list-group-item bg-dark text-white border-0">
                        <Images className="me-2" /> 過去作品
                    </li>
                    <li className="list-group-item bg-dark text-white border-0">
                        <Person className="me-2" /> マイプロフィール
                    </li>
                </ul>

                <div className="mt-auto p-3">
                    <button
                        className="btn btn-outline-danger w-100"
                        onClick={() => {
                            localStorage.removeItem("jwt");
                            navigate("/");
                        }}
                    >
                        <BoxArrowRight className="me-2" />
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-grow-1 p-4 overflow-auto">
                {/* ヘッダー */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">🔥 Ranking</h2>
                    <span className="text-muted">現在お知らせはありません</span>
                </div>

                {/* ランキングカード */}
                <div className="row g-4">
                    {rankingItems.length === 0 &&
                        [...Array(6)].map((_, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card shadow-sm">
                                    <div
                                        className="bg-secondary"
                                        style={{ height: "140px" }}
                                    />
                                    <div className="card-body">
                                        <p className="placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {rankingItems.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card shadow-sm h-100">
                                <div
                                    className="bg-light"
                                    style={{ height: "140px" }}
                                />
                                <div className="card-body">
                                    <h6 className="card-title fw-bold">
                                        {item.name || "作品名"}
                                    </h6>
                                    <p className="text-muted small">
                                        作品の簡単な説明が入ります
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";

const Result = () => {
    const location = useLocation();
    const { keyword, tags } = location.state || {};


    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const jwt = localStorage.getItem("token");

                const result = await ApiCommunication.searchWorks(
                    jwt,
                    keyword,
                    tags
                );

                setWorks(result);
            } catch (err) {
                console.error(err);
                alert("検索に失敗しました");
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, [keyword, tags]);

    if (loading) return <p>読み込み中...</p>;

    return (
        <>
            <h2>検索結果</h2>
            <div className="row">
                {works.map((work) => (
                    <div className="col-md-4 mb-4" key={work.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{work.title}</h5>
                                <p className="card-text">{work.userName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Result;

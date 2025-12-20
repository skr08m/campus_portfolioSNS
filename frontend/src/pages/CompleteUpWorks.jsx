// src/pages/CompleteUpWorks.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

const CompleteUpWorks = () => {
    const navigate = useNavigate();

    return (
        <main
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
        >
            {/* アイコン */}
            <CheckCircleFill size={80} color="#6c757d" className="mb-4" />

            {/* メッセージ */}
            <h2 className="fw-bold mb-3">投稿が完了しました！</h2>
            <p className="text-muted mb-5">
                作品の投稿が正常に完了しました。<br />
                ホーム画面から他の作品も確認できます。
            </p>

            {/* ホームへ */}
            <Button
                variant="outline-secondary"
                className="rounded-pill px-5 py-2"
                onClick={() => navigate("/home")}
            >
                ホームへ
            </Button>
        </main>
    );
};

export default CompleteUpWorks;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCommunication from "../api/ApiCommunicationExample";
import Sidebar from "../components/Sidebar";
import { X } from "react-bootstrap-icons";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- 認証付き画像表示コンポーネント (省略なし) ---
const AlbumImage = ({ workId }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        let isMounted = true;
        const jwt = localStorage.getItem("jwt");
        const fetchImage = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/works/${workId}/file`, {
                    headers: { "Authorization": `Bearer ${jwt}` }
                });
                if (!res.ok) throw new Error();
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                if (isMounted) setImageUrl(objectUrl);
            } catch (err) {
                if (isMounted) setError(true);
            }
        };
        fetchImage();
        return () => { isMounted = false; if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, [workId]);
    if (error) return <span className="text-muted fw-bold">No Image</span>;
    if (!imageUrl) return <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>;
    return <img src={imageUrl} alt="Work" className="card-img-top" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
};

const MyAlbum = () => {
    const navigate = useNavigate();
    const [albumWorks, setAlbumWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    // モーダル管理用のステート
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkId, setSelectedWorkId] = useState(null);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) { navigate("/"); return; }
        const fetchAlbum = async () => {
            try {
                const data = await ApiCommunication.fetchMyAlbum(jwt);
                setAlbumWorks(data);
            } catch (error) {
                console.error("アルバム取得エラー:", error);
            } finally { setLoading(false); }
        };
        fetchAlbum();
    }, [navigate]);

    // 削除ボタンが押された時（モーダルを開く）
    const handleShowModal = (e, workId) => {
        e.stopPropagation(); // 詳細画面への遷移を防ぐ
        setSelectedWorkId(workId);
        setShowModal(true);
    };

    // ★ モーダル内で「削除」が確定した時
    const handleConfirmDelete = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            await ApiCommunication.removeFromAlbum(jwt, selectedWorkId);
            setAlbumWorks(prev => prev.filter(w => w.id !== selectedWorkId));

            setShowModal(false);

            toast.success("🗑️ アルバムから削除しました", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
            });
        } catch (error) {
            toast.error("削除に失敗しました。");
        }
    };

    const MIN_CARDS = 6;

    return (
        <div className="d-flex w-100 m-0 p-0" style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <ToastContainer />
            <Sidebar />

            {/* 削除確認モーダル */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Comfirm</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center fs-5 py-4">
                    この作品をアルバムから削除しますか？
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="px-4" style={{ borderRadius: "10px" }}>
                        キャンセル
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} className="px-4" style={{ borderRadius: "10px" }}>
                        削除する
                    </Button>
                </Modal.Footer>
            </Modal>

            <main className="flex-grow-1" style={{ marginLeft: "240px", padding: "60px 40px", width: "calc(100% - 240px)", minWidth: 0 }}>
                <style>{`
                    @media (max-width: 767px) { main { margin-left: 0 !important; width: 100% !important; padding: 20px !important; } }
                    .fixed-close-btn { position: fixed; top: 25px; right: 30px; z-index: 2001; background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; cursor: pointer; }
                    .custom-card { border: 2px solid #eee; border-radius: 20px; overflow: hidden; transition: all 0.3s ease; background-color: #fff; position: relative; height: 100%; }
                    .custom-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); border-color: #333; }
                    .card-img-container { width: 100%; aspect-ratio: 1 / 1; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid #eee; }
                    .remove-btn-overlay { position: absolute; top: 15px; right: 15px; z-index: 10; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: 0.2s; }
                    .remove-btn-overlay:hover { background: #ff4d4d; color: white; }
                    .empty-card { border-radius: 20px; border: 2px dashed #ddd; background: #fafafa; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
                `}</style>

                <button className="fixed-close-btn" onClick={() => navigate("/home")}><X size={40} color="#000000" /></button>

                <div className="mb-5 text-start">
                    <h1 className="m-0 p-0" style={{ fontSize: "3.5rem", fontWeight: "bold", lineHeight: "1.2" }}>マイアルバム</h1>
                    <hr className="mx-0" style={{ width: "100%", maxWidth: "600px", borderTop: "5px solid #000", opacity: 1, marginTop: "10px" }} />
                </div>

                <div className="container-fluid p-0">
                    <div className="row g-5">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div className="col-12 col-md-6 col-xl-4" key={i}>
                                    <div className="card custom-card placeholder-glow"><div className="placeholder w-100" style={{ aspectRatio: "1/1" }} /></div>
                                </div>
                            ))
                        ) : (
                            <>
                                {albumWorks.map((work) => (
                                    <div className="col-12 col-md-6 col-xl-4" key={work.id}>
                                        <div className="card custom-card shadow-sm" onClick={() => navigate(`/works/${work.id}`)} style={{ cursor: "pointer" }}>
                                            <button className="remove-btn-overlay" onClick={(e) => handleShowModal(e, work.id)}>
                                                <X size={24} />
                                            </button>
                                            <div className="card-img-container">
                                                <AlbumImage workId={work.id} />
                                            </div>
                                            <div className="card-body p-4 d-flex justify-content-between align-items-center">
                                                <div className="text-truncate" style={{ maxWidth: "85%" }}>
                                                    <h3 className="card-title fw-bold mb-1 text-truncate" style={{ fontSize: "1.8rem" }}>{work.title}</h3>
                                                    <p className="card-text text-muted mb-0 fs-5">@{work.username || "Unknown"}</p>
                                                </div>
                                                <div style={{ width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#000" }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {albumWorks.length < MIN_CARDS && (
                                    [...Array(MIN_CARDS - albumWorks.length)].map((_, i) => (
                                        <div className="col-12 col-md-6 col-xl-4" key={`empty-${i}`}>
                                            <div className="empty-card shadow-sm"><span className="text-muted fw-bold fs-4">Empty Slot</span></div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyAlbum;
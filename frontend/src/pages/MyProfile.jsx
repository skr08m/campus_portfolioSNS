import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { X } from 'react-bootstrap-icons'; // react-bootstrap-iconsを使用

const MyProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                if (!jwt) throw new Error("ログインが必要です");

                const res = await fetch("http://localhost:8080/api/users/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${jwt}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) throw new Error("認証期限が切れました。再ログインしてください。");
                    throw new Error("プロフィールの取得に失敗しました");
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return (
        <Container className="text-center" style={{ marginTop: "100px" }}>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">読み込み中...</p>
        </Container>
    );

    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <>
            <style>{`
        .fixed-close-btn {
          position: fixed; top: 25px; right: 30px; z-index: 2001;
          background-color: #ffffff; border: 1px solid #ddd; border-radius: 50%; 
          padding: 8px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease;
          cursor: pointer;
        }
        .fixed-close-btn:hover { transform: scale(1.1); background-color: #f8f9fa; }
      `}</style>

            {/* 右上固定 ×ボタン */}
            <button className="fixed-close-btn" onClick={() => navigate("/home")} title="閉じる">
                <X size={40} color="#000000" />
            </button>

            {/* デモ用にmaxWidthを広げつつ中央寄せ */}
            <Container className="py-5" style={{ maxWidth: '1000px' }}>
                <Card className="shadow-sm border-0 overflow-hidden" style={{ borderRadius: '20px' }}>

                    {/* ヘッダー背景（装飾用） */}
                    <div style={{ height: '160px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>

                    <Card.Body className="px-5 pb-5">
                        <Row className="align-items-end" style={{ marginTop: '-80px' }}>
                            <Col xs="auto">
                                <div
                                    className="rounded-circle border border-4 border-white shadow-sm d-flex align-items-center justify-content-center bg-white"
                                    style={{ width: '150px', height: '150px', fontSize: '4rem' }}
                                >
                                    👤
                                </div>
                            </Col>
                            <Col className="pb-2">
                                <h2 className="fw-bold m-0" style={{ fontSize: '2.5rem' }}>{user.username}</h2>
                                <p className="text-muted m-0 fs-5">@{user.username}</p>
                            </Col>
                        </Row>

                        <hr className="my-5" />

                        {/* 自己紹介セクション */}
                        <section className="mb-5">
                            <h4 className="fw-bold mb-4" style={{ color: '#2d3748' }}>■ 自己紹介</h4>
                            <div className="p-4 bg-light rounded-4" style={{ minHeight: '120px' }}>
                                <p className="mb-0 text-secondary fs-5" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                                    {user.selfIntroduction || "自己紹介はまだ設定されていません。"}
                                </p>
                            </div>
                        </section>

                        {/* カテゴリー（タグ）セクション */}
                        <section>
                            <h4 className="fw-bold mb-4" style={{ color: '#2d3748' }}>■ 興味のあるカテゴリー</h4>
                            <div className="d-flex flex-wrap gap-3">
                                {user.favoriteTags && user.favoriteTags.length > 0 ? (
                                    user.favoriteTags.map((tagName, index) => (
                                        <Badge
                                            key={index}
                                            pill
                                            bg="white"
                                            text="dark"
                                            className="border shadow-sm px-4 py-3"
                                            style={{ fontSize: '1.1rem', fontWeight: '500' }}
                                        >
                                            #{tagName}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted">タグが選択されていません</span>
                                )}
                            </div>
                        </section>

                        {/* 修正：ボタンの位置をさらに下へ調整 */}
                        <div className="mt-5 pt-2">
                            <button
                                className="btn btn-outline-primary rounded-pill px-4"
                                onClick={() => navigate("/editprofile")}
                                style={{ fontWeight: '600' }}
                            >
                                プロフィールを編集
                            </button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default MyProfile;
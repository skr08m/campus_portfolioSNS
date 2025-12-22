// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();

  // 基本情報
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });

  const [iconFile, setIconFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // タグリスト（DBのIDと合わせる）
  const tagList = [
    { tagId: 1, tagName: "IoT" },
    { tagId: 2, tagName: "メタ" },
    { tagId: 3, tagName: "音楽" },
    { tagId: 4, tagName: "VR" },
    { tagId: 5, tagName: "Webアプリ" },
    { tagId: 6, tagName: "ゲーム" },
    { tagId: 7, tagName: "AI" },
    { tagId: 8, tagName: "3Dモデル" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      setIconFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 登録処理のロジック（省略せずに元のコードを維持）
      const regRes = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          mailAddress: formData.email,
          password: formData.password
        }),
      });

      if (!regRes.ok) throw new Error("アカウント登録に失敗しました");
      const jwt = await regRes.text();
      localStorage.setItem("jwt", jwt);

      await fetch("http://localhost:8080/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({ selfIntroduction: formData.bio }),
      });

      const selectedTagIds = selectedTags.map(tag => tag.tagId);
      await fetch("http://localhost:8080/api/users/me/favorite-tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify(selectedTagIds),
      });

      alert("新規登録とプロフィールの設定が完了しました！");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Container className="mt-4 mx-auto" style={{ maxWidth: '800px' }}>
      {/* 統一されたインラインCSSを追加 */}
      <style>{`
        .tag-btn {
          border-radius: 30px; padding: 12px 20px;
          font-weight: bold; border: 2px solid #ddd;
          background-color: #f8f9fa; transition: 0.2s;
          font-size: 1.1rem; color: #000 !important;
          text-align: center; width: 100%;
        }
        .tag-btn.active {
          background-color: #d0d0d0; border-color: #000;
        }
      `}</style>

      <h2 className="text-center fw-bold mb-4" style={{ fontSize: "2.5rem" }}>新規登録</h2>

      <Form onSubmit={handleSubmit}>
        {/* アイコン画像選択 */}
        <section className="mb-4 text-start">
          <Form.Label className="fw-bold">■ プロフィールアイコン</Form.Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              height: 150,
              background: dragOver ? "#f0f9ff" : "#f8f9fa",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => document.getElementById('iconInput').click()}
          >
            {iconFile ?
              <span className="text-success">✔ {iconFile.name}</span> :
              <span className="text-muted">画像をドラッグ＆ドロップ または クリック</span>
            }
          </div>
          <Form.Control
            id="iconInput"
            type="file"
            className="d-none"
            onChange={(e) => setIconFile(e.target.files[0])}
          />
        </section>

        {/* 基本入力欄 */}
        <Form.Group className="mb-3 text-start">
          <Form.Label className="fw-bold">■ ユーザー名</Form.Label>
          <Form.Control name="username" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3 text-start">
          <Form.Label className="fw-bold">■ メールアドレス</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">■ パスワード</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} required />
          </Form.Group>
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">■（確認用）</Form.Label>
            <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
          </Form.Group>
        </Row>

        {/* 自己紹介 */}
        <Form.Group className="mb-4 text-start">
          <Form.Label className="fw-bold">■ 自己紹介</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            placeholder="興味のある技術などを教えてください"
            onChange={handleChange}
          />
        </Form.Group>

        {/* 修正ポイント: カテゴリー選択（Find.jsxと同様のUI） */}
        <section className="mb-5 text-start">
          <Form.Label className="fw-bold">■ カテゴリー（興味のある分野）</Form.Label>
          <Row className="g-3 mt-1">
            {tagList.map((tag) => (
              <Col xs={6} md={3} key={tag.tagId}>
                <button
                  type="button"
                  className={`tag-btn shadow-sm ${selectedTags.some(t => t.tagId === tag.tagId) ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTags((prev) =>
                      prev.some((t) => t.tagId === tag.tagId)
                        ? prev.filter((t) => t.tagId !== tag.tagId)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag.tagName}
                </button>
              </Col>
            ))}
          </Row>
        </section>

        {/* ボタン類 */}
        <div className="d-grid gap-3 mb-5">
          <Button variant="dark" type="submit" size="lg" className="rounded-pill py-3 fw-bold">
            この内容で登録する
          </Button>
          <Button variant="link" className="text-muted text-decoration-none" onClick={() => navigate('/')}>
            キャンセルして戻る
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
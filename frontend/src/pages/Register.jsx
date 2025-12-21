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
    bio: '', // 自己紹介
  });

  // アイコン画像とタグ（UpWorksを参考に独立させたState）
  const [iconFile, setIconFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const tagList = ["Java", "React", "Python", "Design", "AWS", "IoT"];

  // ハンドラー系
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
    if (formData.password !== formData.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    
    // TODO: 実際のAPI送信処理（FormDataを使用）
    console.log({ ...formData, iconFile, selectedTags });
    alert("登録処理へ進みます（実装中）");
  };

  return (
    <Container className="mt-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h2 className="text-center fw-bold mb-4">新規登録</h2>
      <Form onSubmit={handleSubmit}>
        
        {/* アイコン画像選択（UpWorksのドラッグ＆ドロップを応用） */}
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
            className="d-none" // 隠しておいて、上のdivクリックで発火
            onChange={(e) => setIconFile(e.target.files[0])}
          />
        </section>

        {/* 基本入力欄 */}
        <Row className="mb-3">
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">ユーザー名</Form.Label>
            <Form.Control name="username" onChange={handleChange} required />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3 text-start">
          <Form.Label className="fw-bold">メールアドレス</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">パスワード</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} required />
          </Form.Group>
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">（確認用）</Form.Label>
            <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
          </Form.Group>
        </Row>

        {/* 自己紹介（UpWorksの詳細を応用） */}
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

        {/* タグ選択（UpWorksのカテゴリを応用） */}
        <section className="mb-5 text-start">
          <Form.Label className="fw-bold">■ 興味のあるタグ</Form.Label>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {tagList.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "primary" : "outline-primary"}
                className="rounded-pill px-3"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </section>

        {/* ボタン類 */}
        <div className="d-grid gap-2 mb-5">
          <Button variant="success" type="submit" size="lg" className="rounded-pill">
            この内容で登録する
          </Button>
          <Button variant="link" className="text-muted" onClick={() => navigate('/')}>
            キャンセルして戻る
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
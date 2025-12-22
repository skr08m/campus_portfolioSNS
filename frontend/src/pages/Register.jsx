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

  // 1. タグリストをオブジェクト形式で定義（DBのIDと合わせる）
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

  // ハンドラー系
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tagObj) => {
    setSelectedTags((prev) =>
      prev.find(t => t.tagId === tagObj.tagId)
        ? prev.filter((t) => t.tagId !== tagObj.tagId) // IDで比較して削除
        : [...prev, tagObj]                            // 追加
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

    try {
      // --- STEP 1: アカウント作成 (POST) ---
      const regRes = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,    // 全て小文字 (n)
          mailAddress: formData.email,   // そのまま
          password: formData.password    // 全て小文字 (w)
        }),
      });

      if (!regRes.ok) throw new Error("アカウント登録に失敗しました");
      const jwt = await regRes.text();
      localStorage.setItem("jwt", jwt);

      // --- STEP 2: 自己紹介文の保存 (PATCH) ---
      const introRes = await fetch("http://localhost:8080/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({ selfIntroduction: formData.bio }),
      });
      if (!introRes.ok) throw new Error("自己紹介の保存に失敗しました");

      // --- STEP 3: よく使うタグの保存 (POST) ---
      // エンドポイント: /api/users/me/favorite-tags
      const selectedTagIds = selectedTags.map(tag => tag.tagId);

      const tagRes = await fetch("http://localhost:8080/api/users/me/favorite-tags", {
        method: "PUT", // @PutMapping なので PUT を指定
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(selectedTagIds), // [1, 2] のような数値配列を送信
      });
      if (!tagRes.ok) throw new Error("タグの保存に失敗しました");

      // 全て成功！
      alert("新規登録とプロフィールの設定が完了しました！");
      navigate("/home");

    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.message);
    }
  };

  return (
    <Container className="mt-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h2 className="text-center fw-bold mb-4">新規登録</h2>
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
            className="d-none" // 隠しておいて、上のdivクリックで発火
            onChange={(e) => setIconFile(e.target.files[0])}
          />
        </section>

        {/* 基本入力欄 */}
        <Row className="mb-3">
          <Form.Group as={Col} className="text-start">
            <Form.Label className="fw-bold">■ ユーザー名</Form.Label>
            <Form.Control name="username" onChange={handleChange} required />
          </Form.Group>
        </Row>

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

        {/* タグ選択（UpWorksのカテゴリを応用） */}
        {/* カテゴリー選択セクション */}
        <section className="mb-5 text-start">
          <Form.Label className="fw-bold">■ カテゴリー</Form.Label>
          <div className="d-flex flex-wrap gap-4 mt-2 p-0">
            {tagList.map((tag) => {
              // 現在選択されているか判定（IDで比較）
              const isActive = selectedTags.some(t => t.tagId === tag.tagId);

              return (
                <button
                  key={tag.tagId}
                  type="button"
                  // selectedTagsの中にこのタグのIDがあれば 'active' クラスを付与
                  className={`category-btn shadow-sm ${isActive ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTags((prev) =>
                      prev.some((t) => t.tagId === tag.tagId)
                        ? prev.filter((t) => t.tagId !== tag.tagId) // すでにあれば削除
                        : [...prev, tag]                           // なければ追加
                    );
                  }}
                >
                  {tag.tagName}
                </button>
              );
            })}
          </div>
        </section>

        {/* ボタン類 */}
        <div className="d-grid gap-2 mb-5">
          <Button variant="dark" type="submit" size="lg" className="rounded-pill">
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
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { X } from 'react-bootstrap-icons';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    selfIntroduction: '',
    selectedTagIds: [] 
  });
  const [allTags, setAllTags] = useState([]); // ここにDBの全タグを格納
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        // すべての通信で使用するヘッダーを定義
        const headers = { "Authorization": `Bearer ${jwt}` };
        
        // 1. 各リクエストを実行（resAllTagsにもheadersを追加しました）
        const [resAllTags, resUser, resMyTags] = await Promise.all([
          fetch("http://localhost:8080/api/tags", { headers }), // 修正箇所
          fetch("http://localhost:8080/api/users/me", { headers }),
          fetch("http://localhost:8080/api/users/me/favorite-tags", { headers })
        ]);

        // 2. レスポンスが正常かチェックし、テキストとして一度受ける
        const [allTagsText, userText, myTagsText] = await Promise.all([
          resAllTags.ok ? resAllTags.text() : Promise.resolve("[]"),
          resUser.ok ? resUser.text() : Promise.resolve("{}"),
          resMyTags.ok ? resMyTags.text() : Promise.resolve("[]")
        ]);

        // 3. テキストが空でなければパース、空ならデフォルト値を設定
        const tagsMaster = allTagsText ? JSON.parse(allTagsText) : [];
        const userData = userText ? JSON.parse(userText) : {};
        const myTagNames = myTagsText ? JSON.parse(myTagsText) : [];

        // 4. データ加工
        const initialTagIds = tagsMaster
          .filter(t => myTagNames.includes(t.tagName))
          .map(t => t.tagId);

        // 5. ステート更新
        setFormData({
          username: userData.username || '',
          selfIntroduction: userData.selfIntroduction || '',
          selectedTagIds: initialTagIds
        });
        setAllTags(tagsMaster);

      } catch (err) {
        console.error("データの読み込みに失敗しました:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTagClick = (tagId) => {
    setFormData(prev => {
      const isSelected = prev.selectedTagIds.includes(tagId);
      const newIds = isSelected 
        ? prev.selectedTagIds.filter(id => id !== tagId)
        : [...prev.selectedTagIds, tagId];
      return { ...prev, selectedTagIds: newIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const jwt = localStorage.getItem("jwt");

    try {
      // プロフィール更新とタグ更新を並列実行
      await Promise.all([
        fetch("http://localhost:8080/api/users/me", {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${jwt}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            selfIntroduction: formData.selfIntroduction
          })
        }),
        fetch("http://localhost:8080/api/users/me/favorite-tags", {
          method: "PUT",
          headers: { "Authorization": `Bearer ${jwt}`, "Content-Type": "application/json" },
          body: JSON.stringify(formData.selectedTagIds)
        })
      ]);
      
      alert("プロフィールを更新しました！");
      navigate("/myprofile");
    } catch (err) {
      alert("更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <button className="fixed-close-btn" onClick={() => navigate("/myprofile")} style={{ position: 'fixed', top: '25px', right: '30px', border: 'none', background: 'white', borderRadius: '50%', padding: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <X size={35} />
      </button>

      <Card className="shadow border-0 p-4" style={{ borderRadius: '20px' }}>
        <h2 className="fw-bold mb-4 text-center">プロフィール編集</h2>
        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase">ユーザー名</Form.Label>
            <Form.Control 
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={{ borderRadius: '10px', padding: '12px' }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small text-muted text-uppercase">自己紹介</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              value={formData.selfIntroduction}
              onChange={(e) => setFormData({...formData, selfIntroduction: e.target.value})}
              style={{ borderRadius: '10px', padding: '12px' }}
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-bold small text-muted text-uppercase">興味のあるカテゴリー（複数選択可）</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {allTags.map(tag => (
                <Badge
                  key={tag.tagId}
                  pill
                  bg={formData.selectedTagIds.includes(tag.tagId) ? "primary" : "light"}
                  text={formData.selectedTagIds.includes(tag.tagId) ? "white" : "dark"}
                  className="px-3 py-2 border"
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                  onClick={() => handleTagClick(tag.tagId)}
                >
                  {tag.tagName}
                </Badge>
              ))}
            </div>
          </Form.Group>

          <div className="d-grid gap-3">
            <Button variant="primary" type="submit" size="lg" disabled={saving} style={{ borderRadius: '10px', fontWeight: 'bold' }}>
              {saving ? <Spinner size="sm" /> : "変更を保存する"}
            </Button>
            <Button variant="link" className="text-muted" onClick={() => navigate("/myprofile")}>
              キャンセル
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditProfile;
// src/pages/Logout.jsx
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from 'react-bootstrap';

const Logout = () => {
  const navigate = useNavigate();

  // ログアウト実行
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // トークンを破棄
    alert("ログアウトしました");
    navigate("/"); // ログイン画面へ
  };

  // キャンセル（前の画面に戻る）
  const handleCancel = () => {
    navigate(-1); // ブラウザの履歴で一つ前に戻る
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="text-center p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="mb-4">ログアウトの確認</Card.Title>
          <Card.Text className="mb-4 text-muted">
            本当にログアウトしますか？<br />
          </Card.Text>
          <div className="d-grid gap-2">
            <Button variant="danger" size="lg" onClick={handleLogout}>
              ログアウトする
            </Button>
            <Button variant="outline-secondary" onClick={handleCancel}>
              キャンセルして戻る
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Logout;
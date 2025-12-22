import { useEffect, useState } from 'react';
import { Container, Card, Image, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. サーバーから自分のプロフィールを取得する
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        if (!response.ok) throw new Error("取得失敗");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div>読み込み中...</div>;

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Card className="text-center p-4 shadow-sm">
        <div className="mx-auto mb-3">
          {/* アイコン画像の表示。保存パスに合わせてURLを調整 */}
          <Image 
            src={profile.iconPath ? `http://localhost:8080/uploads/${profile.iconPath}` : "/default-icon.png"} 
            roundedCircle 
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            border="2px solid #ddd"
          />
        </div>
        <Card.Body>
          <Card.Title className="fs-3 fw-bold">{profile.userName}</Card.Title>
          <Card.Text className="text-muted mb-4">
            {profile.bio || "自己紹介が設定されていません。"}
          </Card.Text>

          <div className="mb-4">
            <h6 className="fw-bold text-start">興味のある分野：</h6>
            <div className="d-flex flex-wrap gap-2">
              {profile.tags && profile.tags.map(tag => (
                <Badge key={tag} pill bg="primary" className="px-3 py-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button variant="outline-dark" onClick={() => navigate('/edit-profile')}>
            プロフィールを編集する
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyProfile;
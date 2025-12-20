// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // パスワード一致チェック（フロント側のバリデーション）
    if (formData.password !== formData.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      // 1. サーバーへ送信
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userName: formData.username,
            mailAddress: formData.email,
            passWord: formData.password
          })
        }
      );

      // 2. レスポンスのチェック
      if (!response.ok) {
        throw new Error("登録に失敗しました");
      }

      // 3. サーバーから返ってきたJWT（証明書）を受け取る
      const jwt = await response.text();

      // 4. JWTを保存（これでHome画面に入れるようになる）
      localStorage.setItem("jwt", jwt);

      alert("登録が完了し、ログインしました！");
      navigate("/home");

    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました: " + error.message);
    }
  };

  return (
    <Container className="my-5 mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">新規登録</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control type="text" name="username" placeholder="ユーザー名" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="email" name="email" placeholder="メールアドレス" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="password" name="password" placeholder="パスワード" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control type="password" name="confirmPassword" placeholder="パスワード（確認）" onChange={handleChange} required />
        </Form.Group>
        <div className="d-grid">
          <Button variant="success" type="submit" size="lg">登録する</Button>
        </div>
      </Form>
    </Container>
  );
};
export default Register;
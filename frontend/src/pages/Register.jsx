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

    // パスワード一致チェック
    if (formData.password !== formData.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      // サーバーへ送信
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: formData.username,    // Java側の private String username に合わせる
            mailAddress: formData.email,   // Java側の private String mailAddress に合わせる
            password: formData.password     // Java側の private String password に合わせる
          })
        }
      );

      // レスポンスチェック
      if (!response.ok) {
        throw new Error("登録に失敗しました");
      }

      // サーバーから返ってきたJWTを受け取る
      const jwt = await response.text();

      // JWTを保存
      localStorage.setItem("jwt", jwt);
      alert("登録が完了し、ログインしました！");
      navigate("/home");

    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました: " + error.message);
    }
  };

  return (
    <Container className="my-2 mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">新規登録</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 text-start">
          <Form.Label>■ ユーザー名</Form.Label>
          <Form.Control type="text" name="username" placeholder="ユーザー名" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3 text-start">
          <Form.Label>■ メールアドレス</Form.Label>
          <Form.Control type="email" name="email" placeholder="メールアドレス" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3 text-start">
          <Form.Label>■ パスワード</Form.Label>
          <Form.Control type="password" name="password" placeholder="パスワード" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-4 text-start">
          <Form.Label>■ パスワード（確認）</Form.Label>
          <Form.Control type="password" name="confirmPassword" placeholder="パスワード（確認）" onChange={handleChange} required />
        </Form.Group>
        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            キャンセル
          </Button>
          <Button variant="primary" type="submit">
            登録する
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
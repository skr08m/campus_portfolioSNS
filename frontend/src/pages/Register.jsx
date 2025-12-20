// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const RegisterPage = () => {
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
      // TODO: ここで API 通信 (POST /api/register)
      console.log("新規登録データ:", formData);

      alert("登録が完了しました！ログインしてください。");
      navigate("/"); // ログイン画面へ
    } catch (error) {
      alert("登録に失敗しました");
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

export default RegisterPage;
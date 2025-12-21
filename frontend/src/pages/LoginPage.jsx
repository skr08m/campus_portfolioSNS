// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  // useStateを使用してフォームの入力値を保持
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // ログイン成功後にページ遷移を行うためのフック
  const navigate = useNavigate();

  // 入力フィールド変更時の処理
  const handleChange = (e) => {
    // e.target.name と e.target.value を使って、対応するフィールドの状態を更新
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ログインエンドポイントへPOSTリクエスト
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          // RegisterとはJSON名が異なるため注意
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      // 401 Unauthorized などが返ってきた場合はエラーメッセージを表示
      if (!response.ok) {
        throw new Error("メールアドレスまたはパスワードが正しくありません");
      }

      // サーバーから発行されたJWTを受け取る
      const jwt = await response.text();

      // ブラウザのlocalStorageに保存
      localStorage.setItem("jwt", jwt);

      alert("ログイン成功！");
      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Container className="text-center mt-5 mb-3">
        {/* h1 の mb-4 を mb-2 などに調整し、p タグなどを使ってキャッチフレーズを追加しても良い */}
        <h1>ポートフォリオ共有サービス</h1>
      </Container>
      {/* // Containerコンポーネントでコンテンツを中央寄せにし、パディングを適用 */}
      <Container className="my-5 mx-auto" style={{ maxWidth: '300px' }}>
        <h2 className="text-center mb-4">ログイン</h2>

        {/* HTMLの<form>をFormコンポーネントに置き換え、onSubmitを設定 */}
        <Form onSubmit={handleSubmit}>

          {/* メールアドレス入力欄 */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* <Form.Label>メールアドレス</Form.Label> */}
            <Form.Control
              type="email"
              name="email"
              placeholder="メールアドレスを入力"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* パスワード入力欄 */}
          <Form.Group className="mb-4" controlId="formBasicPassword">
            {/* <Form.Label>パスワード</Form.Label> */}
            <Form.Control
              type="password"
              name="password"
              placeholder="パスワードを入力"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* ログインボタン */}
          {/* HTMLの<button>をButtonコンポーネントに置き換え、variantで色を指定 */}
          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              ログイン
            </Button>
          </div>
        </Form>

        <p className="text-center mt-4">
          アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
        </p>
      </Container>
    </>
  );
};

export default LoginPage;
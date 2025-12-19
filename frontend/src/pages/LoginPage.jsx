// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginPage = () => {
  // useStateを使用してフォームの入力値を保持
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // ログイン成功後にページ遷移を行うためのフック
  const navigate = useNavigate();

  // 2. イベントハンドラ: 入力フィールド変更時の処理
  const handleChange = (e) => {
    // e.target.name と e.target.value を使って、対応するフィールドの状態を更新
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. イベントハンドラ: フォーム送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作（ページリロード）を防止

    console.log('ログイン試行:', formData);

    // --- ここに実際の認証ロジックを記述します ---

    // 例: 簡易的な認証チェック (実際にはAPI通信を行う)
    if (formData.email === 'test@example.com' && formData.password === 'password') {

      // ログイン成功後、/home ページへ遷移
      navigate('/home');
    } else {
      alert('メールアドレスまたはパスワードが間違っています。');
    }
  };

  return (
    <>
    {/* サービス名表示 */}
    <Container className="text-center mt-5 mb-3">
      <h1>ポートフォリオ共有サービス</h1> 
    </Container>
    
    {/* 以下ログイン関連 */}
    <Container className="my-5 mx-auto" style={{ maxWidth: '300px' }}>
      {/* タイトル表示 */}
      <h2 className="text-center mb-4">ログイン</h2>

      {/* onSubmitを設定 */}
      <Form onSubmit={handleSubmit}>

        {/* メールアドレス入力欄 */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
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
        <div className="d-grid">
          <Button variant="primary" type="submit" size="lg">
            ログイン
          </Button>
        </div>
      </Form>

      <p className="text-center mt-4">
        アカウントをお持ちでないですか？ <a href="/register">新規登録</a>
      </p>
    </Container>
    </>
  );
};

export default LoginPage;
// src/pages/LoginPage.jsx

import React, { useState } from 'react';
// react-router-dom を使っている場合、ログイン成功後の遷移に必要
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // 1. 状態 (State): フォームの入力値を保持
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
      alert('ログイン成功！');
      
      // ログイン成功後、/home ページへ遷移
      navigate('/home'); 
    } else {
      alert('メールアドレスまたはパスワードが間違っています。');
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      
      {/* 3. UI: ログインフォーム */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email" // name属性は formData のキーと一致させる
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password" // name属性は formData のキーと一致させる
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">ログイン</button>
      </form>
      
      {/* 例: 新規登録ページへのリンク */}
      <p>
        アカウントをお持ちでないですか？ <a href="/register">新規登録</a>
      </p>
    </div>
  );
};

export default LoginPage;
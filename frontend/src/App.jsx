import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {

  return (
    // URLに応じて表示するコンポーネントを切り替える
    <Routes>
      {/* サービスにアクセスしたとき（/）はLoginPageを表示 */}
      <Route path="/" element={<LoginPage />} />
      
      {/* ログイン成功後はHomePageを表示 */}
      <Route path="/home" element={<HomePage />} />
      
    </Routes>
  )
}

export default App

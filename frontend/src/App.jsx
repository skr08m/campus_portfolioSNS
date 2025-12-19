import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
//import HomePage from './pages/HomePage';
import Home from './pages/Home';
import Find from "./pages/Find";

function App() {

  return (
    // URLに応じて表示するコンポーネントを切り替える
    <Routes>
      {/* サービスにアクセスしたとき（/）はLoginPageを表示 */}
      <Route path="/" element={<LoginPage />} />

      {/* ログイン成功後はHomePageを表示
      <Route path="/home" element={<HomePage />} /> */}

      {/*ログイン成功後はHomeを表示*/}
      <Route path="/home" element={<Home />} />

      {/*Homeの見つけるからFindを表示*/}
      <Route path="/find" element={<Find />} />

    </Routes>
  )
}

export default App

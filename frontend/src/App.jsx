import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
//import HomePage from './pages/HomePage';
import Home from './pages/Home';
import Find from "./pages/Find";
import Result from './pages/Result';
import UpWorks from "./pages/UpWorks";
import ConfirmWorks from "./pages/ConfirmWorks";
import CompleteUpWorks from "./pages/CompleteUpWorks";
import Register from './pages/Register';

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

      {/* 検索結果 */}
      <Route path="/result" element={<Result />} />

      {/*作品投稿画面*/}
      <Route path="/upworks" element={<UpWorks />} />

      {/*UpWorksでの内容確認画面*/}
      <Route path="/confirm" element={<ConfirmWorks />} />

      {/*投稿完了を表示する画面*/}
      <Route path="/complete" element={<CompleteUpWorks />} />

      {/* 新規登録 */}
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App

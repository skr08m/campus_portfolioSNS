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
import Logout from './pages/Logout';
import WorkDetail from './pages/WorkDetail';
import MyAlbum from './pages/MyAlbum';
import PastWork from './pages/PastWork';
import MyProfile from './pages/MyProfile';


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

      {/* ログアウト */}
      <Route path="/logout" element={<Logout />} />

      {/* ★ 作品詳細画面へのルートを追加 */}
      {/* :workId の部分は useParams で取得できる変数 */}
      <Route path="/works/:workId" element={<WorkDetail />} />

      {/* マイアルバムの表示をする画面*/}
      <Route path="/album" element={<MyAlbum />} />

      {/*過去作品を表示する画面 */}
      <Route path="/pastworks" element={<PastWork />} />

      {/* マイプロフィール画面 */}
      <Route path="/myprofile" element={<MyProfile />} />
    </Routes>
  )
}

export default App

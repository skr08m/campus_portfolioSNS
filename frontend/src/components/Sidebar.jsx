import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { House, Search, Upload, Images, Star, Person, BoxArrowRight } from "react-bootstrap-icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 現在のURLを取得して「今どのページか」を判定する

  // メニュー項目の定義（ここを編集するだけで全ページ変わる）
  const menuItems = [
    { label: "ホーム", icon: <House />, path: "/home" },
    { label: "見つける", icon: <Search />, path: "/find" },
    { label: "作品投稿", icon: <Upload />, path: "/upworks" },
    { label: "過去作品", icon: <Images />, path: "/pastworks" },
    { label: "マイアルバム", icon: <Star color="#f1c40f" />, path: "/album" },
    { label: "プロフィール", icon: <Person />, path: "/myprofile" },
  ];

  return (
    <aside className="d-none d-md-block shadow-sm" style={{
        width: "240px",
        backgroundColor: "#e0e0e0",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 1000,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
    }}>
      {/* 上部：ロゴ */}
      <div className="text-center py-4">
        <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
        <div className="mx-auto" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "white", margin: "20px 0" }} />
      </div>

      {/* 中部：メニューリスト */}
      <ul className="list-group list-group-flush px-3 flex-grow-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={item.path}
              className={`list-group-item border-0 py-4 ${isActive ? "fw-bold text-dark" : "bg-transparent"}`}
              style={{ 
                backgroundColor: isActive ? "#d0d0d0" : "transparent", 
                borderRadius: "10px", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              onClick={() => navigate(item.path)}
            >
              <span className="me-3" style={{ fontSize: "24px" }}>{item.icon}</span>
              {item.label}
            </li>
          );
        })}
      </ul>

      {/* 下部：ログアウト */}
      <div className="p-3 mb-3 border-top mt-auto">
        <button 
          className="btn btn-outline-danger w-100 border-2 py-2 fw-bold" 
          onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}
        >
          <BoxArrowRight className="me-2" /> ログアウト
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
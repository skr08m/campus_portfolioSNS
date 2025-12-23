import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { House, Search, Upload, Images, Star, Person, BoxArrowRight, List, X } from "react-bootstrap-icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // スマホ用メニューの開閉状態管理
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "ホーム", icon: <House />, path: "/home" },
    { label: "見つける", icon: <Search />, path: "/find" },
    { label: "作品投稿", icon: <Upload />, path: "/upworks" },
    { label: "過去作品", icon: <Images />, path: "/pastworks" },
    { label: "マイアルバム", icon: <Star color="#f1c40f" />, path: "/album" },
    { label: "プロフィール", icon: <Person />, path: "/myprofile" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // メニュークリック時に自動で閉じる（スマホ時のみ有効）
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* --- スマホ用ハンバーガーボタン (768px未満で表示) --- */}
      <div className="d-md-none p-3 shadow-sm bg-white fixed-top d-flex align-items-center" style={{ zIndex: 1100, height: "60px" }}>
        <button className="btn border-0 p-0" onClick={toggleMenu}>
          {isOpen ? <X size={35} /> : <List size={35} />}
        </button>
        <span className="ms-3 fw-bold fs-5">PortFolio</span>
      </div>

      {/* --- スマホ時：メニュー背景のオーバーレイ（背景を暗くする） --- */}
      {isOpen && (
        <div
          className="d-md-none fixed-top w-100 vh-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={toggleMenu}
        />
      )}

      {/* --- メインサイドバー --- */}
      <aside className={`shadow-sm bg-light`} style={{
        width: "240px",
        backgroundColor: "#e0e0e0",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 1060,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease-in-out",
        // スマホ時は isOpen の状態で位置を切り替える
        transform: window.innerWidth < 768 && !isOpen ? "translateX(-240px)" : "translateX(0)"
      }}>
        {/* スタイルの動的適用（メディアクエリ相当） */}
        <style>{`
          @media (max-width: 767px) {
            aside { transform: ${isOpen ? "translateX(0)" : "translateX(-240px)"} !important; }
          }
        `}</style>

        {/* 上部：ロゴ */}
        <div className="text-center py-4">
          <h4 style={{ borderBottom: "1px solid #000", display: "inline-block", paddingBottom: "5px" }}>PortFolio</h4>
          <div className="mx-auto shadow-sm d-flex align-items-center justify-content-center bg-white"
            style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "20px 0", fontSize: "2rem" }}>
            👤
          </div>
        </div>

        {/* 中部：メニューリスト */}
        <ul className="list-group list-group-flush px-3 flex-grow-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.path}
                className={`list-group-item border-0 py-3 mb-2 d-flex align-items-center ${isActive ? "fw-bold text-dark shadow-sm" : "bg-transparent text-secondary"}`}
                style={{
                  backgroundColor: isActive ? "#d0d0d0" : "transparent",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <span className="me-3 fs-4">{item.icon}</span>
                <span className="fs-5">{item.label}</span>
              </li>
            );
          })}
        </ul>

        {/* 下部：ログアウト */}
        <div className="p-3 mb-3 border-top mt-auto">
          <button
            className="btn btn-outline-danger w-100 border-2 py-2 fw-bold d-flex align-items-center justify-content-center"
            onClick={() => { localStorage.removeItem("jwt"); navigate("/"); }}
          >
            <BoxArrowRight className="me-2" /> ログアウト
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
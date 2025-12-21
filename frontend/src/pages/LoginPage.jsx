// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      if (!response.ok) {
        throw new Error("メールアドレスまたはパスワードが正しくありません");
      }

      const jwt = await response.text();
      localStorage.setItem("jwt", jwt);
      alert("ログイン成功！");
      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3" style={{ backgroundColor: "#f0f2f5" }}>
      {/* 画面全体の最大幅を 1000px に拡大 */}
      <Container style={{ maxWidth: '1000px' }}>
        <div className="bg-white shadow-lg rounded-5 overflow-hidden">
          <Row className="g-0 min-vh-50">
            {/* 左側：メッセージエリア (モバイルでは非表示、または上にくる) */}
            <Col lg={5} className="bg-dark text-white d-flex flex-column justify-content-center p-5 text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: "-2px" }}>
                PortFolio<br />SNS
              </h1>
              <p className="fs-4 opacity-75 mb-0">
                あなたの技術と情熱を<br className="d-none d-lg-block" />一つの場所に。
              </p>
            </Col>

            {/* 右側：フォームエリア */}
            <Col lg={7} className="p-4 p-md-5 d-flex align-items-center">
              <div className="w-100 px-lg-4">
                <h2 className="fw-bold mb-2" style={{ fontSize: "2.8rem" }}>ログイン</h2>
                <hr className="mb-5 ms-0" style={{ width: "60px", borderTop: "5px solid #000", opacity: 1 }} />

                <Form onSubmit={handleSubmit}>
                  {/* メールアドレス */}
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label className="fw-bold fs-5 text-muted mb-2">メールアドレス</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        height: "65px",
                        fontSize: "1.2rem",
                        borderRadius: "15px",
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #eee",
                        padding: "0 20px"
                      }}
                    />
                  </Form.Group>

                  {/* パスワード */}
                  <Form.Group className="mb-5" controlId="formBasicPassword">
                    <Form.Label className="fw-bold fs-5 text-muted mb-2">パスワード</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="パスワードを入力"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        height: "65px",
                        fontSize: "1.2rem",
                        borderRadius: "15px",
                        backgroundColor: "#f8f9fa",
                        border: "2px solid #eee",
                        padding: "0 20px"
                      }}
                    />
                  </Form.Group>

                  {/* ログインボタン */}
                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 py-3 fw-bold fs-4 shadow-sm mb-4"
                    style={{ borderRadius: "50px", height: "70px" }}
                  >
                    ログインする
                  </Button>
                </Form>

                {/* 新規登録リンク（一列に収まるよう調整） */}
                <div className="text-center mt-3">
                  <span className="fs-5 text-muted">
                    アカウントをお持ちでないですか？
                    <Link to="/register" className="ms-2 text-dark fw-bold text-decoration-none border-bottom border-dark pb-1" style={{ whiteSpace: 'nowrap' }}>
                      新規登録
                    </Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
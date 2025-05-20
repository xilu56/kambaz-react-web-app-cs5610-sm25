import { Navigate, Route, Routes } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import "./styles.css";
import { useEffect } from "react";

export default function Kambaz() {
  // 全局图片加载失败处理
  useEffect(() => {
    // 为所有图片添加默认的错误处理
    const handleImageErrors = () => {
      document.addEventListener('error', (event) => {
        const target = event.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
          // 通过动态构建路径尝试从public目录加载
          const imgSrc = target.src;
          const imgName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
          target.src = `/images/${imgName}`;
          // 如果仍然失败，可以加载一个通用的占位符图片
          target.onerror = () => {
            target.src = '/images/placeholder.jpg';
            target.onerror = null; // 防止无限循环
          };
        }
      }, true);
    };

    handleImageErrors();
  }, []);

  return (
    <div id="wd-kambaz">
      <Row>
        <Col md={2} sm={2} className="d-none d-sm-block bg-light min-vh-100 p-0">
          <KambazNavigation />
        </Col>
        <Col md={10} sm={10} xs={12} className="p-4 wd-main-content-offset">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Courses" element={<Courses />} />
            <Route path="/Courses/:cid/*" element={<Courses />} />
            <Route path="Inbox" element={<h3>Inbox</h3>} />
            <Route path="Help" element={<h3>Help</h3>} />
          </Routes>
        </Col>
      </Row>
    </div>
  );
}
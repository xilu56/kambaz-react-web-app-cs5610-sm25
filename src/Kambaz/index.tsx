import { Navigate, Route, Routes } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";

export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <Row>
        <Col md={2} className="bg-light min-vh-100">
          <KambazNavigation />
        </Col>
        <Col md={10} className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Courses/:cid/*" element={<Courses />} />
          </Routes>
        </Col>
      </Row>
    </div>
  );
}

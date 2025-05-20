import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/Kambaz/Account/Profile");
  };

  return (
    <div id="wd-signup-screen">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {/* 左侧列留空 */}
          </Col>
          <Col xs={12} md={3} className="border-end d-flex flex-column">
            <h3 className="mb-4">Signup</h3>
            <Link to="/Kambaz/Account/Signin" className="text-danger mb-3">Signin</Link>
            <Link to="/Kambaz/Account/Signup" className="text-danger mb-3">Signup</Link>
            <Link to="/Kambaz/Account/Profile" className="text-danger mb-3">Profile</Link>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="mb-4">Signup</h3>
            <Form>
              <Form.Control 
                id="wd-signup-username"
                placeholder="username"
                className="mb-4"/>
              <Form.Control 
                id="wd-signup-password"
                placeholder="password" 
                type="password"
                className="mb-4"/>
              <Link 
                id="wd-signup-btn"
                to="/Kambaz/Account/Profile"
                className="btn btn-primary w-100 mb-3"
                onClick={handleSignup}
              >
                Signup
              </Link>
              <div className="text-center">
                <Link 
                  id="wd-signin-link" 
                  to="/Kambaz/Account/Signin"
                  className="text-primary">
                  Signin
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
    
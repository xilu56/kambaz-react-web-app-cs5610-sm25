import { Link } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {/* Left column empty */}
          </Col>
          <Col xs={12} md={3} className="border-end d-flex flex-column">
            <h3 className="mb-4">Signin</h3>
            <Link to="/Kambaz/Account/Signin" className="text-danger mb-3">Signin</Link>
            <Link to="/Kambaz/Account/Signup" className="text-danger mb-3">Signup</Link>
            <Link to="/Kambaz/Account/Profile" className="text-danger mb-3">Profile</Link>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="mb-4">Signin</h3>
            <Form>
              <Form.Control 
                id="wd-username"
                placeholder="username"
                className="mb-4"/>
              <Form.Control 
                id="wd-password"
                placeholder="password" 
                type="password"
                className="mb-4"/>
              <Link 
                id="wd-signin-btn"
                to="/Kambaz/Account/Profile"
                className="btn btn-primary w-100 mb-3">
                Signin
              </Link>
              <div className="text-center">
                <Link 
                  id="wd-signup-link" 
                  to="/Kambaz/Account/Signup"
                  className="text-primary">
                  Signup
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


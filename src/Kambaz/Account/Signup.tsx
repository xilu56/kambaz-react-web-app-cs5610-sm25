import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSignup = () => {
    if (password && password === verifyPassword) {
      navigate("/Kambaz/Account/Profile");
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <Container fluid className="p-0">
      <Row>
        <Col>
          <div className="d-flex">
            <div className="border-end pe-4 me-4">
              <h2 className="mb-4">Signup</h2>
            </div>
            <div>
              <h2 className="mb-4">Signup</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="verify password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  className="w-100 mb-3"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
                
                <div className="text-center">
                  <Link 
                    to="/Kambaz/Account/Signin"
                    className="text-primary text-decoration-none"
                  >
                    Signin
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
    
import { Link } from "react-router-dom";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import * as client from "./client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
      console.error("Signin error:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    setError(""); // Clear error when user starts typing
  };

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
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Control 
                id="wd-username"
                placeholder="username"
                className="mb-4"
                value={credentials.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              <Form.Control 
                id="wd-password"
                placeholder="password" 
                type="password"
                className="mb-4"
                value={credentials.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <button
                id="wd-signin-btn"
                type="button"
                onClick={signin}
                className="btn btn-primary w-100 mb-3">
                Signin
              </button>
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


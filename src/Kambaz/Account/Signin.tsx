import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
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
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form>
              <Form.Control 
                id="wd-username"
                placeholder="username"
                className="mb-4"
                value={credentials.username || ""}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
              <Form.Control 
                id="wd-password"
                placeholder="password" 
                type="password"
                className="mb-4"
                value={credentials.password || ""}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button 
                id="wd-signin-btn"
                onClick={signin}
                type="button"
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


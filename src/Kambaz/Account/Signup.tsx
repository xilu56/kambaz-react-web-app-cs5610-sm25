import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div id="wd-signup-screen">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {/* Left column empty */}
          </Col>
          <Col xs={12} md={3} className="border-end d-flex flex-column">
            <h3 className="mb-4">Signup</h3>
            <Link to="/Kambaz/Account/Signin" className="text-danger mb-3">Signin</Link>
            <Link to="/Kambaz/Account/Signup" className="text-danger mb-3">Signup</Link>
            <Link to="/Kambaz/Account/Profile" className="text-danger mb-3">Profile</Link>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="mb-4">Signup</h3>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form>
              <Form.Control 
                id="wd-signup-username"
                placeholder="username"
                className="mb-4"
                value={user.username || ""}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <Form.Control 
                id="wd-signup-password"
                placeholder="password" 
                type="password"
                className="mb-4"
                value={user.password || ""}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <button 
                id="wd-signup-btn"
                onClick={signup}
                type="button"
                className="btn btn-primary w-100 mb-3">
                Signup
              </button>
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
    
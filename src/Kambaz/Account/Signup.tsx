import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    try {
      if (!user.username || !user.password) {
        setError("Please fill in all fields");
        return;
      }
      const currentUser = await client.signup(user);
      
      // Set user in Redux store
      dispatch(setCurrentUser(currentUser));
      
      // Save to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      navigate("/Kambaz/Account/Profile");
    } catch (err: any) {
      setError("Error creating account. Please try again.");
      console.error("Signup error:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
    setError(""); // Clear error when user starts typing
  };

  return (
    <div id="wd-signup-screen">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {/* Left column empty */}
          </Col>
          <Col xs={12} md={3} className="border-end d-flex flex-column">
            <h3 className="mb-4">Account</h3>
            <Link to="/Kambaz/Account/Signin" className="text-danger mb-3">Signin</Link>
            <Link to="/Kambaz/Account/Signup" className="text-danger mb-3">Signup</Link>
            <Link to="/Kambaz/Account/Profile" className="text-danger mb-3">Profile</Link>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="mb-4">Sign up</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Control 
                value={user.username || ""} 
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="mb-3" 
                placeholder="username" 
              />
              <Form.Control 
                value={user.password || ""} 
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="mb-3" 
                placeholder="password" 
                type="password"
              />
              <button 
                onClick={signup} 
                type="button"
                className="btn btn-primary mb-3 w-100">
                Sign up
              </button>
              <div className="text-center">
                <Link to="/Kambaz/Account/Signin" className="text-primary">
                  Already have an account? Sign in
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

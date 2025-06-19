import { Link } from "react-router-dom";
import { Form, Alert, Container, Card } from "react-bootstrap";
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
      
      // Set user in Redux store
      dispatch(setCurrentUser(user));
      
      // Save to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      
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
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#000", fontSize: "1.8rem", lineHeight: "1.2" }}>
                    Northeastern University
                  </h2>
                </div>
                
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                
                <Form>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">myNortheastern Username</label>
                    <Form.Control 
                      id="wd-username"
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      value={credentials.username || ""}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-muted fw-medium">myNortheastern Password</label>
                    <Form.Control 
                      id="wd-password"
                      type="password"
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      value={credentials.password || ""}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                  
                  <button
                    id="wd-signin-btn"
                    type="button"
                    onClick={signin}
                    className="btn btn-lg w-100 text-white fw-medium"
                    style={{ 
                      backgroundColor: "#d32f2f", 
                      borderColor: "#d32f2f",
                      borderRadius: "8px",
                      padding: "12px"
                    }}>
                    Log In
                  </button>
                </Form>
                
                <div className="text-center mt-4">
                  <Link 
                    id="wd-signup-link" 
                    to="/Kambaz/Account/Signup"
                    className="text-decoration-none"
                    style={{ color: "#d32f2f" }}>
                    Don't have an account? Sign up
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, Alert, Container, Card } from "react-bootstrap";

export default function Signup() {
  const [user, setUser] = useState<any>({ role: "STUDENT" }); // Default to STUDENT
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    try {
      if (!user.username || !user.password || !user.role) {
        setError("Please fill in all fields and select a role");
        return;
      }
      
      if (user.password.length < 6) {
        setError("Password must be at least 6 characters long");
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
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#000", fontSize: "1.8rem", lineHeight: "1.2" }}>
                    Northeastern University
                  </h2>
                  <p className="text-muted mt-2">Create your Kambaz account</p>
                </div>
                
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                
                <Form>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">Username</label>
                    <Form.Control 
                      value={user.username || ""} 
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">Password</label>
                    <Form.Control 
                      value={user.password || ""} 
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      type="password"
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">First Name</label>
                    <Form.Control 
                      value={user.firstName || ""} 
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">Last Name</label>
                    <Form.Control 
                      value={user.lastName || ""} 
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted fw-medium">Account Type</label>
                    <Form.Select 
                      value={user.role || "STUDENT"} 
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="form-control-lg"
                      style={{ borderRadius: "8px", border: "2px solid #e9ecef" }}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                    </Form.Select>
                    <div className="form-text text-muted mt-1">
                      <small>
                        <strong>Student:</strong> Can view and take quizzes, see grades<br/>
                        <strong>Faculty:</strong> Can create, edit, delete, and preview quizzes
                      </small>
                    </div>
                  </div>
                  
                  <button 
                    onClick={signup} 
                    type="button"
                    className="btn btn-lg w-100 text-white fw-medium"
                    style={{ 
                      backgroundColor: "#d32f2f", 
                      borderColor: "#d32f2f",
                      borderRadius: "8px",
                      padding: "12px"
                    }}>
                    Create Account
                  </button>
                </Form>
                
                <div className="text-center mt-4">
                  <Link 
                    to="/Kambaz/Account/Signin" 
                    className="text-decoration-none"
                    style={{ color: "#d32f2f" }}>
                    Already have an account? Sign in
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
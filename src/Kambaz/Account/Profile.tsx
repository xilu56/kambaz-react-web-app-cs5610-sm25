import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser, clearCurrentUser } from "./reducer";
import * as client from "./client";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setPassword(currentUser.password || "");
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setDob(currentUser.dob ? currentUser.dob.substring(0, 10) : "");
      setEmail(currentUser.email || "");
      setRole(currentUser.role || "STUDENT");
    }
  }, [currentUser]);

  const updateProfile = async () => {
    try {
      const updatedUser = {
        ...currentUser,
        username,
        password,
        firstName,
        lastName,
        dob,
        email,
        role
      };
      
      const result = await client.updateProfile(updatedUser);
      dispatch(setCurrentUser(result));
      
      // Save to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(result));
      
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage("");
    }
  };

  const signout = async () => {
    try {
      await client.signout();
      dispatch(clearCurrentUser());
      
      // Clear localStorage
      localStorage.removeItem('currentUser');
      
      navigate("/Kambaz/Account/Signin");
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if server signout fails, clear local state
      dispatch(clearCurrentUser());
      localStorage.removeItem('currentUser');
      navigate("/Kambaz/Account/Signin");
    }
  };

  if (!currentUser) {
    return (
      <div className="alert alert-danger">
        Please sign in to view your profile.
        <Link to="/Kambaz/Account/Signin" className="btn btn-primary ms-2">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div id="wd-profile-screen">
      <Container>
        <Row>
          <Col xs={12} md={3}>
            {/* Left column empty */}
          </Col>
          <Col xs={12} md={3} className="border-end d-flex flex-column">
            <h3 className="mb-4">Profile</h3>
            <Link to="/Kambaz/Account/Signin" className="text-danger mb-3">Signin</Link>
            <Link to="/Kambaz/Account/Signup" className="text-danger mb-3">Signup</Link>
            <Link to="/Kambaz/Account/Profile" className="text-danger mb-3">Profile</Link>
            <Link to="/Kambaz/Dashboard" className="text-danger mb-3">Dashboard</Link>
          </Col>
          <Col xs={12} md={6}>
            <h1 className="mb-4">Profile</h1>
            
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Username:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Password:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>First Name:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-firstname"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    type="text"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Last Name:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-lastname"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    type="text"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Date of Birth:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-dob"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    type="date"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Email:</Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="wd-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                  />
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>Role:</Form.Label>
                <Col sm={8}>
                  <Form.Select
                    id="wd-role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Admin</option>
                    <option value="TA">TA</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              
              <div className="w-100 mb-3">
                <Button
                  id="wd-update-btn"
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={updateProfile}
                >
                  Update Profile
                </Button>
                <Button
                  id="wd-signout-btn"
                  variant="danger"
                  className="w-100"
                  onClick={signout}
                >
                  Signout
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
  
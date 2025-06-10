import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { clearCurrentUser } from "./reducer";
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

  const signout = async () => {
    try {
      await client.signout();
      dispatch(clearCurrentUser());
      navigate("/Kambaz/Account/Signin");
    } catch (error) {
      console.error("Error signing out:", error);
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
          </Col>
          <Col xs={12} md={6}>
            <h1 className="mb-4">Profile</h1>
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
              
              <div className="w-100">
                <Button
                  id="wd-signout-btn"
                  variant="danger"
                  className="w-100 border border-dark"
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
  
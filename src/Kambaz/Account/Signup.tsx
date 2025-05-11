import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("newuser");
  const [password, setPassword] = useState("123456");
  const [verifyPassword, setVerifyPassword] = useState("123456");

  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <div>
        <label htmlFor="wd-signup-username">Username: </label>
        <input
          id="wd-signup-username"
          placeholder="username"
          className="wd-username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
        />
      </div>
      <div>
        <label htmlFor="wd-signup-password">Password: </label>
        <input
          id="wd-signup-password"
          placeholder="password"
          type="password"
          className="wd-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="wd-signup-verify-password">Verify Password: </label>
        <input
          id="wd-signup-verify-password"
          placeholder="verify password"
          type="password"
          className="wd-password-verify"
          value={verifyPassword}
          onChange={e => setVerifyPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          id="wd-signup-btn"
          onClick={() => {
            if (password === verifyPassword) {
              navigate("/Kambaz/Account/Profile");
            } else {
              alert("Passwords do not match!");
            }
          }}
        >
          Sign up
        </button>
      </div>
      <div>
        <Link to="/Kambaz/Account/Signin" id="wd-signin-link">Sign in</Link>
      </div>
    </div>
  );
}
    
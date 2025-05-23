import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("kambaz");
  const [password, setPassword] = useState("123456");

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        className="wd-username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      /> <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /> <br />
      <button
        id="wd-signin-btn" 
        onClick={() => {
          if (username === "admin") {
            navigate("/Kambaz/Account/Dashboard");
          } else {
            navigate("/Kambaz/Dashboard");
          }
        }}
      >
        Sign in
      </button> <br />
      <button 
        id="wd-signup-link"
        onClick={() => navigate("/Kambaz/Account/Signup")}
      >
        Sign up
      </button>
    </div>
  );
}


import { Link, useNavigate } from "react-router-dom";
export default function Signin() {
  const navigate = useNavigate();
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input placeholder="username" className="wd-username" /> <br />
      <input placeholder="password" type="password" className="wd-password" /> <br />
      <button id="wd-signin-btn" onClick={() => navigate("/Kambaz/Account/Profile")}>Sign in</button> <br />
      <Link  to="/Kambaz/Account/Signup"  id="wd-signup-link">Sign up</Link>
    </div>
  );
}


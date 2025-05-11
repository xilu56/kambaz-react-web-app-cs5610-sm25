import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("bobcat");
  const [password, setPassword] = useState("passw0rd");
  const [firstName, setFirstName] = useState("Bob");
  const [lastName, setLastName] = useState("Cat");
  const [dob, setDob] = useState("1995-05-15");
  const [email, setEmail] = useState("bobcat@email.com");
  const [role, setRole] = useState("STUDENT");

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <div>
        <label htmlFor="wd-username">Username: </label>
        <input
          id="wd-username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          className="wd-username"
          type="text"
        />
      </div>
      <div>
        <label htmlFor="wd-password">Password: </label>
        <input
          id="wd-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="wd-password"
          type="password"
        />
      </div>
      <div>
        <label htmlFor="wd-firstname">First Name: </label>
        <input
          id="wd-firstname"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First Name"
          type="text"
        />
      </div>
      <div>
        <label htmlFor="wd-lastname">Last Name: </label>
        <input
          id="wd-lastname"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Last Name"
          type="text"
        />
      </div>
      <div>
        <label htmlFor="wd-dob">Date of Birth: </label>
        <input
          id="wd-dob"
          value={dob}
          onChange={e => setDob(e.target.value)}
          type="date"
        />
      </div>
      <div>
        <label htmlFor="wd-email">Email: </label>
        <input
          id="wd-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
      </div>
      <div>
        <label htmlFor="wd-role">Role: </label>
        <select
          id="wd-role"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>
      <div>
        <button
          id="wd-signout-btn"
          onClick={() => navigate("/Kambaz/Account/Signin")}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
  
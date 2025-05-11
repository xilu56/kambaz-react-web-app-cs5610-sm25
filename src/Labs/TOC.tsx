import { Link } from "react-router-dom";

export default function TOC() {
  return (
    <div className="main-navigation">
      <div className="student-info">
        <p>Xi Lu, CS5610 Summer1 2025</p>
        <p><a href="https://github.com/xilu56/kambaz-react-web-app-cs5610-sm25.git" target="_blank">GitHub Repository</a></p>
      </div>
      
      <nav className="nav-links">
        <Link to="/" className="nav-link home-link">Home</Link><br />
        <Link to="/Labs" className="nav-link" id="wd-a">Labs</Link><br />
        <Link to="/Labs/Lab1" className="nav-link" id="wd-a1">Lab 1</Link><br />
        <Link to="/Labs/Lab2" className="nav-link" id="wd-a2">Lab 2</Link><br />
        <Link to="/Labs/Lab3" className="nav-link" id="wd-a3">Lab 3</Link><br />
        <Link to="/Kambaz" className="nav-link" id="wd-k">Kambaz</Link><br />
      </nav>
    </div>
  );
}

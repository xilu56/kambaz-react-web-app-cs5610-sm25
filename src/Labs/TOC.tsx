import Nav from "react-bootstrap/Nav";
import { NavLink, useLocation } from "react-router-dom";

export default function TOC() {
  const location = useLocation();
  const { pathname } = location;
  
  return (
   <Nav variant="pills">
     <Nav.Item>
       <Nav.Link 
         as={NavLink} 
         to="/"
         className={pathname === "/" ? "active" : ""}
       >
         Labs
       </Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link 
         as={NavLink} 
         to="/Labs/Lab1"
         className={pathname === "/Labs/Lab1" ? "active" : ""}
       >
         Lab 1
       </Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link 
         as={NavLink} 
         to="/Labs/Lab2"
         className={pathname === "/Labs/Lab2" ? "active" : ""}
       >
         Lab 2
       </Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link 
         as={NavLink} 
         to="/Labs/Lab3"
         className={pathname === "/Labs/Lab3" ? "active" : ""}
       >
         Lab 3
       </Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link 
         as={NavLink} 
         to="/Kambaz"
         className={pathname.includes("/Kambaz") ? "active" : ""}
       >
         Kambaz
       </Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link 
         href="https://github.com/xilu56/kambaz-react-web-app-cs5610-sm25.git"
         target="_blank"
         rel="noopener noreferrer"
       >
         My GitHub
       </Nav.Link>
     </Nav.Item>
   </Nav>
  );
}


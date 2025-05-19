import { Link, useParams, useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  const { cid } = useParams();
  const { pathname } = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  
  return (
    <div id="wd-courses-navigation">
      <ListGroup className="wd list-group fs-5 rounded-0">
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Home`} 
          id="wd-course-home-link"
          active={isActive(`/Courses/${cid}/Home`)}
          className="border-0">
          Home
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Modules`} 
          id="wd-course-modules-link"
          className="text-danger border-0">
          Modules
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Piazza`} 
          id="wd-course-piazza-link"
          className="text-danger border-0">
          Piazza
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Zoom`} 
          id="wd-course-zoom-link"
          className="text-danger border-0">
          Zoom
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Assignments`} 
          id="wd-course-assignments-link"
          className="text-danger border-0">
          Assignments
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Quizzes`} 
          id="wd-course-quizzes-link"
          className="text-danger border-0">
          Quizzes
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Grades`} 
          id="wd-course-grades-link"
          className="text-danger border-0">
          Grades
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/People`} 
          id="wd-course-people-link"
          className="text-danger border-0">
          People
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

import { ListGroup, Badge, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "./Database";
import { FaBook, FaUsers, FaClock } from "react-icons/fa";

export default function CoursesList() {
  const courses = db.courses;

  return (
    <Container fluid>
      <div id="wd-courses-list">
        <h1 id="wd-courses-list-title">All Courses</h1>
        <hr />
        <p className="text-muted mb-4">
          Browse all available courses ({courses.length} courses)
        </p>
        
        <ListGroup className="mb-4">
          {courses.map((course: any) => (
            <ListGroup.Item 
              key={course._id} 
              className="d-flex justify-content-between align-items-start py-3 border-bottom"
              style={{ borderLeft: "4px solid #dc3545" }}
            >
              <div className="flex-grow-1">
                <Link
                  to={`/Kambaz/Courses/${course._id}/Home`}
                  className="text-decoration-none"
                >
                  <h5 className="mb-1 text-danger fw-bold">
                    {course.number}: {course.name}
                  </h5>
                </Link>
                
                <p className="mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
                  {course.description}
                </p>
                
                <div className="d-flex gap-3 align-items-center text-muted" style={{ fontSize: "0.85rem" }}>
                  <span className="d-flex align-items-center">
                    <FaBook className="me-1" />
                    {course.credits} credits
                  </span>
                  <span className="d-flex align-items-center">
                    <FaClock className="me-1" />
                    {course.startDate} - {course.endDate}
                  </span>
                  <span className="d-flex align-items-center">
                    <FaUsers className="me-1" />
                    {course.department}
                  </span>
                </div>
              </div>
              
              <div className="d-flex flex-column align-items-end">
                <Badge bg="primary" className="mb-2">
                  Active
                </Badge>
                <Link
                  to={`/Kambaz/Courses/${course._id}/Home`}
                  className="btn btn-outline-danger btn-sm"
                >
                  Enter Course
                </Link>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        
        {courses.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">No courses available</h3>
            <p className="text-muted">Check back later for new course offerings.</p>
          </div>
        )}
      </div>
    </Container>
  );
} 
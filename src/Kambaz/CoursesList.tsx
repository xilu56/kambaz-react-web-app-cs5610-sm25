import { ListGroup, Badge, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaClock } from "react-icons/fa";

export default function CoursesList({ 
  courses, 
  enrollInCourse, 
  unenrollFromCourse, 
  isEnrolled 
}: { 
  courses: any[];
  enrollInCourse?: (courseId: string) => void;
  unenrollFromCourse?: (courseId: string) => void;
  isEnrolled?: (courseId: string) => boolean;
}) {
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
              
              <div className="d-flex flex-column align-items-end gap-2">
                {/* Enrollment Status Badge */}
                {isEnrolled && isEnrolled(course._id) ? (
                  <Badge bg="success" className="mb-2">
                    Enrolled
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="mb-2">
                    Not Enrolled
                  </Badge>
                )}
                
                {/* Enrollment/Unenrollment Button */}
                {isEnrolled && enrollInCourse && unenrollFromCourse && (
                  <div className="d-flex gap-2">
                    {isEnrolled(course._id) ? (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => unenrollFromCourse(course._id)}
                      >
                        Unenroll
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => enrollInCourse(course._id)}
                      >
                        Enroll
                      </Button>
                    )}
                  </div>
                )}
                
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
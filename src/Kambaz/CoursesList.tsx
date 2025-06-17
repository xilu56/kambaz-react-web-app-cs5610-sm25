import { ListGroup, Badge, Container, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaClock } from "react-icons/fa";
import { useState } from "react";

export default function CoursesList({ 
  courses, 
  enrollInCourse, 
  unenrollFromCourse, 
  isEnrolled,
  enrolledCourses,
  deleteCourse
}: { 
  courses: any[];
  enrollInCourse?: (courseId: string) => void;
  unenrollFromCourse?: (courseId: string) => void;
  isEnrolled?: (courseId: string) => boolean;
  enrolledCourses?: any[];
  deleteCourse?: (courseId: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"all" | "enrolled">("all");
  
  // Determine which courses to display based on view mode
  const displayCourses = viewMode === "all" ? courses : (enrolledCourses || []);
  
  return (
    <Container fluid>
      <div id="wd-courses-list">
        {/* Navigation buttons */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 id="wd-courses-list-title">
            {viewMode === "all" ? "All Courses" : "My Courses"}
          </h1>
          <ButtonGroup>
            <Button
              variant={viewMode === "all" ? "danger" : "outline-danger"}
              onClick={() => setViewMode("all")}
            >
              All Courses
            </Button>
            <Button
              variant={viewMode === "enrolled" ? "danger" : "outline-danger"}
              onClick={() => setViewMode("enrolled")}
            >
              My Courses
            </Button>
          </ButtonGroup>
        </div>
        
        <hr />
        <p className="text-muted mb-4">
          {viewMode === "all" 
            ? `Browse all available courses (${displayCourses.length} courses)`
            : `Your enrolled courses (${displayCourses.length} courses)`
          }
        </p>
        
        <ListGroup className="mb-4">
          {displayCourses.map((course: any) => (
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
                {/* Enrollment Status Badge - only show in All Courses view */}
                {viewMode === "all" && isEnrolled && (
                  <>
                    {isEnrolled(course._id) ? (
                      <Badge bg="success" className="mb-2">
                        Enrolled
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="mb-2">
                        Not Enrolled
                      </Badge>
                    )}
                  </>
                )}
                
                {/* Enrollment/Unenrollment Button - only show in All Courses view */}
                {viewMode === "all" && isEnrolled && enrollInCourse && unenrollFromCourse && (
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
                
                {/* Delete button - only show if deleteCourse function is provided */}
                {deleteCourse && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete the course "${course.name}"?`)) {
                        deleteCourse(course._id);
                      }
                    }}
                    className="mt-2"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        
        {displayCourses.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">
              {viewMode === "all" ? "No courses available" : "No enrolled courses"}
            </h3>
            <p className="text-muted">
              {viewMode === "all" 
                ? "Check back later for new course offerings."
                : "Browse all courses to find and enroll in courses that interest you."
              }
            </p>
          </div>
        )}
      </div>
    </Container>
  );
} 
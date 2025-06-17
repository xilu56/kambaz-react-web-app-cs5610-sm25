import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormControl from "react-bootstrap/FormControl";
import { useState } from "react";

export default function Dashboard(
{ courses, course, setCourse, addNewCourse, deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment }: {
  courses: any[]; course: any; setCourse: (course: any) => void;
  addNewCourse: () => void; deleteCourse: (course: any) => void;
  updateCourse: () => void; enrolling: boolean; setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/placeholder.jpg";
    target.onerror = null;
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!course.name || course.name.trim() === "" || course.name === "New Course") {
      errors.push("Course name is required");
    }
    
    if (!course.number || course.number.trim() === "" || course.number === "New Number") {
      errors.push("Course number is required");
    }
    
    if (!course.description || course.description.trim() === "" || course.description === "New Description") {
      errors.push("Course description is required");
    }
    
    if (!course.startDate) {
      errors.push("Start date is required");
    }
    
    if (!course.endDate) {
      errors.push("End date is required");
    }
    
    if (course.startDate && course.endDate && new Date(course.startDate) >= new Date(course.endDate)) {
      errors.push("End date must be after start date");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddCourse = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addNewCourse();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!course._id) {
      setValidationErrors(["Please select a course to update by clicking the Edit button on a course card"]);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateCourse();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary" >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </h1> <hr />
      <h5>New Course
          <button 
            className="btn btn-primary float-end"
            id="wd-add-new-course-click"
            onClick={handleAddCourse}
            disabled={isSubmitting}
          > 
            {isSubmitting ? "Adding..." : "Add"} 
          </button>
          <button 
            className="btn btn-warning float-end me-2"
            onClick={handleUpdateCourse} 
            id="wd-update-course-click"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
      </h5><br />
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>Please fix the following errors:</Alert.Heading>
          <ul className="mb-0">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      <FormControl 
        value={course.name} 
        className="mb-2" 
        onChange={(e) => setCourse({ ...course, name: e.target.value })} 
        placeholder="Course Name"
        isInvalid={validationErrors.some(error => error.includes("Course name"))}
      />
      <FormControl 
        value={course.number} 
        className="mb-2" 
        onChange={(e) => setCourse({ ...course, number: e.target.value })} 
        placeholder="Course Number"
        isInvalid={validationErrors.some(error => error.includes("Course number"))}
      />
      <FormControl 
        value={course.startDate} 
        className="mb-2" 
        onChange={(e) => setCourse({ ...course, startDate: e.target.value })} 
        type="date"
        isInvalid={validationErrors.some(error => error.includes("Start date") || error.includes("End date must be after"))}
      />
      <FormControl 
        value={course.endDate} 
        className="mb-2" 
        onChange={(e) => setCourse({ ...course, endDate: e.target.value })} 
        type="date"
        isInvalid={validationErrors.some(error => error.includes("End date"))}
      />
      <FormControl 
        value={course.description} 
        className="mb-2" 
        onChange={(e) => setCourse({ ...course, description: e.target.value })} 
        as="textarea" 
        rows={3} 
        placeholder="Course Description"
        isInvalid={validationErrors.some(error => error.includes("Course description"))}
      />
      
      {/* Help text */}
      <div className="text-muted small mb-3">
        <p className="mb-1">💡 <strong>Tips:</strong></p>
        <ul className="mb-0" style={{ fontSize: "0.85rem" }}>
          <li>Fill in all required fields to create a new course</li>
          <li>Click "Edit" on any course card below to update an existing course</li>
          <li>After creating or updating, you'll be redirected to the Courses page</li>
        </ul>
      </div>
      
      <hr />
      
      <h2 id="wd-dashboard-published">
        {enrolling ? "All Courses" : "My Courses"} ({courses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={3} lg={4} xl={5} className="g-4">
          {courses
            .filter((course: any) => course && course._id) // Filter out null/undefined courses
            .map((course: any) => (
            <Col key={course._id} className="wd-dashboard-course">
              <Card className="h-100">
                <Link
                  className="wd-dashboard-course-link
                           text-decoration-none text-dark h-100"
                  to={`/Kambaz/Courses/${course._id}/Home`}
                >
                  <Card.Img
                    variant="top"
                    width="100%"
                    src={course.image || "/images/reactjs.jpg"}
                    height={160}
                    onError={handleImageError}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {enrolling && (
                        <button onClick={(event) => {
                                  event.preventDefault();
                                  updateEnrollment(course._id, !course.enrolled);
                                }}
                                className={`btn ${ course.enrolled ? "btn-danger" : "btn-success" } float-end`} >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                      {course.number || 'N/A'}: {course.name || 'Untitled Course'}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "75px" }}
                    >
                      {course.description || 'No description available'}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button variant="primary">Go to Course</Button>
                      
                      <button id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                          setValidationErrors([]); // Clear any previous validation errors
                        }}
                        className="btn btn-warning me-2 float-end" >
                        Edit
                      </button>
                    </div>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
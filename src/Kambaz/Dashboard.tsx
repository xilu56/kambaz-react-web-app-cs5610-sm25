import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormControl from "react-bootstrap/FormControl";

export default function Dashboard(
{ courses, course, setCourse, addNewCourse, deleteCourse, updateCourse, unenrollFromCourse, isEnrolled }: {
  courses: any[]; course: any; setCourse: (course: any) => void;
  addNewCourse: () => void; deleteCourse: (course: any) => void;
  updateCourse: () => void; enrollInCourse?: (courseId: string) => void;
  unenrollFromCourse?: (courseId: string) => void; isEnrolled?: (courseId: string) => boolean;
}
) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/placeholder.jpg";
    target.onerror = null;
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={addNewCourse} > Add </button>
          <button className="btn btn-warning float-end me-2"
                  onClick={updateCourse} id="wd-update-course-click">
            Update
          </button>
      </h5><br />
      <FormControl value={course.name} className="mb-2" 
        onChange={(e) => setCourse({ ...course, name: e.target.value })} 
        placeholder="Course Name" />
      <FormControl value={course.number} className="mb-2" 
        onChange={(e) => setCourse({ ...course, number: e.target.value })} 
        placeholder="Course Number" />
      <FormControl value={course.startDate} className="mb-2" 
        onChange={(e) => setCourse({ ...course, startDate: e.target.value })} 
        type="date" />
      <FormControl value={course.endDate} className="mb-2" 
        onChange={(e) => setCourse({ ...course, endDate: e.target.value })} 
        type="date" />
      <FormControl value={course.description} className="mb-2" 
        onChange={(e) => setCourse({ ...course, description: e.target.value })} 
        as="textarea" rows={3} placeholder="Course Description" />
      <hr />
      
      <h2 id="wd-dashboard-published">
        Enrolled Courses ({courses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={3} lg={4} xl={5} className="g-4">
          {courses.map((course: any) => (
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
                      {course.number}: {course.name}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "75px" }}
                    >
                      {course.description}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button variant="primary">Go to Course</Button>
                      
                      {/* Show enrollment/unenrollment buttons */}
                      {unenrollFromCourse && isEnrolled && isEnrolled(course._id) && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            unenrollFromCourse(course._id);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Unenroll
                        </button>
                      )}
                      
                      <button id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end" >
                        Edit
                      </button>
                      <button onClick={(event) => {
                              event.preventDefault();
                              deleteCourse(course._id);
                            }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                            Delete
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
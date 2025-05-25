import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "./Database";

export default function Dashboard() {
  const courses = db.courses;
  
  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/placeholder.jpg"; // 使用占位符图片
    target.onerror = null; // 防止无限循环
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
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
                    src={`/images/${course.image}`}
                    height={160}
                    onError={handleImageError}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "75px" }}
                    >
                      {course.description}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button variant="primary">Go to Course</Button>
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
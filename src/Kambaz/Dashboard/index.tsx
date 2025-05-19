import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";

export default function Dashboard() {
  // Course data
  const courses = [
    {
      id: "5001",
      title: "CS5001 Intensive Foundations",
      description: "Programming fundamentals with Python",
      image: "/images/CS5001.jpg"
    },
    {
      id: "5002",
      title: "CS5002 Discrete Structures",
      description: "Mathematical concepts for CS",
      image: "/images/CS5002.jpg"
    },
    {
      id: "5004",
      title: "CS5004 Object-Oriented Design",
      description: "OOP principles and patterns",
      image: "/images/CS5004.jpg"
    },
    {
      id: "5008",
      title: "CS5008 Data Structures",
      description: "Algorithms and data structures",
      image: "/images/CS5008.jpg"
    },
    {
      id: "5010",
      title: "CS5010 Programming Design Paradigm",
      description: "Advanced programming concepts",
      image: "/images/CS5010.jpg"
    },
    {
      id: "5520",
      title: "CS5520 Mobile App Development",
      description: "Cross-platform mobile applications",
      image: "/images/CS5520.jpg"
    },
    {
      id: "5800",
      title: "CS5800 Algorithms",
      description: "Advanced algorithm analysis",
      image: "/images/CS5800.jpg"
    }
  ];

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {courses.map((course) => (
            <Col key={course.id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  to={`/Kambaz/Courses/${course.id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <Card.Img variant="top" src={course.image} width="100%" height={160} alt={course.title} />
                  <Card.Body>
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.title}
                    </Card.Title>
                    <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description}
                    </Card.Text>
                    <Button variant="primary">Go</Button>
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

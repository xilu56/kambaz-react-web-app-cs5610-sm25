import { Link } from "react-router-dom";

export default function CourseList() {
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
    <div id="wd-course-list">
      <h1>Courses</h1> <hr />
      <h2>Available Courses (7)</h2> <hr />
      <div id="wd-courses-list">
        {courses.map((course) => (
          <div key={course.id} className="wd-course-item">
            <Link
              to={`/Kambaz/Courses/${course.id}/Home`}
              className="wd-course-link"
            >
              <img src={course.image} width={200} alt={course.title} />
              <div>
                <h5>{course.title}</h5>
                <p className="wd-course-description">
                  {course.description}
                </p>
                <button>Enroll</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 
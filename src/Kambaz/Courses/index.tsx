import CourseNavigation from "./Navigation";
import { Navigate, Route, Routes, useParams } from "react-router";
import CourseList from "./List";

// Define interfaces for course data
interface CourseInfo {
  title: string;
  description: string;
}

interface CourseDataType {
  [key: string]: CourseInfo;
}

export default function Courses() {
  const { cid } = useParams();
  
  // Course data - synchronized with the data in List.tsx
  const courseData: CourseDataType = {
    "5001": {
      title: "CS5001 Intensive Foundations",
      description: "Programming fundamentals with Python"
    },
    "5002": {
      title: "CS5002 Discrete Structures",
      description: "Mathematical concepts for CS"
    },
    "5004": {
      title: "CS5004 Object-Oriented Design",
      description: "OOP principles and patterns"
    },
    "5008": {
      title: "CS5008 Data Structures",
      description: "Algorithms and data structures"
    },
    "5010": {
      title: "CS5010 Programming Design Paradigm",
      description: "Advanced programming concepts"
    },
    "5520": {
      title: "CS5520 Mobile App Development",
      description: "Cross-platform mobile applications"
    },
    "5800": {
      title: "CS5800 Algorithms",
      description: "Advanced algorithm analysis"
    }
  };
  
  // If no course ID is specified, display the course list
  if (!cid) {
    return <CourseList />;
  }
  
  // Get the current course information
  const course = cid && courseData[cid] ? courseData[cid] : { title: `Course ${cid}`, description: "No description available" };
  
  // If a course ID is provided, display specific course content
  return (
    <div id="wd-courses">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <CourseNavigation />
            </td>
            <td valign="top">
              <Routes>
                <Route path="/" element={<Navigate to="Home" />} />
                <Route path="Home" element={<h2>Home - {course.title}</h2>} />
                <Route path="Modules" element={<h2>Modules - {course.title}</h2>} />
                <Route path="Assignments" element={<h2>Assignments - {course.title}</h2>} />
                <Route path="Assignments/:aid" element={<h2>Assignment Editor - {course.title}</h2>} />
                <Route path="People" element={<h2>People - {course.title}</h2>} />
                <Route path="Piazza" element={<h2>Piazza - {course.title}</h2>} />
                <Route path="Zoom" element={<h2>Zoom - {course.title}</h2>} />
                <Route path="Quizzes" element={<h2>Quizzes - {course.title}</h2>} />
                <Route path="Grades" element={<h2>Grades - {course.title}</h2>} />
              </Routes>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

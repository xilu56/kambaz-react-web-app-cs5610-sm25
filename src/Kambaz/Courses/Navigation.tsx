import { Link, useParams } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams();
  
  return (
    <div id="wd-courses-navigation">
      <Link to={`/Kambaz/Courses/${cid}/Home`} id="wd-course-home-link">Home</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Modules`} id="wd-course-modules-link">Modules</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Piazza`} id="wd-course-piazza-link">Piazza</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Zoom`} id="wd-course-zoom-link">Zoom</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Assignments`} id="wd-course-quizzes-link">Assignments</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Quizzes`} id="wd-course-assignments-link">Quizzes</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/Grades`} id="wd-course-grades-link">Grades</Link><br/>
      <Link to={`/Kambaz/Courses/${cid}/People`} id="wd-course-people-link">People</Link><br/>
    </div>
  );
}

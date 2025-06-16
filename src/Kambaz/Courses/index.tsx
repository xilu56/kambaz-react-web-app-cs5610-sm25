import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";
import * as enrollmentsClient from "../Enrollments/client";
import * as userClient from "../Account/client";

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const [courseUsers, setCourseUsers] = useState<any[]>([]);

  const fetchCourseUsers = async () => {
    if (!cid) return;
    
    try {
      // Get enrollments for the current course
      const enrollments = await enrollmentsClient.findEnrollmentsForCourse(cid);
      
      // Get all users
      const allUsers = await userClient.findAllUsers();
      
      // Filter users who are enrolled in this course
      const enrolledUserIds = enrollments.map((enrollment: any) => enrollment.user);
      const enrolledUsers = allUsers.filter((user: any) => 
        enrolledUserIds.includes(user._id)
      );
      
      setCourseUsers(enrolledUsers);
    } catch (error) {
      console.error("Error fetching course users:", error);
      setCourseUsers([]);
    }
  };

  useEffect(() => {
    fetchCourseUsers();
  }, [cid]);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <div className="text-danger fs-4 fw-bold">
          {course && course.number}: {course && course.name} &gt; {pathname.split("/")[4]}
        </div>
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<h2>Piazza</h2>} />
            <Route path="Zoom" element={<h2>Zoom</h2>} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes" element={<h2>Quizzes</h2>} />
            <Route path="Grades" element={<h2>Grades</h2>} />
            <Route path="People" element={<PeopleTable users={courseUsers} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
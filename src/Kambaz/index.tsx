import { Navigate, Route, Routes } from "react-router-dom";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import CoursesList from "./CoursesList";
import "./styles.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./Account/reducer";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", 
    image: "/images/reactjs.jpg", description: "New Description",
  });
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Restore user session from localStorage
  const restoreSession = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(setCurrentUser(userData));
        console.log("Session restored for user:", userData.username);
      } catch (error) {
        console.error("Error restoring session:", error);
        localStorage.removeItem('currentUser');
      }
    }
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses from server...");
      // Fetch all courses instead of just enrolled courses for Dashboard
      const courses = await courseClient.fetchAllCourses();
      console.log("Courses fetched successfully:", courses.length, "courses");
      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const addNewCourse = async () => {
    try {
      console.log("Creating new course:", course);
      // Create course object without _id (let server generate it)
      const courseToCreate = {
        name: course.name,
        number: course.number,
        startDate: course.startDate,
        endDate: course.endDate,
        image: course.image,
        description: course.description
      };
      
      const newCourse = await courseClient.createCourse(courseToCreate);
      console.log("Course created successfully:", newCourse);
      
      // Refresh courses list from server to show all courses
      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (courseId: any) => {
    try {
      console.log("Deleting course:", courseId);
      await courseClient.deleteCourse(courseId);
      console.log("Course deleted successfully");
      // Refresh courses list from server to ensure consistency
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const updateCourse = async () => {
    try {
      console.log("Updating course:", course);
      await courseClient.updateCourse(course);
      console.log("Course updated successfully");
      // Refresh courses list from server to ensure consistency
      await fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  useEffect(() => {
    // Restore session first
    restoreSession();
  }, []);

  useEffect(() => {
    // Fetch courses when currentUser changes or when component mounts
    fetchCourses();
  }, [currentUser]);

  useEffect(() => {
    const handleImageErrors = () => {
      document.addEventListener('error', (event) => {
        const target = event.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
          const imgSrc = target.src;
          const imgName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
          target.src = `/images/${imgName}`;
          target.onerror = () => {
            target.src = '/images/placeholder.jpg';
            target.onerror = null;
          };
        }
      }, true);
    };

    handleImageErrors();
  }, []);

return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Account" />} />
          <Route path="/Account/*" element={<Account />} />
          <Route path="/Dashboard" element={
            <Dashboard
              courses={courses}
              course={course}
              setCourse={setCourse}
              addNewCourse={addNewCourse}
              deleteCourse={deleteCourse}
              updateCourse={updateCourse}/>
          } />
          <Route path="/Courses" element={<CoursesList courses={courses} />} />
          <Route path="/Courses/:cid/*" element={<Courses courses={courses} />} />
          <Route path="/Calendar" element={<h1>Calendar</h1>} />
          <Route path="/Inbox" element={<h1>Inbox</h1>} />
        </Routes>
      </div>
    </div>
);}

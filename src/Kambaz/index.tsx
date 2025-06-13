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
import { setEnrollments, enrollUserInCourse, unenrollUserFromCourse } from "./Enrollments/reducer";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import * as enrollmentsClient from "./Enrollments/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", 
    image: "/images/reactjs.jpg", description: "New Description",
  });
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

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
      // Fetch all courses for courses list
      const courses = await courseClient.fetchAllCourses();
      console.log("Courses fetched successfully:", courses.length, "courses");
      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchEnrollments = async () => {
    if (currentUser && currentUser._id) {
      try {
        console.log("Fetching enrollments for user:", currentUser._id);
        const userEnrollments = await enrollmentsClient.findEnrollmentsForUser(currentUser._id);
        console.log("Enrollments fetched successfully:", userEnrollments.length, "enrollments");
        dispatch(setEnrollments(userEnrollments));
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    }
  };

  const getEnrolledCourses = () => {
    if (!currentUser || !currentUser._id) {
      return courses; // Show all courses if no user logged in
    }
    
    // Filter courses to show only enrolled ones for the Dashboard
    const enrolledCourseIds = enrollments.map((enrollment: any) => enrollment.course);
    return courses.filter(course => enrolledCourseIds.includes(course._id));
  };

  const enrollInCourse = async (courseId: string) => {
    if (!currentUser || !currentUser._id) {
      console.error("No user logged in");
      return;
    }

    try {
      console.log("Enrolling user", currentUser._id, "in course", courseId);
      const newEnrollment = await enrollmentsClient.enrollUserInCourse(currentUser._id, courseId);
      console.log("Enrollment successful:", newEnrollment);
      dispatch(enrollUserInCourse(newEnrollment));
      // Refresh enrollments from server
      await fetchEnrollments();
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const unenrollFromCourse = async (courseId: string) => {
    if (!currentUser || !currentUser._id) {
      console.error("No user logged in");
      return;
    }

    try {
      console.log("Unenrolling user", currentUser._id, "from course", courseId);
      await enrollmentsClient.unenrollUserFromCourse(currentUser._id, courseId);
      console.log("Unenrollment successful");
      dispatch(unenrollUserFromCourse({ userId: currentUser._id, courseId }));
      // Refresh enrollments from server
      await fetchEnrollments();
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  const isEnrolled = (courseId: string) => {
    if (!currentUser || !currentUser._id) return false;
    return enrollments.some((enrollment: any) => 
      enrollment.user === currentUser._id && enrollment.course === courseId
    );
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
    // Fetch enrollments when currentUser changes
    fetchEnrollments();
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
              courses={getEnrolledCourses()}
              course={course}
              setCourse={setCourse}
              addNewCourse={addNewCourse}
              deleteCourse={deleteCourse}
              updateCourse={updateCourse}
              enrollInCourse={enrollInCourse}
              unenrollFromCourse={unenrollFromCourse}
              isEnrolled={isEnrolled}/>
          } />
          <Route path="/Courses" element={<CoursesList 
            courses={courses} 
            enrollInCourse={enrollInCourse}
            unenrollFromCourse={unenrollFromCourse}
            isEnrolled={isEnrolled}
          />} />
          <Route path="/Courses/:cid/*" element={<Courses courses={courses} />} />
          <Route path="/Calendar" element={<h1>Calendar</h1>} />
          <Route path="/Inbox" element={<h1>Inbox</h1>} />
        </Routes>
      </div>
    </div>
);}
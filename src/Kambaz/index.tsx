import { Navigate, Route, Routes } from "react-router-dom";
import KambazNavigation from "./Navigation";
import Account from "./Account";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import CoursesList from "./CoursesList";
import "./styles.css";
import { useEffect, useState } from "react";
import { db } from "./Database";
import { v4 as uuidv4 } from "uuid";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>(db.courses);
  const [course, setCourse] = useState<any>({
    _id: "1234", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", 
    image: "/images/reactjs.jpg", description: "New Description",
  });

  const addNewCourse = () => {
    setCourses([...courses, { ...course, _id: uuidv4() }]);
  };

  const deleteCourse = (courseId: any) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  };

  const updateCourse = () => {
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

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
          <Route path="/Courses" element={<CoursesList />} />
          <Route path="/Courses/:cid/*" element={<Courses courses={courses} />} />
          <Route path="/Calendar" element={<h1>Calendar</h1>} />
          <Route path="/Inbox" element={<h1>Inbox</h1>} />
        </Routes>
      </div>
    </div>
);}

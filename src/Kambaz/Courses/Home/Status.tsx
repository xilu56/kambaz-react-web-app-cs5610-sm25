import React from 'react';
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { MdOutlineHome, MdTimeline } from "react-icons/md";
import { FaRegBell, FaChartBar } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { Button, Image } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { db } from '../../Database';

export default function CourseStatus() {
  const { cid } = useParams();
  const course = db.courses.find((c: any) => c._id === cid);
  
  // 确保图片加载失败时有备用处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/placeholder.jpg"; // 公共目录中的备用图片
    target.onerror = null; // 防止无限循环
  };

  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>
      <div className="mb-3">
        <Image 
          src={course && course.image ? `/images/${course.image}` : "/images/placeholder.jpg"}
          alt={course?.name || "CS Course"} 
          className="img-fluid rounded mb-3"
          onError={handleImageError}
        />
      </div>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button variant="secondary" size="lg" className="w-100 text-nowrap">
            <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish
          </Button>
        </div>
        <div className="w-50">
          <Button variant="success" size="lg" className="w-100">
            <FaCheckCircle className="me-2 fs-5" /> Publish
          </Button>
        </div>
      </div>
      <br />
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" /> Import Existing Content
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <MdOutlineHome className="me-2 fs-5" /> Choose Home Page
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <MdTimeline className="me-2 fs-5" /> View Course Stream
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaRegBell className="me-2 fs-5" /> New Announcement
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaChartBar className="me-2 fs-5" /> New Analytics
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <IoNotificationsOutline className="me-2 fs-5" /> View Course Notifications
      </Button>
      
      <div className="mt-4">
        <h6>Coming Up</h6>
        <ul className="list-unstyled">
          <li className="mb-2">
            <small className="text-muted d-block">Tomorrow</small>
            <span>Assignment Due: Algorithms Analysis</span>
          </li>
          <li className="mb-2">
            <small className="text-muted d-block">Friday</small>
            <span>Quiz: Data Structures Implementation</span>
          </li>
          <li className="mb-2">
            <small className="text-muted d-block">Next Monday</small>
            <span>Project Phase 1: React Application</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h6>Recent Feedback</h6>
        <ul className="list-unstyled">
          <li className="mb-2">
            <small className="text-muted d-block">May 15, 2023</small>
            <span>Assignment: Database Design - 92/100</span>
          </li>
          <li className="mb-2">
            <small className="text-muted d-block">May 10, 2023</small>
            <span>Quiz: JavaScript Basics - 18/20</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
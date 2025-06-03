import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { MdOutlineHome, MdTimeline } from "react-icons/md";
import { FaRegBell, FaChartBar } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { db } from "../../Database";

export default function CourseStatus() {
  const { cid } = useParams();
  
  // Get assignments for the current course
  const courseAssignments = db.assignments.filter((a: any) => a.course === cid);
  
  // Get the next few upcoming assignments (sorted by due date)
  const upcomingAssignments = courseAssignments
    .filter((a: any) => a.dueDate)
    .slice(0, 3); // Show first 3 assignments
  
  // Get some recent assignments for feedback simulation
  const recentAssignments = courseAssignments
    .slice(0, 2); // Show first 2 assignments

  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
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
        {upcomingAssignments.length > 0 ? (
          <ul className="list-unstyled">
            {upcomingAssignments.map((assignment: any, index: number) => (
              <li key={assignment._id} className="mb-2">
                <small className="text-muted d-block">
                  {assignment.dueDate || "No due date"}
                </small>
                <span>Assignment Due: {assignment.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No upcoming assignments</p>
        )}
      </div>
      
      <div>
        <h6>Recent Feedback</h6>
        {recentAssignments.length > 0 ? (
          <ul className="list-unstyled">
            {recentAssignments.map((assignment: any, index: number) => (
              <li key={assignment._id} className="mb-2">
                <small className="text-muted d-block">Recently graded</small>
                <span>Assignment: {assignment.title} - {assignment.points || 100}/{assignment.points || 100}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No recent feedback</p>
        )}
      </div>
    </div>
  );
}
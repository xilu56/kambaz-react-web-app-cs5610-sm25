import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { FaSearch, FaEllipsisV, FaGripVertical, FaTrash, FaPencilAlt} from "react-icons/fa";
import { BsFileText } from "react-icons/bs";
import { InputGroup, Form, Row, Col, Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments, deleteAssignment } from "./reducer";
import * as assignmentsClient from "./client";

// Import GreenCheckmark component
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function Assignments() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  // Get assignments from Redux store
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  // Get assignments for the current course
  const courseAssignments = assignments.filter((a: any) => 
    a.course === cid
  );

  const fetchAssignments = async () => {
    try {
      if (cid) {
        const assignments = await assignmentsClient.findAssignmentsForCourse(cid);
        dispatch(setAssignments(assignments));
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    try {
      console.log("Deleting assignment:", assignmentId);
      await assignmentsClient.deleteAssignment(assignmentId);
      console.log("Assignment deleted successfully");
      dispatch(deleteAssignment(assignmentId));
      // Refresh assignments from server to ensure consistency
      await fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddAssignment = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments/new`);
  };

  const handleDeleteClick = (assignmentId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      removeAssignment(assignmentToDelete);
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const handleEditClick = (assignmentId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/Kambaz/Courses/${cid}/Assignments/${assignmentId}`);
  };

  const assignmentItemStyle: CSSProperties = {
    position: "relative",
    padding: "10px 5px",
    transition: "background-color 0.2s",
    marginBottom: "0",
    borderLeft: "0",
    borderRight: "0",
    borderTop: "0",
    borderBottom: "1px solid rgba(0,0,0,.125)",
  };

  const greenBorderStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "3px",
    height: "100%",
    backgroundColor: "#28a745"
  };

  const fileIconStyle: CSSProperties = {
    color: "#28a745",
    marginRight: "10px",
    fontSize: "1.1rem"
  };

  return (
    <div className="p-3">
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{borderRight: "none", backgroundColor: "white"}}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              style={{borderLeft: "none"}}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <button 
            className="btn me-2" 
            style={{backgroundColor: "#f8f9fa", border: "1px solid #dee2e6"}}
          >
            + Group
          </button>
          <button 
            className="btn text-white"
            style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
            onClick={handleAddAssignment}
          >
            + Assignment
          </button>
        </Col>
      </Row>
      
      <div 
        className="d-flex justify-content-between align-items-center py-2 border-bottom mb-0 px-2 bg-light"
        onClick={toggleExpand}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center">
          <FaGripVertical className="text-muted me-2" />
          <span className="fw-bold">ASSIGNMENTS</span>
        </div>
        <div className="d-flex align-items-center">
          <span 
            className="me-3 rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-muted"
            style={{ fontSize: "0.85rem" }}
          >
            40% of Total
          </span>
          <button className="btn p-0 fs-5 text-muted">+</button>
          <div className="ms-3 text-muted">
            <FaEllipsisV />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <ul className="list-group list-group-flush">
          {courseAssignments.map((assignment: any) => (
            <li 
              key={assignment._id}
              className="list-group-item d-flex"
              style={assignmentItemStyle}
            >
              <div style={greenBorderStyle}></div>
              <div className="me-2">
                <FaGripVertical className="text-muted" style={{opacity: 0.3}} />
              </div>
              <div className="me-2">
                <BsFileText style={fileIconStyle} />
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-0">
                  <Link 
                    to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`} 
                    style={{color: "#212529", textDecoration: "none"}}
                  >
                    {assignment.title}
                  </Link>
                </h5>
                <div style={{fontSize: "0.9rem"}}>
                  <span style={{color: "#dc3545"}}>{assignment.module || "Multiple Modules"}</span>
                  <span className="text-muted"> | {assignment.availableFrom ? `Not available until ${assignment.availableFrom}` : "Available now"} |</span>
                  <div className="text-muted">
                    {assignment.dueDate ? `Due ${assignment.dueDate}` : "No due date"} | {assignment.points || 100} pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start ms-2">
                {assignment.status === "completed" && <GreenCheckmark />}
                <div className="d-flex gap-2 ms-3">
                  <button
                    className="btn btn-sm btn-outline-primary p-1"
                    onClick={(e) => handleEditClick(assignment._id, e)}
                    title="Edit Assignment"
                  >
                    <FaPencilAlt size={12} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger p-1"
                    onClick={(e) => handleDeleteClick(assignment._id, e)}
                    title="Delete Assignment"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteDialog} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
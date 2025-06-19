import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { FaSearch, FaEllipsisV, FaGripVertical, FaTrash, FaPencilAlt, FaCheckCircle, FaBan, FaCopy, FaSort } from "react-icons/fa";
import { BsFileText } from "react-icons/bs";
import { InputGroup, Form, Row, Col, Modal, Button, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  
  // Get quizzes from Redux store
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  
  // Get current user for role-based functionality
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Get quizzes for the current course
  const courseQuizzes = quizzes.filter((q: any) => 
    q.course === cid
  );

  const fetchQuizzes = async () => {
    if (cid) {
      try {
        console.log("Fetching quizzes for course:", cid);
        console.log("REMOTE_SERVER:", import.meta.env.VITE_REMOTE_SERVER);
        const quizzes = await quizzesClient.fetchQuizzesForCourse(cid);
        console.log("Received quizzes:", quizzes);
        dispatch(setQuizzes(quizzes));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }
  };

  const removeQuiz = async (quizId: string) => {
    try {
      console.log("Deleting quiz:", quizId);
      await quizzesClient.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
      await fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const togglePublishStatus = async (quiz: any) => {
    try {
      const updatedQuiz = await quizzesClient.updateQuiz(quiz._id, {
        published: !quiz.published
      });
      dispatch(updateQuiz({ quizId: quiz._id, updates: { published: !quiz.published } }));
    } catch (error) {
      console.error("Error updating quiz publish status:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
  };

  const handleDeleteClick = (quizId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (quizToDelete) {
      removeQuiz(quizToDelete);
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleEditClick = (quizId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
  };

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;
    
    if (!quiz.published) {
      return "Unpublished";
    }
    
    if (untilDate && now > untilDate) {
      return "Closed";
    }
    
    if (availableDate && now < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }
    
    return "Available";
  };

  const formatDueDate = (quiz: any) => {
    if (!quiz.dueDate) return "No due date";
    const dueDate = new Date(quiz.dueDate);
    return `Due ${dueDate.toLocaleDateString()} at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const quizItemStyle: CSSProperties = {
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

  const isFaculty = currentUser && currentUser.role === "FACULTY";
  const isStudent = currentUser && currentUser.role === "STUDENT";

  return (
    <div className="p-3">
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{borderRight: "none", backgroundColor: "white"}}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search for Quiz"
              style={{borderLeft: "none"}}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          {isFaculty && (
            <>
              <Dropdown className="me-2">
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <FaSort /> Sort
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Sort by Name</Dropdown.Item>
                  <Dropdown.Item>Sort by Due Date</Dropdown.Item>
                  <Dropdown.Item>Sort by Available Date</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button 
                className="btn text-white"
                style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                onClick={handleAddQuiz}
              >
                + Quiz
              </button>
            </>
          )}
        </Col>
      </Row>
      
      <div 
        className="d-flex justify-content-between align-items-center py-2 border-bottom mb-0 px-2 bg-light"
        onClick={toggleExpand}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center">
          <FaGripVertical className="text-muted me-2" />
          <span className="fw-bold">QUIZZES</span>
        </div>
        <div className="d-flex align-items-center">
          <span 
            className="me-3 rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-muted"
            style={{ fontSize: "0.85rem" }}
          >
            {courseQuizzes.length} quizzes
          </span>
          {isFaculty && (
            <button className="btn p-0 fs-5 text-muted">+</button>
          )}
          <div className="ms-3 text-muted">
            <FaEllipsisV />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <>
          {courseQuizzes.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No quizzes available.</p>
              {isFaculty && (
                <Button 
                  variant="primary" 
                  onClick={handleAddQuiz}
                  style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                >
                  + Quiz
                </Button>
              )}
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {courseQuizzes.map((quiz: any) => (
                <li 
                  key={quiz._id}
                  className="list-group-item d-flex"
                  style={quizItemStyle}
                >
                  <div style={greenBorderStyle}></div>
                  <div className="me-2">
                    <FaGripVertical className="text-muted" style={{opacity: 0.3}} />
                  </div>
                  <div className="me-2">
                    <BsFileText style={fileIconStyle} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-0">
                          <Link 
                            to={isFaculty 
                              ? `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}` 
                              : `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`
                            } 
                            style={{color: "#212529", textDecoration: "none"}}
                          >
                            {quiz.title}
                          </Link>
                          {isFaculty && (
                            <button
                              className="btn p-0 ms-2"
                              onClick={(e) => {
                                e.preventDefault();
                                togglePublishStatus(quiz);
                              }}
                              style={{ fontSize: "0.9rem" }}
                            >
                              {quiz.published ? (
                                <FaCheckCircle className="text-success" title="Published" />
                              ) : (
                                <FaBan className="text-danger" title="Unpublished" />
                              )}
                            </button>
                          )}
                        </h5>
                        <div style={{fontSize: "0.9rem"}}>
                          <span style={{color: getAvailabilityStatus(quiz).includes("Closed") ? "#dc3545" : 
                                      getAvailabilityStatus(quiz).includes("Not available") ? "#ffc107" : "#28a745"}}>
                            {getAvailabilityStatus(quiz)}
                          </span>
                          <span className="text-muted"> | {formatDueDate(quiz)} | </span>
                          <span className="text-muted">{quiz.points || 0} pts | </span>
                          <span className="text-muted">{quiz.questions?.length || 0} questions</span>
                          {!isFaculty && quiz.latestScore !== undefined && (
                            <span className="text-muted"> | Score: {quiz.latestScore}/{quiz.points || 0}</span>
                          )}
                        </div>
                      </div>
                      {isFaculty && (
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="link" 
                            className="text-muted p-0"
                            style={{ boxShadow: "none", border: "none" }}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => handleEditClick(quiz._id, e)}>
                              <FaPencilAlt className="me-2" />
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleDeleteClick(quiz._id, e)}>
                              <FaTrash className="me-2" />
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) => {
                              e.preventDefault();
                              togglePublishStatus(quiz);
                            }}>
                              {quiz.published ? <FaBan className="me-2" /> : <FaCheckCircle className="me-2" />}
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item>
                              <FaCopy className="me-2" />
                              Copy to Another Course
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteDialog} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz? This action cannot be undone.
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
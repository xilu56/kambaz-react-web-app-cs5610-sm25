import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { FaSearch, FaEllipsisV, FaTrash, FaPencilAlt, FaCheckCircle, FaBan, FaCopy, FaPlus, FaCaretDown, FaCaretRight } from "react-icons/fa";
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
  const [showQuizList, setShowQuizList] = useState(false);
  
  // Get quizzes from Redux store
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  
  // Get current user for role-based functionality
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Determine user role
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  const isStudent = currentUser && currentUser.role === "STUDENT";
  
  // Get quizzes for the current course with role-based filtering and auto-sorting
  const courseQuizzes = quizzes
    .filter((q: any) => {
      // First filter by course
      if (q.course !== cid) return false;
      
      // Faculty can see all quizzes
      if (isFaculty) return true;
      
      // Students can only see published quizzes
      if (isStudent) return q.published === true;
      
      // Default: show all (fallback)
      return true;
    })
    .sort((a: any, b: any) => {
      // Sort by available date (earliest first)
      const dateA = a.availableDate ? new Date(a.availableDate).getTime() : 0;
      const dateB = b.availableDate ? new Date(b.availableDate).getTime() : 0;
      return dateA - dateB;
    });

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
    // Don't automatically show quiz list - always start with empty state
  }, [cid]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddQuiz = () => {
    const targetUrl = `/Kambaz/Courses/${cid}/Quizzes/new`;
    console.log("=== ADD QUIZ NAVIGATION DEBUG ===");
    console.log("Current cid:", cid);
    console.log("Navigating to:", targetUrl);
    console.log("Current URL before navigation:", window.location.href);
    navigate(targetUrl);
  };

  const handleShowQuizzes = () => {
    setShowQuizList(true);
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

  const getStatusIcon = (quiz: any) => {
    if (!quiz.published) {
      return "🚫"; // Unpublished symbol
    }
    
    const status = getAvailabilityStatus(quiz);
    if (status === "Closed") {
      return "🚫";
    } else if (status === "Available") {
      return "✅";
    } else {
      return "⏳";
    }
  };

  const getStatusColor = (quiz: any) => {
    const status = getAvailabilityStatus(quiz);
    if (status.includes("Closed")) {
      return "#d9534f"; // Red
    } else if (status === "Available") {
      return "#5cb85c"; // Green
    } else if (status.includes("Not available")) {
      return "#f0ad4e"; // Orange
    } else {
      return "#5bc0de"; // Blue
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      {/* Show search/controls only when quiz list is visible */}
      {showQuizList && (
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text style={{ borderRight: "none", backgroundColor: "white", border: "1px solid #ddd" }}>
                  <FaSearch style={{ color: "#999" }} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search for Quiz"
                  style={{ borderLeft: "none", border: "1px solid #ddd" }}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              {isFaculty && (
                <Button 
                  style={{ backgroundColor: "#0374b5", borderColor: "#0374b5", color: "white" }}
                  onClick={handleAddQuiz}
                >
                  <FaPlus className="me-1" /> Quiz
                </Button>
              )}
            </Col>
          </Row>
        </div>
      )}
      
      {/* Default Empty State or Assignment Quizzes Section */}
      {!showQuizList ? (
        /* Empty State - Default View */
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "60px 40px",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: "30px" }}>
            <div style={{ 
              fontSize: "48px", 
              color: "#ccc", 
              marginBottom: "20px"
            }}>
              📋
            </div>
            <h3 style={{ 
              color: "#333", 
              marginBottom: "15px",
              fontSize: "24px",
              fontWeight: "normal"
            }}>
              {courseQuizzes.length === 0 ? "No Quizzes Available" : "Quiz Management"}
            </h3>
            <p style={{ 
              color: "#666", 
              fontSize: "16px",
              lineHeight: "1.5",
              maxWidth: "400px",
              margin: "0 auto 30px"
            }}>
              {isFaculty 
                ? (courseQuizzes.length === 0 
                   ? "Get started by creating your first quiz. Click the Add Quiz button below to begin."
                   : "Manage your course quizzes. Create new quizzes or view existing ones.")
                : (courseQuizzes.length === 0
                   ? "Your instructor hasn't created any quizzes yet. Check back later!"
                   : "Your instructor has created quizzes for this course.")
              }
            </p>
            
            {isFaculty && (
              <div>
                <Button 
                  style={{ 
                    backgroundColor: "#0374b5", 
                    borderColor: "#0374b5",
                    fontSize: "16px",
                    padding: "12px 24px",
                    marginBottom: "15px"
                  }}
                  onClick={handleAddQuiz}
                >
                  <FaPlus className="me-2" />
                  Add Quiz
                </Button>
                <div style={{ fontSize: "14px", color: "#888" }}>
                  or{" "}
                  <button 
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#0374b5", 
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                    onClick={handleShowQuizzes}
                  >
                    view existing quizzes
                  </button>
                </div>
              </div>
            )}
            
            {!isFaculty && (
              courseQuizzes.length > 0 ? (
                <Button 
                  variant="outline-primary"
                  onClick={handleShowQuizzes}
                  style={{ 
                    borderColor: "#0374b5",
                    color: "#0374b5",
                    fontSize: "16px",
                    padding: "12px 24px"
                  }}
                >
                  View Available Quizzes
                </Button>
              ) : null
            )}
          </div>
        </div>
      ) : (
        /* Assignment Quizzes Section */
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {/* Section Header */}
          <div 
            style={{ 
              padding: "15px 20px", 
              borderBottom: "1px solid #e7e7e7",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            onClick={toggleExpand}
          >
            <div style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "16px" }}>
              {isExpanded ? <FaCaretDown style={{ marginRight: "8px" }} /> : <FaCaretRight style={{ marginRight: "8px" }} />}
              Assignment Quizzes
              <span style={{ 
                fontSize: "12px", 
                fontWeight: "normal", 
                color: "#666", 
                marginLeft: "10px",
                fontStyle: "italic"
              }}>
                (sorted by available date)
              </span>
            </div>
            {isFaculty && (
              <Button 
                size="sm"
                variant="link"
                style={{ color: "#0374b5", textDecoration: "none", padding: "0" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddQuiz();
                }}
              >
                <FaPlus />
              </Button>
            )}
          </div>
        
        {/* Quiz List */}
        {isExpanded && (
          <div>
            {courseQuizzes.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                <p style={{ fontSize: "16px", marginBottom: "20px" }}>No quizzes available.</p>
                {isFaculty && (
                  <div>
                    <p style={{ marginBottom: "15px" }}>Click the Add Quiz button to create your first quiz.</p>
                    <Button 
                      style={{ backgroundColor: "#0374b5", borderColor: "#0374b5" }}
                      onClick={handleAddQuiz}
                    >
                      <FaPlus className="me-2" />
                      Quiz
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {courseQuizzes.map((quiz: any, index: number) => (
                  <div 
                    key={quiz._id}
                    style={{
                      padding: "15px 20px",
                      borderBottom: index < courseQuizzes.length - 1 ? "1px solid #e7e7e7" : "none",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "white"
                    }}
                  >
                    {/* Status Icon */}
                    <div style={{ marginRight: "15px", fontSize: "20px" }}>
                      <div 
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: getStatusColor(quiz),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold"
                        }}
                      >
                        {quiz.published && getAvailabilityStatus(quiz) === "Available" ? "✓" : 
                         quiz.published && getAvailabilityStatus(quiz) === "Closed" ? "✕" : "🚫"}
                      </div>
                    </div>
                    
                    {/* Quiz Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h5 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                            <Link 
                              to={isFaculty 
                                ? `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}` 
                                : `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`
                              } 
                              style={{ color: "#0374b5", textDecoration: "none" }}
                            >
                              {quiz.title}
                            </Link>
                          </h5>
                          
                          <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                            <span style={{ color: getStatusColor(quiz), fontWeight: "500" }}>
                              {getAvailabilityStatus(quiz)}
                            </span>
                            
                            {/* Multiple Dates and Due information */}
                            {quiz.availableDate && (
                              <>
                                <span style={{ margin: "0 8px" }}>|</span>
                                <span>Available {new Date(quiz.availableDate).toLocaleDateString()}</span>
                              </>
                            )}
                            
                            {quiz.dueDate && (
                              <>
                                <span style={{ margin: "0 8px" }}>|</span>
                                <span>{formatDueDate(quiz)}</span>
                              </>
                            )}
                            
                            <span style={{ margin: "0 8px" }}>|</span>
                            <span>{quiz.points || 0} pts</span>
                            
                            <span style={{ margin: "0 8px" }}>|</span>
                            <span>{quiz.questions?.length || 0} Questions</span>
                            
                            {/* Student Score Display */}
                            {isStudent && quiz.latestScore !== undefined && (
                              <>
                                <span style={{ margin: "0 8px" }}>|</span>
                                <span>Score: {quiz.latestScore}/{quiz.points || 0}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons for Faculty */}
                        {isFaculty && (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                togglePublishStatus(quiz);
                              }}
                              style={{ 
                                background: "none", 
                                border: "none", 
                                fontSize: "16px", 
                                marginRight: "10px",
                                cursor: "pointer"
                              }}
                              title={quiz.published ? "Unpublish" : "Publish"}
                            >
                              {quiz.published ? "✅" : "🚫"}
                            </button>
                            
                            <Dropdown>
                              <Dropdown.Toggle 
                                variant="link" 
                                style={{ 
                                  color: "#666", 
                                  border: "none", 
                                  background: "none",
                                  boxShadow: "none",
                                  padding: "0",
                                  fontSize: "16px"
                                }}
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
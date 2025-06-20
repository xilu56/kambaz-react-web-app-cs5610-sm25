import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Badge, Row, Col, Alert, Table } from "react-bootstrap";
import { FaEdit, FaEye, FaPlay, FaCalendarAlt, FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  const { currentQuiz } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isFaculty = currentUser && currentUser.role === "FACULTY";
  const isStudent = currentUser && currentUser.role === "STUDENT";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          console.log("Fetching quiz details for ID:", qid);
          const quiz = await quizzesClient.fetchQuiz(qid);
          console.log("Fetched quiz data:", quiz);
          console.log("Quiz points from server:", quiz.points);
          dispatch(setCurrentQuiz(quiz));
          
          // If student, fetch their latest attempt
          if (!isFaculty) {
            try {
              const attempt = await quizzesClient.getLatestAttemptForStudent(qid);
              setLatestAttempt(attempt);
            } catch (error) {
              console.log("No attempts found or error fetching attempts");
            }
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [qid, isFaculty, dispatch]);

  // Add effect to refetch quiz when navigating back from editor
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, refetching quiz data...");
      if (qid) {
        const refetchQuiz = async () => {
          try {
            const quiz = await quizzesClient.fetchQuiz(qid);
            console.log("Refetched quiz data:", quiz);
            dispatch(setCurrentQuiz(quiz));
          } catch (error) {
            console.error("Error refetching quiz:", error);
          }
        };
        refetchQuiz();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [qid, dispatch]);

  const handleEdit = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleTakeQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
  };

  const handleTogglePublish = async () => {
    if (!currentQuiz) return;
    
    try {
      const updatedQuiz = await quizzesClient.updateQuiz(currentQuiz._id, {
        published: !currentQuiz.published
      });
      dispatch(updateQuiz({ quizId: currentQuiz._id, updates: { published: !currentQuiz.published } }));
      dispatch(setCurrentQuiz({ ...currentQuiz, published: !currentQuiz.published }));
    } catch (error) {
      console.error("Error updating quiz publish status:", error);
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getAvailabilityStatus = () => {
    if (!currentQuiz) return { status: "Loading...", color: "secondary" };
    
    const now = new Date();
    const availableDate = currentQuiz.availableDate ? new Date(currentQuiz.availableDate) : null;
    const untilDate = currentQuiz.untilDate ? new Date(currentQuiz.untilDate) : null;
    
    if (!currentQuiz.published) {
      return { status: "Unpublished", color: "secondary" };
    }
    
    if (untilDate && now > untilDate) {
      return { status: "Closed", color: "danger" };
    }
    
    if (availableDate && now < availableDate) {
      return { status: `Not available until ${availableDate.toLocaleDateString()}`, color: "warning" };
    }
    
    return { status: "Available", color: "success" };
  };

  const canTakeQuiz = () => {
    if (!currentQuiz || isFaculty) return false;
    
    const availability = getAvailabilityStatus();
    if (availability.status !== "Available") return false;
    
    // Check if student has exhausted attempts
    if (currentQuiz.multipleAttempts && latestAttempt) {
      return latestAttempt.attemptNumber < currentQuiz.howManyAttempts;
    }
    
    // If single attempt, check if they've already taken it
    if (!currentQuiz.multipleAttempts && latestAttempt) {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return <div className="p-4">Loading quiz details...</div>;
  }

  if (!currentQuiz) {
    return <div className="p-4">Quiz not found.</div>;
  }

  const availability = getAvailabilityStatus();

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px" }}>
        
        {/* Header with buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <Link to={`/Kambaz/Courses/${cid}/Quizzes`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
              ← Back to Quizzes
            </Link>
          </div>
          <div>
            {isFaculty && (
              <>
                <Button variant="outline-secondary" onClick={handlePreview} className="me-2">
                  Preview
                </Button>
                <Button variant="outline-primary" onClick={handleEdit}>
                  <FaEdit className="me-1" />
                  Edit
                </Button>
              </>
            )}
            {isStudent && canTakeQuiz() && (
              <Button variant="primary" onClick={handleTakeQuiz} size="lg">
                <FaPlay className="me-1" />
                Take Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Quiz Title */}
        <h2 style={{ marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
          {currentQuiz.title}
        </h2>

        {/* For Students - Show Take Quiz button and basic info */}
        {isStudent && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            {!canTakeQuiz() && (
              <Alert variant="warning" style={{ marginBottom: "20px" }}>
                <h6>Quiz Not Available</h6>
                <p className="mb-0">{availability.status}</p>
              </Alert>
            )}
            
            {latestAttempt && (
              <Alert variant="info" style={{ marginBottom: "20px" }}>
                <h6>Your Latest Score: {latestAttempt.score}/{latestAttempt.totalPoints}</h6>
                <p className="mb-0">
                  Attempt {latestAttempt.attemptNumber}
                  {currentQuiz.multipleAttempts && ` of ${currentQuiz.howManyAttempts}`}
                </p>
              </Alert>
            )}

            <div style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}>
              <div><strong>Points:</strong> {currentQuiz.points || 0}</div>
              <div><strong>Time Limit:</strong> {currentQuiz.timeLimit || 20} minutes</div>
              <div><strong>Questions:</strong> {currentQuiz.questions?.length || 0}</div>
            </div>
          </div>
        )}

                 {/* For Faculty - Show detailed properties */}
         {isFaculty && (
           <Row>
                          <Col md={12}>
               {/* Quiz properties table */}
               <div style={{ fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500", width: "50%" }}>Quiz Type</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.quizType || "Graded Quiz"}</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Points</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.points || 0}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Assignment Group</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.assignmentGroup || "QUIZZES"}</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Shuffle Answers</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.shuffleAnswers ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Time Limit</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.timeLimit || 20} Minutes</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Multiple Attempts</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.multipleAttempts ? "Yes" : "No"}</td>
                    </tr>
                    {currentQuiz.multipleAttempts && (
                      <tr>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>How Many Attempts</td>
                        <td style={{ padding: "8px 12px" }}>{currentQuiz.howManyAttempts || 1}</td>
                      </tr>
                    )}
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Show Correct Answers</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.showCorrectAnswers || "Immediately"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Access Code</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.accessCode || "None"}</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>One Question at a Time</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.oneQuestionAtATime ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Webcam Required</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.webcamRequired ? "Yes" : "No"}</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "500" }}>Lock Questions After Answering</td>
                      <td style={{ padding: "8px 12px" }}>{currentQuiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

                             {/* Due date table */}
               <div style={{ marginTop: "30px", maxWidth: "600px", margin: "30px auto 0 auto" }}>
                 <Table striped bordered size="sm" style={{ fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th>Due</th>
                      <th>For</th>
                      <th>Available from</th>
                      <th>Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currentQuiz.dueDate ? new Date(currentQuiz.dueDate).toLocaleDateString() + " at " + new Date(currentQuiz.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not set"}</td>
                      <td>Everyone</td>
                      <td>{currentQuiz.availableDate ? new Date(currentQuiz.availableDate).toLocaleDateString() + " at " + new Date(currentQuiz.availableDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not set"}</td>
                      <td>{currentQuiz.untilDate ? new Date(currentQuiz.untilDate).toLocaleDateString() + " at " + new Date(currentQuiz.untilDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not set"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        )}

        {/* Publish/Unpublish Button at Bottom */}
        {isFaculty && (
          <div style={{ textAlign: "center", marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #eee" }}>
            <Button 
              variant={currentQuiz?.published ? "warning" : "success"} 
              onClick={handleTogglePublish}
              size="lg"
              style={{ minWidth: "150px" }}
            >
              {currentQuiz?.published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
} 
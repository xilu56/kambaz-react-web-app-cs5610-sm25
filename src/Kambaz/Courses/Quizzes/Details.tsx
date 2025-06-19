import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Badge, Row, Col, Alert } from "react-bootstrap";
import { FaEdit, FaEye, FaPlay, FaCalendarAlt, FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz } from "./reducer";
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
          const quiz = await quizzesClient.fetchQuiz(qid);
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

  const handleEdit = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleTakeQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
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
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{currentQuiz.title}</h2>
          <Badge bg={availability.color} className="me-2">
            {availability.status}
          </Badge>
        </div>
        <div>
          {isFaculty && (
            <>
              <Button variant="outline-primary" onClick={handleEdit} className="me-2">
                <FaEdit className="me-1" />
                Edit
              </Button>
              <Button variant="outline-info" onClick={handlePreview}>
                <FaEye className="me-1" />
                Preview
              </Button>
            </>
          )}
          {!isFaculty && canTakeQuiz() && (
            <Button variant="primary" onClick={handleTakeQuiz}>
              <FaPlay className="me-1" />
              Take Quiz
            </Button>
          )}
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quiz Information</h5>
            </Card.Header>
            <Card.Body>
              {currentQuiz.description && (
                <div className="mb-3">
                  <p>{currentQuiz.description}</p>
                </div>
              )}
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Quiz Type:</strong> {currentQuiz.quizType || "Graded Quiz"}
                  </div>
                  <div className="mb-3">
                    <strong>Points:</strong> {currentQuiz.points || 0}
                  </div>
                  <div className="mb-3">
                    <strong>Assignment Group:</strong> {currentQuiz.assignmentGroup || "QUIZZES"}
                  </div>
                  <div className="mb-3">
                    <strong>Time Limit:</strong> {currentQuiz.timeLimit || 20} minutes
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Multiple Attempts:</strong> {currentQuiz.multipleAttempts ? "Yes" : "No"}
                  </div>
                  {currentQuiz.multipleAttempts && (
                    <div className="mb-3">
                      <strong>Number of Attempts:</strong> {currentQuiz.howManyAttempts || 1}
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Show Correct Answers:</strong> {currentQuiz.showCorrectAnswers || "Immediately"}
                  </div>
                  <div className="mb-3">
                    <strong>Questions:</strong> {currentQuiz.questions?.length || 0}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Due Dates
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>Due:</strong><br />
                {formatDate(currentQuiz.dueDate)}
              </div>
              <div className="mb-2">
                <strong>Available from:</strong><br />
                {formatDate(currentQuiz.availableDate)}
              </div>
              <div className="mb-2">
                <strong>Until:</strong><br />
                {formatDate(currentQuiz.untilDate)}
              </div>
            </Card.Body>
          </Card>

          {!isFaculty && latestAttempt && (
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">
                  <FaStar className="me-2" />
                  Your Attempts
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Latest Score:</strong> {latestAttempt.score}/{latestAttempt.totalPoints}
                </div>
                <div className="mb-2">
                  <strong>Attempt:</strong> {latestAttempt.attemptNumber}
                  {currentQuiz.multipleAttempts && ` of ${currentQuiz.howManyAttempts}`}
                </div>
                <div className="mb-2">
                  <strong>Submitted:</strong><br />
                  {formatDate(latestAttempt.submittedAt)}
                </div>
              </Card.Body>
            </Card>
          )}

          {!isFaculty && !canTakeQuiz() && latestAttempt && (
            <Alert variant="info">
              <h6>Quiz Completed</h6>
              <p className="mb-0">
                You have completed this quiz. 
                {currentQuiz.multipleAttempts && latestAttempt.attemptNumber >= currentQuiz.howManyAttempts
                  ? " You have used all available attempts."
                  : !currentQuiz.multipleAttempts 
                    ? " Multiple attempts are not allowed."
                    : ""
                }
              </p>
            </Alert>
          )}

          {!isFaculty && availability.status !== "Available" && (
            <Alert variant="warning">
              <h6>Quiz Not Available</h6>
              <p className="mb-0">{availability.status}</p>
            </Alert>
          )}
        </Col>
      </Row>

      <div className="mt-4">
        <Link to={`/Kambaz/Courses/${cid}/Quizzes`} className="btn btn-outline-secondary">
          ← Back to Quizzes
        </Link>
      </div>
    </div>
  );
} 
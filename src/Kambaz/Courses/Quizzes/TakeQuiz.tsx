import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Button, Form, Alert, Badge, Row, Col } from "react-bootstrap";
import { FaArrowRight, FaArrowLeft, FaCheck, FaTimes, FaSave } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz } from "./reducer";
import * as quizzesClient from "./client";
import { formatDateForDisplay } from "./dateUtils";

interface Answer {
  questionId: string;
  answer?: any;
  selectedChoices?: string[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  correctAnswer: string;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: QuestionResult[];
}

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [isViewingResults, setIsViewingResults] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const { currentQuiz } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isStudent = currentUser && currentUser.role === "STUDENT";

  // Helper functions
  const checkCanTakeQuiz = (quiz: any, latestAttempt: any) => {
    if (!quiz.multipleAttempts) {
      // Single attempt only - can't retake if already attempted
      return !latestAttempt;
    }
    
    // Multiple attempts allowed - check if under limit
    return latestAttempt.attemptNumber < quiz.howManyAttempts;
  };

  const getCorrectAnswer = (question: any) => {
    if (!question) return "";
    
    if (question.type === "Multiple Choice") {
      return question.choices?.find((c: any) => c.isCorrect)?.text || "";
    } else if (question.type === "True/False") {
      return question.answer?.toString() || "";
    } else if (question.type === "Fill in the Blank") {
      return question.correctAnswers?.join(", ") || "";
    }
    return "";
  };

  const getQuizAvailabilityStatus = (quiz = currentQuiz) => {
    if (!quiz) return { status: "Loading...", color: "secondary", canTake: false, message: "" };
    
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;
    
    if (!quiz.published) {
      return { 
        status: "Quiz Not Available", 
        color: "warning", 
        canTake: false,
        message: "This quiz has not been published yet. Please contact your instructor for more information."
      };
    }
    
    if (untilDate && now > untilDate) {
      return { 
        status: "Quiz Not Available", 
        color: "danger", 
        canTake: false,
        message: "This quiz is no longer available. The due date has passed. Please contact instructor of the course."
      };
    }
    
    if (availableDate && now < availableDate) {
      return { 
        status: "Quiz Not Available", 
        color: "warning", 
        canTake: false,
        message: `This quiz will be available starting ${availableDate.toLocaleDateString()} at ${availableDate.toLocaleTimeString()}.`
      };
    }
    
    return { status: "Available", color: "success", canTake: true, message: "" };
  };

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      if (qid) {
        try {
          const quiz = await quizzesClient.fetchQuiz(qid);
          dispatch(setCurrentQuiz(quiz));
          
          // Check quiz availability first (we need to pass the quiz since currentQuiz might not be set yet)
          const availability = getQuizAvailabilityStatus(quiz);
          
          // Check if student has previous attempts
          const latestAttemptData = await quizzesClient.getLatestAttemptForStudent(qid);
          setLatestAttempt(latestAttemptData);
          
          if (latestAttemptData) {
            // Check if student can take quiz again
            const canTake = checkCanTakeQuiz(quiz, latestAttemptData);
            setCanTakeQuiz(canTake);
            setAttemptNumber(latestAttemptData.attemptNumber + 1);
            
            if (!canTake) {
              // Show results of latest attempt
              setIsViewingResults(true);
              setQuizResult({
                totalQuestions: quiz.questions.length,
                correctAnswers: latestAttemptData.answers.filter((a: any) => a.isCorrect).length,
                score: Math.round((latestAttemptData.score / latestAttemptData.totalPoints) * 100),
                answers: latestAttemptData.answers.map((a: any) => ({
                  questionId: a.questionId,
                  userAnswer: a.answer,
                  isCorrect: a.isCorrect,
                  correctAnswer: getCorrectAnswer(quiz.questions.find((q: any) => q._id === a.questionId))
                }))
              });
            }
          }
          
          // Only initialize answers if quiz is available and student can take it
          if (availability.canTake && (!latestAttemptData || checkCanTakeQuiz(quiz, latestAttemptData))) {
            const initialAnswers = quiz.questions?.map((question: any) => ({
              questionId: question._id,
              answer: null,
              selectedChoices: []
            })) || [];
            setAnswers(initialAnswers);
            setStartTime(new Date());
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizAndAttempts();
  }, [qid, dispatch]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, answer } : a
    ));
  };

  const handleChoiceChange = (questionId: string, choiceIndex: number, isSelected: boolean) => {
    setAnswers(prev => prev.map(a => {
      if (a.questionId === questionId) {
        const newSelectedChoices = [...(a.selectedChoices || [])];
        if (isSelected) {
          // For multiple choice, only one can be selected
          return { ...a, selectedChoices: [choiceIndex.toString()] };
        } else {
          return { ...a, selectedChoices: newSelectedChoices.filter(c => c !== choiceIndex.toString()) };
        }
      }
      return a;
    }));
  };

  const handleSaveQuiz = () => {
    // Save current progress (in a real app, this would save to the server)
    setLastSaved(new Date());
    console.log("Quiz progress saved:", answers);
  };

  const calculateScore = () => {
    if (!currentQuiz?.questions) return null;

    let correctCount = 0;
    const totalQuestions = currentQuiz.questions.length;

    const resultAnswers: QuestionResult[] = currentQuiz.questions.map((question: any) => {
      const userAnswer = answers.find(a => a.questionId === question._id);
      let isCorrect = false;

      if (question.type === "Multiple Choice") {
        const selectedChoiceIndex = userAnswer?.selectedChoices?.[0];
        if (selectedChoiceIndex !== undefined) {
          const selectedChoice = question.choices?.[parseInt(selectedChoiceIndex)];
          isCorrect = selectedChoice?.isCorrect || false;
        }
      } else if (question.type === "True/False") {
        isCorrect = userAnswer?.answer === question.answer;
      } else if (question.type === "Fill in the Blank") {
        const userAnswerText = userAnswer?.answer?.toLowerCase()?.trim();
        isCorrect = question.correctAnswers?.some((correct: string) => 
          correct.toLowerCase().trim() === userAnswerText
        ) || false;
      }

      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        userAnswer: userAnswer?.answer || userAnswer?.selectedChoices,
        isCorrect,
        correctAnswer: question.type === "Multiple Choice" 
          ? question.choices?.find((c: any) => c.isCorrect)?.text
          : question.type === "True/False" 
          ? question.answer?.toString()
          : question.correctAnswers?.join(", ")
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers: correctCount,
      score,
      answers: resultAnswers
    };
  };

  const handleSubmitQuiz = async () => {
    try {
      // Prepare answers for submission
      const submissionAnswers = answers.map(answer => ({
        questionId: answer.questionId,
        answer: answer.answer || (answer.selectedChoices && answer.selectedChoices.length > 0 ? 
          currentQuiz.questions.find((q: any) => q._id === answer.questionId)?.choices?.[parseInt(answer.selectedChoices[0])]?.text : null)
      })).filter(a => a.answer !== null);

      // Submit to server
      const attempt = await quizzesClient.submitQuizAttempt(qid!, submissionAnswers);
      
      // Calculate and display results
      const result = {
        totalQuestions: currentQuiz.questions.length,
        correctAnswers: attempt.answers.filter((a: any) => a.isCorrect).length,
        score: Math.round((attempt.score / attempt.totalPoints) * 100),
        answers: attempt.answers.map((a: any) => ({
          questionId: a.questionId,
          userAnswer: a.answer,
          isCorrect: a.isCorrect,
          correctAnswer: getCorrectAnswer(currentQuiz.questions.find((q: any) => q._id === a.questionId))
        }))
      };
      
      setQuizResult(result);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return <div className="p-4">Loading quiz...</div>;
  }

  if (!currentQuiz) {
    return <div className="p-4">Quiz not found.</div>;
  }

  if (!isStudent) {
    return <div className="p-4">Access denied. Only students can take quizzes.</div>;
  }

  const handleTakeNewAttempt = () => {
    setIsViewingResults(false);
    setIsCompleted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setLastSaved(null);
    
    // Initialize answers for new attempt
    const initialAnswers = currentQuiz.questions?.map((question: any) => ({
      questionId: question._id,
      answer: null,
      selectedChoices: []
    })) || [];
    setAnswers(initialAnswers);
    setStartTime(new Date());
  };

  // Show quiz overview if student has attempts but isn't currently taking quiz
  if (latestAttempt && !isViewingResults && !startTime) {
    const availability = getQuizAvailabilityStatus();
    
    return (
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Header */}
          <div className="mb-4">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
              ← Back to Quizzes
            </Link>
          </div>

          {/* Quiz Title */}
          <h2 className="mb-4">{currentQuiz.title}</h2>

          {/* Quiz Availability Status */}
          {!availability.canTake ? (
            <Alert variant={availability.color} className="mb-4">
              <h4 className="text-center mb-3">Cannot Take Quiz</h4>
              <h5 className="text-center mb-3">{availability.status}</h5>
              <p className="text-center mb-0">{availability.message}</p>
            </Alert>
          ) : (
            <Alert variant={availability.color} className="text-center mb-4">
              <h5 className="mb-0">{availability.status}</h5>
            </Alert>
          )}

          {/* Latest Score */}
          <Alert variant="info" className="text-center mb-4">
            <h5>Your Latest Score: {latestAttempt.score}/{latestAttempt.totalPoints}</h5>
            <p className="mb-0">Attempt {latestAttempt.attemptNumber}</p>
          </Alert>

          {/* Quiz Info */}
          <div className="text-center mb-4">
            <p><strong>Points:</strong> {currentQuiz.points}</p>
            {currentQuiz.timeLimit && <p><strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes</p>}
            <p><strong>Questions:</strong> {currentQuiz.questions?.length || 0}</p>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            {canTakeQuiz && availability.canTake && (
              <Button variant="success" onClick={handleTakeNewAttempt} className="me-3" size="lg">
                New Attempt
              </Button>
            )}
            <Button variant="outline-primary" onClick={() => setIsViewingResults(true)} size="lg">
              View Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results if completed or viewing previous results
  if ((isCompleted || isViewingResults) && quizResult) {
    return (
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Header */}
          <div className="mb-4">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
              ← Back to Quiz Details
            </Link>
          </div>

          {/* Quiz Title */}
          <h2 className="mb-3">{currentQuiz.title} - Results</h2>
          
          {/* Attempt Info */}
          {latestAttempt && (
            <Alert variant="info" className="mb-3">
              <strong>Attempt {latestAttempt.attemptNumber}</strong> - Submitted on {new Date(latestAttempt.submittedAt).toLocaleString()}
              {currentQuiz.multipleAttempts && canTakeQuiz && (
                <span> | You can take {currentQuiz.howManyAttempts - latestAttempt.attemptNumber} more attempt(s)</span>
              )}
            </Alert>
          )}

          {/* Score Summary */}
          <Card className="mb-4">
            <Card.Body>
              <h4>Quiz Results</h4>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h2 className="text-primary">{quizResult.score}%</h2>
                    <p className="text-muted">Final Score</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h2 className="text-success">{quizResult.correctAnswers}</h2>
                    <p className="text-muted">Correct</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h2 className="text-danger">{quizResult.totalQuestions - quizResult.correctAnswers}</h2>
                    <p className="text-muted">Incorrect</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h2>{quizResult.totalQuestions}</h2>
                    <p className="text-muted">Total Questions</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Question Results */}
          <h4 className="mb-3">Question Results</h4>
          {currentQuiz.questions?.map((question: any, index: number) => {
            const result = quizResult.answers.find((a: QuestionResult) => a.questionId === question._id);
            return (
              <Card key={question._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 style={{ color: result?.isCorrect ? "#28a745" : "#dc3545" }}>
                      {result?.isCorrect ? <FaCheck className="me-2" /> : <FaTimes className="me-2" />}
                      Question {index + 1}{question.title ? `: ${question.title}` : ''}
                    </h6>
                    <Badge bg={result?.isCorrect ? "success" : "danger"}>
                      {question.points} pts
                    </Badge>
                  </div>
                  
                  <p className="mb-3">{question.questionText}</p>
                  
                  {question.type === "Multiple Choice" && (
                    <div>
                      <p><strong>Your Answer:</strong> {
                        result?.userAnswer?.[0] !== undefined 
                          ? question.choices?.[parseInt(result.userAnswer[0])]?.text || "No answer"
                          : "No answer"
                      }</p>
                      <p><strong>Correct Answer:</strong> <span className="text-success">{result?.correctAnswer}</span></p>
                    </div>
                  )}
                  
                  {question.type === "True/False" && (
                    <div>
                      <p><strong>Your Answer:</strong> {result?.userAnswer?.toString() || "No answer"}</p>
                      <p><strong>Correct Answer:</strong> <span className="text-success">{result?.correctAnswer}</span></p>
                    </div>
                  )}
                  
                  {question.type === "Fill in the Blank" && (
                    <div>
                      <p><strong>Your Answer:</strong> {result?.userAnswer || "No answer"}</p>
                      <p><strong>Correct Answer(s):</strong> <span className="text-success">{result?.correctAnswer}</span></p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}

          {/* Action Buttons */}
          <div className="text-center mt-4">
            {canTakeQuiz && currentQuiz.multipleAttempts && !isCompleted && (
              <Button variant="success" onClick={handleTakeNewAttempt} className="me-3">
                Take New Attempt
              </Button>
            )}
            <Button variant="primary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz overview for first-time visitors (no attempts yet)
  if (!latestAttempt && !startTime) {
    const availability = getQuizAvailabilityStatus();
    
    return (
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Header */}
          <div className="mb-4">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
              ← Back to Quizzes
            </Link>
          </div>

          {/* Quiz Title */}
          <h2 className="mb-4">{currentQuiz.title}</h2>

          {/* Quiz Availability Status */}
          {!availability.canTake ? (
            <Alert variant={availability.color} className="mb-4">
              <h4 className="text-center mb-3">Cannot Take Quiz</h4>
              <h5 className="text-center mb-3">{availability.status}</h5>
              <p className="text-center mb-0">{availability.message}</p>
            </Alert>
          ) : (
            <Alert variant={availability.color} className="text-center mb-4">
              <h5 className="mb-0">{availability.status}</h5>
            </Alert>
          )}

          {/* Quiz Info */}
          <div className="text-center mb-4">
            <p><strong>Points:</strong> {currentQuiz.points}</p>
            {currentQuiz.timeLimit && <p><strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes</p>}
            <p><strong>Questions:</strong> {currentQuiz.questions?.length || 0}</p>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            {availability.canTake && (
              <Button variant="success" onClick={handleTakeNewAttempt} size="lg">
                Start Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If student can't take quiz, show message
  if (!canTakeQuiz && !isViewingResults) {
    return (
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <div className="mb-4">
            <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
              ← Back to Quiz Details
            </Link>
          </div>
          
          <h2 className="mb-3">{currentQuiz.title}</h2>
          
          <Alert variant="warning">
            <h5>Quiz Attempts Exhausted</h5>
            <p>
              You have completed all allowed attempts for this quiz. 
              {currentQuiz.multipleAttempts 
                ? ` You were allowed ${currentQuiz.howManyAttempts} attempts.`
                : " This quiz only allows one attempt."
              }
            </p>
            <p>
              <strong>Your latest score:</strong> {latestAttempt ? Math.round((latestAttempt.score / latestAttempt.totalPoints) * 100) : 0}%
            </p>
          </Alert>
          
          <div className="text-center">
            <Button variant="primary" onClick={() => setIsViewingResults(true)}>
              View Your Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions?.[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?._id);

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div className="mb-4">
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
            ← Back to Quiz Details
          </Link>
        </div>

        {/* Quiz Title */}
        <h2 className="mb-3">{currentQuiz.title}</h2>

        {/* Quiz Instructions */}
        <div className="mb-4">
          <p className="text-muted">Started: {startTime?.toLocaleString()}</p>
          <h4>Quiz Instructions</h4>
          {latestAttempt && (
            <Alert variant="info">
              <strong>Attempt {attemptNumber}</strong>
              {currentQuiz.multipleAttempts && (
                <span> of {currentQuiz.howManyAttempts} allowed attempts</span>
              )}
            </Alert>
          )}
        </div>

        {/* Question */}
        {currentQuestion && (
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Question {currentQuestionIndex + 1}</span>
              <Badge bg="secondary">{currentQuestion.points} pts</Badge>
            </Card.Header>
            <Card.Body>
              <p className="mb-3">{currentQuestion.questionText}</p>
              
              {/* Multiple Choice */}
              {currentQuestion.type === "Multiple Choice" && (
                <div>
                  {currentQuestion.choices?.map((choice: any, index: number) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`choice-${index}`}
                      label={choice.text}
                      name={`question-${currentQuestion._id}`}
                      checked={currentAnswer?.selectedChoices?.includes(index.toString())}
                      onChange={(e) => handleChoiceChange(currentQuestion._id, index, e.target.checked)}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}
              
              {/* True/False */}
              {currentQuestion.type === "True/False" && (
                <div>
                  <Form.Check
                    type="radio"
                    id="true-option"
                    label="True"
                    name={`question-${currentQuestion._id}`}
                    checked={currentAnswer?.answer === true}
                    onChange={() => handleAnswerChange(currentQuestion._id, true)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="false-option"
                    label="False"
                    name={`question-${currentQuestion._id}`}
                    checked={currentAnswer?.answer === false}
                    onChange={() => handleAnswerChange(currentQuestion._id, false)}
                    className="mb-2"
                  />
                </div>
              )}
              
              {/* Fill in the Blank */}
              {currentQuestion.type === "Fill in the Blank" && (
                <Form.Control
                  type="text"
                  placeholder="Enter your answer"
                  value={currentAnswer?.answer || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                />
              )}
            </Card.Body>
          </Card>
        )}

        {/* Navigation */}
        <div className="d-flex justify-content-between align-items-center">
          {currentQuestionIndex > 0 ? (
            <Button 
              variant="outline-secondary" 
              onClick={handlePreviousQuestion}
            >
              <FaArrowLeft className="me-1" />
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          <span className="text-muted">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions?.length || 0}
          </span>
          
          {currentQuestionIndex === (currentQuiz.questions?.length || 0) - 1 ? (
            <Button variant="success" onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNextQuestion}>
              Next
              <FaArrowRight className="ms-1" />
            </Button>
          )}
        </div>

        {/* Save Status and Save Quiz */}
        <div className="mt-4">
          {/* Save Status */}
          <div className="text-center mb-3" style={{ 
            border: "1px solid #dee2e6", 
            padding: "15px", 
            backgroundColor: "#f8f9fa",
            borderRadius: "4px"
          }}>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {lastSaved ? `Quiz saved at ${lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : "Not saved yet"}
            </span>
          </div>
          
          {/* Save Quiz Button */}
          <div className="text-center">
            <Button 
              variant="outline-primary" 
              onClick={handleSaveQuiz}
              style={{ padding: "8px 20px" }}
            >
              <FaSave className="me-2" />
              Save Quiz
            </Button>
          </div>
        </div>

        {/* Questions Navigation */}
        <div className="mt-4 p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
          <h6 className="mb-3">Questions</h6>
          <div>
            {currentQuiz.questions?.map((question: any, index: number) => (
              <div key={index} className="mb-2">
                <Button
                  variant={currentQuestionIndex === index ? "danger" : "link"}
                  onClick={() => setCurrentQuestionIndex(index)}
                  style={{
                    textDecoration: "none",
                    color: currentQuestionIndex === index ? "white" : "#dc3545",
                    padding: "2px 8px",
                    fontSize: "14px"
                  }}
                >
                  Question {index + 1}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
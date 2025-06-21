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

  const { currentQuiz } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isStudent = currentUser && currentUser.role === "STUDENT";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        try {
          const quiz = await quizzesClient.fetchQuiz(qid);
          dispatch(setCurrentQuiz(quiz));
          
          // Initialize answers array
          const initialAnswers = quiz.questions?.map((question: any) => ({
            questionId: question._id,
            answer: null,
            selectedChoices: []
          })) || [];
          setAnswers(initialAnswers);
          setStartTime(new Date());
        } catch (error) {
          console.error("Error fetching quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
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

  const handleSubmitQuiz = () => {
    const result = calculateScore();
    setQuizResult(result);
    setIsCompleted(true);
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

  if (isCompleted && quizResult) {
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
                    <h6>Question {index + 1}{question.title ? `: ${question.title}` : ''}</h6>
                    <Badge bg={result?.isCorrect ? "success" : "danger"}>
                      {result?.isCorrect ? <FaCheck /> : <FaTimes />} {question.points} pts
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
            <Button variant="primary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
              Back to Quizzes
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
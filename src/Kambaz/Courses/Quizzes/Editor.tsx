import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Card, Row, Col, Nav, Tab, Alert, Modal } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz, addQuiz, updateQuiz, setQuizzes } from "./reducer";
import * as quizzesClient from "./client";
import { formatDateForInput, parseLocalDateTime } from "./dateUtils";

interface Question {
  _id: string;
  type: "Multiple Choice" | "True/False" | "Fill in the Blank";
  title: string;
  points: number;
  questionText: string;
  choices?: { text: string; isCorrect: boolean }[];
  answer?: boolean;
  correctAnswers?: string[];
  isEditing?: boolean; // For inline editing state
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // More robust check for new quiz using React Router location
  const isNew = qid === "new" || location.pathname.includes("/new");
  
  // Debug URL params on component mount
  console.log("=== QUIZ EDITOR MOUNT DEBUG ===");
  console.log("Current URL:", window.location.href);
  console.log("React Router pathname:", location.pathname);
  console.log("useParams result:", { cid, qid });
  console.log("isNew calculated:", isNew);

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>({
    title: "New Quiz",
    description: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    published: false,
    dueDate: "",
    availableDate: "",
    untilDate: "",
    questions: [],
    course: cid
  });



  useEffect(() => {
    if (!isNew && qid) {
      const fetchQuiz = async () => {
        try {
          const fetchedQuiz = await quizzesClient.fetchQuiz(qid);
          setQuiz(fetchedQuiz);
          dispatch(setCurrentQuiz(fetchedQuiz));
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      };
      fetchQuiz();
    }
  }, [qid, isNew, dispatch]);

  const refreshQuizList = async () => {
    try {
      console.log("Refreshing quiz list for course:", cid);
      const quizzes = await quizzesClient.fetchQuizzesForCourse(cid!);
      console.log("Refreshed quizzes:", quizzes);
      dispatch(setQuizzes(quizzes));
    } catch (error) {
      console.error("Error refreshing quiz list:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("=== QUIZ SAVE DEBUG ===");
      console.log("Is new quiz:", isNew);
      console.log("Course ID:", cid);
      console.log("Quiz ID:", qid);
      console.log("Quiz data:", quiz);
      console.log("Quiz points value:", quiz.points);
      console.log("Quiz points type:", typeof quiz.points);
      console.log("REMOTE_SERVER:", import.meta.env.VITE_REMOTE_SERVER);
      
      if (isNew) {
        console.log("Creating new quiz...");
        const newQuiz = await quizzesClient.createQuizForCourse(cid!, quiz);
        console.log("New quiz created:", newQuiz);
        dispatch(addQuiz(newQuiz));
        await refreshQuizList(); // Refresh the quiz list to ensure latest data
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        console.log("Updating existing quiz...");
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quiz);
        console.log("Quiz updated:", updatedQuiz);
        console.log("Updated quiz points:", updatedQuiz.points);
        dispatch(updateQuiz({ quizId: qid!, updates: updatedQuiz }));
        // Also update the current quiz in Redux store
        dispatch(setCurrentQuiz(updatedQuiz));
        console.log("Redux update dispatched with points:", updatedQuiz.points);
        await refreshQuizList(); // Refresh the quiz list to ensure latest data
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (error: any) {
      console.error("=== QUIZ SAVE ERROR ===");
      console.error("Error details:", error);
      console.error("Error response:", error.response);
      alert(`Error saving quiz: ${error.message || "Unknown error occurred"}`);
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      console.log("=== QUIZ SAVE & PUBLISH DEBUG ===");
      console.log("Is new quiz:", isNew);
      console.log("Course ID:", cid);
      console.log("Quiz ID:", qid);
      console.log("qid === 'new':", qid === "new");
      console.log("typeof qid:", typeof qid);
      console.log("Current URL params:", { cid, qid });
      
      const publishedQuiz = { ...quiz, published: true };
      console.log("Published quiz data:", publishedQuiz);
      
      if (isNew) {
        console.log("Creating and publishing new quiz...");
        const newQuiz = await quizzesClient.createQuizForCourse(cid!, publishedQuiz);
        console.log("New quiz created and published:", newQuiz);
        dispatch(addQuiz(newQuiz));
      } else {
        console.log("Updating and publishing existing quiz...");
        console.log("Attempting to update quiz with ID:", qid);
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, publishedQuiz);
        console.log("Quiz updated and published:", updatedQuiz);
        dispatch(updateQuiz({ quizId: qid!, updates: updatedQuiz }));
        dispatch(setCurrentQuiz(updatedQuiz));
      }
      await refreshQuizList(); // Refresh the quiz list to ensure latest data
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (error: any) {
      console.error("=== QUIZ SAVE & PUBLISH ERROR ===");
      console.error("Error details:", error);
      console.error("Error response:", error.response);
      alert(`Error saving and publishing quiz: ${error.message || "Unknown error occurred"}`);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      _id: new Date().getTime().toString(),
      type: "Multiple Choice" as const,
      title: "New Question",
      points: 1,
      questionText: "Enter your question text here",
      choices: [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false }
      ],
      isEditing: true // Add editing state flag
    };
    
    // Add question to the list in edit mode
    const questions = [...quiz.questions, newQuestion];
    setQuiz({ ...quiz, questions });
  };

  const editQuestion = (question: Question) => {
    // Toggle editing state for inline editing
    const questions = quiz.questions.map((q: Question) => 
      q._id === question._id ? { ...q, isEditing: true } : { ...q, isEditing: false }
    );
    setQuiz({ ...quiz, questions });
  };

  const cancelEditQuestion = (questionId: string) => {
    // If this is a new question (no saved version), remove it
    const questions = quiz.questions.filter((q: Question) => {
      if (q._id === questionId && q.questionText === "Enter your question text here") {
        return false; // Remove new unsaved questions
      }
      return true;
    }).map((q: Question) => ({ ...q, isEditing: false }));
    
    setQuiz({ ...quiz, questions });
  };

  const saveQuestionEdit = (questionId: string) => {
    const questions = quiz.questions.map((q: Question) => 
      q._id === questionId ? { ...q, isEditing: false } : q
    );
    setQuiz({ ...quiz, questions });
  };

  const updateQuestionField = (questionId: string, field: string, value: any) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId) {
        const updatedQuestion = { ...q, [field]: value };
        
        // Handle question type changes - set appropriate defaults
        if (field === 'type') {
          if (value === 'Multiple Choice') {
            updatedQuestion.choices = updatedQuestion.choices || [
              { text: "Option 1", isCorrect: true },
              { text: "Option 2", isCorrect: false },
              { text: "Option 3", isCorrect: false },
              { text: "Option 4", isCorrect: false }
            ];
            delete updatedQuestion.answer;
            delete updatedQuestion.correctAnswers;
          } else if (value === 'True/False') {
            updatedQuestion.answer = true;
            delete updatedQuestion.choices;
            delete updatedQuestion.correctAnswers;
          } else if (value === 'Fill in the Blank') {
            updatedQuestion.correctAnswers = ['Answer'];
            delete updatedQuestion.choices;
            delete updatedQuestion.answer;
          }
        }
        
        return updatedQuestion;
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const updateCorrectChoice = (questionId: string, correctIndex: number) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.choices) {
        const newChoices = q.choices.map((choice: any, index: number) => ({
          ...choice,
          isCorrect: index === correctIndex
        }));
        return { ...q, choices: newChoices };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const updateChoiceText = (questionId: string, choiceIndex: number, text: string) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.choices) {
        const newChoices = [...q.choices];
        newChoices[choiceIndex] = { ...newChoices[choiceIndex], text };
        return { ...q, choices: newChoices };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const calculateTotalPoints = () => {
    return quiz.questions.reduce((total: number, question: Question) => total + (question.points || 0), 0);
  };



  const deleteQuestion = (questionId: string) => {
    const questions = quiz.questions.filter((q: Question) => q._id !== questionId);
    setQuiz({ ...quiz, questions });
  };



  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isNew ? "Create New Quiz" : "Edit Quiz"}</h2>
        <div>
          <Button variant="outline-secondary" onClick={handleCancel} className="me-2">
            Cancel
          </Button>
          <Button variant="outline-primary" onClick={handleSave} className="me-2">
            <FaSave className="me-1" />
            Save
          </Button>
          <Button variant="success" onClick={handleSaveAndPublish}>
            <FaSave className="me-1" />
            Save & Publish
          </Button>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || "details")}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <Card>
              <Card.Header>
                <h5>Quiz Details</h5>
              </Card.Header>
              <Card.Body>
                {/* Title and Description - Full Width */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={quiz.title}
                        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        placeholder="Enter quiz title"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={quiz.description}
                        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                        placeholder="Enter quiz description (optional)"
                      />
                      <Form.Text className="text-muted">
                        Provide instructions or context for students taking this quiz
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Quiz Settings - Two Columns */}
                <Row>
                  <Col md={6}>

                    <Form.Group className="mb-3">
                      <Form.Label>Quiz Type</Form.Label>
                      <Form.Select
                        value={quiz.quizType}
                        onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                      >
                        <option value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Assignment Group</Form.Label>
                      <Form.Select
                        value={quiz.assignmentGroup}
                        onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                      >
                        <option value="QUIZZES">Quizzes</option>
                        <option value="EXAMS">Exams</option>
                        <option value="ASSIGNMENTS">Assignments</option>
                        <option value="PROJECT">Project</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Time Limit (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Points</Form.Label>
                      <Form.Control
                        type="number"
                        value={quiz.points !== undefined ? quiz.points : 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === '' ? 0 : parseInt(value, 10);
                          const finalValue = isNaN(numValue) ? 0 : numValue;
                          console.log(`Points changed: ${value} -> ${finalValue}`);
                          setQuiz({ ...quiz, points: finalValue });
                        }}
                        min="0"
                        placeholder="Enter total points"
                      />
                      <Form.Text className="text-muted">
                        The sum of the points of all questions in the quiz
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Show Correct Answers</Form.Label>
                      <Form.Select
                        value={quiz.showCorrectAnswers}
                        onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="After due date">After due date</option>
                        <option value="Never">Never</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Access Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={quiz.accessCode}
                        onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                        placeholder="Leave blank if no access code required"
                      />
                      <Form.Text className="text-muted">
                        Optional passcode students need to enter to access the quiz
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formatDateForInput(quiz.dueDate)}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log("Due date changed:", value);
                          // 将datetime-local值转换为正确的Date对象
                          const localDate = parseLocalDateTime(value);
                          console.log("Due date parsed:", localDate);
                          // 保存ISO字符串到状态中
                          setQuiz({ ...quiz, dueDate: localDate ? localDate.toISOString() : "" });
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Available Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formatDateForInput(quiz.availableDate)}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log("Available date changed:", value);
                          const localDate = parseLocalDateTime(value);
                          console.log("Available date parsed:", localDate);
                          setQuiz({ ...quiz, availableDate: localDate ? localDate.toISOString() : "" });
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Until Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formatDateForInput(quiz.untilDate)}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log("Until date changed:", value);
                          const localDate = parseLocalDateTime(value);
                          console.log("Until date parsed:", localDate);
                          setQuiz({ ...quiz, untilDate: localDate ? localDate.toISOString() : "" });
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Shuffle Answers"
                        checked={quiz.shuffleAnswers}
                        onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Multiple Attempts"
                        checked={quiz.multipleAttempts}
                        onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                      />
                    </Form.Group>

                    {quiz.multipleAttempts && (
                      <Form.Group className="mb-3">
                        <Form.Label>How Many Attempts</Form.Label>
                        <Form.Control
                          type="number"
                          value={quiz.howManyAttempts}
                          onChange={(e) => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) })}
                        />
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="One Question at a Time"
                        checked={quiz.oneQuestionAtATime}
                        onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Webcam Required"
                        checked={quiz.webcamRequired}
                        onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Lock Questions After Answering"
                        checked={quiz.lockQuestionsAfterAnswering}
                        onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="questions">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Questions</h5>
                <Button variant="primary" onClick={addNewQuestion}>
                  <FaPlus className="me-1" />
                  New Question
                </Button>
              </Card.Header>
              <Card.Body>
                {quiz.questions.length === 0 ? (
                  <Alert variant="info">
                    No questions added yet. Click "New Question" to add your first question.
                  </Alert>
                ) : (
                  <div>
                    {quiz.questions.map((question: Question, index: number) => (
                      <Card key={question._id} className="mb-3" style={{ border: question.isEditing ? "2px solid #0d6efd" : "1px solid #dee2e6" }}>
                        <Card.Body>
                          {question.isEditing ? (
                            // Edit Mode
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6>Question {index + 1}</h6>
                                <div>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => cancelEditQuestion(question._id)}
                                    className="me-2"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => saveQuestionEdit(question._id)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                              
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Question Type</Form.Label>
                                    <Form.Select
                                      value={question.type}
                                      onChange={(e) => updateQuestionField(question._id, 'type', e.target.value)}
                                    >
                                      <option value="Multiple Choice">Multiple Choice</option>
                                      <option value="True/False">True/False</option>
                                      <option value="Fill in the Blank">Fill in the Blank</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Points</Form.Label>
                                    <Form.Control
                                      type="number"
                                      value={question.points}
                                      onChange={(e) => updateQuestionField(question._id, 'points', parseInt(e.target.value) || 0)}
                                      min="0"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mb-3">
                                <Form.Label>Question Text</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={question.questionText}
                                  onChange={(e) => updateQuestionField(question._id, 'questionText', e.target.value)}
                                />
                              </Form.Group>

                              {question.type === "Multiple Choice" && (
                                <div>
                                  <Form.Label>Answer Choices</Form.Label>
                                  {question.choices?.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="d-flex mb-2">
                                      <Form.Check
                                        type="radio"
                                        name={`correctAnswer-${question._id}`}
                                        checked={choice.isCorrect}
                                        onChange={() => updateCorrectChoice(question._id, choiceIndex)}
                                        className="me-2"
                                      />
                                      <Form.Control
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) => updateChoiceText(question._id, choiceIndex, e.target.value)}
                                        placeholder={`Choice ${choiceIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {question.type === "True/False" && (
                                <Form.Group className="mb-3">
                                  <Form.Label>Correct Answer</Form.Label>
                                  <div>
                                    <Form.Check
                                      type="radio"
                                      label="True"
                                      name={`trueFalseAnswer-${question._id}`}
                                      checked={question.answer === true}
                                      onChange={() => updateQuestionField(question._id, 'answer', true)}
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="False"
                                      name={`trueFalseAnswer-${question._id}`}
                                      checked={question.answer === false}
                                      onChange={() => updateQuestionField(question._id, 'answer', false)}
                                    />
                                  </div>
                                </Form.Group>
                              )}

                              {question.type === "Fill in the Blank" && (
                                <Form.Group className="mb-3">
                                  <Form.Label>Correct Answers (one per line)</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={question.correctAnswers?.join('\n') || ''}
                                    onChange={(e) => updateQuestionField(question._id, 'correctAnswers', e.target.value.split('\n').filter(line => line.trim()))}
                                    placeholder="Enter possible correct answers, one per line"
                                  />
                                  <Form.Text className="text-muted">
                                    Multiple correct answers are supported (case-insensitive matching)
                                  </Form.Text>
                                </Form.Group>
                              )}
                            </div>
                          ) : (
                            // Preview Mode
                            <div>
                              <div className="d-flex justify-content-between align-items-start">
                                <div style={{ flex: 1 }}>
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6>Question {index + 1}</h6>
                                    <span className="badge bg-secondary">{question.points} pts</span>
                                  </div>
                                  <p className="text-muted mb-2">{question.type}</p>
                                  <p className="mb-3">{question.questionText}</p>
                                  
                                  {question.type === "Multiple Choice" && (
                                    <div className="mb-3">
                                      {question.choices?.map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className="d-flex align-items-center mb-1">
                                          <span className="me-2" style={{ color: choice.isCorrect ? "green" : "black" }}>
                                            {choice.isCorrect ? "●" : "○"}
                                          </span>
                                          <span style={{ color: choice.isCorrect ? "green" : "black" }}>
                                            {choice.text}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {question.type === "True/False" && (
                                    <div className="mb-3">
                                      <span style={{ color: "green" }}>
                                        Correct Answer: {question.answer ? "True" : "False"}
                                      </span>
                                    </div>
                                  )}

                                  {question.type === "Fill in the Blank" && (
                                    <div className="mb-3">
                                      <strong>Acceptable Answers:</strong>
                                      <ul className="mb-0">
                                        {question.correctAnswers?.map((answer, answerIndex) => (
                                          <li key={answerIndex}>{answer}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                <div className="ms-3">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => editQuestion(question)}
                                    className="me-2"
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteQuestion(question._id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                    <div className="text-center mt-3">
                      <strong>Total Points: {calculateTotalPoints()}</strong>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>


    </div>
  );
} 
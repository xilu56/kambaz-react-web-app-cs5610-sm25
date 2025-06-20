import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Card, Row, Col, Nav, Tab, Alert, Modal } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz, addQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";

interface Question {
  _id: string;
  type: "Multiple Choice" | "True/False" | "Fill in the Blank";
  title: string;
  points: number;
  questionText: string;
  choices?: { text: string; isCorrect: boolean }[];
  answer?: boolean;
  correctAnswers?: string[];
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
    points: 10,
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

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

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

  const handleSave = async () => {
    try {
      console.log("=== QUIZ SAVE DEBUG ===");
      console.log("Is new quiz:", isNew);
      console.log("Course ID:", cid);
      console.log("Quiz ID:", qid);
      console.log("Quiz data:", quiz);
      console.log("REMOTE_SERVER:", import.meta.env.VITE_REMOTE_SERVER);
      
      if (isNew) {
        console.log("Creating new quiz...");
        const newQuiz = await quizzesClient.createQuizForCourse(cid!, quiz);
        console.log("New quiz created:", newQuiz);
        dispatch(addQuiz(newQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else {
        console.log("Updating existing quiz...");
        const updatedQuiz = await quizzesClient.updateQuiz(qid!, quiz);
        console.log("Quiz updated:", updatedQuiz);
        dispatch(updateQuiz({ quizId: qid!, updates: quiz }));
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
        await quizzesClient.updateQuiz(qid!, publishedQuiz);
        console.log("Quiz updated and published");
        dispatch(updateQuiz({ quizId: qid!, updates: publishedQuiz }));
      }
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
    setEditingQuestion({
      _id: new Date().getTime().toString(),
      type: "Multiple Choice",
      title: "New Question",
      points: 1,
      questionText: "",
      choices: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ]
    });
    setShowQuestionModal(true);
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setShowQuestionModal(true);
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;

    const questions = [...quiz.questions];
    const existingIndex = questions.findIndex(q => q._id === editingQuestion._id);
    
    if (existingIndex >= 0) {
      questions[existingIndex] = editingQuestion;
    } else {
      questions.push(editingQuestion);
    }

    setQuiz({ ...quiz, questions });
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const deleteQuestion = (questionId: string) => {
    const questions = quiz.questions.filter((q: Question) => q._id !== questionId);
    setQuiz({ ...quiz, questions });
  };

  const formatDateForInput = (date: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
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
                        value={quiz.points || 10}
                        onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) || 0 })}
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
                        onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Available Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formatDateForInput(quiz.availableDate)}
                        onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Until Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formatDateForInput(quiz.untilDate)}
                        onChange={(e) => setQuiz({ ...quiz, untilDate: e.target.value })}
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
                      <Card key={question._id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>Question {index + 1}: {question.title}</h6>
                              <p className="text-muted mb-1">{question.type}</p>
                              <p className="mb-1">{question.questionText}</p>
                              <small className="text-muted">{question.points} points</small>
                            </div>
                            <div>
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
                        </Card.Body>
                      </Card>
                    ))}
                    <div className="text-center mt-3">
                      <strong>Total Points: {quiz.points || 0}</strong>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Question Editor Modal */}
      <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion && quiz.questions.find((q: Question) => q._id === editingQuestion._id) 
              ? "Edit Question" : "New Question"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingQuestion && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question Type</Form.Label>
                <Form.Select
                  value={editingQuestion.type}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    type: e.target.value as "Multiple Choice" | "True/False" | "Fill in the Blank"
                  })}
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Question Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  value={editingQuestion.points}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Question Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                />
              </Form.Group>

              {editingQuestion.type === "Multiple Choice" && (
                <div>
                  <Form.Label>Answer Choices</Form.Label>
                  {editingQuestion.choices?.map((choice, index) => (
                    <div key={index} className="d-flex mb-2">
                      <Form.Check
                        type="radio"
                        name="correctAnswer"
                        checked={choice.isCorrect}
                        onChange={() => {
                          const newChoices = editingQuestion.choices?.map((c, i) => ({
                            ...c,
                            isCorrect: i === index
                          })) || [];
                          setEditingQuestion({ ...editingQuestion, choices: newChoices });
                        }}
                        className="me-2"
                      />
                      <Form.Control
                        type="text"
                        value={choice.text}
                        onChange={(e) => {
                          const newChoices = [...(editingQuestion.choices || [])];
                          newChoices[index].text = e.target.value;
                          setEditingQuestion({ ...editingQuestion, choices: newChoices });
                        }}
                        placeholder={`Choice ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {editingQuestion.type === "True/False" && (
                <Form.Group className="mb-3">
                  <Form.Label>Correct Answer</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="True"
                      name="trueFalseAnswer"
                      checked={editingQuestion.answer === true}
                      onChange={() => setEditingQuestion({ ...editingQuestion, answer: true })}
                    />
                    <Form.Check
                      type="radio"
                      label="False"
                      name="trueFalseAnswer"
                      checked={editingQuestion.answer === false}
                      onChange={() => setEditingQuestion({ ...editingQuestion, answer: false })}
                    />
                  </div>
                </Form.Group>
              )}

              {editingQuestion.type === "Fill in the Blank" && (
                <Form.Group className="mb-3">
                  <Form.Label>Correct Answers (one per line)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editingQuestion.correctAnswers?.join('\n') || ''}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      correctAnswers: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Enter possible correct answers, one per line"
                  />
                  <Form.Text className="text-muted">
                    Multiple correct answers are supported (case-insensitive matching)
                  </Form.Text>
                </Form.Group>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveQuestion}>
            Save Question
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 
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
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]); // Store original state for cancel
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

  const createDefaultQuestion = (type: "Multiple Choice" | "True/False" | "Fill in the Blank") => {
    const baseQuestion = {
      _id: new Date().getTime().toString(),
      isEditing: true
    };

    switch (type) {
      case "Multiple Choice":
        return {
          ...baseQuestion,
          type: "Multiple Choice" as const,
          title: "Easy Question",
          points: 4,
          questionText: "How much is 2 + 2?",
          choices: [
            { text: "4", isCorrect: true },
            { text: "3", isCorrect: false },
            { text: "5", isCorrect: false },
            { text: "7", isCorrect: false }
          ]
        };
      case "True/False":
        return {
          ...baseQuestion,
          type: "True/False" as const,
          title: "Is 2 + 2 = 4?",
          points: 3,
          questionText: "Is it true that 2 + 2 = 4?",
          answer: true
        };
      case "Fill in the Blank":
        return {
          ...baseQuestion,
          type: "Fill in the Blank" as const,
          title: "Fill Question",
          points: 2,
          questionText: "2 + 2 = ____",
          correctAnswers: ["4", "four", "Four"]
        };
      default:
        return baseQuestion;
    }
  };

  const addNewQuestion = () => {
    // Save current state as original before adding new question
    setOriginalQuestions([...quiz.questions]);
    
    const newQuestion = createDefaultQuestion("Multiple Choice");
    
    // Add question to the list in edit mode
    const questions = [...quiz.questions, newQuestion];
    setQuiz({ ...quiz, questions });
  };

  const editQuestion = (question: Question) => {
    // Save original state before editing
    setOriginalQuestions([...quiz.questions]);
    
    // Toggle editing state for inline editing
    const questions = quiz.questions.map((q: Question) => 
      q._id === question._id ? { ...q, isEditing: true } : { ...q, isEditing: false }
    );
    setQuiz({ ...quiz, questions });
  };

  const cancelEditQuestion = (questionId: string) => {
    const questionToCancel = quiz.questions.find((q: Question) => q._id === questionId);
    
    if (questionToCancel) {
      // Check if this is a new question (not in original questions)
      const isNewQuestion = !originalQuestions.some(q => q._id === questionId);
      
      if (isNewQuestion) {
        // Remove new question from list
        const questions = quiz.questions.filter((q: Question) => q._id !== questionId);
        setQuiz({ ...quiz, questions });
      } else {
        // Restore original state for existing question
        const restoredQuestions = originalQuestions.map((q: Question) => ({ ...q, isEditing: false }));
        setQuiz({ ...quiz, questions: restoredQuestions });
      }
    }
    
    // Clear original questions state
    setOriginalQuestions([]);
  };

  const saveQuestionEdit = (questionId: string) => {
    const questions = quiz.questions.map((q: Question) => 
      q._id === questionId ? { ...q, isEditing: false } : q
    );
    setQuiz({ ...quiz, questions });
    
    // Clear original questions state after saving
    setOriginalQuestions([]);
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
            updatedQuestion.points = 3; // Default points for True/False
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

  const addChoice = (questionId: string) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.choices) {
        const newChoices = [...q.choices, { text: "", isCorrect: false }];
        return { ...q, choices: newChoices };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const removeChoice = (questionId: string, choiceIndex: number) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.choices && q.choices.length > 2) {
        const newChoices = q.choices.filter((_, index) => index !== choiceIndex);
        // If we removed the correct answer, make the first choice correct
        if (q.choices[choiceIndex].isCorrect && newChoices.length > 0) {
          newChoices[0].isCorrect = true;
        }
        return { ...q, choices: newChoices };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const addFillAnswer = (questionId: string) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.correctAnswers) {
        const newAnswers = [...q.correctAnswers, ""];
        return { ...q, correctAnswers: newAnswers };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const removeFillAnswer = (questionId: string, answerIndex: number) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.correctAnswers && q.correctAnswers.length > 1) {
        const newAnswers = q.correctAnswers.filter((_, index) => index !== answerIndex);
        return { ...q, correctAnswers: newAnswers };
      }
      return q;
    });
    setQuiz({ ...quiz, questions });
  };

  const updateFillAnswer = (questionId: string, answerIndex: number, value: string) => {
    const questions = quiz.questions.map((q: Question) => {
      if (q._id === questionId && q.correctAnswers) {
        const newAnswers = [...q.correctAnswers];
        newAnswers[answerIndex] = value;
        return { ...q, correctAnswers: newAnswers };
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
                              {/* Question Header */}
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                  <Form.Control
                                    type="text"
                                    value={question.title}
                                    onChange={(e) => updateQuestionField(question._id, 'title', e.target.value)}
                                    placeholder="Enter a title"
                                    className="me-3"
                                    style={{ width: '200px', fontWeight: 'normal' }}
                                  />
                                  <Form.Select
                                    value={question.type}
                                    onChange={(e) => updateQuestionField(question._id, 'type', e.target.value)}
                                    className="me-3"
                                    style={{ width: '180px' }}
                                  >
                                    <option value="Multiple Choice">Multiple Choice</option>
                                    <option value="True/False">True/False</option>
                                    <option value="Fill in the Blank">Fill in the Blank</option>
                                  </Form.Select>
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">pts:</span>
                                    <Form.Control
                                      type="number"
                                      value={question.points}
                                      onChange={(e) => updateQuestionField(question._id, 'points', parseInt(e.target.value) || 0)}
                                      min="0"
                                      style={{ width: '80px' }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Instruction Text */}
                              <p className="text-muted mb-3" style={{ fontSize: '0.9em' }}>
                                {question.type === "Multiple Choice" && "Enter your question and multiple answers, then select the one correct answer."}
                                {question.type === "True/False" && "Enter your question text, then select if True or False is the correct answer."}
                                {question.type === "Fill in the Blank" && "Enter your question text and the correct answers."}
                              </p>

                              {/* Question Section */}
                              <div className="mb-4">
                                <Form.Label><strong>Question:</strong></Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={4}
                                  value={question.questionText}
                                  onChange={(e) => updateQuestionField(question._id, 'questionText', e.target.value)}
                                  placeholder="Enter your question here..."
                                  className="mb-3"
                                />
                              </div>

                              {question.type === "Multiple Choice" && (
                                <div>
                                  <Form.Label className="mb-3">Answers:</Form.Label>
                                  {question.choices?.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="mb-3">
                                      <div className="d-flex align-items-start">
                                        <div className="me-2 mt-1">
                                          <Form.Check
                                            type="radio"
                                            name={`correctAnswer-${question._id}`}
                                            checked={choice.isCorrect}
                                            onChange={() => updateCorrectChoice(question._id, choiceIndex)}
                                            style={{ transform: 'scale(1.2)' }}
                                          />
                                        </div>
                                        <div className="flex-grow-1">
                                          <div className="d-flex align-items-center mb-1">
                                                                                         {choice.isCorrect && (
                                               <span className="badge bg-success me-2">
                                                 → Correct Answer
                                               </span>
                                             )}
                                            <span className="text-muted">Possible Answer</span>
                                            <Button
                                              variant="link"
                                              size="sm"
                                              className="ms-auto text-danger p-0"
                                              onClick={() => removeChoice(question._id, choiceIndex)}
                                              style={{ textDecoration: 'none' }}
                                            >
                                                                                             <FaTrash />
                                            </Button>
                                          </div>
                                          <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={choice.text}
                                            onChange={(e) => updateChoiceText(question._id, choiceIndex, e.target.value)}
                                            placeholder={`Enter answer choice ${choiceIndex + 1}`}
                                            style={{ 
                                              border: choice.isCorrect ? '2px solid #28a745' : '1px solid #ced4da',
                                              backgroundColor: choice.isCorrect ? '#f8fff8' : 'white'
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <Button
                                    variant="link"
                                    className="text-primary p-0 mb-3"
                                    onClick={() => addChoice(question._id)}
                                    style={{ textDecoration: 'none' }}
                                  >
                                                                         <FaPlus /> Add Another Answer
                                  </Button>
                                </div>
                              )}

                              {question.type === "True/False" && (
                                <div>
                                  <Form.Label className="mb-3">Answers:</Form.Label>
                                  
                                  {/* True Option */}
                                  <div className="mb-3">
                                    <div className="d-flex align-items-center mb-1">
                                      {question.answer === true && (
                                        <span className="badge bg-success me-2">
                                          → Correct Answer
                                        </span>
                                      )}
                                      <span className="text-muted">Possible Answer</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Form.Check
                                        type="radio"
                                        name={`trueFalseAnswer-${question._id}`}
                                        checked={question.answer === true}
                                        onChange={() => updateQuestionField(question._id, 'answer', true)}
                                        className="me-2"
                                        style={{ transform: 'scale(1.2)' }}
                                      />
                                      <span style={{ 
                                        color: question.answer === true ? '#28a745' : '#6c757d',
                                        fontWeight: question.answer === true ? 'bold' : 'normal'
                                      }}>
                                        True
                                      </span>
                                    </div>
                                  </div>

                                  {/* False Option */}
                                  <div className="mb-3">
                                    <div className="d-flex align-items-center mb-1">
                                      {question.answer === false && (
                                        <span className="badge bg-success me-2">
                                          → Correct Answer
                                        </span>
                                      )}
                                      <span className="text-muted">Possible Answer</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Form.Check
                                        type="radio"
                                        name={`trueFalseAnswer-${question._id}`}
                                        checked={question.answer === false}
                                        onChange={() => updateQuestionField(question._id, 'answer', false)}
                                        className="me-2"
                                        style={{ transform: 'scale(1.2)' }}
                                      />
                                      <span style={{ 
                                        color: question.answer === false ? '#28a745' : '#6c757d',
                                        fontWeight: question.answer === false ? 'bold' : 'normal'
                                      }}>
                                        False
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {question.type === "Fill in the Blank" && (
                                <div>
                                  <Form.Label className="mb-3">Answers:</Form.Label>
                                  {question.correctAnswers?.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="mb-3">
                                      <div className="d-flex align-items-start">
                                        <div className="flex-grow-1">
                                          <div className="d-flex align-items-center mb-1">
                                            <span className="text-muted">Possible Answer</span>
                                            <Button
                                              variant="link"
                                              size="sm"
                                              className="ms-auto text-danger p-0"
                                              onClick={() => removeFillAnswer(question._id, answerIndex)}
                                              style={{ textDecoration: 'none' }}
                                            >
                                              <FaTrash />
                                            </Button>
                                          </div>
                                          <Form.Control
                                            type="text"
                                            value={answer}
                                            onChange={(e) => updateFillAnswer(question._id, answerIndex, e.target.value)}
                                            placeholder={`Enter possible answer ${answerIndex + 1}`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <Button
                                    variant="link"
                                    className="text-primary p-0 mb-3"
                                    onClick={() => addFillAnswer(question._id)}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    <FaPlus /> Add Another Answer
                                  </Button>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="d-flex justify-content-start mt-4">
                                <Button
                                  variant="outline-secondary"
                                  onClick={() => cancelEditQuestion(question._id)}
                                  className="me-2"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => saveQuestionEdit(question._id)}
                                >
                                  {originalQuestions.some(q => q._id === question._id) ? "Update Question" : "Save"}
                                </Button>
                              </div>
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
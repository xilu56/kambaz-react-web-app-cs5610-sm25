import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/quizzes`);
  return response.data;
};

export const fetchQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/quizzes`);
  return response.data;
};

export const fetchQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const createQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.post(QUIZZES_API, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId: string, quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/courses/${courseId}/quizzes`, quiz);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const findAllQuizzes = async () => {
  const response = await axiosWithCredentials.get(QUIZZES_API);
  return response.data;
};

// Question management
export const addQuestionToQuiz = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestionInQuiz = async (quizId: string, questionId: string, question: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/questions/${questionId}`, question);
  return response.data;
};

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
  return response.data;
};

// Quiz attempts
export const submitQuizAttempt = async (quizId: string, answers: any[]) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`, { answers });
  return response.data;
};

export const getQuizAttemptsForStudent = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};

export const getLatestAttemptForStudent = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
  return response.data;
}; 
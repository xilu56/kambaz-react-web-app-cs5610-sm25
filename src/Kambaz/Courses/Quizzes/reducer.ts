import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [] as any[],
  currentQuiz: null as any,
  currentAttempt: null as any,
  attempts: [] as any[]
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action) => {
      state.quizzes = [...state.quizzes, action.payload];
    },
    deleteQuiz: (state, action) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== action.payload);
    },
    updateQuiz: (state, action) => {
      const { quizId, updates } = action.payload;
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, ...updates } : q
      );
      if (state.currentQuiz && state.currentQuiz._id === quizId) {
        state.currentQuiz = { ...state.currentQuiz, ...updates };
      }
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    // Question management
    addQuestionToQuiz: (state, action) => {
      const { quizId, question } = action.payload;
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId 
          ? { ...q, questions: [...(q.questions || []), question], points: (q.points || 0) + (question.points || 0) }
          : q
      );
      if (state.currentQuiz && state.currentQuiz._id === quizId) {
        state.currentQuiz = {
          ...state.currentQuiz,
          questions: [...(state.currentQuiz.questions || []), question],
          points: (state.currentQuiz.points || 0) + (question.points || 0)
        };
      }
    },
    updateQuestionInQuiz: (state, action) => {
      const { quizId, questionId, updates } = action.payload;
      state.quizzes = state.quizzes.map((q: any) => {
        if (q._id === quizId) {
          const questions = q.questions.map((question: any) =>
            question._id === questionId ? { ...question, ...updates } : question
          );
          const points = questions.reduce((total: number, q: any) => total + (q.points || 0), 0);
          return { ...q, questions, points };
        }
        return q;
      });
      if (state.currentQuiz && state.currentQuiz._id === quizId) {
        const questions = state.currentQuiz.questions.map((question: any) =>
          question._id === questionId ? { ...question, ...updates } : question
        );
        const points = questions.reduce((total: number, q: any) => total + (q.points || 0), 0);
        state.currentQuiz = { ...state.currentQuiz, questions, points };
      }
    },
    deleteQuestionFromQuiz: (state, action) => {
      const { quizId, questionId } = action.payload;
      state.quizzes = state.quizzes.map((q: any) => {
        if (q._id === quizId) {
          const questions = q.questions.filter((question: any) => question._id !== questionId);
          const points = questions.reduce((total: number, q: any) => total + (q.points || 0), 0);
          return { ...q, questions, points };
        }
        return q;
      });
      if (state.currentQuiz && state.currentQuiz._id === quizId) {
        const questions = state.currentQuiz.questions.filter((question: any) => question._id !== questionId);
        const points = questions.reduce((total: number, q: any) => total + (q.points || 0), 0);
        state.currentQuiz = { ...state.currentQuiz, questions, points };
      }
    },
    // Attempt management
    setCurrentAttempt: (state, action) => {
      state.currentAttempt = action.payload;
    },
    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
    setAttempts: (state, action) => {
      state.attempts = action.payload;
    },
    addAttempt: (state, action) => {
      state.attempts = [...state.attempts, action.payload];
      state.currentAttempt = action.payload;
    }
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  setCurrentQuiz,
  clearCurrentQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
  setCurrentAttempt,
  clearCurrentAttempt,
  setAttempts,
  addAttempt
} = quizzesSlice.actions;

export default quizzesSlice.reducer; 
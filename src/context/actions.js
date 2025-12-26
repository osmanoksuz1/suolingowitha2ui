/**
 * Application Action Types and Action Creators
 */

// Action Types
export const ActionTypes = {
  // App State
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // User Input
  SET_USER_INPUT: 'SET_USER_INPUT',
  SET_TOPIC: 'SET_TOPIC',
  
  // Stage Navigation
  SET_STAGE: 'SET_STAGE',
  NEXT_STAGE: 'NEXT_STAGE',
  RESET_TO_WELCOME: 'RESET_TO_WELCOME',
  
  // Cards (Step 1)
  SET_CARDS: 'SET_CARDS',
  SELECT_CARD: 'SELECT_CARD',
  SELECT_WRONG_CARD: 'SELECT_WRONG_CARD',
  CLEAR_CARD_SELECTION: 'CLEAR_CARD_SELECTION',
  SHOW_CARD_ANSWERS: 'SHOW_CARD_ANSWERS',
  START_ROUND: 'START_ROUND',
  NEXT_CARD: 'NEXT_CARD',
  PREV_CARD: 'PREV_CARD',
  SET_CARD_INDEX: 'SET_CARD_INDEX',
  
  // Explanation (Step 2)
  SET_USER_EXPLANATION: 'SET_USER_EXPLANATION',
  SUBMIT_EXPLANATION: 'SUBMIT_EXPLANATION',
  SET_AI_FEEDBACK: 'SET_AI_FEEDBACK',
  
  // Correct Image Selection (Step 3)
  SET_CORRECT_IMAGES: 'SET_CORRECT_IMAGES',
  SELECT_IMAGE: 'SELECT_IMAGE',
  CLEAR_IMAGE_SELECTION: 'CLEAR_IMAGE_SELECTION',
  SHOW_IMAGE_ANSWERS: 'SHOW_IMAGE_ANSWERS',
  
  // Round & Score
  INCREMENT_ROUND: 'INCREMENT_ROUND',
  NEXT_ROUND: 'NEXT_ROUND',
  UPDATE_SCORE: 'UPDATE_SCORE',
  ADD_SCORE: 'ADD_SCORE',
  RECORD_ANSWER: 'RECORD_ANSWER',
  
  // History
  SAVE_TO_HISTORY: 'SAVE_TO_HISTORY',
  
  // Full Reset
  RESET_APP: 'RESET_APP',
  RESET: 'RESET',
};

// Alias for easier access
export const ACTION_TYPES = ActionTypes;

// Action Creators
export const setLoading = (isLoading) => ({
  type: ActionTypes.SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: ActionTypes.SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: ActionTypes.CLEAR_ERROR,
});

export const setUserInput = (input) => ({
  type: ActionTypes.SET_USER_INPUT,
  payload: input,
});

export const setStage = (stage) => ({
  type: ActionTypes.SET_STAGE,
  payload: stage,
});

export const nextStage = () => ({
  type: ActionTypes.NEXT_STAGE,
});

export const resetToWelcome = () => ({
  type: ActionTypes.RESET_TO_WELCOME,
});

export const setCards = (cards) => ({
  type: ActionTypes.SET_CARDS,
  payload: cards,
});

export const selectCard = (cardId) => ({
  type: ActionTypes.SELECT_CARD,
  payload: cardId,
});

export const clearCardSelection = () => ({
  type: ActionTypes.CLEAR_CARD_SELECTION,
});

export const showCardAnswers = () => ({
  type: ActionTypes.SHOW_CARD_ANSWERS,
});

export const setUserExplanation = (explanation) => ({
  type: ActionTypes.SET_USER_EXPLANATION,
  payload: explanation,
});

export const setAiFeedback = (feedback) => ({
  type: ActionTypes.SET_AI_FEEDBACK,
  payload: feedback,
});

export const setCorrectImages = (images) => ({
  type: ActionTypes.SET_CORRECT_IMAGES,
  payload: images,
});

export const selectImage = (imageId) => ({
  type: ActionTypes.SELECT_IMAGE,
  payload: imageId,
});

export const clearImageSelection = () => ({
  type: ActionTypes.CLEAR_IMAGE_SELECTION,
});

export const showImageAnswers = () => ({
  type: ActionTypes.SHOW_IMAGE_ANSWERS,
});

export const incrementRound = () => ({
  type: ActionTypes.INCREMENT_ROUND,
});

export const updateScore = (points) => ({
  type: ActionTypes.UPDATE_SCORE,
  payload: points,
});

export const recordAnswer = (isCorrect) => ({
  type: ActionTypes.RECORD_ANSWER,
  payload: isCorrect,
});

export const saveToHistory = (roundData) => ({
  type: ActionTypes.SAVE_TO_HISTORY,
  payload: roundData,
});

export const resetApp = () => ({
  type: ActionTypes.RESET_APP,
});

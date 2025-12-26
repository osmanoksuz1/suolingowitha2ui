/**
 * Application Context Provider
 * Global state management using React Context + useReducer
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { appReducer, initialState, STAGES, selectors } from './appReducer';
import * as actions from './actions';

// Create Context
const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoize action dispatchers
  const actionDispatchers = useMemo(() => ({
    setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    setError: (error) => dispatch(actions.setError(error)),
    clearError: () => dispatch(actions.clearError()),
    setUserInput: (input) => dispatch(actions.setUserInput(input)),
    setStage: (stage) => dispatch(actions.setStage(stage)),
    nextStage: () => dispatch(actions.nextStage()),
    resetToWelcome: () => dispatch(actions.resetToWelcome()),
    setCards: (cards) => dispatch(actions.setCards(cards)),
    selectCard: (cardId) => dispatch(actions.selectCard(cardId)),
    clearCardSelection: () => dispatch(actions.clearCardSelection()),
    showCardAnswers: () => dispatch(actions.showCardAnswers()),
    setUserExplanation: (explanation) => dispatch(actions.setUserExplanation(explanation)),
    setAiFeedback: (feedback) => dispatch(actions.setAiFeedback(feedback)),
    setCorrectImages: (images) => dispatch(actions.setCorrectImages(images)),
    selectImage: (imageId) => dispatch(actions.selectImage(imageId)),
    clearImageSelection: () => dispatch(actions.clearImageSelection()),
    showImageAnswers: () => dispatch(actions.showImageAnswers()),
    incrementRound: () => dispatch(actions.incrementRound()),
    updateScore: (points) => dispatch(actions.updateScore(points)),
    recordAnswer: (isCorrect) => dispatch(actions.recordAnswer(isCorrect)),
    saveToHistory: (roundData) => dispatch(actions.saveToHistory(roundData)),
    resetApp: () => dispatch(actions.resetApp()),
  }), [dispatch]);

  // Memoize computed values
  const computedState = useMemo(() => ({
    ...state,
    // Computed properties
    isWelcomeStage: selectors.isWelcomeStage(state),
    isFindWrongStage: selectors.isFindWrongStage(state),
    isExplanationStage: selectors.isExplanationStage(state),
    isSelectCorrectStage: selectors.isSelectCorrectStage(state),
    hasSelectedCard: selectors.hasSelectedCard(state),
    hasSelectedImage: selectors.hasSelectedImage(state),
    selectedCard: selectors.getSelectedCard(state),
    selectedImage: selectors.getSelectedImage(state),
    isSelectedCardCorrect: selectors.isSelectedCardCorrect(state),
    isSelectedImageCorrect: selectors.isSelectedImageCorrect(state),
    accuracyPercentage: selectors.getAccuracyPercentage(state),
    currentStageIndex: selectors.getCurrentStageIndex(state),
    totalStages: selectors.getTotalStages(),
  }), [state]);

  return (
    <AppContext.Provider value={computedState}>
      <AppDispatchContext.Provider value={actionDispatchers}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};

// Custom Hooks
export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppDispatchContext);
  if (context === null) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
};

// Combined hook for convenience
export const useApp = () => {
  const state = useAppState();
  const actions = useAppActions();
  return { state, actions };
};

// Alternative combined hook with dispatch
export const useAppContext = () => {
  const context = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  if (context === null || dispatch === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  // Return state and raw dispatch for flexibility
  return { state: context, dispatch: (action) => {
    // Handle both action objects and action creator results
    if (typeof action === 'function') {
      return action(dispatch);
    }
    // For simple action objects, map to the appropriate action creator
    switch (action.type) {
      case 'SET_TOPIC':
        dispatch.setUserInput(action.payload);
        break;
      case 'START_ROUND':
        dispatch.setCards(action.payload);
        dispatch.setStage('findWrong');
        break;
      case 'SET_STAGE':
        dispatch.setStage(action.payload);
        break;
      case 'SELECT_WRONG_CARD':
        dispatch.selectCard(action.payload?.id || action.payload);
        break;
      case 'SUBMIT_EXPLANATION':
        dispatch.setUserExplanation(action.payload);
        break;
      case 'SET_CORRECT_IMAGES':
        dispatch.setCorrectImages(action.payload);
        break;
      case 'ADD_SCORE':
        dispatch.updateScore(action.payload);
        break;
      case 'NEXT_ROUND':
        dispatch.incrementRound();
        dispatch.setStage('findWrong');
        break;
      case 'NEXT_CARD':
        // Handle internally in reducer
        break;
      case 'PREV_CARD':
        // Handle internally in reducer
        break;
      case 'SET_CARD_INDEX':
        // Handle internally in reducer
        break;
      case 'RESET':
        dispatch.resetApp();
        break;
      case 'CLEAR_ERROR':
        dispatch.clearError();
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  }};
};

// Export stages for easy access
export { STAGES };

export default AppProvider;

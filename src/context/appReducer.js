/**
 * Application Reducer
 * Handles all state updates
 */

import { ActionTypes } from './actions';

// Stage definitions
export const STAGES = {
  WELCOME: 'welcome',
  FIND_WRONG: 'findWrong',
  EXPLANATION: 'explanation',
  SELECT_CORRECT: 'selectCorrect',
};

// Stage order for navigation
const STAGE_ORDER = [
  STAGES.WELCOME,
  STAGES.FIND_WRONG,
  STAGES.EXPLANATION,
  STAGES.SELECT_CORRECT,
];

// Initial State
export const initialState = {
  // User Input
  userInput: '',
  topic: '',
  
  // Stage Navigation
  currentStage: STAGES.WELCOME,
  currentRound: 1,
  round: 1,
  difficulty: 1,
  
  // Cards (Step 1 - Find Wrong)
  cards: [],
  currentCardIndex: 0,
  selectedCardId: null,
  selectedWrongCard: null,
  wrongCard: null,
  showCardAnswers: false,
  
  // Explanation (Step 2)
  userExplanation: '',
  aiFeedback: '',
  
  // Correct Image Selection (Step 3)
  correctImages: [],
  selectedImageId: null,
  showImageAnswers: false,
  
  // Score & Stats
  score: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  
  // UI States
  isLoading: false,
  loading: false,
  error: null,
  
  // History
  history: [],
};

// Reducer Function
export const appReducer = (state, action) => {
  switch (action.type) {
    // Loading State
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    // Error Handling
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // User Input
    case ActionTypes.SET_USER_INPUT:
    case 'SET_TOPIC':
      return {
        ...state,
        userInput: action.payload,
        topic: action.payload,
      };

    // Stage Navigation
    case ActionTypes.SET_STAGE:
      return {
        ...state,
        currentStage: action.payload,
      };

    // Start Round with cards
    case 'START_ROUND': {
      const cards = action.payload;
      const wrongCard = cards.find(card => !card.isCorrect);
      return {
        ...state,
        cards,
        wrongCard,
        selectedWrongCard: null,
        currentCardIndex: 0,
        selectedCardId: null,
        showCardAnswers: false,
        currentStage: STAGES.FIND_WRONG,
      };
    }

    // Card navigation
    case 'NEXT_CARD':
      return {
        ...state,
        currentCardIndex: Math.min(state.currentCardIndex + 1, state.cards.length - 1),
      };

    case 'PREV_CARD':
      return {
        ...state,
        currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
      };

    case 'SET_CARD_INDEX':
      return {
        ...state,
        currentCardIndex: action.payload,
      };

    // Select wrong card
    case 'SELECT_WRONG_CARD': {
      const card = typeof action.payload === 'object' 
        ? action.payload 
        : state.cards.find(c => c.id === action.payload);
      return {
        ...state,
        selectedWrongCard: card,
        selectedCardId: card?.id,
      };
    }

    case ActionTypes.NEXT_STAGE: {
      const currentIndex = STAGE_ORDER.indexOf(state.currentStage);
      const nextIndex = currentIndex + 1;
      
      // If at last stage, go back to FIND_WRONG for next round
      if (nextIndex >= STAGE_ORDER.length) {
        return {
          ...state,
          currentStage: STAGES.FIND_WRONG,
          currentRound: state.currentRound + 1,
          // Reset round-specific state
          selectedCardId: null,
          showCardAnswers: false,
          userExplanation: '',
          aiFeedback: '',
          selectedImageId: null,
          showImageAnswers: false,
        };
      }
      
      return {
        ...state,
        currentStage: STAGE_ORDER[nextIndex],
      };
    }

    case ActionTypes.RESET_TO_WELCOME:
      return {
        ...initialState,
        history: state.history, // Keep history
      };

    // Cards
    case ActionTypes.SET_CARDS: {
      const cards = action.payload;
      const wrongCard = cards.find(card => !card.isCorrect);
      return {
        ...state,
        cards,
        wrongCard,
        selectedCardId: null,
        showCardAnswers: false,
      };
    }

    case ActionTypes.SELECT_CARD:
      return {
        ...state,
        selectedCardId: action.payload,
      };

    case ActionTypes.CLEAR_CARD_SELECTION:
      return {
        ...state,
        selectedCardId: null,
      };

    case ActionTypes.SHOW_CARD_ANSWERS:
      return {
        ...state,
        showCardAnswers: true,
      };

    // Explanation
    case ActionTypes.SET_USER_EXPLANATION:
    case 'SUBMIT_EXPLANATION':
      return {
        ...state,
        userExplanation: action.payload,
      };

    case ActionTypes.SET_AI_FEEDBACK:
      return {
        ...state,
        aiFeedback: action.payload,
      };

    // Correct Images
    case ActionTypes.SET_CORRECT_IMAGES:
      return {
        ...state,
        correctImages: action.payload,
        selectedImageId: null,
        showImageAnswers: false,
      };

    case ActionTypes.SELECT_IMAGE:
      return {
        ...state,
        selectedImageId: action.payload,
      };

    case ActionTypes.CLEAR_IMAGE_SELECTION:
      return {
        ...state,
        selectedImageId: null,
      };

    case ActionTypes.SHOW_IMAGE_ANSWERS:
      return {
        ...state,
        showImageAnswers: true,
      };

    // Round & Score
    case ActionTypes.INCREMENT_ROUND:
    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1,
        round: state.round + 1,
        difficulty: Math.min(state.difficulty + 0.1, 3), // Max difficulty 3
        currentStage: STAGES.FIND_WRONG,
        selectedWrongCard: null,
        currentCardIndex: 0,
        selectedCardId: null,
        showCardAnswers: false,
        userExplanation: '',
        aiFeedback: '',
        selectedImageId: null,
        showImageAnswers: false,
      };

    case ActionTypes.UPDATE_SCORE:
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.payload,
      };

    case ActionTypes.RECORD_ANSWER:
      return {
        ...state,
        totalAnswers: state.totalAnswers + 1,
        correctAnswers: action.payload 
          ? state.correctAnswers + 1 
          : state.correctAnswers,
      };

    // History
    case ActionTypes.SAVE_TO_HISTORY:
      return {
        ...state,
        history: [...state.history, action.payload],
      };

    // Full Reset
    case ActionTypes.RESET_APP:
    case 'RESET':
      return initialState;

    // Clear error
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Selectors
export const selectors = {
  isWelcomeStage: (state) => state.currentStage === STAGES.WELCOME,
  isFindWrongStage: (state) => state.currentStage === STAGES.FIND_WRONG,
  isExplanationStage: (state) => state.currentStage === STAGES.EXPLANATION,
  isSelectCorrectStage: (state) => state.currentStage === STAGES.SELECT_CORRECT,
  
  hasSelectedCard: (state) => state.selectedCardId !== null,
  hasSelectedImage: (state) => state.selectedImageId !== null,
  
  getSelectedCard: (state) => 
    state.cards.find(card => card.id === state.selectedCardId),
  
  getSelectedImage: (state) => 
    state.correctImages.find(img => img.id === state.selectedImageId),
  
  isSelectedCardCorrect: (state) => {
    const selected = state.cards.find(card => card.id === state.selectedCardId);
    return selected ? !selected.isCorrect : false; // True if user selected the wrong card (correct answer)
  },
  
  isSelectedImageCorrect: (state) => {
    const selected = state.correctImages.find(img => img.id === state.selectedImageId);
    return selected?.isCorrect || false;
  },
  
  getAccuracyPercentage: (state) => {
    if (state.totalAnswers === 0) return 0;
    return Math.round((state.correctAnswers / state.totalAnswers) * 100);
  },
  
  getCurrentStageIndex: (state) => STAGE_ORDER.indexOf(state.currentStage),
  getTotalStages: () => STAGE_ORDER.length,
};

export default appReducer;

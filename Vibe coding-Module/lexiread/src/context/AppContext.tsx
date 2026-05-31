import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Book, VocabEntry, AppStats } from '../types';
import { storage } from '../utils/storage';

interface AppState {
  books: Book[];
  vocab: VocabEntry[];
}

type Action =
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'SET_VOCAB'; payload: VocabEntry[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'ADD_VOCAB'; payload: VocabEntry }
  | { type: 'DELETE_VOCAB'; payload: string };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getStats: () => AppStats;
} | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'SET_VOCAB':
      return { ...state, vocab: action.payload };
    case 'ADD_BOOK':
      return { ...state, books: [action.payload, ...state.books] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'ADD_VOCAB':
      return { ...state, vocab: [action.payload, ...state.vocab] };
    case 'DELETE_VOCAB':
      return { ...state, vocab: state.vocab.filter(v => v.id !== action.payload) };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    books: [],
    vocab: []
  });

  useEffect(() => {
    dispatch({ type: 'SET_BOOKS', payload: storage.getBooks() });
    dispatch({ type: 'SET_VOCAB', payload: storage.getVocab() });
  }, []);

  useEffect(() => {
    storage.saveBooks(state.books);
  }, [state.books]);

  useEffect(() => {
    storage.saveVocab(state.vocab);
  }, [state.vocab]);

  const getStats = (): AppStats => {
    return {
      totalBooksFinished: state.books.filter(b => b.status === 'finished').length,
      totalWordsLearned: state.vocab.length,
      currentlyReading: state.books.filter(b => b.status === 'reading')
    };
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getStats }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

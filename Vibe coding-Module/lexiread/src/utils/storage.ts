import { Book, VocabEntry } from '../types';

const BOOKS_KEY = 'lexiread_books';
const VOCAB_KEY = 'lexiread_vocab';

export const storage = {
  getBooks: (): Book[] => {
    const data = localStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveBooks: (books: Book[]) => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  getVocab: (): VocabEntry[] => {
    const data = localStorage.getItem(VOCAB_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveVocab: (vocab: VocabEntry[]) => {
    localStorage.setItem(VOCAB_KEY, JSON.stringify(vocab));
  }
};

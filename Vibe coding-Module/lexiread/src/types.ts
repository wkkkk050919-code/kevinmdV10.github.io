/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  language: 'EN' | 'FR';
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'finished' | 'paused';
  coverColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabEntry {
  id: string;
  word: string;
  language: 'EN' | 'FR';
  definition: string;
  example: string;
  exampleTranslation: string;
  userNote: string;
  bookId: string;
  bookTitle: string;
  savedAt: string;
}

export interface AppStats {
  totalBooksFinished: number;
  totalWordsLearned: number;
  currentlyReading: Book[];
}

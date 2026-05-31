import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Save, X, Loader2, BookmarkPlus } from 'lucide-react';
import { VocabEntry, Book } from '../../types';
import { clsx } from 'clsx';

interface TextReaderProps {
  book: Book;
  onSaveVocab: (entry: VocabEntry) => void;
}

export const TextReader = ({ book, onSaveVocab }: TextReaderProps) => {
  const [text, setText] = useState('');
  const [selection, setSelection] = useState<{ word: string; x: number; y: number } | null>(null);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userNote, setUserNote] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelection = (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0 && selectedText.split(/\s+/).length === 1) {
      // Only single words
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        setSelection({
          word: selectedText,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
        performLookup(selectedText);
      }
    } else {
      setSelection(null);
      setLookupResult(null);
    }
  };

  const performLookup = async (word: string) => {
    setIsLoading(true);
    setLookupResult(null);
    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, language: book.language }),
      });
      const data = await response.json();
      setLookupResult(data);
    } catch (error) {
      console.error('Lookup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLibrary = () => {
    if (!lookupResult) return;
    
    const entry: VocabEntry = {
      id: `v_${Date.now()}`,
      word: lookupResult.word,
      language: book.language,
      definition: lookupResult.definition,
      example: lookupResult.example,
      exampleTranslation: lookupResult.example_translation,
      userNote: userNote,
      bookId: book.id,
      bookTitle: book.title,
      savedAt: new Date().toISOString(),
    };

    onSaveVocab(entry);
    setSelection(null);
    setLookupResult(null);
    setUserNote('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="bg-white border-border rounded-3xl overflow-hidden min-h-[400px] flex flex-col shadow-sm border">
        <div className="px-6 py-4 border-b border-bg bg-bg/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Text Analyzer</span>
            <div className="flex gap-1">
              <button onClick={() => setText('')} className="px-3 py-1 bg-white border border-border rounded-full text-[10px] font-bold text-text-secondary hover:bg-bg transition-colors">Clear</button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase">
            <span>Gemini AI Ready</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <textarea
          className="flex-1 p-10 bg-transparent focus:outline-none font-serif text-xl leading-relaxed text-text-primary selection:bg-accent selection:text-white resize-none"
          placeholder="Paste the original text you are reading here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
        />
      </div>

      <AnimatePresence>
        {selection && (
          <div 
            className="fixed z-[200] -translate-x-1/2 -translate-y-full pb-4"
            style={{ left: selection.x, top: selection.y + window.scrollY }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl border border-accent/20 w-80 p-5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xl font-bold font-serif text-accent">{selection.word}</h5>
                <button onClick={() => { setSelection(null); setLookupResult(null); }} className="text-text-muted hover:text-text-primary transition-colors">
                  <X size={18} />
                </button>
              </div>

              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center text-text-muted gap-2">
                  <Loader2 size={24} className="animate-spin text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Consulting Teacher...</span>
                </div>
              ) : lookupResult ? (
                <div className="space-y-4">
                  <div className="bg-bg p-3 rounded-lg border-l-4 border-accent">
                    <p className="text-sm font-bold text-text-primary leading-tight">
                      {lookupResult.definition}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Gemini Example</p>
                    <p className="text-sm italic text-text-primary leading-snug">"{lookupResult.example}"</p>
                    <p className="text-xs text-text-secondary">{lookupResult.example_translation}</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Add a personal note..."
                      className="w-full text-xs px-3 py-2 bg-bg border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveToLibrary()}
                    />
                  </div>
                  <button 
                    onClick={saveToLibrary}
                    className="w-full bg-accent text-white py-2.5 rounded-full text-xs font-bold shadow-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <BookmarkPlus size={14} />
                    Save to My Library
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-text-muted">
                  Lookup failed. Try again.
                </div>
              )}
            </motion.div>
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white mx-auto -mt-0.5" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

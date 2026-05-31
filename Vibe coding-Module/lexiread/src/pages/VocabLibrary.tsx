import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Search, Filter, BookIcon, Trash2, ExternalLink, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export default function VocabLibrary() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string>('all');

  const filteredVocab = state.vocab.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBook = selectedBookId === 'all' || v.bookId === selectedBookId;
    return matchesSearch && matchesBook;
  });

  return (
    <PageWrapper title="Vocabulary Library" subtitle="Your carefully curated words and phrases">
      <div className="bg-white rounded-3xl border border-border p-6 mb-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text"
              placeholder="Search in your knowledge base..."
              className="w-full pl-14 pr-6 py-4 bg-bg border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-5 py-4 bg-bg border border-border rounded-2xl">
              <Filter size={18} className="text-accent" />
              <select 
                className="bg-transparent focus:outline-none text-xs font-bold text-text-primary uppercase tracking-widest cursor-pointer"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
              >
                <option value="all">Every Source</option>
                {state.books.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredVocab.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVocab.map((v) => (
              <motion.div 
                key={v.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-7 rounded-2xl border border-border hover:shadow-xl transition-all group flex flex-col h-full relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm",
                    v.language === 'EN' ? "bg-en" : "bg-fr"
                  )}>
                    {v.language}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Link to={`/books/${v.bookId}`} className="p-2 text-text-muted hover:text-accent rounded-full hover:bg-bg transition-colors">
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                      onClick={() => dispatch({ type: 'DELETE_VOCAB', payload: v.id })}
                      className="p-2 text-text-muted hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-3xl font-serif font-bold text-accent mb-3 tracking-tight">{v.word}</h3>
                <div className="bg-bg/50 p-4 rounded-xl border-l-4 border-accent mb-6">
                  <p className="text-sm font-bold text-text-primary leading-relaxed">
                    {v.definition}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="p-4 bg-bg rounded-xl border border-border border-dashed">
                    <p className="text-xs italic text-text-secondary leading-snug">"{v.example}"</p>
                    <p className="text-[10px] font-medium text-text-muted mt-2">— {v.exampleTranslation}</p>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/40">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest truncate">
                      <BookIcon size={12} className="text-accent" /> {v.bookTitle}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold tracking-tighter whitespace-nowrap">
                      {new Date(v.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-surface border border-dashed border-border p-20 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center text-text-muted mb-6">
            <BookMarked size={40} />
          </div>
          <h3 className="text-xl font-serif font-medium text-text-primary mb-2">No words found</h3>
          <p className="text-text-secondary">Start reading your books to add new words to your library.</p>
        </div>
      )}
    </PageWrapper>
  );
}

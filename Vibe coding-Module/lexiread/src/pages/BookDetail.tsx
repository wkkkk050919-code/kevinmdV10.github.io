import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TextReader } from '../components/reader/TextReader';
import { ArrowLeft, BookOpen, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const book = state.books.find(b => b.id === id);
  const bookVocab = state.vocab.filter(v => v.bookId === id);

  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [newPage, setNewPage] = useState(book?.currentPage || 0);

  if (!book) return <PageWrapper>Book not found</PageWrapper>;

  const handleUpdateProgress = () => {
    const updatedBook = {
      ...book,
      currentPage: Math.min(newPage, book.totalPages),
      status: newPage >= book.totalPages ? 'finished' : 'reading',
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
    setIsUpdatingProgress(false);
  };

  const deleteBook = () => {
    if (confirm('Are you sure you want to delete this book? The vocabulary earned from this book will remain.')) {
      dispatch({ type: 'SET_BOOKS', payload: state.books.filter(b => b.id !== id) });
      navigate('/books');
    }
  };

  const progress = (book.currentPage / book.totalPages) * 100;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/books')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-all font-medium text-sm p-2 -ml-2 rounded-lg hover:bg-surface"
        >
          <ArrowLeft size={18} />
          Back to Bookshelf
        </button>
        <button 
          onClick={deleteBook}
          className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mb-12 items-start">
        <div 
          className="w-48 aspect-[3/4] rounded-xl shadow-inner flex flex-col items-center justify-end p-6 text-white text-center transform -rotate-1 hover:rotate-0 transition-transform duration-500 flex-shrink-0"
          style={{ backgroundColor: book.coverColor }}
        >
           <p className="font-serif text-sm italic opacity-80 mb-1">{book.author}</p>
           <h1 className="font-serif font-bold text-xl leading-tight">{book.title}</h1>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className={clsx(
              "px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-sm",
              book.language === 'EN' ? "bg-en" : "bg-fr"
            )}>
              {book.language === 'EN' ? 'English' : 'French'}
            </span>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-border">
              <Calendar size={12} />
              Book Added {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-5xl font-serif font-bold text-text-primary tracking-tight mb-4">{book.title}</h1>
          <p className="text-xl font-serif italic text-text-secondary mb-8">by {book.author}</p>

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm max-w-xl">
             <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
              <span>Read {Math.round(progress)}%</span>
              <span>{book.currentPage} / {book.totalPages} Pages</span>
            </div>
            <div className="h-3 bg-accent-light rounded-full overflow-hidden mb-8">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-accent h-full rounded-full"
              />
            </div>

            <div className="flex items-center gap-4">
              {isUpdatingProgress ? (
                <div className="flex items-center gap-3">
                  <input 
                    type="number"
                    className="w-24 px-4 py-2.5 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-bold"
                    value={newPage}
                    onChange={(e) => setNewPage(parseInt(e.target.value) || 0)}
                  />
                  <button 
                    onClick={handleUpdateProgress}
                    className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-opacity-90 active:scale-95 transition-all"
                  >
                    Save Progress
                  </button>
                  <button 
                    onClick={() => setIsUpdatingProgress(false)}
                    className="text-text-secondary text-sm font-bold hover:text-text-primary px-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsUpdatingProgress(true)}
                  className="flex-1 md:flex-none py-3 px-8 bg-accent text-white rounded-full text-sm font-bold shadow-sm hover:bg-opacity-90 active:scale-95 transition-all"
                >
                  Update Reading Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <TextReader 
            book={book} 
            onSaveVocab={(entry) => dispatch({ type: 'ADD_VOCAB', payload: entry })} 
          />
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-medium text-lg text-text-primary">Collected Words</h3>
              <span className="bg-bg text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold">{bookVocab.length}</span>
            </div>

            {bookVocab.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {bookVocab.map((v) => (
                  <motion.div 
                    key={v.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group bg-bg p-4 rounded-2xl border border-transparent hover:border-border hover:bg-white transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-accent">{v.word}</span>
                      <button 
                        onClick={() => dispatch({ type: 'DELETE_VOCAB', payload: v.id })}
                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-text-primary line-clamp-2 leading-relaxed">{v.definition}</p>
                    {v.userNote && (
                      <p className="text-[10px] text-text-muted mt-2 italic flex items-center gap-1">
                        <ChevronRight size={8} /> {v.userNote}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs text-text-muted font-medium">No words collected yet from this book.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

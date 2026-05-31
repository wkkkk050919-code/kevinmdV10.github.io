import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { motion } from 'motion/react';
import { Plus, CheckCircle2, Book as BookIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { clsx } from 'clsx';

export default function Dashboard() {
  const { getStats, state } = useApp();
  const stats = getStats();

  return (
    <PageWrapper title="LexiRead" subtitle="Welcome back to your digital library">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="text-3xl font-serif font-bold text-accent">{stats.totalBooksFinished}</div>
          <div className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Books Finished</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="text-3xl font-serif font-bold text-accent">{stats.totalWordsLearned}</div>
          <div className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Vocabulary Accumulation</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="text-3xl font-serif font-bold text-accent">{state.books.length}</div>
          <div className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Total Library Size</div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2">
            <span className="text-accent text-2xl group-hover:animate-bounce">📖</span> Currently Reading
          </h2>
          <Link to="/books" className="text-accent font-bold text-sm hover:underline">Manage All</Link>
        </div>
        
        {stats.currentlyReading.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.currentlyReading.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`}>
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-2xl border border-border shadow-sm group transition-shadow hover:shadow-md"
                >
                  <div className="flex gap-6">
                    <div 
                      className="w-24 h-32 rounded-lg shadow-inner flex flex-col items-center justify-end p-3 text-white text-center flex-shrink-0"
                      style={{ backgroundColor: book.coverColor }}
                    >
                      <p className="font-serif text-[10px] italic opacity-80 truncate w-full">{book.author}</p>
                      <h4 className="font-serif font-bold text-sm leading-tight line-clamp-2">{book.title}</h4>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-2">
                        <span>Progress {Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                        <span className={clsx(
                          "px-2 rounded-full text-white",
                          book.language === 'EN' ? "bg-en" : "bg-fr"
                        )}>
                          {book.language}
                        </span>
                      </div>
                      <div className="h-2 bg-accent-light rounded-full overflow-hidden mb-4">
                        <div 
                          className="bg-accent h-full transition-all duration-500 rounded-full"
                          style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                        />
                      </div>
                      <button className="w-full py-2 bg-accent text-white rounded-full text-xs font-bold transition-all hover:bg-opacity-90 active:scale-95">Update Progress</button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-dashed border-border p-12 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-text-muted mb-4">
              <Plus size={32} />
            </div>
            <p className="text-text-secondary mb-6">No books in progress. Ready to start something new?</p>
            <Link 
              to="/books" 
              className="bg-accent text-white px-6 py-2.5 rounded-full font-medium shadow-sm hover:bg-opacity-90 transition-all"
            >
              Add Your First Book
            </Link>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}

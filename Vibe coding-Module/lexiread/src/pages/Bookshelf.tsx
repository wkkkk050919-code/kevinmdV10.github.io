import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Plus, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Book } from '../types';
import { Link } from 'react-router-dom';

export default function Bookshelf() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    language: 'EN' as 'EN' | 'FR',
    totalPages: 0,
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['#D4A373', '#A3B18A', '#FAEDCD', '#CCD5AE', '#E9EDC9', '#FEFAE0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const book: Book = {
      id: `b_${Date.now()}`,
      ...newBook,
      currentPage: 0,
      status: 'reading',
      coverColor: randomColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_BOOK', payload: book });
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', language: 'EN', totalPages: 0 });
  };

  const filteredBooks = state.books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper title="My Bookshelf" subtitle="Manage your reading list">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text"
            placeholder="Find a masterpiece..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add to Collection
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="group">
            <motion.div 
              whileHover={{ y: -8 }}
              className="flex flex-col h-full"
            >
              <div 
                className="aspect-[3/4] rounded-xl shadow-sm mb-4 relative overflow-hidden flex flex-col items-center justify-end p-5 text-center transition-all group-hover:shadow-xl group-hover:-rotate-1"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="absolute top-0 right-0 p-3">
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm",
                    book.language === 'EN' ? "bg-en" : "bg-fr"
                  )}>
                    {book.language}
                  </span>
                </div>
                <p className="font-serif text-[10px] italic text-white/80 mb-1 truncate w-full">{book.author}</p>
                <h3 className="font-serif font-bold text-white text-base leading-tight line-clamp-3 mb-2">
                  {book.title}
                </h3>
                <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-white h-full transition-all duration-700"
                    style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                  />
                </div>
              </div>
              <h3 className="font-serif font-bold text-text-primary truncate px-1 uppercase tracking-tight">{book.title}</h3>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest px-1">{book.author}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface w-full max-w-md rounded-3xl p-8 border border-border shadow-xl relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-medium">Add New Book</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Book Title</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                    placeholder="e.g. The Great Gatsby"
                    value={newBook.title}
                    onChange={e => setNewBook({...newBook, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Author</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                    placeholder="e.g. F. Scott Fitzgerald"
                    value={newBook.author}
                    onChange={e => setNewBook({...newBook, author: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Language</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                      value={newBook.language}
                      onChange={e => setNewBook({...newBook, language: e.target.value as 'EN' | 'FR'})}
                    >
                      <option value="EN">English</option>
                      <option value="FR">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Total Pages</label>
                    <input 
                      required
                      type="number"
                      min="1"
                      className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                      placeholder="e.g. 180"
                      value={newBook.totalPages || ''}
                      onChange={e => setNewBook({...newBook, totalPages: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-3 rounded-xl font-bold shadow-sm hover:bg-opacity-90 transition-all mt-4"
                >
                  Save to Bookshelf
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

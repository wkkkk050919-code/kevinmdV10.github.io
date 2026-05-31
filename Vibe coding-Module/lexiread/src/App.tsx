import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AnimatePresence } from 'motion/react';
import Dashboard from './pages/Dashboard';
import Bookshelf from './pages/Bookshelf';
import BookDetail from './pages/BookDetail';
import VocabLibrary from './pages/VocabLibrary';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col md:flex-row min-h-screen bg-bg">
          <Navbar />
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/books" element={<Bookshelf />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/vocab" element={<VocabLibrary />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Home, Library, BookOpen, BookMarked } from 'lucide-react';
import { clsx } from 'clsx';

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Bookshelf', path: '/books', icon: Library },
    { name: 'Vocabulary', path: '/vocab', icon: BookMarked },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:left-0 md:w-20 md:h-screen bg-white/50 backdrop-blur-sm border-t md:border-t-0 md:border-r border-border z-50 flex md:flex-col items-center justify-around md:justify-center md:gap-8 px-4 py-3 md:px-0">
      <Link to="/" className="hidden md:flex mb-8 group transition-transform hover:scale-105">
        <div className="w-10 h-12 bg-accent rounded-sm flex items-center justify-center text-white font-serif italic text-xl shadow-sm">
          L
        </div>
      </Link>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              "flex flex-col md:flex-row items-center gap-1 p-2 rounded-xl transition-all duration-200",
              isActive ? "text-accent bg-accent-light" : "text-text-muted hover:text-text-secondary hover:bg-bg"
            )}
          >
            <Icon size={24} />
            <span className="text-[10px] md:hidden font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

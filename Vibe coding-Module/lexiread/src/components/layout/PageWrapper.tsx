import { motion } from 'motion/react';
import { ReactNode } from 'react';

export const PageWrapper = ({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="md:ml-20 min-h-screen pb-24 md:pb-12 px-6 pt-12 max-w-5xl mx-auto"
    >
      {(title || subtitle) && (
        <header className="mb-12">
          {title && <h1 className="text-4xl font-serif font-medium text-text-primary mb-2">{title}</h1>}
          {subtitle && <p className="text-text-secondary font-medium tracking-wide">{subtitle}</p>}
        </header>
      )}
      {children}
    </motion.main>
  );
};

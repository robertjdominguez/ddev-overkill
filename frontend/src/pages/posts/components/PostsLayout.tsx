import { useRef } from 'react';
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import AuthorSidebar from './AuthorSidebar';
import classes from './PostsLayout.module.css';

export default function PostsLayout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentOutlet = useOutlet();

  const prevLocationKey = useRef(location.key);
  const scrollPositions = useRef(new Map<string, number>());

  const onExitComplete = () => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.current.get(location.key);
      window.scrollTo(0, saved ?? 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Save scroll position before the outlet changes
  if (prevLocationKey.current !== location.key) {
    scrollPositions.current.set(prevLocationKey.current, window.scrollY);
    prevLocationKey.current = location.key;
  }

  return (
    <div className={classes.layout}>
      <AuthorSidebar />
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <motion.div
          key={location.pathname}
          className={classes.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {currentOutlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

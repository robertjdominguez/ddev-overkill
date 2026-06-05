import { useEffect, useState, useRef } from 'react';

export function useShowSignUp(threshold: number = 500) {
  const [isScrolled, setIsScrolled] = useState(false);
  const hasFired = useRef(false); 

  useEffect(() => {
    // If already fired, do nothing. Keeps it truly "once".
    if (hasFired.current) return;

    const handleScroll = () => {
      if (window.scrollY >= threshold) {
        hasFired.current = true; 
        setIsScrolled(true);
        window.removeEventListener('scroll', handleScroll);
        console.log("Let's get them to sign up!");
        return;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Clean up on unmount or when threshold changes
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

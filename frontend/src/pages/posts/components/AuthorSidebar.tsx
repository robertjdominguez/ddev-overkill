import { useRef, useState, useEffect, useCallback } from 'react';
import { Text, Group, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { motion } from 'motion/react';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import classes from './AuthorSidebar.module.css';

const SCROLL_THRESHOLD = 100;

export default function AuthorSidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [scrolled, setScrolled] = useState(false);

  // Only re-render when crossing the threshold, not on every scroll tick
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setScrolled(false);
      return;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, handleScroll]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>();

  // Capture full-height on mobile so compacting doesn't collapse the grid cell
  useEffect(() => {
    if (isMobile && sidebarRef.current && !minHeight) {
      setMinHeight(sidebarRef.current.offsetHeight);
    }
    if (!isMobile && minHeight) {
      setMinHeight(undefined);
    }
  }, [isMobile, minHeight]);

  return (
    <div
      ref={sidebarRef}
      className={classes.sidebar}
      data-scrolled={scrolled || undefined}
      style={{ minHeight }}
    >
      <div className={classes.inner}>
        <motion.div className={classes.header} layout>
          <motion.div className={classes.avatarWrapper} layout>
            <img src="/face.png" alt="Rob Dominguez" className={classes.avatar} />
          </motion.div>
          <motion.div layout="position">
            <Text fw={700} className={classes.name}>
              Rob Dominguez
            </Text>
          </motion.div>
        </motion.div>

        <div className={classes.details}>
          <Text size="sm" c="dimmed">
            Engineering manager solving problems at PromptQL. Former educator with a passion for
            automating the mundane.
          </Text>
          <Group gap="xs">
            <ActionIcon
              component="a"
              href="https://github.com/robertjdominguez"
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              color="gray"
              size="lg"
            >
              <FiGithub size={18} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.linkedin.com/in/rob-dominguez-0b258b147/"
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              color="gray"
              size="lg"
            >
              <FiLinkedin size={18} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://twitter.com/_RobDominguez"
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              color="gray"
              size="lg"
            >
              <FiTwitter size={18} />
            </ActionIcon>
          </Group>
        </div>
      </div>
    </div>
  );
}

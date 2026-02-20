import { useState } from 'react';
import { Title, Text } from '@mantine/core';
import { motion } from 'motion/react';
import AllPosts from './AllPosts';
import AuthorSidebar from './AuthorSidebar';
import SearchPosts from './SearchPosts';
import classes from './Posts.module.css';

const container = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function Posts() {
  const [searching, setSearching] = useState(false);

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className={classes.layout}>
      <motion.div variants={item}>
        <AuthorSidebar />
      </motion.div>
      <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-xl)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-sm)' }}>
          <Title order={1}>
            Things I <Text span c="accent.5" inherit>write</Text>
          </Title>
          <Text c="dimmed">
            Most of the posts you'll find talk about efforts made in automating
            mundane tasks, speeding up workflows, and learning new technologies.
            Hopefully something will spark an interest or help you with a small
            portion of a problem you're facing.
          </Text>
        </div>
        <SearchPosts onSearchActive={setSearching} />
        <div style={{ display: searching ? 'none' : undefined }}>
          <AllPosts />
        </div>
      </motion.div>
    </motion.div>
  );
}

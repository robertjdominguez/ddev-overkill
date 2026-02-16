import { Title, Text } from '@mantine/core';
import { motion } from 'motion/react';
import AllPosts from './AllPosts';

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
  return (
    <motion.div variants={container} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)' }}>
      <motion.div variants={item}>
        <Title order={1}>
          Things I <Text span c="blue" inherit>write</Text> about
        </Title>
      </motion.div>
      <motion.div variants={item}>
        <Text c="dimmed">
          I work in engineering leadership and primarily focus on product and DX at
          PromptQL.
        </Text>
      </motion.div>
      <motion.div variants={item}>
        <Text c="dimmed">
          Most of the posts you'll find talk about efforts made in automating
          mundane tasks, speeding up workflows, and learning new technologies.
          Hopefully something will spark an interest or help you with a small
          portion of a problem you're facing. Or, at the very least, entertain you.
        </Text>
      </motion.div>
      <motion.div variants={item}>
        <Text c="dimmed">
          I spent nearly a decade in the classroom and working with some amazing
          educators. As such, there's a pretty large backlog of pedagogical and
          education-specific content.
        </Text>
      </motion.div>
      <motion.div variants={item}>
        <AllPosts />
      </motion.div>
    </motion.div>
  );
}

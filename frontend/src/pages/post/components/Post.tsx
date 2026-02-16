import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';

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

export default function Post() {
  const { slug } = useParams();
  return (
    <motion.div variants={container} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-md)' }}>
      <motion.div variants={item}>
        <h1>Post: {slug}</h1>
      </motion.div>
      <motion.div variants={item}>
        <p>Single post view coming soon</p>
      </motion.div>
    </motion.div>
  );
}

import { useState } from 'react';
import { Title, Text, Button, Group, Stack, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import classes from './Home.module.css';
import SubscribeModal from './SubscribeModal';

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

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
  <>
    <motion.div variants={container} initial="hidden" animate="visible" className={classes.hero}>
      <motion.div variants={item} className={classes.deets}>
        <Title order={1}>I'm Rob, welcome to my site.</Title>
        <Text size="lg" c="dimmed">
          I'm an{' '}
          <Text span c="accent.5" inherit>
            <s>software engineer</s> engineering manager
          </Text>{' '}
          that likes to solve problems. Currently, I'm working on product at{' '}
          <Text component="a" href="https://promptql.io" target="_blank" inherit c="accent.5">
            PromptQL
          </Text>
          .
        </Text>
        <Group justify="flex-end" visibleFrom="sm">
          <Button variant="outline" radius="sm" size="sm" onClick={() => setOpened(true)}>
            Stay in the loop
          </Button>
          <Button component={Link} to="/posts" variant="light" radius="sm" size="sm">
            What I'm writing <span className={classes.shaka}>🤙</span>
          </Button>
        </Group>
        <Stack hiddenFrom="sm">
          <Button component={Link} to="/posts" variant="light" radius="sm" size="sm" fullWidth>
            What I'm writing <span className={classes.shaka}>🤙</span>
          </Button>
          <Button variant="outline" radius="sm" size="sm" onClick={() => setOpened(true)} fullWidth>
            Stay in the loop
          </Button>
        </Stack>
      </motion.div>
      <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center' }}>
        <Box className={classes.imageWrapper}>
          <img src="/face.png" alt="Rob Dominguez" className={classes.image} />
        </Box>
      </motion.div>
    </motion.div>
    <SubscribeModal opened={opened} onClose={() => setOpened(false)} />
  </>
  );
}

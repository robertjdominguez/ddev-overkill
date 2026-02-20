import { AppShell, Burger, Affix, Group, Text, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import SideNav from './SideNav';

export default function AppShellLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentOutlet = useOutlet();

  const prevLocationKey = useRef(location.key);
  const scrollPositions = useRef(new Map<string, number>());

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    scrollPositions.current.set(prevLocationKey.current, window.scrollY);
    prevLocationKey.current = location.key;
  }, [location.key]);

  const onExitComplete = () => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.current.get(location.key);
      window.scrollTo(0, saved ?? 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <AppShell padding={{ base: 'lg', sm: 'xl' }}>
      <Affix position={{ top: 20, right: 20 }}>
        <Burger opened={opened} onClick={toggle} size="md" aria-label="Open navigation" />
      </Affix>

      <SideNav opened={opened} onClose={close} />

      <AppShell.Main>
        <Container size="md">
          <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
            <motion.div
              key={location.pathname.startsWith('/posts') ? '/posts' : location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {currentOutlet}
            </motion.div>
          </AnimatePresence>
        </Container>
      </AppShell.Main>

      {location.pathname !== '/' && (
        <Container size="md" py="xl">
          <Group justify="center">
            <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} Rob Dominguez</Text>
          </Group>
        </Container>
      )}
    </AppShell>
  );
}

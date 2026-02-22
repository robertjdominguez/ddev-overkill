import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation } from '@apollo/client';
import { TextInput, Button, Title, Text, Stack, Alert, Paper } from '@mantine/core';
import { motion, AnimatePresence } from 'motion/react';
import { SUBSCRIBE_NEWSLETTER } from '../data/mutations';
import classes from './SubscribeModal.module.css';

interface SubscribeModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ opened, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [subscribe, { loading }] = useMutation(SUBSCRIBE_NEWSLETTER, {
    onCompleted: () => {
      setSuccess(true);
    },
    onError: (err) => {
      if (err.message.includes('Uniqueness violation')) {
        setError("Looks like you're already subscribed!");
      } else {
        setError(err.message || 'Something went wrong');
      }
    },
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  useEffect(() => {
    if (!opened) {
      setEmail('');
      setError('');
      setSuccess(false);
    }
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [opened, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    subscribe({ variables: { email } });
  };

  return createPortal(
    <AnimatePresence>
      {opened && (
        <motion.div
          className={classes.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={classes.modal}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Paper p="xl" withBorder>
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <form onSubmit={handleSubmit}>
                      <Stack>
                        <Title order={3}>Stay in the loop</Title>
                        <Text size="sm" c="dimmed">
                          Get notified when I publish something new.
                        </Text>
                        {error && <Alert color="red">{error}</Alert>}
                        <TextInput
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.currentTarget.value)}
                          required
                        />
                        <Button type="submit" loading={loading} fullWidth>
                          Subscribe
                        </Button>
                      </Stack>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Stack align="center" py="md">
                      <Title order={3}>You're in!</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Check your inbox for a welcome email.
                      </Text>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

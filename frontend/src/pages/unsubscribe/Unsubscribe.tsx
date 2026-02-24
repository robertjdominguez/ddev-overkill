import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Center, Paper, Stack, Title, Text, Loader, Alert } from '@mantine/core';

const UNSUBSCRIBE = gql`
  mutation Unsubscribe($token: String!) {
    unsubscribe(token: $token) {
      success
    }
  }
`;

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const calledRef = useRef(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [unsubscribe, { loading }] = useMutation(UNSUBSCRIBE, {
    onCompleted: () => setDone(true),
    onError: (err) => setError(err.message || 'Something went wrong'),
  });

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;
    unsubscribe({ variables: { token } });
  }, [token, unsubscribe]);

  return (
    <Center mih="100vh">
      <Paper w={400} p="xl" withBorder>
        <Stack align="center">
          <Title order={2}>Unsubscribe</Title>
          {!token && <Alert color="red">Missing token.</Alert>}
          {loading && <Loader />}
          {done && (
            <Text ta="center">
              You've been unsubscribed. You won't receive any more emails from
              us.
            </Text>
          )}
          {error && <Alert color="red">{error}</Alert>}
        </Stack>
      </Paper>
    </Center>
  );
}

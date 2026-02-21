import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Alert, Center } from '@mantine/core';
import { useAuth } from '@/lib/auth';
import { ADMIN_LOGIN } from './data/mutations';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/admin';

  const [adminLogin, { loading }] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data) => {
      login(data.adminLogin.token, data.adminLogin.expiresAt);
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setError(err.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    adminLogin({ variables: { username, password } });
  };

  return (
    <Center mih="100vh">
      <Paper w={400} p="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Title order={2} ta="center">Admin Login</Title>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            <Button type="submit" loading={loading} fullWidth>
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}

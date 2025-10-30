import React from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your authentication logic here
    onLogin();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', mt: 8 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LockIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" gutterBottom>
                Sign In
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                Enter your credentials to access the admin panel
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
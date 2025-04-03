import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f0f4f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Dynamic Scheduling Tool
      </Typography>
      <Typography variant="h6" color="text.secondary" maxWidth="600px">
        Automatically manage your time with smart NLP-based task suggestions, conflict resolution, and priority-based scheduling.
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" onClick={() => navigate('/input')}>
          Get Started
        </Button>
        <Button variant="outlined" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default Landing;

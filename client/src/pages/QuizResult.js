import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const QuizResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://quiz-app-he1s.onrender.com/api/results/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(response.data);
      } catch (err) {
        setError('Failed to fetch result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Result not found</Alert>
      </Container>
    );
  }

  const scorePercentage = (result.score / (result.totalQuestions * 1)) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Score
              </Typography>
              <Typography variant="h3" color="primary">
                {result.score}/{result.totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scorePercentage.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Correct Answers
              </Typography>
              <Typography variant="h3" color="primary">
                {result.correctAnswers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of {result.totalQuestions}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Time Taken
              </Typography>
              <Typography variant="h3" color="primary">
                {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                minutes
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          Question Review
        </Typography>
        <List>
          {result.answers.map((answer, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={`Question ${index + 1}`}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {answer.isCorrect ? (
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      ) : (
                        <CancelIcon color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body2" color={answer.isCorrect ? 'success.main' : 'error.main'}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/quizzes"
          >
            Back to Quizzes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizResult; 
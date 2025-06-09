import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  background: 'rgba(44, 45, 49, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const QuestionCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const OptionLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(108, 99, 255, 0.1)',
  },
  '&.Mui-checked': {
    background: 'rgba(108, 99, 255, 0.15)',
  },
}));

const Timer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  right: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(44, 45, 49, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
  },
}));

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(response.data);
        setTimeLeft(response.data.timeLimit * 60);
        setAnswers(new Array(response.data.questions.length).fill(null));
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = parseInt(event.target.value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/results', {
        quizId: id,
        answers: answers.map((answer, index) => ({
          questionId: index,
          selectedOption: answer
        })),
        timeTaken: quiz.timeLimit * 60 - timeLeft
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/result/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting quiz result');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Container maxWidth="md">
      <Timer>
        <Typography variant="h6" gutterBottom>
          Time Remaining
        </Typography>
        <Typography variant="h4" color="primary">
          {formatTime(timeLeft)}
        </Typography>
      </Timer>

      <Box mt={4} mb={2}>
        <Typography variant="h4" gutterBottom>
          {quiz.title}
        </Typography>
        <ProgressBar variant="determinate" value={progress} />
        <Typography variant="body2" color="text.secondary" mt={1}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Typography>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard>
            <Typography variant="h5" gutterBottom>
              {quiz.questions[currentQuestionIndex].question}
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestionIndex]?.toString() || ''}
                onChange={handleAnswerChange}
              >
                {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <OptionLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </QuestionCard>
        </motion.div>
      </AnimatePresence>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={answers[currentQuestionIndex] === null}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || answers.some(answer => answer === null)}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default QuizAttempt; 
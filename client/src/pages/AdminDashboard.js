import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    category: '',
    timeLimit: 30,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  });

  const categories = [
    'General Knowledge',
    'Science',
    'Mathematics',
    'History',
    'Geography',
    'Literature',
    'Technology',
    'Sports',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [quizzesRes, usersRes] = await Promise.all([
        axios.get('https://quiz-app-he1s.onrender.com/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://quiz-app-he1s.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setQuizzes(quizzesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (quiz = null) => {
    if (quiz) {
      setSelectedQuiz(quiz);
      setQuizForm({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions
      });
    } else {
      setSelectedQuiz(null);
      setQuizForm({
        title: '',
        description: '',
        category: '',
        timeLimit: 30,
        questions: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuiz(null);
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      setError('Please fill in all question fields');
      return;
    }

    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    });
  };

  const handleRemoveQuestion = (index) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (quizForm.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (selectedQuiz) {
        await axios.put(
          `https://quiz-app-he1s.onrender.com/api/quizzes/${selectedQuiz._id}`,
          quizForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'https://quiz-app-he1s.onrender.com/api/quizzes',
          quizForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://quiz-app-he1s.onrender.com/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        setError('Failed to delete quiz');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Quizzes" />
            <Tab label="Users" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
              >
                Create New Quiz
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Time Limit</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizzes.map((quiz) => (
                    <TableRow key={quiz._id}>
                      <TableCell>{quiz.title}</TableCell>
                      <TableCell>{quiz.category}</TableCell>
                      <TableCell>{quiz.description}</TableCell>
                      <TableCell>{quiz.timeLimit} minutes</TableCell>
                      <TableCell>{quiz.questions.length}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(quiz)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleQuizSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={quizForm.title}
              onChange={(e) =>
                setQuizForm({ ...quizForm, title: e.target.value })
              }
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={quizForm.category}
                label="Category"
                onChange={(e) =>
                  setQuizForm({ ...quizForm, category: e.target.value })
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={quizForm.description}
              onChange={(e) =>
                setQuizForm({ ...quizForm, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Time Limit (minutes)"
              type="number"
              value={quizForm.timeLimit}
              onChange={(e) =>
                setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })
              }
              margin="normal"
              required
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Questions
            </Typography>

            {/* Question List */}
            <List>
              {quizForm.questions.map((question, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Question ${index + 1}: ${question.question}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Options:
                          </Typography>
                          {question.options.map((option, optIndex) => (
                            <Typography
                              key={optIndex}
                              variant="body2"
                              color={optIndex === question.correctAnswer ? 'success.main' : 'text.secondary'}
                            >
                              {`${optIndex + 1}. ${option} ${
                                optIndex === question.correctAnswer ? '(Correct)' : ''
                              }`}
                            </Typography>
                          ))}
                          <Typography variant="body2" color="text.secondary">
                            Points: {question.points}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            {/* Add Question Form */}
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Add New Question
              </Typography>
              <TextField
                fullWidth
                label="Question Text"
                value={currentQuestion.question}
                onChange={(e) =>
                  setCurrentQuestion({ ...currentQuestion, question: e.target.value })
                }
                margin="normal"
                required
              />
              {currentQuestion.options.map((option, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                  }}
                  margin="normal"
                  required
                />
              ))}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  value={currentQuestion.correctAnswer}
                  label="Correct Answer"
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: e.target.value
                    })
                  }
                >
                  {currentQuestion.options.map((_, index) => (
                    <MenuItem key={index} value={index}>
                      Option {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Points"
                type="number"
                value={currentQuestion.points}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    points: parseInt(e.target.value)
                  })
                }
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleQuizSubmit} variant="contained" color="primary">
            {selectedQuiz ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 
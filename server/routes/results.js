const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { auth, adminAuth } = require('../middleware/auth');

// Get specific result
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz', 'title category')
      .populate('user', 'username');
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check if user is authorized to view this result
    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this result' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error: error.message });
  }
});

// Get user's results
router.get('/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title category')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
});

// Get all results (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('quiz', 'title category')
      .populate('user', 'username')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
});

// Submit quiz result
router.post('/', auth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    
    // Get quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    let totalScore = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question.correctAnswer === answer.selectedOption;
      
      if (isCorrect) {
        correctAnswers++;
        totalScore += question.points;
      }

      return {
        questionId: index,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    });

    // Create result
    const result = new Result({
      user: req.user._id,
      quiz: quizId,
      score: totalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeTaken,
      answers: processedAnswers
    });

    await result.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz result', error: error.message });
  }
});

module.exports = router; 
// ===============================================================
// Quiz Data And State
// ===============================================================

// Questions - Object Array
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2, // Paris is at index 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1, // Mars is at index 1
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1, // 4 is at index 1
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1, // Blue Whale is at index 1
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2, // 7 is at index 2
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2, // Au is at index 2
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: 2, // Leonardo da Vinci is at index 2
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2, // Diamond is at index 2
  },
  {
    question: "Which ocean is the largest?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3, // Pacific Ocean is at index 3
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2, // 1945 is at index 2
  },
];

// SINGLE SOURCE OF TRUTH - All quiz state in one object
// Think of this as the "memory" of our quiz app
const quizState = {
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  score: 0,
  isAnswerSubmitted: false,
  userAnswers: new Array(quizData.length).fill(null), // Store all answers
  totalQuestions: quizData.length,
  isReviewMode: false, // Track if we're in review mode
};

// ===================
// DOM Elements Selector
// ===================

const questionId = document.getElementById("q-number");
const optionsContainer = document.getElementById("options-container");
const questionTextElement = document.getElementById("question-text");
const currentQuestionElement = document.getElementById("current-question");
const totalQuestionsElement = document.getElementById("total-questions");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const scoreElement = document.getElementById("score");
const submitBtn = document.getElementById("submit-btn");
const resultContainer = document.getElementById("result-container");
const finalScore = document.getElementById("final-score");
const quizContainer = document.getElementById("question-container");
const restartBtn = document.getElementById("restart-btn");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const percentage = document.getElementById("percentage");
const highScoreElement = document.getElementById("high-score");
const reviewBtn = document.getElementById("review-btn");
const highScoreMessage = document.getElementById("high-score-message");

// =======================================================
// HIGH SCORE SYSTEM with Local Storage
// ========================================================

// Get high score from localStorage or set to 0 if none exists
function getHighScore() {
  const savedScore = localStorage.getItem("quizHighScore");
  return savedScore ? parseInt(savedScore) : 0;
}

// Save new high score to localStorage
function saveHighScore(score) {
  localStorage.setItem("quizHighScore", score.toString());
}

// Update high score display
function updateHighScoreDisplay() {
  const highScore = getHighScore();
  // Check if element exists before updating
  if (highScoreElement) {
    highScoreElement.textContent = `🏆 High Score: ${highScore}`;
  }
}

// Check if current score is a new high score
function checkAndUpdateHighScore(currentScore) {
  const currentHighScore = getHighScore();
  if (currentScore > currentHighScore) {
    saveHighScore(currentScore);
    updateHighScoreDisplay();
    return true;
  }
  return false;
}

// =======================================================
// STATE MANAGEMENT FUNCTIONS
// ========================================================

// Update the UI based on current state
function updateUI() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];

  // Update question text
  questionTextElement.textContent = currentQuestion.question;

  // Update question numbers
  currentQuestionElement.textContent = quizState.currentQuestionIndex + 1;
  questionId.textContent = quizState.currentQuestionIndex + 1;
  totalQuestionsElement.textContent = quizData.length;

  // Update options
  updateOptions();

  // Update score display
  scoreElement.textContent = quizState.score;

  // Update button states
  updateButtonStates();

  // Update progress
  updateProgressBar();

  // Restore selected option if previously answered
  restoreSelectedOption();

  // Update high score display
  updateHighScoreDisplay();
}

// Update options in the DOM
function updateOptions() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((div, index) => {
    const optionText = div.querySelector(".option-text");
    if (optionText) {
      optionText.textContent = currentQuestion.options[index];
    }
    div.setAttribute("data-index", index);

    // Reset classes
    div.className = "option";

    // In review mode or if answer submitted, show correct/incorrect state
    const isAnswered =
      quizState.userAnswers[quizState.currentQuestionIndex] !== null;

    if (isAnswered || quizState.isReviewMode) {
      const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
      const correctAnswer = currentQuestion.correctAnswer;

      if (index === correctAnswer) {
        div.classList.add("correct");
      } else if (index === userAnswer && userAnswer !== correctAnswer) {
        div.classList.add("incorrect");
      }

      // Disable interaction in review mode or after submission
      div.classList.add("disabled");
    }
  });
}

// Update button states based on current state
function updateButtonStates() {
  // Previous button
  prevBtn.disabled = quizState.currentQuestionIndex === 0;

  // Next button
  nextBtn.disabled = quizState.currentQuestionIndex === quizData.length - 1;

  // Submit button - only show in quiz mode, not review mode
  if (quizState.isReviewMode) {
    submitBtn.style.display = "none";
  } else {
    submitBtn.style.display = "inline-block";
    if (quizState.isAnswerSubmitted) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitted";
    } else {
      submitBtn.disabled = quizState.selectedOptionIndex === null;
      submitBtn.textContent = "Submit Answer";
    }
  }

  // In review mode, change button labels
  if (quizState.isReviewMode) {
    prevBtn.textContent = "← Previous Question";
    nextBtn.textContent = "Next Question →";
  } else {
    prevBtn.textContent = "← Previous";
    nextBtn.textContent = "Next →";
  }
}

// Restore selected option when navigating between questions
function restoreSelectedOption() {
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((option) => {
    option.classList.remove("selected");
  });

  // If user has selected an option for this question, highlight it (not in review mode)
  if (quizState.selectedOptionIndex !== null && !quizState.isReviewMode) {
    const selectedOption = document.querySelector(
      `.option[data-index="${quizState.selectedOptionIndex}"]`
    );
    if (selectedOption && !quizState.isAnswerSubmitted) {
      selectedOption.classList.add("selected");
    }
  }
}

// ========================
// Option Selection Handler
// ========================

optionsContainer.addEventListener("click", (e) => {
  // Don't allow selection if answer already submitted or in review mode
  if (quizState.isAnswerSubmitted || quizState.isReviewMode) return;

  const clickedOption = e.target.closest(".option");
  if (!clickedOption) return;

  const selectedIndex = parseInt(clickedOption.getAttribute("data-index"));

  // Toggle selection
  if (quizState.selectedOptionIndex === selectedIndex) {
    // Deselect
    quizState.selectedOptionIndex = null;
    clickedOption.classList.remove("selected");
  } else {
    // Select new option
    quizState.selectedOptionIndex = selectedIndex;

    // Remove selection from all options
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => opt.classList.remove("selected"));

    // Add selection to clicked option
    clickedOption.classList.add("selected");
  }

  // Update button states
  updateButtonStates();
});

// ========================
// Submit Answer Handler
// ========================

submitBtn.addEventListener("click", () => {
  if (quizState.selectedOptionIndex === null || quizState.isAnswerSubmitted)
    return;

  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const isCorrect =
    quizState.selectedOptionIndex === currentQuestion.correctAnswer;

  // Store user's answer
  quizState.userAnswers[quizState.currentQuestionIndex] =
    quizState.selectedOptionIndex;

  // Update score if correct
  if (isCorrect) {
    quizState.score++;
    showCorrectFeedback();
  } else {
    showWrongFeedback();
  }

  // Mark answer as submitted
  quizState.isAnswerSubmitted = true;

  // Highlight correct/incorrect answers
  highlightAnswers();

  // Update UI
  updateUI();

  // Check if this is the last question
  if (quizState.currentQuestionIndex === quizData.length - 1) {
    showResults();
  }
});

// Highlight correct and incorrect answers
function highlightAnswers() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((option) => {
    const optionIndex = parseInt(option.getAttribute("data-index"));

    if (optionIndex === currentQuestion.correctAnswer) {
      option.classList.add("correct");
    } else if (
      optionIndex === quizState.selectedOptionIndex &&
      optionIndex !== currentQuestion.correctAnswer
    ) {
      option.classList.add("incorrect");
    }
  });
}

// ========================
// Navigation Handlers
// ========================

nextBtn.addEventListener("click", () => {
  if (quizState.currentQuestionIndex < quizData.length - 1) {
    // Move to next question
    quizState.currentQuestionIndex++;

    // Reset state for new question (only if not in review mode)
    if (!quizState.isReviewMode) {
      quizState.selectedOptionIndex =
        quizState.userAnswers[quizState.currentQuestionIndex];
      quizState.isAnswerSubmitted =
        quizState.userAnswers[quizState.currentQuestionIndex] !== null;
    }

    // Update UI
    updateUI();
    hideFeedback();
  }
});

prevBtn.addEventListener("click", () => {
  if (quizState.currentQuestionIndex > 0) {
    // Move to previous question
    quizState.currentQuestionIndex--;

    // Restore state for previous question (only if not in review mode)
    if (!quizState.isReviewMode) {
      quizState.selectedOptionIndex =
        quizState.userAnswers[quizState.currentQuestionIndex];
      quizState.isAnswerSubmitted =
        quizState.userAnswers[quizState.currentQuestionIndex] !== null;
    }

    // Update UI
    updateUI();
    hideFeedback();
  }
});

// =======================================
// Feedback Functions
// =======================================

function showCorrectFeedback() {
  feedback.textContent = "✅ Correct! Well done!";
  feedback.className = "feedback correct";
  feedback.style.display = "block";
}

function showWrongFeedback() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
  feedback.textContent = `𐄂 Wrong! The correct answer is: ${correctAnswer}`;
  feedback.className = "feedback incorrect";
  feedback.style.display = "block";
}

function hideFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
  feedback.style.display = "none";
}

// ===========================================
// Progress Bar
// ===========================================

function updateProgressBar() {
  const percent = Math.round(
    ((quizState.currentQuestionIndex + 1) / quizData.length) * 100
  );
  progressBar.style.width = `${percent}%`;
  percentage.textContent = `${percent}%`;
}

// ===========================================
// Results Screen
// ===========================================

function showResults() {
  // Check for new high score
  const isNewHighScore = checkAndUpdateHighScore(quizState.score);

  // Show results
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  // Display final score
  finalScore.textContent = `${quizState.score}/${quizData.length}`;

  // Show high score message if applicable
  if (highScoreMessage) {
    if (isNewHighScore) {
      highScoreMessage.textContent = "🎉 New High Score! 🎉";
      highScoreMessage.style.display = "block";
    } else {
      highScoreMessage.style.display = "none";
    }
  }

  // Update result message based on score
  const resultMessage = document.getElementById("result-message");
  const percentage = Math.round((quizState.score / quizData.length) * 100);

  let message = "";
  if (percentage >= 90) {
    message = "🎯 Excellent! You're a quiz master!";
  } else if (percentage >= 70) {
    message = "👍 Great job! You know your stuff!";
  } else if (percentage >= 50) {
    message = "😊 Good effort! Keep learning!";
  } else {
    message = "📚 Keep practicing! You'll get better!";
  }

  if (resultMessage) {
    resultMessage.textContent = message;
  }
}

// ===========================================
// REVIEW ANSWERS FEATURE
// ===========================================

function enterReviewMode() {
  // Enter review mode
  quizState.isReviewMode = true;
  quizState.currentQuestionIndex = 0;

  // Show quiz interface, hide results
  resultContainer.style.display = "none";
  quizContainer.style.display = "block";

  // Update UI for review mode
  updateUIForReview();
}

function updateUIForReview() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];

  // Update question text with review indicator
  questionTextElement.textContent = `Review: ${currentQuestion.question}`;

  // Update question numbers
  currentQuestionElement.textContent = quizState.currentQuestionIndex + 1;
  questionId.textContent = quizState.currentQuestionIndex + 1;

  // Update options for review (show correct/incorrect)
  updateOptionsForReview();

  // Hide score and progress in review mode
  document.querySelector(".score-display").style.display = "none";
  progressBar.style.display = "none";
  percentage.style.display = "none";

  // Update button states for review
  updateButtonStates();

  // Show feedback for this question
  showReviewFeedback();
}

function updateOptionsForReview() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const allOptions = document.querySelectorAll(".option");
  const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  allOptions.forEach((div, index) => {
    const optionText = div.querySelector(".option-text");
    if (optionText) {
      optionText.textContent = currentQuestion.options[index];
    }

    // Reset classes
    div.className = "option disabled";

    // Always show correct answer
    if (index === correctAnswer) {
      div.classList.add("correct");
    }

    // Show user's answer if different from correct answer
    if (index === userAnswer && userAnswer !== correctAnswer) {
      div.classList.add("incorrect");
    }

    // Highlight user's selected answer
    if (index === userAnswer) {
      div.classList.add("selected-review");
    }
  });
}

function showReviewFeedback() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;
  const isCorrect = userAnswer === correctAnswer;

  if (userAnswer === null) {
    feedback.textContent = "⏭️ You skipped this question";
    feedback.className = "feedback skipped";
  } else if (isCorrect) {
    feedback.textContent = `✅ You got it right! Your answer: "${currentQuestion.options[userAnswer]}"`;
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = `𐄂 Your answer: "${currentQuestion.options[userAnswer]}". Correct answer: "${currentQuestion.options[correctAnswer]}"`;
    feedback.className = "feedback incorrect";
  }

  feedback.style.display = "block";
}

function exitReviewMode() {
  // Exit review mode
  quizState.isReviewMode = false;

  // Show results screen
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  // Restore score and progress display
  document.querySelector(".score-display").style.display = "block";
  progressBar.style.display = "block";
  percentage.style.display = "block";
}

// ===========================================
// Restart Quiz
// ===========================================

restartBtn.addEventListener("click", () => {
  // Reset state
  quizState.currentQuestionIndex = 0;
  quizState.selectedOptionIndex = null;
  quizState.score = 0;
  quizState.isAnswerSubmitted = false;
  quizState.userAnswers.fill(null);
  quizState.isReviewMode = false;

  // Reset UI
  resultContainer.style.display = "none";
  quizContainer.style.display = "block";

  // Restore score and progress display
  document.querySelector(".score-display").style.display = "block";
  progressBar.style.display = "block";
  percentage.style.display = "block";

  // Reset button text
  prevBtn.textContent = "← Previous";
  nextBtn.textContent = "Next →";

  // Hide feedback
  hideFeedback();

  // Update UI
  updateUI();
});

// ===========================================
// Review Button Handler
// ===========================================

reviewBtn.addEventListener("click", enterReviewMode);

// Add a "Back to Results" button for review mode
// We need to modify the HTML to include this, but for now we'll add it dynamically
function addBackToResultsButton() {
  // Check if back button already exists
  if (!document.getElementById("back-to-results-btn")) {
    const backButton = document.createElement("button");
    backButton.id = "back-to-results-btn";
    backButton.className = "btn btn-secondary";
    backButton.textContent = "← Back to Results";
    backButton.style.marginRight = "10px";

    backButton.addEventListener("click", exitReviewMode);

    // Insert at the beginning of buttons container
    const buttonsContainer = document.querySelector(".buttons-container");
    if (buttonsContainer) {
      buttonsContainer.insertBefore(backButton, buttonsContainer.firstChild);
    }
  }
}

// ===========================================
// Initialize Quiz
// ===========================================

// Initial setup when page loads
function initQuiz() {
  // Set total questions display
  if (totalQuestionsElement) {
    totalQuestionsElement.textContent = quizData.length;
  }

  // Load high score from localStorage
  updateHighScoreDisplay();

  // Initial UI update
  updateUI();

  // Disable submit button initially
  submitBtn.disabled = true;

  // Hide results initially
  resultContainer.style.display = "none";
}

// Start the quiz when page loads
document.addEventListener("DOMContentLoaded", initQuiz);

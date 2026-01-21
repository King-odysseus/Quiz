// ===============================================================
// Quiz Data
// ===============================================================
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
  },
  {
    question: "Which ocean is the largest?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3,
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
];

// ===============================================================
// Quiz State
// ===============================================================
const quizState = {
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  score: 0,
  userAnswers: new Array(quizData.length).fill(null),
  answeredQuestions: new Set(),
};

// ========================================================================
// High Score Manager
// ========================================================================
const highScoreManager = {
  storageKey: "quizHighScore",

  // Get current high score from local storage
  getHighScore() {
    const storedScore = localStorage.getItem(this.storageKey);
    return storedScore ? parseInt(storedScore) : 0;
  },

  // Save new high score if it's higher than current
  saveHighScore(newScore) {
    const currentHighScore = this.getHighScore();
    if (newScore > currentHighScore) {
      localStorage.setItem(this.storageKey, newScore.toString());
      this.updateDisplay(); // Update display after saving
      return true;
    }
    return false;
  },

  // Update the high score display at the top of the page
  updateDisplay() {
    const highScoreElement = document.getElementById("high-score-value");
    if (highScoreElement) {
      const highScore = this.getHighScore();
      highScoreElement.textContent = highScore;
    }
  },

  // Clear high score (for testing)
  clearHighScore() {
    localStorage.removeItem(this.storageKey);
    this.updateDisplay();
  },
};

// ===================
// DOM Elements
// ===================
// High score elements
const highScoreValueElement = document.getElementById("high-score-value");

// Question elements
const questionNumberElement = document.getElementById("q-number");
const currentQuestionElement = document.getElementById("current-question");
const questionTextElement = document.getElementById("question-text");
const totalQuestionsElement = document.getElementById("total");
const totalQuestionsSpan = document.getElementById("total-questions");
const optionsContainer = document.getElementById("options-container");

// Navigation buttons
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const restartButton = document.getElementById("restart-btn");

// Score and progress
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const progressPercentage = document.getElementById("percentage");

// Feedback and results
const feedbackElement = document.getElementById("feedback");
const resultContainer = document.getElementById("result-container");
const finalScoreElement = document.getElementById("final-score");
const quizContainer = document.getElementById("question-container");
const newHighScoreSection = document.getElementById("new-high-score-section");

// Modal Display
const nameModal = getElementById("name-modal");
const modalScore = getElementById("modal-score");
const modalTotal = getElementById("modal-total");

// =======================================================
// Initialize Quiz
// =======================================================
function initializeQuiz() {
  // Reset quiz state
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.selectedOptionIndex = null;
  quizState.userAnswers.fill(null);
  quizState.answeredQuestions.clear();

  // Update displays
  updateScoreDisplay();
  displayQuestion(0);
  updateProgressBar();
  updateButtonStates();

  // Show high score from localStorage
  highScoreManager.updateDisplay();

  // Set total questions
  const totalQuestions = quizData.length;
  if (totalQuestionsElement) {
    totalQuestionsElement.textContent = totalQuestions;
  }
  if (totalQuestionsSpan) {
    totalQuestionsSpan.textContent = totalQuestions;
  }

  // Hide feedback and results
  hideFeedback();
  resultContainer.style.display = "none";
  quizContainer.style.display = "block";
  newHighScoreSection.style.display = "none";
}

// ==========================================
// Display Question
// ==========================================
function displayQuestion(index) {
  const question = quizData[index];

  // Update question number and text
  questionNumberElement.textContent = index + 1;
  currentQuestionElement.textContent = index + 1;
  questionTextElement.textContent = question.question;

  // Update options
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((div, i) => {
    div.querySelector(".option-text").textContent = question.options[i];
    div.setAttribute("data-index", i);
    div.className = "option";

    // Check if this question has been answered
    if (quizState.answeredQuestions.has(index)) {
      const userAnswer = quizState.userAnswers[index];
      const correctIndex = question.correctAnswer;

      // Highlight correct answer
      if (i === correctIndex) {
        div.classList.add("correct");
      }

      // Highlight if user answer was wrong
      if (userAnswer === i && userAnswer !== correctIndex) {
        div.classList.add("incorrect");
      }

      // Show user's selection
      if (userAnswer === i) {
        div.classList.add("selected");
      }

      // Disable all options for answered questions
      div.classList.add("disabled");
    }
  });
  updateButtonStates();
  updateProgressBar();
}

// ========================
// Option Click Handler
// ========================
optionsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".option");

  // Guard clause
  if (!clicked) return;

  // Prevent changing answer if already scored
  if (quizState.answeredQuestions.has(quizState.currentQuestionIndex)) {
    return;
  }

  // Toggle selection
  if (clicked.classList.contains("selected")) {
    clicked.classList.remove("selected");
    quizState.selectedOptionIndex = null;
    quizState.userAnswers[quizState.currentQuestionIndex] = null;
  } else {
    // Remove selection from all options
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Add selection to clicked option
    clicked.classList.add("selected");

    // Save user answer
    const selectedIndex = parseInt(clicked.getAttribute("data-index"));
    quizState.selectedOptionIndex = selectedIndex;
    quizState.userAnswers[quizState.currentQuestionIndex] = selectedIndex;
  }

  // Update button states after selection
  updateButtonStates();
});

// ========================
// Navigation Functions
// ========================
function goToNextQuestion() {
  const currentIndex = quizState.currentQuestionIndex;
  const isCurrentAnswered = quizState.answeredQuestions.has(currentIndex);

  // Only allow navigation if current question is answered
  if (currentIndex < quizData.length - 1 && isCurrentAnswered) {
    quizState.currentQuestionIndex++;

    // Clear selection if navigating to an unanswered question
    if (!quizState.answeredQuestions.has(quizState.currentQuestionIndex)) {
      quizState.selectedOptionIndex = null;
    }

    displayQuestion(quizState.currentQuestionIndex);
    hideFeedback();
    updateProgressBar();
  }
}

function goToPreviousQuestion() {
  const currentIndex = quizState.currentQuestionIndex;

  // Only allow going back if we're not on the first question
  if (currentIndex > 0) {
    quizState.currentQuestionIndex--;

    // Clear selection if navigating to an unanswered question
    if (!quizState.answeredQuestions.has(quizState.currentQuestionIndex)) {
      quizState.selectedOptionIndex = null;
    }

    displayQuestion(quizState.currentQuestionIndex);
    hideFeedback();
    updateProgressBar();
  }
}

// ========================
// Button Event Listeners
// ========================
nextButton.addEventListener("click", goToNextQuestion);
prevButton.addEventListener("click", goToPreviousQuestion);

// =======================================
// Feedback Functions
// =======================================
function showCorrectFeedback() {
  feedbackElement.textContent =
    "✅ Correct! You can now move to the next question";
  feedbackElement.className = "feedback correct";
  feedbackElement.style.display = "block";
}

function showWrongFeedback() {
  feedbackElement.textContent =
    "❌ Wrong! You can now move to the next question";
  feedbackElement.className = "feedback incorrect";
  feedbackElement.style.display = "block";
}

function hideFeedback() {
  feedbackElement.textContent = "";
  feedbackElement.className = "feedback";
  feedbackElement.style.display = "none";
}

// ==========================================
// Update Score Display
// ==========================================
function updateScoreDisplay() {
  scoreElement.textContent = quizState.score;
}

// ==========================================
// Update Progress Bar
// ==========================================
function updateProgressBar() {
  const percent = Math.round(
    ((quizState.currentQuestionIndex + 1) / quizData.length) * 100,
  );
  progressBar.style.width = percent + "%";
  progressPercentage.textContent = percent + "%";
}

// ==========================================
// Update Button States
// ==========================================
function updateButtonStates() {
  const currentIndex = quizState.currentQuestionIndex;
  const isAnswered = quizState.answeredQuestions.has(currentIndex);
  const hasSelection = quizState.selectedOptionIndex !== null;
  const isLastQuestion = currentIndex === quizData.length - 1;

  // Previous button - enable if not first question
  prevButton.disabled = currentIndex === 0;

  // Next button - ONLY enable if current question is answered AND not last question
  nextButton.disabled = !isAnswered || isLastQuestion;

  // Submit button - enable only if has selection AND question is not answered
  submitButton.disabled = !hasSelection || isAnswered;

  // Update submit button text based on status
  if (isAnswered) {
    submitButton.textContent = "✓ Answered";
  } else {
    submitButton.textContent = "Submit Answer";
  }
}

// ==========================================
// Submit Answer
// ==========================================
submitButton.addEventListener("click", () => {
  // Guard clause
  if (quizState.selectedOptionIndex === null) {
    return;
  }

  const currentIndex = quizState.currentQuestionIndex;
  const selectedIndex = quizState.selectedOptionIndex;
  const correctIndex = quizData[currentIndex].correctAnswer;
  const isCorrect = selectedIndex === correctIndex;

  // Check to see if it already has been scored
  if (!quizState.answeredQuestions.has(currentIndex)) {
    if (isCorrect) {
      quizState.score++;
      updateScoreDisplay();
      showCorrectFeedback();
    } else {
      showWrongFeedback();
    }

    // Mark question as answered
    quizState.answeredQuestions.add(currentIndex);
  } else {
    return;
  }

  // Update UI for answered question
  const allOptions = document.querySelectorAll(".option");

  // Highlight correct answer
  allOptions.forEach((option) => {
    const optionIndex = parseInt(option.getAttribute("data-index"));
    if (optionIndex === correctIndex) {
      option.classList.add("correct");
    }

    // Highlight incorrect user answer
    if (optionIndex === selectedIndex && !isCorrect) {
      option.classList.add("incorrect");
    }

    // Disable all options
    option.classList.add("disabled");
  });

  // Update button states after submission
  updateButtonStates();

  // Check if this is the last question
  if (currentIndex === quizData.length - 1) {
    // Show results after a short delay
    setTimeout(() => {
      resultContainer.style.display = "block";
      quizContainer.style.display = "none";
      finalScoreElement.textContent = `${quizState.score}/${quizData.length}`;

      // Check and save high score
      const isNewHighScore = highScoreManager.saveHighScore(quizState.score);
      if (isNewHighScore) {
        newHighScoreSection.style.display = "block";
      }
    }, 1000);
  }
});

// ============================================
// Restart Quiz
// ============================================
restartButton.addEventListener("click", initializeQuiz);

// ============================================
// Initialize the quiz when page loads
// ============================================
document.addEventListener("DOMContentLoaded", initializeQuiz);

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
const leaderboard = {
  storageKey: "quizLeaderboard",
  maxEntries: 5,

  // Get current high score from local storage
  getHighScore() {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      return 0;
    }
    try {
      return parseInt(storedData) || 0;
    } catch (error) {
      console.log("Error parsing high score data", error);
      return 0;
    }
  },

  // Get leaderboard
  getLeaderboard() {
    const storedData = localStorage.getItem(this.storageKey + "_leaderboard");
    if (!storedData) {
      return [];
    }
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.log("Error parsing leaderboard data", error);
      return [];
    }
  },

  saveToLeaderboard(playerName, playerScore) {
    // FIXED: Changed playername to playerName
    const leaderboardEntries = this.getLeaderboard();

    // Add new entry
    leaderboardEntries.push({
      name: playerName,
      score: playerScore,
      date: new Date().toISOString(),
    });

    // Sort by score (highest first) and keep only top entries
    leaderboardEntries.sort((a, b) => b.score - a.score);
    const trimmedEntries = leaderboardEntries.slice(0, this.maxEntries);

    // Save back to localStorage
    localStorage.setItem(
      this.storageKey + "_leaderboard",
      JSON.stringify(trimmedEntries),
    );

    return trimmedEntries;
  },

  // Check if a score qualifies for the leaderboard
  isHighScoreQualifying(score) {
    const leaderboardEntries = this.getLeaderboard();

    // If leaderboard isn't full, any score qualifies
    if (leaderboardEntries.length < this.maxEntries) {
      return true;
    }

    // Check if score is higher than the lowest score on leaderboard
    const lowestScore = leaderboardEntries[leaderboardEntries.length - 1].score;
    return score > lowestScore;
  },

  // Save new high score if it's higher than current absolute high score
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

  // Clear leaderboard (for testing)
  clearLeaderboard() {
    localStorage.removeItem(this.storageKey + "_leaderboard");
  },

  // Display leaderboard in the UI (if you have a leaderboard section)
  displayLeaderboard() {
    const leaderboardEntries = this.getLeaderboard();
    const leaderboardElement = document.getElementById("score-container");

    if (!leaderboardElement) return;

    if (leaderboardEntries.length === 0) {
      leaderboardElement.innerHTML =
        '<li class="empty">No scores yet. Be the first!</li>';
      return;
    }

    let html = "";
    leaderboardEntries.forEach((entry, index) => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString();
      html += `
        <li>
          <span class="rank">${index + 1}.</span>
          <span class="name">${entry.name}</span>
          <span class="score">${entry.score}</span>
          <span class="date">${formattedDate}</span>
        </li>
      `;
    });

    leaderboardElement.innerHTML = html;
  },
};

// ==========================================
// Initialize DOM Elements
// ==========================================
let highScoreValueElement;
let questionNumberElement;
let currentQuestionElement;
let questionTextElement;
let totalQuestionsElement;
let totalQuestionsSpan;
let optionsContainer;
let prevButton;
let nextButton;
let submitButton;
let restartButton;
let scoreElement;
let progressBar;
let progressPercentage;
let feedbackElement;
let resultContainer;
let finalScoreElement;
let quizContainer;
let newHighScoreSection;
let nameModal;
let modalScore;
let modalTotal;
let playerNameInput;
let saveScoreBtn;
let skipSaveBtn;
let closeModalBtn;
let nameError;

function initializeDOMElements() {
  // High score elements
  highScoreValueElement = document.getElementById("high-score-value");

  // Question elements
  questionNumberElement = document.getElementById("q-number");
  currentQuestionElement = document.getElementById("current-question");
  questionTextElement = document.getElementById("question-text");
  totalQuestionsElement = document.getElementById("total");
  totalQuestionsSpan = document.getElementById("total-questions");
  optionsContainer = document.getElementById("options-container");

  // Navigation buttons
  prevButton = document.getElementById("prev-btn");
  nextButton = document.getElementById("next-btn");
  submitButton = document.getElementById("submit-btn");
  restartButton = document.getElementById("restart-btn");

  // Score and progress
  scoreElement = document.getElementById("score");
  progressBar = document.getElementById("progress-bar");
  progressPercentage = document.getElementById("percentage");

  // Feedback and results
  feedbackElement = document.getElementById("feedback");
  resultContainer = document.getElementById("result-container");
  finalScoreElement = document.getElementById("final-score");
  quizContainer = document.getElementById("question-container");
  newHighScoreSection = document.getElementById("new-high-score-section");

  // Modal Display
  nameModal = document.getElementById("name-modal");
  modalScore = document.getElementById("modal-score");
  modalTotal = document.getElementById("modal-total");
  playerNameInput = document.getElementById("player-name");
  saveScoreBtn = document.getElementById("save-score-btn");
  skipSaveBtn = document.getElementById("skip-save-btn");
  closeModalBtn = document.getElementById("close-modal-btn");
  nameError = document.getElementById("name-error");
}

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
  leaderboard.updateDisplay(); // FIXED: Changed from highScoreManager to leaderboard

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

  // Hide modal if it's open
  if (nameModal) {
    nameModal.style.display = "none";
  }
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

  // Clear all options first
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((div, i) => {
    // Reset classes
    div.className = "option";

    // Update option text
    if (i < question.options.length) {
      div.querySelector(".option-text").textContent = question.options[i];
      div.setAttribute("data-index", i);
    }

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

  // Update selected option for unanswered questions
  if (!quizState.answeredQuestions.has(index)) {
    const userAnswer = quizState.userAnswers[index];
    if (userAnswer !== null && allOptions[userAnswer]) {
      allOptions[userAnswer].classList.add("selected");
    }
  }

  updateButtonStates();
  updateProgressBar();
}

// ========================
// Option Click Handler
// ========================
function setupOptionListeners() {
  if (optionsContainer) {
    optionsContainer.addEventListener("click", (e) => {
      const clicked = e.target.closest(".option");

      // Guard clause
      if (!clicked) return;

      // Prevent changing answer if already scored
      if (quizState.answeredQuestions.has(quizState.currentQuestionIndex)) {
        return;
      }

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

      // Update button states after selection
      updateButtonStates();
    });
  }
}

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
function setupNavigationListeners() {
  if (nextButton) {
    nextButton.addEventListener("click", goToNextQuestion);
  }

  if (prevButton) {
    prevButton.addEventListener("click", goToPreviousQuestion);
  }

  if (restartButton) {
    restartButton.addEventListener("click", initializeQuiz);
  }

  if (submitButton) {
    submitButton.addEventListener("click", handleSubmit);
  }
}

// =======================================
// Feedback Functions
// =======================================
function showCorrectFeedback() {
  if (feedbackElement) {
    feedbackElement.textContent =
      "✅ Correct! You can now move to the next question";
    feedbackElement.className = "feedback correct";
    feedbackElement.style.display = "block";
  }
}

function showWrongFeedback() {
  if (feedbackElement) {
    feedbackElement.textContent =
      "❌ Wrong! You can now move to the next question";
    feedbackElement.className = "feedback incorrect";
    feedbackElement.style.display = "block";
  }
}

function hideFeedback() {
  if (feedbackElement) {
    feedbackElement.textContent = "";
    feedbackElement.className = "feedback";
    feedbackElement.style.display = "none";
  }
}

// ==========================================
// Update Score Display
// ==========================================
function updateScoreDisplay() {
  if (scoreElement) {
    scoreElement.textContent = quizState.score;
  }
}

// ==========================================
// Update Progress Bar
// ==========================================
function updateProgressBar() {
  if (progressBar && progressPercentage) {
    const percent = Math.round(
      ((quizState.currentQuestionIndex + 1) / quizData.length) * 100,
    );
    progressBar.style.width = percent + "%";
    progressPercentage.textContent = percent + "%";
  }
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
  if (prevButton) {
    prevButton.disabled = currentIndex === 0;
  }

  // Next button - ONLY enable if current question is answered AND not last question
  if (nextButton) {
    nextButton.disabled = !isAnswered || isLastQuestion;
  }

  // Submit button - enable only if has selection AND question is not answered
  if (submitButton) {
    submitButton.disabled = !hasSelection || isAnswered;

    // Update submit button text based on status
    if (isAnswered) {
      submitButton.textContent = "✓ Answered";
    } else {
      submitButton.textContent = "Submit Answer";
    }
  }
}

// ==========================================
// Submit Answer
// ==========================================
function handleSubmit() {
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
      if (resultContainer) {
        resultContainer.style.display = "block";
      }
      if (quizContainer) {
        quizContainer.style.display = "none";
      }
      if (finalScoreElement) {
        finalScoreElement.textContent = `${quizState.score}/${quizData.length}`;
      }

      // Check and save high score
      const isNewHighScore = leaderboard.saveHighScore(quizState.score); // FIXED: Changed from highScoreManager
      if (isNewHighScore && newHighScoreSection) {
        newHighScoreSection.style.display = "block";
      }

      // Show modal for leaderboard entry
      showScoreModal();
    }, 1000);
  }
}

// ============================================
// Modal Functions
// ============================================
function showScoreModal() {
  const score = quizState.score;

  // Check if score qualifies for leaderboard
  if (leaderboard.isHighScoreQualifying(score)) {
    // Show modal to enter name
    if (nameModal) {
      nameModal.style.display = "flex";
    }
    if (modalScore) {
      modalScore.textContent = score;
    }
    if (modalTotal) {
      modalTotal.textContent = quizData.length;
    }
  } else {
    // Just show results without modal
    if (nameModal) {
      nameModal.style.display = "none";
    }
  }
}

function saveLeaderboardEntry() {
  const playerName = playerNameInput.value.trim();
  const score = quizState.score;

  if (playerName.length < 2) {
    if (nameError) {
      nameError.textContent = "Please enter at least 2 characters";
    }
    return;
  }

  // Save to leaderboard
  leaderboard.saveToLeaderboard(playerName, score);
  console.log(localStorage.getItem("leaderboard"));

  // Also save as high score if it's the highest
  leaderboard.saveHighScore(score);

  // Close modal and show updated leaderboard
  if (nameModal) {
    nameModal.style.display = "none";
  }
  if (nameError) {
    nameError.textContent = "";
  }
  if (playerNameInput) {
    playerNameInput.value = "";
  }

  // Update leaderboard display
  leaderboard.displayLeaderboard();
  leaderboard.updateDisplay();
}

function setupModalListeners() {
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener("click", saveLeaderboardEntry);
  }

  if (skipSaveBtn) {
    skipSaveBtn.addEventListener("click", () => {
      if (nameModal) {
        nameModal.style.display = "none";
      }
      if (nameError) {
        nameError.textContent = "";
      }
      if (playerNameInput) {
        playerNameInput.value = "";
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (nameModal) {
        nameModal.style.display = "none";
      }
      if (nameError) {
        nameError.textContent = "";
      }
      if (playerNameInput) {
        playerNameInput.value = "";
      }
    });
  }
}

// ============================================
// Initialize the quiz when page loads
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  initializeDOMElements();

  // Setup event listeners
  setupOptionListeners();
  setupNavigationListeners();
  setupModalListeners();

  // Initialize the quiz
  initializeQuiz();
});

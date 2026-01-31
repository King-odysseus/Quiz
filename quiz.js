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
// Game Mode & Multiplayer State
// ===============================================================
const gameConfig = {
  mode: "single", // 'single' or 'multiplayer'
  totalQuestions: 10, // We'll make this configurable later
  players: [
    {
      id: 1,
      name: "Player 1",
      score: 0,
      selectedOptionIndex: null,
      userAnswers: [],
      isCurrentPlayer: true,
    },
    {
      id: 2,
      name: "Player 2",
      score: 0,
      selectedOptionIndex: null,
      userAnswers: [],
      isCurrentPlayer: false,
    },
  ],
  currentPlayerIndex: 0,
  answeredPlayers: new Set(), // Track which players have answered current question
};
// ===============================================================
// Game Mode Selection
// ===============================================================
function setupGameModeSelection() {
  const {
    singleModeBtn,
    multiplayerModeBtn,
    playerNamesSection,
    startMultiplayerBtn,
    player1NameInput,
    player2NameInput,
  } = initializeMultiplayerDOMElements();

  if (!singleModeBtn || !multiplayerModeBtn) return;

  // Single player mode
  singleModeBtn.addEventListener("click", () => {
    gameConfig.mode = "single";
    singleModeBtn.classList.add("active");
    multiplayerModeBtn.classList.remove("active");
    playerNamesSection.style.display = "none";

    // Reset to single player mode
    hideMultiplayerUI();
    initializeQuiz(); // Restart quiz in single player mode
  });

  // Multiplayer mode
  multiplayerModeBtn.addEventListener("click", () => {
    gameConfig.mode = "multiplayer";
    multiplayerModeBtn.classList.add("active");
    singleModeBtn.classList.remove("active");
    playerNamesSection.style.display = "block";
  });

  // Start multiplayer game
  if (startMultiplayerBtn) {
    startMultiplayerBtn.addEventListener("click", () => {
      // Update player names
      gameConfig.players[0].name = player1NameInput.value.trim() || "Player 1";
      gameConfig.players[1].name = player2NameInput.value.trim() || "Player 2";

      // Reset game state for multiplayer
      resetMultiplayerGame();

      // Show multiplayer UI
      setupMultiplayerUI();

      // Initialize multiplayer quiz
      initializeMultiplayerQuiz();
    });
  }
}

// ===============================================================
// Multiplayer UI Functions
// ===============================================================
function setupMultiplayerUI() {
  // Check if players container already exists
  let playersContainer = document.querySelector(".players-container");

  if (!playersContainer) {
    // Create players container HTML
    playersContainer = document.createElement("div");
    playersContainer.className = "players-container";

    playersContainer.innerHTML = `
      <div class="player-panel" data-player-id="1">
        <div class="player-name">${gameConfig.players[0].name}</div>
        <div class="player-score">Score: <span class="player-score-value">0</span></div>
        <div class="player-turn-indicator">🎤 YOUR TURN</div>
      </div>
      
      <div class="player-panel" data-player-id="2">
        <div class="player-name">${gameConfig.players[1].name}</div>
        <div class="player-score">Score: <span class="player-score-value">0</span></div>
        <div class="player-turn-indicator">Waiting...</div>
      </div>
    `;

    // Insert before the question container
    const questionContainer = document.querySelector(".question-container");
    if (questionContainer) {
      questionContainer.parentNode.insertBefore(
        playersContainer,
        questionContainer,
      );
    }
  }

  // Update player names in case they changed
  updatePlayerPanels();
}

function hideMultiplayerUI() {
  const playersContainer = document.querySelector(".players-container");
  if (playersContainer) {
    playersContainer.remove();
  }
}

function updatePlayerPanels() {
  gameConfig.players.forEach((player, index) => {
    const panel = document.querySelector(`[data-player-id="${player.id}"]`);
    if (panel) {
      // Update name
      const nameElement = panel.querySelector(".player-name");
      if (nameElement) {
        nameElement.textContent = player.name;
      }

      // Update score
      const scoreElement = panel.querySelector(".player-score-value");
      if (scoreElement) {
        scoreElement.textContent = player.score;
      }

      // Update turn indicator
      const indicator = panel.querySelector(".player-turn-indicator");
      if (indicator) {
        if (index === gameConfig.currentPlayerIndex) {
          indicator.textContent = "🎤 YOUR TURN";
          panel.classList.add("active");
        } else {
          indicator.textContent = "Waiting...";
          panel.classList.remove("active");
        }
      }
    }
  });
}
// ===============================================================
// Multiplayer Quiz Functions
// ===============================================================
function initializeMultiplayerQuiz() {
  // Reset game config
  resetMultiplayerGame();

  // Hide other sections
  if (resultContainer) resultContainer.style.display = "none";
  if (quizContainer) quizContainer.style.display = "block";
  if (reviewContainer) reviewContainer.style.display = "none";

  // Reset quiz state for single player compatibility
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

  // Setup multiplayer-specific listeners
  setupMultiplayerOptionListeners();
}

function resetMultiplayerGame() {
  // Reset players
  gameConfig.players.forEach((player) => {
    player.score = 0;
    player.selectedOptionIndex = null;
    player.userAnswers = [];
  });

  gameConfig.players[0].isCurrentPlayer = true;
  gameConfig.players[1].isCurrentPlayer = false;
  gameConfig.currentPlayerIndex = 0;
  gameConfig.answeredPlayers.clear();

  // Update UI
  updatePlayerPanels();
}

// ===============================================================
// Multiplayer Option Selection
// ===============================================================
function setupMultiplayerOptionListeners() {
  if (optionsContainer) {
    // Remove existing listener if any
    optionsContainer.removeEventListener("click", handleMultiplayerOptionClick);

    // Add multiplayer listener
    optionsContainer.addEventListener("click", handleMultiplayerOptionClick);
  }
}

function handleMultiplayerOptionClick(e) {
  // Only handle clicks in multiplayer mode
  if (gameConfig.mode !== "multiplayer") {
    return; // Fall back to single player behavior
  }

  const clicked = e.target.closest(".option");
  if (!clicked) return;

  const currentPlayer = gameConfig.players[gameConfig.currentPlayerIndex];

  // Check if current player has already answered this question
  if (gameConfig.answeredPlayers.has(currentPlayer.id)) {
    return;
  }

  // Remove previous selection for this player
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((opt) => {
    opt.classList.remove(`selected-player-${currentPlayer.id}`);
  });

  // Add new selection
  clicked.classList.add(`selected-player-${currentPlayer.id}`);

  // Save selection
  const selectedIndex = parseInt(clicked.getAttribute("data-index"));
  currentPlayer.selectedOptionIndex = selectedIndex;

  // Ensure userAnswers array is long enough
  if (!currentPlayer.userAnswers[quizState.currentQuestionIndex]) {
    currentPlayer.userAnswers[quizState.currentQuestionIndex] = selectedIndex;
  }

  // Mark player as answered
  gameConfig.answeredPlayers.add(currentPlayer.id);

  // Check if both players have answered
  if (gameConfig.answeredPlayers.size === gameConfig.players.length) {
    // Both players answered - show results after delay
    setTimeout(processMultiplayerAnswers, 1000);
  } else {
    // Switch to next player
    switchToNextPlayer();
  }

  updateButtonStates();
}
// ===============================================================
// Player Turn Management
// ===============================================================
function switchToNextPlayer() {
  // Remove active class from current player
  const currentPanel = document.querySelector(
    `[data-player-id="${gameConfig.players[gameConfig.currentPlayerIndex].id}"]`,
  );
  if (currentPanel) {
    currentPanel.classList.remove("active");
  }

  // Move to next player
  gameConfig.currentPlayerIndex =
    (gameConfig.currentPlayerIndex + 1) % gameConfig.players.length;

  // Update UI
  updatePlayerPanels();
}

function processMultiplayerAnswers() {
  const currentQuestion = quizData[quizState.currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  // Check each player's answer
  gameConfig.players.forEach((player) => {
    if (player.selectedOptionIndex === correctAnswer) {
      player.score++;

      // Highlight their correct choice
      const playerOptions = document.querySelectorAll(
        `.selected-player-${player.id}`,
      );
      playerOptions.forEach((opt) => {
        opt.classList.add("correct");
      });
    } else {
      // Highlight their incorrect choice
      const playerOptions = document.querySelectorAll(
        `.selected-player-${player.id}`,
      );
      playerOptions.forEach((opt) => {
        opt.classList.add("incorrect");
      });
    }

    // Clear selection for next question
    player.selectedOptionIndex = null;
  });

  // Highlight correct answer for all to see
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((opt) => {
    const optionIndex = parseInt(opt.getAttribute("data-index"));
    if (optionIndex === correctAnswer) {
      opt.classList.add("correct");
    }
    opt.classList.add("disabled");
  });

  // Mark question as answered in single player state for compatibility
  quizState.answeredQuestions.add(quizState.currentQuestionIndex);
  quizState.score = Math.max(...gameConfig.players.map((p) => p.score));

  // Update score display
  updateScoreDisplay();
  updatePlayerPanels();

  // Enable next button
  if (nextButton) {
    nextButton.disabled = false;
  }

  // Clear answered players for next question
  gameConfig.answeredPlayers.clear();

  // Reset to player 1 for next question
  gameConfig.currentPlayerIndex = 0;
  updatePlayerPanels();
}

// ===============================================================
// Initialize Multiplayer DOM Elements
// ===============================================================
function initializeMultiplayerDOMElements() {
  // Game mode selector elements
  const singleModeBtn = document.querySelector('[data-mode="single"]');
  const multiplayerModeBtn = document.querySelector(
    '[data-mode="multiplayer"]',
  );
  const playerNamesSection = document.getElementById("player-names-section");
  const startMultiplayerBtn = document.getElementById("start-multiplayer-btn");
  const player1NameInput = document.getElementById("player1-name");
  const player2NameInput = document.getElementById("player2-name");

  return {
    singleModeBtn,
    multiplayerModeBtn,
    playerNamesSection,
    startMultiplayerBtn,
    player1NameInput,
    player2NameInput,
  };
}

// ===============================================================
// Initialize Multiplayer DOM Elements
// ===============================================================
function initializeMultiplayerDOMElements() {
  // Game mode selector elements
  const singleModeBtn = document.querySelector('[data-mode="single"]');
  const multiplayerModeBtn = document.querySelector(
    '[data-mode="multiplayer"]',
  );
  const playerNamesSection = document.getElementById("player-names-section");
  const startMultiplayerBtn = document.getElementById("start-multiplayer-btn");
  const player1NameInput = document.getElementById("player1-name");
  const player2NameInput = document.getElementById("player2-name");

  return {
    singleModeBtn,
    multiplayerModeBtn,
    playerNamesSection,
    startMultiplayerBtn,
    player1NameInput,
    player2NameInput,
  };
}
//
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
  maxEntries: 10,

  // Get leaderboard
  getLeaderboard() {
    const storedData = localStorage.getItem(this.storageKey);
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

  saveToLeaderboard(playerName, playerScore, totalQuestions) {
    const leaderboardEntries = this.getLeaderboard();

    const percentage = Math.round((playerScore / totalQuestions) * 100);

    // Add new entry
    leaderboardEntries.push({
      name: playerName,
      score: playerScore,
      total: totalQuestions,
      percentage: percentage,
      date: new Date().toISOString(),
    });

    // Sort by percentage (descending), then by date (earlier first for ties)
    leaderboardEntries.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return new Date(a.date) - new Date(b.date);
    });

    // Keep only top entries
    const trimmedEntries = leaderboardEntries.slice(0, this.maxEntries);

    // Save back to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedEntries));

    // Return player's position (1-based index)
    const playerPosition =
      trimmedEntries.findIndex(
        (entry) => entry.name === playerName && entry.score === playerScore,
      ) + 1;

    return {
      leaderboard: trimmedEntries,
      playerPosition: playerPosition,
      madeLeaderboard: playerPosition <= this.maxEntries,
    };
  },

  // Check if a score qualifies for the leaderboard
  isHighScoreQualifying(score, total) {
    const leaderboardEntries = this.getLeaderboard();
    const percentage = Math.round((score / total) * 100);

    // If leaderboard isn't full, any score qualifies
    if (leaderboardEntries.length < this.maxEntries) {
      return true;
    }

    // Check if percentage is higher than the lowest percentage on leaderboard
    const lowestPercentage =
      leaderboardEntries[leaderboardEntries.length - 1].percentage;
    return percentage >= lowestPercentage;
  },

  getHighestScore() {
    const leaderboardEntries = this.getLeaderboard();
    if (leaderboardEntries.length === 0) {
      return { score: 0, total: 0 };
    }
    return {
      score: leaderboardEntries[0].score,
      total: leaderboardEntries[0].total,
    };
  },

  // Update the high score display at the top of the page
  updateDisplay() {
    const highScoreValueElement = document.getElementById("high-score-value");
    if (highScoreValueElement) {
      const highestScore = this.getHighestScore();
      highScoreValueElement.textContent = `${highestScore.score}/${highestScore.total}`;
    }
  },

  // Display leaderboard in the UI
  displayLeaderboard() {
    const leaderboardEntries = this.getLeaderboard();
    const scoreContainer = document.getElementById("score-container");

    if (!scoreContainer) return;

    if (leaderboardEntries.length === 0) {
      scoreContainer.innerHTML = `
        <div class="no-scores-message">
          No high scores yet. Be the first!
        </div>
      `;
      return;
    }

    let html = "";
    leaderboardEntries.forEach((entry, index) => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString();
      const medal =
        index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

      html += `
        <div class="score-item ${index < 3 ? "top-score" : ""}">
          <div class="score-rank">${medal} #${index + 1}</div>
          <div class="score-name">${entry.name}</div>
          <div class="score-value">${entry.score}/${entry.total}</div>
          <div class="score-percentage">${entry.percentage}%</div>
          <div class="score-date">${formattedDate}</div>
        </div>
      `;
    });

    scoreContainer.innerHTML = html;
  },

  // Clear leaderboard (for testing)
  clearLeaderboard() {
    if (confirm("Are you sure you want to clear all high scores?")) {
      localStorage.removeItem(this.storageKey);
      this.updateDisplay();
      this.displayLeaderboard();
      alert("Leaderboard cleared!");
    }
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
let highScoresSection;
let backToQuizBtn;
let clearLeaderboardBtn;
let leaderboardBtn;
let reviewBtn;
let reviewContainer;
let correctCountElement;
let incorrectCountElement;
let reviewScoreElement;
let reviewQuestionsContainer;
let backToResultsBtn;
let restartAfterReviewBtn;
let resultMessage;

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
  reviewBtn = document.getElementById("review-btn");
  leaderboardBtn = document.getElementById("leaderboard-btn");

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
  resultMessage = document.getElementById("result-message");

  // Review elements
  reviewContainer = document.getElementById("review-container");
  correctCountElement = document.getElementById("correct-count");
  incorrectCountElement = document.getElementById("incorrect-count");
  reviewScoreElement = document.getElementById("review-score");
  reviewQuestionsContainer = document.getElementById("review-questions");
  backToResultsBtn = document.getElementById("back-to-results-btn");
  restartAfterReviewBtn = document.getElementById("restart-after-review-btn");

  // Modal Display
  nameModal = document.getElementById("name-modal");
  modalScore = document.getElementById("modal-score");
  modalTotal = document.getElementById("modal-total");
  playerNameInput = document.getElementById("player-name");
  saveScoreBtn = document.getElementById("save-score-btn");
  skipSaveBtn = document.getElementById("skip-save-btn");
  closeModalBtn = document.getElementById("close-modal-btn");
  nameError = document.getElementById("name-error");

  // Leaderboard section
  highScoresSection = document.getElementById("high-scores-section");
  backToQuizBtn = document.getElementById("back-to-quiz-btn");
  clearLeaderboardBtn = document.getElementById("clear-leaderboard-btn");
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
  leaderboard.updateDisplay();

  // Set total questions
  const totalQuestions = quizData.length;
  if (totalQuestionsElement) {
    totalQuestionsElement.textContent = totalQuestions;
  }
  if (totalQuestionsSpan) {
    totalQuestionsSpan.textContent = totalQuestions;
  }

  // Hide all containers except question container
  hideFeedback();
  if (resultContainer) resultContainer.style.display = "none";
  if (quizContainer) quizContainer.style.display = "block";
  if (newHighScoreSection) newHighScoreSection.style.display = "none";
  if (highScoresSection) highScoresSection.style.display = "none";
  if (nameModal) nameModal.style.display = "none";
  if (reviewContainer) reviewContainer.style.display = "none";
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
  // Reset multiplayer state for new question (if in multiplayer mode)
  if (gameConfig.mode === "multiplayer") {
    gameConfig.answeredPlayers.clear();

    // Clear player-specific selections
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      gameConfig.players.forEach((player) => {
        opt.classList.remove(`selected-player-${player.id}`);
      });
    });

    // Reset current player to player 1
    gameConfig.currentPlayerIndex = 0;
    updatePlayerPanels();
  }

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

  if (reviewBtn) {
    reviewBtn.addEventListener("click", showReview);
  }

  if (leaderboardBtn) {
    leaderboardBtn.addEventListener("click", showLeaderboard);
  }

  if (backToQuizBtn) {
    backToQuizBtn.addEventListener("click", hideLeaderboard);
  }

  if (clearLeaderboardBtn) {
    clearLeaderboardBtn.addEventListener("click", () => {
      leaderboard.clearLeaderboard();
    });
  }

  if (backToResultsBtn) {
    backToResultsBtn.addEventListener("click", backToResults);
  }

  if (restartAfterReviewBtn) {
    restartAfterReviewBtn.addEventListener("click", initializeQuiz);
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
  if (gameConfig.mode === "multiplayer") {
    return;
  }
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

      // Update result message based on score
      updateResultMessage();

      // Show modal for leaderboard entry
      showScoreModal();
    }, 1000);
  }
}

// ============================================
// Review Functions
// ============================================
function showReview() {
  if (resultContainer) resultContainer.style.display = "none";
  if (quizContainer) quizContainer.style.display = "none";
  if (highScoresSection) highScoresSection.style.display = "none";
  if (reviewContainer) {
    reviewContainer.style.display = "block";
    displayReview();
  }
}

function displayReview() {
  const totalQuestions = quizData.length;
  const correctAnswers = quizState.score;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Update summary
  if (correctCountElement) correctCountElement.textContent = correctAnswers;
  if (incorrectCountElement)
    incorrectCountElement.textContent = incorrectAnswers;
  if (reviewScoreElement)
    reviewScoreElement.textContent = `${correctAnswers}/${totalQuestions}`;

  // Generate review questions
  let reviewHTML = "";

  quizData.forEach((question, index) => {
    const userAnswer = quizState.userAnswers[index];
    const correctAnswer = question.correctAnswer;
    const isCorrect = userAnswer === correctAnswer;
    const userAnswerText =
      userAnswer !== null ? question.options[userAnswer] : "Not answered";
    const correctAnswerText = question.options[correctAnswer];

    reviewHTML += `
      <div class="review-question-item ${isCorrect ? "correct" : "incorrect"}">
        <div class="review-question-header">
          <div class="review-question-number">Question ${index + 1}</div>
          <div class="review-question-status ${isCorrect ? "correct" : "incorrect"}">
            ${isCorrect ? "✅ Correct" : "❌ Incorrect"}
          </div>
        </div>
        
        <div class="review-question-text">${question.question}</div>
        
        <div class="review-options">
          ${question.options
            .map((option, optionIndex) => {
              let optionClass = "review-option";
              let isUserAnswer = userAnswer === optionIndex;
              let isCorrectAnswer = optionIndex === correctAnswer;

              if (isCorrectAnswer) optionClass += " correct-answer";
              if (isUserAnswer && isCorrectAnswer)
                optionClass += " user-answer";
              if (isUserAnswer && !isCorrectAnswer)
                optionClass += " user-incorrect";

              return `
              <div class="${optionClass}">
                <div class="review-option-letter">${String.fromCharCode(65 + optionIndex)}</div>
                <div class="review-option-text">${option}</div>
              </div>
            `;
            })
            .join("")}
        </div>
        
        ${
          !isCorrect
            ? `
          <div class="review-explanation">
            <span class="explanation-label">Your answer:</span> ${userAnswerText}<br>
            <span class="explanation-label">Correct answer:</span> ${correctAnswerText}
          </div>
        `
            : ""
        }
      </div>
    `;
  });

  if (reviewQuestionsContainer) {
    reviewQuestionsContainer.innerHTML = reviewHTML;
  }
}

function backToResults() {
  if (reviewContainer) reviewContainer.style.display = "none";
  if (resultContainer) resultContainer.style.display = "block";
}

function updateResultMessage() {
  if (!resultMessage) return;

  const percentage = (quizState.score / quizData.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect score! 🎉 You're a quiz master!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Excellent work! 🏅 You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good job! 👍 Keep learning and improving!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! 📚 Try again to improve your score!";
  } else {
    resultMessage.textContent =
      "Keep practicing! 💪 Every quiz makes you better!";
  }
}

// ============================================
// Modal Functions
// ============================================
function showScoreModal() {
  const score = quizState.score;
  const total = quizData.length;

  // Check if score qualifies for leaderboard
  if (leaderboard.isHighScoreQualifying(score, total)) {
    // Show new high score message
    if (newHighScoreSection) {
      newHighScoreSection.style.display = "block";
    }

    // Show modal to enter name
    if (nameModal) {
      nameModal.style.display = "flex";
    }
    if (modalScore) {
      modalScore.textContent = score;
    }
    if (modalTotal) {
      modalTotal.textContent = total;
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
  const total = quizData.length;

  if (playerName.length < 2 || playerName.length > 20) {
    if (nameError) {
      nameError.textContent = "Please enter a name between 2-20 characters";
      nameError.style.display = "block";
    }
    return;
  }

  // Save to leaderboard
  const result = leaderboard.saveToLeaderboard(playerName, score, total);

  // Also save as high score if it's the highest
  leaderboard.updateDisplay();

  // Close modal
  if (nameModal) {
    nameModal.style.display = "none";
  }
  if (nameError) {
    nameError.style.display = "none";
    nameError.textContent = "";
  }
  if (playerNameInput) {
    playerNameInput.value = "";
  }

  // Show success message
  alert(
    `🎉 Score saved! You placed #${result.playerPosition} on the leaderboard!`,
  );
}

function showLeaderboard() {
  if (quizContainer) quizContainer.style.display = "none";
  if (resultContainer) resultContainer.style.display = "none";
  if (reviewContainer) reviewContainer.style.display = "none";
  if (highScoresSection) {
    highScoresSection.style.display = "block";
    leaderboard.displayLeaderboard();
  }
}

function hideLeaderboard() {
  if (highScoresSection) highScoresSection.style.display = "none";
  if (quizContainer) quizContainer.style.display = "block";
  initializeQuiz();
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
        nameError.style.display = "none";
        nameError.textContent = "";
      }
      if (playerNameInput) {
        playerNameInput.value = "";
      }
      // Initialize a new quiz
      initializeQuiz();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (nameModal) {
        nameModal.style.display = "none";
      }
      if (nameError) {
        nameError.style.display = "none";
        nameError.textContent = "";
      }
      if (playerNameInput) {
        playerNameInput.value = "";
      }
    });
  }

  // Also close modal when clicking outside
  if (nameModal) {
    nameModal.addEventListener("click", (e) => {
      if (e.target === nameModal) {
        nameModal.style.display = "none";
        if (nameError) {
          nameError.style.display = "none";
          nameError.textContent = "";
        }
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
  // Setup game mode selection FIRST
  setupGameModeSelection();

  // Setup event listeners
  setupOptionListeners();
  setupNavigationListeners();
  setupModalListeners();

  // Initialize the quiz
  initializeQuiz();
});

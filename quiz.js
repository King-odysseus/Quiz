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

// previously used quizQuestions to ensure it is always quizdata
const quizQuestions = quizData;

const quizState = {
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  score: 0,
  isAnswerSubmitted: false,
  userAnswers: [], //tracks answers
  answeredQuestions: new Set(), //tracks answered Questions
  answerScore: new Array(quizData.length).fill(null), //tracks ascores for each question
};

// ========================================================================
// High Score Manager
// ========================================================================

const highScoreManager = {
  storageKey: "quizHighScore",

  // function that gets current highscore from local storage
  getHighScore: function () {
    const storedScore = localStorage.getItem(this.storageKey);
    return storedScore ? parseInt(storedScore) : 0;
  },

  // function that saves new highscore if it is higher than current highscore
  saveHighScore: function (newScore) {
    const currentHighScore = this.getHighScore(); // Fixed typo: "curentHighScore" to "currentHighScore"
    if (newScore > currentHighScore) {
      localStorage.setItem(this.storageKey, newScore.toString());
      return true; // New high score was set
    }
    return false; //no new highscore
  },
};

// ===================
// DOM Elements Selector
// ===================

const questionId = document.getElementById("q-number");
const allOptions = document.querySelectorAll(".option");
const optionsContainer = document.getElementById("options-container");
const questionTextElement = document.getElementById("question-text");
const currentQuestionElement = document.getElementById("current-question");
const questionNumber = document.getElementById("q-number");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const scoreElement = document.getElementById("score");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result-container");
const finalScore = document.getElementById("final-score");
const quizContainer = document.getElementById("question-container");
const restartBtn = document.getElementById("restart-btn");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const percentage = document.getElementById("percentage");

// // ===========
// // Variables
// // ===========
let currentQuestionNumber = 0;
let selectedOption = null;
let score = 0; // Move score declaration here
let clickedOption = null; // Moved clickedOption declaration here

// =======================================================
// Initialize Quiz
// ========================================================

function initializeQuiz() {
  currentQuestionNumber = 0;
  score = 0;

  // Update display
  questionTextElement.textContent = quizData[currentQuestionNumber].question;
  currentQuestionElement.textContent = currentQuestionNumber + 1;
  questionNumber.textContent = currentQuestionNumber + 1;
  questionId.textContent = currentQuestionNumber + 1;

  // Update options
  updateOption();

  // Update score display
  updateScoreDisplay();

  // Update progress bar
  updateProgressBar();

  // Reset buttons
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  prevBtn.disabled = true;

  // Hide feedback
  hideFeedback();

  // Clear selected option
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((opt) => {
    opt.classList.remove("selected", "correct", "incorrect", "disabled");
  });
}

// ========================
// Update Options Function
// ========================
function displayQuestion(index) {
  const question = quizData[index];

  // update question number and textContent
  questionId.textContent = index + 1;
  currentQuestionElement.textContent = index + 1;
  questionNumber.textContent = index + 1;
  questionTextElement.textContent = question.question;

  //update options
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((div, i) => {
    div.querySelector(".option-text").textContent = question.options[i];
    div.setAttribute("data-index", i);
    div.className = "option";

    if (quizState.answeredQuestions.has(index)) {
      const userAnswers = quizState.userAnswers[index];
      const correctIndex = question.correctAnswer;
    }
  });
}

// ========================
// Option Detection Handler
// =========================

optionsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".option");

  // Guard clause to make sure user clicks an option else nothing runs
  if (!clicked) return;
  //check to prevent changing answer if already scored
  if (quizState.answeredQuestions.has(currentQuestionNumber)) {
    console.log("Can't change answer - already scored!");
    return;
  }

  // To enable toggle which helps user deselect already selected option
  // check if its already been selected and disable the next button till they click
  if (clicked.classList.contains("selected")) {
    clicked.classList.remove("selected");
    nextBtn.disabled = true;

    submitBtn.disabled = true;
    clickedOption = null;
    quizState.userAnswers[currentQuestionNumber] = null;
  } else {
    // Remove selection from all options
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Add selection css to clicked option
    clicked.classList.add("selected");
    submitBtn.disabled = false;
    clickedOption = clicked;

    //save user answers
    quizState.userAnswers[currentQuestionNumber] = parseInt(
      clicked.getAttribute("data-index"),
    );

    // Enable prev button if not on first question
    if (currentQuestionNumber > 0) {
      prevBtn.disabled = false;
    }
  }
});

// ========================

// Navigation Handler
// ========================

const loadNextQuestion = function () {
  if (currentQuestionNumber < quizData.length - 1) {
    currentQuestionNumber++;
    questionTextElement.textContent = quizData[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;

    updateOption();
    submitBtn.disabled = false;
    nextBtn.disabled = true; // Disable until new option is selected
    prevBtn.disabled = false;
    hideFeedback();
    updateProgressBar();

    // Clear selected option
    clickedOption = null;
  }

  // Disable next button on last question
  if (currentQuestionNumber === quizData.length - 1) {
    nextBtn.disabled = true;
  }
};

// =============
// Next Button
// ==============

nextBtn.addEventListener("click", loadNextQuestion);

// =============
// Prev Button
// ==============

prevBtn.addEventListener("click", function () {
  if (currentQuestionNumber > 0) {
    currentQuestionNumber--;
    questionTextElement.textContent = quizData[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;

    updateOption();
    submitBtn.disabled = false;
    nextBtn.disabled = true;

    // Update progress bar
    updateProgressBar();

    // Clear selected option
    clickedOption = null;
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected", "correct", "incorrect", "disabled");
    });

    // Disable prev button on first question
    if (currentQuestionNumber === 0) {
      prevBtn.disabled = true;
    }
  }
});

// =======================================
// Feedback Functions
// =======================================

function showCorrectFeedback() {
  feedback.textContent = "✅ Correct! Well done - Move to next question";
  feedback.className = "feedback correct";
  feedback.style.display = "block";
}

function showWrongFeedback() {
  feedback.textContent = "𐄂 Wrong! Move to next question";
  feedback.className = "feedback incorrect";
  feedback.style.display = "block";
}

function hideFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
  feedback.style.display = "none";
}

// ==========================================
// Check Correct Answer and update score
// ==========================================

submitBtn.addEventListener("click", () => {
  //Guard Clause
  if (!clickedOption) {
    console.log("Please click an option first!");
    return;
  }

  const selectedIndex = clickedOption.getAttribute("data-index");
  const correctIndex = quizData[currentQuestionNumber].correctAnswer;

  if (parseInt(selectedIndex) === correctIndex) {
    score++;
    scoreElement.textContent = score;
    showCorrectFeedback();
    clickedOption.classList.add("correct");
  } else {
    clickedOption.classList.add("incorrect");
    showWrongFeedback();
  }

  // Disable all options after submission
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach((option) => {
    option.classList.add("disabled");
  });

  // Highlight correct answer
  allOptions.forEach((option) => {
    if (parseInt(option.getAttribute("data-index")) === correctIndex) {
      option.classList.add("correct");
    }
  });

  // Update button states
  prevBtn.disabled = false;

  if (currentQuestionNumber < quizData.length - 1) {
    nextBtn.disabled = false;
  }

  submitBtn.disabled = true;

  // Check if this is the last question
  if (currentQuestionNumber === quizData.length - 1) {
    result.style.display = "block";
    quizContainer.style.display = "none";
    finalScore.textContent = `${score}/${quizData.length}`;

    // Check and save high score
    if (highScoreManager.saveHighScore(score)) {
      finalScore.innerHTML += `<br><span class="high-score">New High Score!</span>`;
    }
  }
});

// ===========================================
// Update Progress Bar
// ===========================================
function updateProgressBar() {
  if (!quizData || quizData.length === 0) {
    progressBar.style.width = "0%";
    return;
  }

  const percent = Math.round(
    ((currentQuestionNumber + 1) / quizData.length) * 100,
  );
  progressBar.style.width = percent + "%";
  percentage.textContent = percent + "%";
}

// +========================
// Update Score Function
// =========================
function updateScoreDisplay() {
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

// ============================================
// Function to reset the Question and options
// =============================================

restartBtn.addEventListener("click", () => {
  initializeQuiz();
  quizContainer.style.display = "block";
  result.style.display = "none";
});

// ============================================
// Initialize the quiz when page loads
// =============================================

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeQuiz);

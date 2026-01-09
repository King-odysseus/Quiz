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

const quizState = {
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  score: 0,
  isAnswerSubmitted: false,
  userAnswers: [], //tracks answers
};

// ========================================================================
// High Score Mnager
// ========================================================================

const highScoreManager = {
  storageKey: "quizHighScore",

  // function that get highscore  from local storage

  getHighScore: function () {
    const storedScore = localStorage.getItem(this.storageKey);
    return storedScore ? parseInt(storedScore) : 0;
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

// ===========
// Variables
// ===========
let currentQuestionNumber = 0;
let selectedOption = null;
const arrayOptions = quizQuestions[currentQuestionNumber].options;

// =======================================================
// Text content Selection
// ========================================================

questionTextElement.textContent = quizQuestions[currentQuestionNumber].question;
currentQuestionElement.textContent = currentQuestionNumber + 1;
questionNumber.textContent = currentQuestionElement + 1;
questionId.textContent = currentQuestionNumber + 1;

// ========================
// Update Options Function
// ========================
const updateOption = function () {
  const currentQuestion = quizQuestions[currentQuestionNumber];
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((div, index) => {
    div.querySelector(".option-text").textContent =
      currentQuestion.options[index];
    div.setAttribute("data-index", index);
    div.className = "option";
  });
};

// ========================
// Option Detection Handler
// =========================

let clickedOption = null;

optionsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".option");

  //   Guard clause to make sure user clicks an option else nothing runs
  if (!clicked) return;

  //  To enable toggle which helps user deselect already selected option
  // check if its already been selected and disable the next button till they click
  if (clicked.classList.contains("selected")) {
    clicked.classList.remove("selected");
    nextBtn.disabled = true;
    submitBtn.disabled = true;

    // After the click run Code to add the selection CSS
    // but first the guard clause which removes css from the option that isnt selected
  } else {
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    clicked.classList.add("selected");

    submitBtn.disabled = false;

    clickedOption = clicked;
  }
});

// ========================
// Navigation Handler
// ========================

const loadNextQuestion = function () {
  if (currentQuestionNumber < quizQuestions.length - 1) {
    currentQuestionNumber++;
    questionTextElement.textContent =
      quizQuestions[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;

    updateOption();
    submitBtn.disabled = false;
    hideFeedback();
    updateProgressBar();
  }
};

const loadQuiz = () => {
  currentQuestionNumber = 0;
  score = 0;
  questionTextElement.textContent =
    quizQuestions[currentQuestionNumber].question;
  questionId.textContent = currentQuestionNumber + 1;
  updateOption();
  updateProgressBar();
};

function updateScoreDisplay() {
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}
// =============
// Next Button
// ==============

nextBtn.addEventListener("click", loadNextQuestion);

// =============
// Prev Button
// ==============

prevBtn.addEventListener("click", function () {
  if (currentQuestionNumber > 0) {
    let score = parseInt(scoreElement.textContent);
    console.log("score");
    currentQuestionNumber--;
    questionTextElement.textContent =
      quizQuestions[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;
    scoreElement.textContent = score--;

    updateOption();
    allOptions.forEach((option) => {
      option.classList.add("disabled");
    });
    updateProgressBar();
    console.log("updateProgressBar");
  }
});

// =======================================
// FeedBack FUnctions
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

let score = 0;
scoreElement.textContent = score;

submitBtn.addEventListener("click", () => {
  if (!clickedOption) {
    console.log("Please click an option first!");
    return;
  }

  const selectedIndex = clickedOption.getAttribute("data-index");
  const correctIndex = quizQuestions[currentQuestionNumber].correctAnswer;

  if (parseInt(selectedIndex) === correctIndex) {
    score++;
    scoreElement.textContent = score;
    showCorrectFeedback();

    console.log("Correct!");
    // clickedOption.classList.contains("option, selected");
    clickedOption.classList.add("correct");
  } else {
    console.log("Wrong!");
    clickedOption.classList.add("incorrect");
    showWrongFeedback();
  }

  allOptions.forEach((option) => {
    option.classList.add("disabled");
  });
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  submitBtn.disabled = true;

  if (currentQuestionNumber === quizQuestions.length - 1) {
    submitBtn.classList.add("disabled");
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    console.log("this is the last questions");
    result.style.display = "block";
    quizContainer.style.display = "none";

    finalScore.textContent = score + "/10";
  }
});

// ===========================================
// Update Progress Bar
// ===========================================
let percent = 0;
function updateProgressBar() {
  if (!quizQuestions || quizQuestions.length === 0) {
    progressBar.style.width = "0%";
    console.log("no question loaded");
    return;
  }
  percent = Math.round(
    ((currentQuestionNumber + 1) / quizQuestions.length) * 100
  );
  progressBar.style.width = percent + "%";
  console.log(`Progress: ${percent}%`);
  percentage.textContent = percent;
}

// ============================================
// Function to reset the Question and options
// =============================================

restartBtn.addEventListener("click", () => {
  score = 0;
  currentQuestionNumber = 0;
  currentQuestionElement.textContent = currentQuestionNumber + 1;
  console.log(currentQuestionElement);
  quizContainer.style.display = "block";
  loadQuiz();
  updateScoreDisplay();
  result.style.display = "none";
  hideFeedback();
});

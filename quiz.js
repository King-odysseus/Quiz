// Questions - Object Array
const quizQuestions = [
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

// ===================
// Element Selector
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

// =============
// Next Button
// ==============

nextBtn.addEventListener("click", function () {
  if (currentQuestionNumber < quizQuestions.length - 1) {
    currentQuestionNumber++;
    questionTextElement.textContent =
      quizQuestions[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;

    updateOption();
  }
});

// =============
// Prev Button
// ==============

prevBtn.addEventListener("click", function () {
  if (currentQuestionNumber > 0) {
    currentQuestionNumber--;
    questionTextElement.textContent =
      quizQuestions[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;

    updateOption();
  }
});

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
    console.log("Correct!");
    // clickedOption.classList.contains("option, selected");
    clickedOption.classList.add("correct");
  } else {
    console.log("Wrong!");
    clickedOption.classList.add("incorrect");
  }

  allOptions.forEach((option) => {
    option.classList.add("disabled");
  });
  prevBtn.disabled = false;
  nextBtn.disabled = false;

  if (currentQuestionNumber === quizQuestions.length - 1) {
    submitBtn.classList.add("disabled");
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    console.log("this is the last questions");
    result.style.display = "block";

    finalScore.textContent = score + "/10";
  }
});

// ============================================
// Function to reset the Question and options
// =============================================

const loadQuestions = () => {
  if ((allOptions.classList.contains = "selected, ")) updateOption();
};

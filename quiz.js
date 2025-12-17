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

// ===========
// Variables
// ===========

let currentQuestionNumber = 0;

// ===================
// Element Selector
// ===================

const questionId = document.getElementById("q-number");
let options = document.querySelectorAll(".options");
const allOptions = document.querySelectorAll(".option");
const arrayOptions = quizQuestions[currentQuestionNumber].options;
const optionsContainer = document.getElementById("options-container");
const questionTextElement = document.getElementById("question-text");
const currentQuestionElement = document.getElementById("current-question");
const questionNumber = document.getElementById("q-number");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("submit-btn");

// =======================================================
questionTextElement.textContent = quizQuestions[currentQuestionNumber].question;
currentQuestionElement.textContent = currentQuestionNumber + 1;
questionNumber.textContent = currentQuestionElement + 1;
questionId.textContent = currentQuestionNumber + 1;

// ========================
// Option Delection Handler
// =========================

optionsContainer.addEventListener("click", (e) => {
  // console.log("clicked", e.target);
  // find which option was clicked
  const clickedOption = e.target.closest(".option");
  //   Guard clause to make sure user clicks an option else nothing runs
  if (!clickedOption) return;

  //  To enable toggle which helps user deselect already selected option
  // check if its already been selected and disable the next button till they click
  if (clickedOption.classList.contains("selected")) {
    clickedOption.classList.remove("selected");
    nextBtn.disabled = true;

    // After the click run Code to add the selection CSS
    // but first the guard clause which removes css from the option that isnt selected
  } else {
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    clickedOption.classList.add("selected");
    nextBtn.disabled = false;
    prevBtn.disabled = false;
  }
});

// ========================
// Navigation Handler
// ========================

// =============
// Next Button
// ==============

nextBtn.addEventListener("click", function () {
  if (currentQuestionNumber < quizQuestions.length + 1) {
    currentQuestionNumber++;
    questionTextElement.textContent =
      quizQuestions[currentQuestionNumber].question;
    currentQuestionElement.textContent = currentQuestionNumber + 1;
    questionId.textContent = currentQuestionNumber + 1;
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
  }
});

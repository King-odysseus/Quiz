// Select the Elements

const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const currentQuestion = document.getElementById("current-question");
const questionText = document.getElementById("question-text");
const feedbackElement = document.getElementById("feedback");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const options = document.querySelectorAll(".option");

// Making the selection interactive

// Add click event to each option
options.forEach((option) => {
  option.addEventListener("click", function () {
    options.forEach((opt) => {
      opt.classList.remove("selected");
    });
    this.classList.add("selected");
  });
});

submitButton.addEventListener("click", function () {
  console.log("submit button clicked");

  // find what option is clicked by looking for the otion that contains
  // the classes option and selected

  const selectedOption = document.querySelector(".option.selected");

  if (!selectedOption) {
    console.log("please click an option");
    return;
  }

  const selectedIndex = selectedOption.getAttribute("data-index");
  console.log("Selected index", selectedIndex);

  alert(`you selected ${selectedIndex}!`);
});

// Quiz Data

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
];

// Game Data
let currentQuestionIndex = 0;
let score = 0;

// Function to load a question

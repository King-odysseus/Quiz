// Select the Elements

// ======================
// DOM ELEMENT REFERENCES
// ======================
// Score & Progress
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const totalQuestionsElement = document.getElementById("total-questions");
const percentageElement = document.getElementById("percentage");
const currentQuestionElement = document.getElementById("current-question");
const questionNumberElement = document.getElementById("q-number");

// Question & Options
const questionTextElement = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const options = document.querySelectorAll(".option");
const feedbackElement = document.getElementById("feedback");

// Buttons
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");

// Results
const resultContainer = document.getElementById("result-container");
const finalScoreElement = document.getElementById("final-score");
const resultMessageElement = document.getElementById("result-message");

// LOOP START
// │
// ├── 1. SHOW question and options
// │     (Make the HTML show current question)
// │
// ├── 2. WAIT for user to click option
// │     (Mark it as selected)
// │
// ├── 3. WAIT for user to click Submit
// │     (Check if selected option = correct answer)
// │
// ├── 4. SHOW result (correct/incorrect)
// │     (Update score, give feedback)
// │
// ├── 5. WAIT for user to click Next
// │     (Move to next question)
// │
// └── 6. REPEAT until all questions done

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

// Add event listner to the container to have just one

optionsContainer.addEventListener("click", (e) => {
  console.log("clicked", e.target);
  // find which option was clicked
  const clickedOption = e.target.closest(".option");
  if (!clickedOption) return;

  //   check if its already been selected
  if (clickedOption.classList.contains("selected")) {
    clickedOption.classList.remove("selected");
    nextBtn.disabled = true;
  } else {
    const allOptions = document.querySelectorAll(".option");
    allOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    clickedOption.classList.add("selected");
    nextBtn.disabled = false;
  }
});

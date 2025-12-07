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
    option.forEach((opt) => {
      opt.classList.remove("selected");
    });

    opt.classList.add("selected");
  });
});

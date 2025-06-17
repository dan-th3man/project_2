//submit login info to the server
let currentUser = null;

function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      currentUser = data.username; // or user ID
      alert("Login successful!");
    } else {
      alert("Login failed!");
    }
  })
  .catch(err => console.error("Login error:", err));
}
//display individual questions 
let questions = [];
let currentIndex = 0;

// Load the JSON file
fetch("/questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    renderQuestion();
  });

function renderQuestion() {
  const container = document.getElementById("quiz");
  container.innerHTML = ""; // clear previous content

  if (currentIndex < questions.length) {
    const q = questions[currentIndex];

    const div = document.createElement("div");
    div.className = "question active";

    const p = document.createElement("p");
    p.textContent = `${currentIndex + 1}. ${q.question}`;
    div.appendChild(p);

    const input = document.createElement("input");
    input.type = q.type || "text";
    input.id = `answer-${currentIndex}`;
    div.appendChild(input);

    const btn = document.createElement("button");
    btn.textContent = currentIndex < questions.length - 1 ? "Next" : "Submit";
    btn.onclick = currentIndex < questions.length - 1 ? nextQuestion : submitQuiz;
    div.appendChild(btn);

    container.appendChild(div);
  }
}

function nextQuestion() {
  saveAnswer();
  currentIndex++;
  renderQuestion();
}

const answers = [];

function saveAnswer() {
  const input = document.getElementById(`answer-${currentIndex}`);
  answers[currentIndex] = input.value;
}
//submitt quiz results 
function submitQuiz() {
  if (!currentUser) {
    alert("Please log in before submitting the quiz.");
    return;
  }

  const answers = ["A", "B", "C", "D"];
  const score = 1;

  fetch("/submit-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser, answers, score })
  })
  .then(res => res.json())
  .then(data => console.log("Quiz submitted:", data))
  .catch(err => console.error("Quiz submit error:", err));
}


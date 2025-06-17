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


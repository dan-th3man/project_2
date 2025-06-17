
  <!--Submission button --> 
  <button onclick="submitQuiz()">Submit Quiz</button>
  <!-- need this to pull the anwers for lederboard -->
  <script>
  function submitQuiz() {
    const answers = ["A", "B", "C", "D"];
    const score = 15;
    const userId = "user123";

    fetch("/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, score, userId })
    })
    .then(res => res.json())
    .then(data => console.log("Server response:", data))
    .catch(err => console.error("Error:", err));
    }
  </script>
  <!-- need this to pull the anwers for lederboard -->

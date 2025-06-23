let currentUser = null;

//login function
function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("currentUser", data.username);
        currentUser = data.username;

        document.getElementById("loginPage").classList.add("d-none");
        document.getElementById("questionCountPage").classList.remove("d-none");
        alert("Login successful!");
      } else {
        alert("Login failed! Check your credentials.");
      }
    })
    .catch(err => console.error("Login error:", err));
}

//signup function 
function signupUser() {
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (res.status === 409) throw new Error("Username already exists");
      return res.json();
    })
    .then(data => {
      if (data.success) {
        localStorage.setItem("currentUser", data.username);
        currentUser = data.username;
        alert("Sign-up successful! You’re now logged in.");
        document.getElementById("signupPage").classList.add("d-none");
        document.getElementById("questionCountPage").classList.remove("d-none");
      } else {
        alert("Sign-up failed!");
      }
    })
    .catch(err => alert(`Sign-up error: ${err.message}`));
}

//Event listeners
document.getElementById("submitLoginBtn").addEventListener("click", event => {
  event.preventDefault();
  loginUser();
});

document.getElementById("submitSignupBtn").addEventListener("click", event => {
  event.preventDefault();
  signupUser();
});
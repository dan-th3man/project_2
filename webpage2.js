let currentUser = localStorage.getItem("currentUser");
let selectedQuestionCount = 10;
let allQuestions = [];
let questions = [];
let currentIndex = 0;
let questionTimer;
let quizActive = false; 
const timeLimit = 20;
const answers = [];
const resultPage = document.getElementById('resultPage'); 

document.addEventListener('DOMContentLoaded', () => {
    // Page references
    const homePage = document.getElementById('homePage');
    const signupPage = document.getElementById('signupPage');
    const loginPage = document.getElementById('loginPage');
    const questionCountPage = document.getElementById('questionCountPage');
    const rulesPage = document.getElementById('rulesPage');
    const quizPage = document.getElementById('quizPage');

    // Interactive elements
    const loginBtnHome = document.getElementById('loginBtnHome');
    const signupBtnHome = document.getElementById('signupBtnHome');
    const submitSignupBtn = document.getElementById('submitSignupBtn');
    const backToLoginFromSignup = document.getElementById('backToLoginFromSignup');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const backToSignupFromLogin = document.getElementById('backToSignupFromLogin');
    const questionCountCards = document.querySelectorAll('.question-count-card');
    const startQuizBtn = document.getElementById('startQuizBtn');

	//show pages
    function showPage(pageToShow) {
        const allPages = [homePage, signupPage, loginPage, questionCountPage, rulesPage, quizPage, resultPage];
		if (pageToShow !== quizPage && quizActive) {
		    clearInterval(questionTimer);  
		    quizActive = false;  
		}
        allPages.forEach(page => {
            if (page === pageToShow) {
                page.classList.remove('d-none');
            } else {
                page.classList.add('d-none');
            }
        });
    }

    async function fetchQuestions() {
        try {
            const response = await fetch('/questions.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allQuestions = await response.json();
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            alert('Failed to load quiz questions. Please try again later.');
        }
    }
// timer for questions
	function startTimer() {
	    console.log("Timer started");

	    if (quizActive) {
	        console.warn("Timer already running");
	        return;
	    }

	    quizActive = true;
	    let timeRemaining = timeLimit;
	    const timerDisplay = document.getElementById("timer");

	    if (!timerDisplay) {
	        console.error("Timer element not found!");
	        return;
	    }

	    timerDisplay.textContent = `Time left: ${timeRemaining}s`;

	    questionTimer = setInterval(() => {
	        timeRemaining--;
	        timerDisplay.textContent = `Time left: ${timeRemaining}s`;

	        if (timeRemaining <= 0) {
	            clearInterval(questionTimer);
	            quizActive = false; // reset here
	            handleTimeout();
	        }
	    }, 1000);
	}
//create questions
	function renderQuestion() {
	    const container = document.getElementById("quiz");
	    container.innerHTML = "";

	    if (currentIndex < questions.length) {
	        const q = questions[currentIndex];
	        const div = document.createElement("div");
	        div.className = "question active";

	        const p = document.createElement("p");
	        p.textContent = `${currentIndex + 1}. ${q.question}`;
	        div.appendChild(p);

	        const options = ["A", "B", "C", "D"];
	        options.forEach(option => {
	            if (q[option]) {
	                const label = document.createElement("label");
	                label.className = "d-block text-start ps-0 mb-2";

	                const input = document.createElement("input");
	                input.type = "radio";
	                input.name = `answer-${currentIndex}`;
	                input.value = option;
	                input.className = "me-2";

	                input.addEventListener("change", () => {
	                    saveAnswer();
	                    handleAnswerSelection(input, q);
	                });

	                label.appendChild(input);
	                label.append(`${option}: ${q[option]}`);
	                div.appendChild(label);
	            }
	        });

	        container.appendChild(div);

	        startTimer();
	    }
	}	
	//question timeout 
	function handleAnswerSelection(selectedInput, question) {
	    clearInterval(questionTimer);
		quizActive=false;

	    if (selectedInput.value === question.answer) {
	        document.getElementById("correctSound").play();
	    } else {
	        document.getElementById("incorrectSound").play();
	    }

	    highlightAnswers(selectedInput, question.answer);

	    // Delay to allow highlight and sound 
	    setTimeout(() => {
	        currentIndex++;
	        if (currentIndex < questions.length) {
	            renderQuestion(); 
	        } else {
	            submitQuiz(); 
	        }
	    }, 1000);
	}

	// Handle timeout when the timer runs out
	function handleTimeout() {
	    clearInterval(questionTimer); 
		quizActive=false; 

	    const q = questions[currentIndex];
	    const options = document.querySelectorAll(`input[name="answer-${currentIndex}"]`);

	    document.getElementById("incorrectSound").play();

	    options.forEach(input => {
	        const label = input.parentElement;
	        if (input.value === q.answer) {
	            label.style.backgroundColor = "rgba(0, 255, 0, 0.3)"; // Green for correct
	            label.style.border = "2px solid green";
	        }
	    });
	
		// Delay to allow highlight and sound 
	    setTimeout(() => {
	        currentIndex++;
	        if (currentIndex < questions.length) {
	            renderQuestion(); 
	        } else {
	            submitQuiz(); 
	        }
	    }, 1000); 
	}

	// Reset timer
	function restartQuiz() {
	    clearInterval(questionTimer); 
	    currentIndex = 0;
	    answers.length = 0;
	    questions = [];

	    fetchQuestions().then(() => {
	        showPage(questionCountPage);
	    });
	}
	// Highlight correct and incorrect answers
	function highlightAnswers(selectedInput, correctAnswer) {
	    const options = document.querySelectorAll(`input[name="answer-${currentIndex}"]`);
	    options.forEach(input => {
	        const label = input.parentElement;
	       
	        label.style.backgroundColor = "";
	        label.style.border = "";
	        label.style.borderRadius = "5px";

	        if (input.value === correctAnswer) {
	            label.style.backgroundColor = "rgba(0, 255, 0, 0.3)"; 
	            label.style.border = "2px solid green";
	        } else if (input === selectedInput) {
	            label.style.backgroundColor = "rgba(255, 0, 0, 0.3)"; 
	            label.style.border = "2px solid red";
	        }
	    });
	}

	// Function to restart the quiz
	function restartQuiz() {
	    currentIndex = 0;
	    answers.length = 0; 
	    questions = []; 

	    fetchQuestions().then(() => {
	        showPage(questionCountPage);
	    });
	}

	// Event listener for restart quiz
	document.getElementById("resultPage").querySelector("button").addEventListener('click', restartQuiz);
	
	//save answers
    function saveAnswer() {
        const selected = document.querySelector(`input[name="answer-${currentIndex}"]:checked`);
        answers[currentIndex] = selected ? selected.value : null;
    }
	
	//move to next question
    function nextQuestion() {
        saveAnswer();
        currentIndex++;
        renderQuestion();
    }
	
	//submit quiz
	function submitQuiz() {
	    if (!currentUser) {
	        alert("Please log in before submitting the quiz.");
	        return;
	    }

	    clearInterval(questionTimer);  

	    saveAnswer();

	    let score = 0;
	    for (let i = 0; i < questions.length; i++) {
	        if (answers[i] === questions[i].answer) {
	            score += 1;
	        }
	    }

	    fetch("/submit-quiz", {
	        method: "POST",
	        headers: { "Content-Type": "application/json" },
	        body: JSON.stringify({ username: currentUser, answers, score })
	    })
	    .then(res => res.json())
	    .then(data => {
	        document.getElementById("finalScore").textContent = score;
			document.getElementById("totalQuestions").textContent = questions.length;


	        fetch("/leaderboard")
	            .then(res => res.json())
	            .then(leaderboard => {
	                const list = document.getElementById("leaderboardList");
	                list.innerHTML = "";

	                leaderboard.forEach(entry => {
	                    const li = document.createElement("li");
	                    li.textContent = `${entry.username}: ${entry.score}`;
	                    list.appendChild(li);
	                });
	            })
	            .catch(err => console.error("Leaderboard fetch error:", err));

	        const cheerSound = document.getElementById("cheerSound");
	        const booSound = document.getElementById("booSound");

	        if (score >= questions.length / 2) {
	            cheerSound.play();
	        } else {
	            booSound.play();
	        }

	        showPage(resultPage);
	    })
	    .catch(err => console.error("Quiz submit error:", err));
	}


    submitSignupBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (username && email && password) {
            fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Sign Up successful! Please log in.');
                    showPage(loginPage);
                } else {
                    alert('Signup failed: ' + (data.message || "Unknown error"));
                }
            })
            .catch(err => console.error("Signup error:", err));
        } else {
            alert('Please fill in all sign up fields.');
        }
    });

    submitLoginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (username && password) {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    currentUser = data.username;
                    localStorage.setItem("currentUser", data.username);
                    alert("Login successful!");
                    showPage(questionCountPage);
                } else {
                    alert("Login failed!");
                }
            })
            .catch(err => console.error("Login error:", err));
        } else {
            alert('Please enter your username and password.');
        }
    });
	
	// logout user
	function logoutUser() {
	    localStorage.removeItem("currentUser");
	    currentUser = null;
	    answers.length = 0;
	    questions = [];
	    currentIndex = 0;

	    
	    document.getElementById("quiz").innerHTML = "";
	    document.getElementById("leaderboardList").innerHTML = "";
	    document.getElementById("finalScore").textContent = "";

	    showPage(loginPage);
	}

	// event listeners 
	//go to login page
    loginBtnHome.addEventListener('click', () => showPage(loginPage));
	// go to signup page
    signupBtnHome.addEventListener('click', () => showPage(signupPage));
	//go to login page from sign up
    backToLoginFromSignup.addEventListener('click', () => showPage(loginPage));
	//go to sign up from login 
    backToSignupFromLogin.addEventListener('click', () => showPage(signupPage));
	//log out from quiz
	document.getElementById("logoutFromQuiz").addEventListener("click", logoutUser);
	//logout from results
	document.getElementById("logoutFromResult").addEventListener("click", logoutUser);

	//question amount selection 
    questionCountCards.forEach(card => {
        card.addEventListener('click', () => {
            questionCountCards.forEach(c => c.classList.remove('border-primary', 'border-3'));
            card.classList.add('border-primary', 'border-3');

            selectedQuestionCount = card.dataset.count === 'all' ? Infinity : parseInt(card.dataset.count);
            showPage(rulesPage);
        });
    });
	//question event listener
    startQuizBtn.addEventListener('click', () => {
        if (allQuestions.length === 0) {
            alert('Quiz questions not loaded yet. Please try again in a moment.');
            return;
        }

        if (!selectedQuestionCount || isNaN(selectedQuestionCount)) {
            alert('Invalid question count selected.');
            return;
        }

        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        questions = shuffled.slice(0, selectedQuestionCount);
        currentIndex = 0;
        answers.length = 0;

        showPage(quizPage);
        renderQuestion();
    });

    fetchQuestions();
    showPage(homePage);
});

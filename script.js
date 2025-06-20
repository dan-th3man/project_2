document.addEventListener('DOMContentLoaded', () => {
    // Get references to all page containers
    const homePage = document.getElementById('homePage');
    const signupPage = document.getElementById('signupPage');
    const loginPage = document.getElementById('loginPage');
    const questionCountPage = document.getElementById('questionCountPage');
    const rulesPage = document.getElementById('rulesPage');

    // Get references to all interactive elements (buttons, cards)
    const loginBtnHome = document.getElementById('loginBtnHome');
    const signupBtnHome = document.getElementById('signupBtnHome');
    const submitSignupBtn = document.getElementById('submitSignupBtn');
    const backToLoginFromSignup = document.getElementById('backToLoginFromSignup');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const backToSignupFromLogin = document.getElementById('backToSignupFromLogin');
    const questionCountCards = document.querySelectorAll('.question-count-card');
    const startQuizBtn = document.getElementById('startQuizBtn');

    let allQuestions = []; // Array to store all questions from JSON
    let selectedQuestionCount = null; // Stores user's selected quiz length

    /**
     * Fetches quiz questions from the 'questions.json' file.
     * This function should be called early in the app lifecycle.
     */
    async function fetchQuestions() {
        try {
            const response = await fetch('questions.json'); // Ensure this path is correct
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allQuestions = await response.json();
            console.log('Quiz questions loaded successfully:', allQuestions.length, 'questions');
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            // Display a user-friendly message in the UI if questions can't be loaded
            alert('Failed to load quiz questions. Please try again later.');
        }
    }

    /**
     * Manages the visibility of different "pages" in the application.
     * Hides all pages and then displays the specified page.
     * @param {HTMLElement} pageToShow - The DOM element of the page to display.
     */
    function showPage(pageToShow) {
        const allPages = [homePage, signupPage, loginPage, questionCountPage, rulesPage];
        allPages.forEach(page => {
            if (page === pageToShow) {
                page.classList.remove('d-none'); // Show the target page
            } else {
                page.classList.add('d-none'); // Hide all other pages
            }
        });
    }

    // --- Initial App Setup ---
    fetchQuestions(); // Load questions as soon as the DOM is ready
    showPage(homePage); // Start by displaying the home page

    // --- Event Listeners for Page Navigation ---

    // Home Page -> Login Page
    loginBtnHome.addEventListener('click', () => {
        console.log('Login button clicked from home.');
        showPage(loginPage);
    });

    // Home Page -> Sign Up Page
    signupBtnHome.addEventListener('click', () => {
        console.log('Sign Up button clicked from home.');
        showPage(signupPage);
    });

    // Sign Up Form Submission (Simulated)
    submitSignupBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission to stay on the page

        // Basic validation (in a real app, this would involve server-side validation)
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (username && email && password) {
            console.log('Simulating Sign Up:', { username, email, password });
            
            alert('Sign Up successful! Please log in.');
            showPage(loginPage); // Redirect to login page after successful signup
        } else {
            // Replace with a custom modal or message box, not alert()
            alert('Please fill in all sign up fields.');
        }
    });

    // Link from Sign Up to Login
    backToLoginFromSignup.addEventListener('click', () => {
        console.log('Back to Login link clicked.');
        showPage(loginPage);
    });

    // Login Form Submission (Simulated)
    submitLoginBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic validation
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (username && password) {
            console.log('Simulating Login:', { username, password });
           
            alert('Login successful! Welcome, ' + username + '.');
            showPage(questionCountPage); // After successful login, move to question count selection
        } else {
            // Replace with a custom modal or message box, not alert()
            alert('Please enter your username and password.');
        }
    });

    // Link from Login to Sign Up
    backToSignupFromLogin.addEventListener('click', () => {
        console.log('Back to Sign Up link clicked.');
        showPage(signupPage);
    });

    // Question Count Selection Cards
    questionCountCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'border-primary' and 'border-3' from all cards
            questionCountCards.forEach(c => c.classList.remove('border-primary', 'border-3'));

            // Add 'border-primary' and 'border-3' to the clicked card for visual feedback
            card.classList.add('border-primary', 'border-3');

            selectedQuestionCount = card.dataset.count; // Store the selected count (e.g., "10", "all")
            console.log('Selected question count:', selectedQuestionCount);

            // Immediately proceed to the rules page after selection
            showPage(rulesPage);
        });
    });

    // Start Quiz Button on Rules Page
    startQuizBtn.addEventListener('click', () => {
        if (allQuestions.length === 0) {
            // Replace with a custom modal or message box
            alert('Quiz questions not loaded yet. Please try again in a moment.');
            return;
        }

        let quizQuestions = [];
        if (selectedQuestionCount === 'all') {
            quizQuestions = [...allQuestions]; // Use all loaded questions
        } else {
            const count = parseInt(selectedQuestionCount);
            if (isNaN(count) || count <= 0) {
                // Replace with a custom modal or message box
                alert('Invalid question count selected. Please choose a valid option.');
                return;
            }
            // Shuffle the entire questions array and then take the specified number
            // Using a simple shuffle algorithm (Fisher-Yates)
            const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
            quizQuestions = shuffledQuestions.slice(0, count);
        }

        console.log(`Starting quiz with ${quizQuestions.length} questions.`);
        console.log('Quiz questions for this round:', quizQuestions);

       
        alert(`Prepare for a quiz of ${quizQuestions.length} questions! The actual quiz display is next to be built.`);
        showPage(homePage); // Temporary: go back to home page
    });
});
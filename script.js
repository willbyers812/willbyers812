let questions = [];
let currentQuestionIndex = 0;

const startButton = document.getElementById("startButton");
const subtitle = document.getElementById("subtitle");
const questionAudio = document.getElementById("questionAudio");
const questionImage = document.getElementById("questionImage");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Fetch questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        subtitle.textContent = question.text;

        // Set audio source dynamically
        questionAudio.innerHTML = `<source src="${question.audio}" type="audio/mpeg">`;
        questionAudio.load();
        questionAudio.play();

        // Show image while audio is playing
        questionImage.src = question.image;
        questionImage.style.display = "block";

        questionAudio.onended = () => {
            questionImage.style.display = "none"; // Hide image after audio ends
            recognition.start();
        };
    } else {
        subtitle.textContent = "Thank you for completing the questionnaire!";
        startButton.style.display = "block";
    }
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();

    if (checkAnswer(transcript)) {
        currentQuestionIndex++;
        setTimeout(askQuestion, 2000);
    } else {
        setTimeout(askQuestion, 2000);
    }
};

// Function to check if the answer is correct
function checkAnswer(userAnswer) {
    const question = questions[currentQuestionIndex];
    return question.correctAnswers.some(correct => 
        userAnswer.toLowerCase().includes(correct.toLowerCase())
    );
}

startButton.addEventListener("click", async () => {
    startButton.style.display = "none";
    await loadQuestions();
    currentQuestionIndex = 0;
    askQuestion();
});

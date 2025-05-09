function checkAnswer(questionNumber, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="answer${questionNumber}"]:checked`);
    const resultMessage = document.getElementById(`result-message${questionNumber}`);

    if (selectedAnswer) {
        if (selectedAnswer.value === correctAnswer) {
            resultMessage.textContent = "You win! 🎉";
            resultMessage.style.color = "green";
        } else {
            resultMessage.textContent = "You lose! 😞";
            resultMessage.style.color = "red";
        }
    } else {
        resultMessage.textContent = "Please select an answer!";
        resultMessage.style.color = "orange";
    }
}


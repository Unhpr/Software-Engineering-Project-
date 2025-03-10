const quizDB = [
    {
        question: "Four gods A, B, and C, D are called, in no particular order, True, False, and Random, and doesn't know. True always speaks truly, False always speaks falsely, but whether Random speaks truly or falsely is a completely random matter, doesn't know is random but gets things wrong twice as much as random. Your task is to determine the identities of A, B, C and D by asking four yes–no questions; each question must be put to exactly one god. The gods understand English, but will answer all questions in their own language, in which the words for yes and no are da and ja, in some order. You do not know which word means which.",
        options: ["God A", "God B", "God C", "God D"],
        answer: "God A"
    },
]

let currentQuestion = 0;
window.addEventListener("load", displayQuestion)

function displayQuestion(){
    var q = quizDB[currentQuestion];
    document.getElementById("question").innnerHTML = q.question;
    document.getElementById("choiceLabel").innnerHTML = q.options[0];
    document.getElementById("choice2Label").innnerHTML = q.options[1];
    document.getElementById("choice3Label").innnerHTML = q.options[2];
    document.getElementById("choice4Label").innnerHTML = q.options[3];
}

const submitButton = document.querySelector("button");
submitButton.addEeventListener("click", checkAnswer);
function checkAnswer(){
    let userAnswer;
    var choicess = document.getElementsByName("answer");
    for (i=0; i<choicess.length; i++){
        if (choices[i].checked){
            userAnswer = choices[i].id;
            break;
        }

}   if (userAnswer){
    console.log("moving to next question...");
    if (userAnswer === quizDB[currentQuestion].answer){
        score++;
        document.getElementById("result").innerHTML = "Your Current Score is:" + score;
}

    currentQuestion++;

    if (currentQuestion <quizDB.length){
        displayQuestion();
    
}  else{
    document.getElementById("quizPage").innerHTML="";
    document.getElementById("result").innnerHTML = "You Answered" + score + "our of" + quizDB.length + "questions correctly.";
}   
    }
}
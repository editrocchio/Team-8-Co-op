var deckName = sessionStorage.getItem("deckName");
var muteVoice = false;

class Card {
    constructor(question, answer) {
        this.questionNumber = questionNo;
        this.question = question;
        this.answer = answer;

        questionNo++;
    }
}

var questionNo = 1;
var cards = loadDeck(getDeckName());
var cardIndex = 0;
var displayAnswer = false;

function getDeckName() {
    // Receive deck name from other page
    return deckName;

}

function loadDeck(deckName) {
    var decks = firebase.database().ref(deckName);
    var arr = [];
    decks.on('value', function (snap) {

        for (var deck in snap.val()) {

            var question = snap.val()[deck]['question'];
            var answer = snap.val()[deck]['answer'];
            var card = new Card(question, answer);
            arr.push(card);
        }
        firstQuestion(arr);
    });
    return arr;

}

function firstQuestion(listofcards) {
    displayQuestion(listofcards[cardIndex].question, listofcards[cardIndex].answer, listofcards[cardIndex].questionNumber);
}

function nextQuestion() {
    if (cardIndex == cards.length - 1) {
        cardIndex = 0;
    } else {
        cardIndex++;
    }
    displayQuestion(cards[cardIndex].question, cards[cardIndex].answer, cards[cardIndex].questionNumber);
    if (!muteVoice) {
        displayQuestion(cards[cardIndex].question, cards[cardIndex].answer, cards[cardIndex].questionNumber);
        var msg = new SpeechSynthesisUtterance("question");
        window.speechSynthesis.speak(msg);
        readText("question");
    }
    hideAnswer();
}

function previousQuestion() {
    if (cardIndex == 0) {
        cardIndex = cards.length - 1;
    } else {
        cardIndex--;
    }

    displayQuestion(cards[cardIndex].question, cards[cardIndex].answer, cards[cardIndex].questionNumber);
    if (!muteVoice) {
        var msg = new SpeechSynthesisUtterance("question");
        window.speechSynthesis.speak(msg);
        readText("question");
    }
    hideAnswer();

}

function displayQuestion(question, answer, questionNumber) {
    document.getElementsByClassName('question')[0].innerHTML = question;
    document.getElementsByClassName('answer')[0].innerHTML = answer;
    document.getElementsByClassName('question_number')[0].innerHTML = 'Question ' + questionNumber;
};

function displayDeckName() {
    document.getElementById('deck_name').innerHTML = getDeckName();
}

function showAnswer() {
    document.getElementsByClassName('answer')[0].style.visibility = 'visible';
    displayAnswer = true;
    document.getElementById("get_answer").value = "Hide Answer";
    if (!muteVoice) {
        readText("answer");
    }
}

function showAnswer2() {
    document.getElementsByClassName('answer')[0].style.visibility = 'visible';
    displayAnswer = true;
    document.getElementById("get_answer").value = "Hide Answer";
}

function hideAnswer() {
    document.getElementsByClassName('answer')[0].style.visibility = 'hidden';
    displayAnswer = false;
    document.getElementById("get_answer").value = "Show Answer";
}

function toggleAnswer() {
    if (displayAnswer) {
        hideAnswer();
    } else {
        showAnswer();
        document.getElementById("get_answer").value = "Hide Answer";
    }
}

function addAnswer() {
    passDeckName(deckName);
    window.location.href = "create.html";
}

function passDeckName(name) {
    sessionStorage.setItem('deckName', name);
}
document.getElementById("previous_question").addEventListener('click', previousQuestion);
document.getElementById("next_question").addEventListener('click', nextQuestion);
document.getElementById("get_answer").addEventListener('click', toggleAnswer);
document.getElementById("add_answer").addEventListener('click', addAnswer);

displayDeckName();

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var commands = ['question', 'next', 'show', , 'hide', 'edit', 'previous', 'help'];
var grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var msg = new SpeechSynthesisUtterance("Welcome to quiz " + deckName + ". Press space to speak, and say help for a list of commands. Or press A to answer.");
window.speechSynthesis.speak(msg);

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 32) {
        console.log('Ready to receive a command.');
        recognition.start();
    }
});
var commands2 = ['apple', 'pineapple', '6', '8'];

var grammar2 = '#JSGF V1.0; grammar commands; public <command> = ' + commands2.join(' | ') + ' ;'

var recognition2 = new SpeechRecognition();
speechRecognitionList2 = new SpeechGrammarList();
speechRecognitionList2.addFromString(grammar2, 1);

recognition2.grammars = speechRecognitionList2;
//recognition.continuous = false;
recognition2.lang = 'en-US';
recognition2.interimResults = false;
recognition2.maxAlternatives = 1;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        console.log('Ready to receive an answer.');
        recognition2.start();
    }
});

recognition2.onresult = function (event) {
    var incstr;
    var last2 = event.results.length - 1;
    var strcon;
    var word2 = (event.results[last2][0].transcript);
    var realAnswer = $("#rAnswer").html();
    console.log(realAnswer);
    incstr = realAnswer.toUpperCase().split(" ");
    console.log(incstr);
    console.log("my input" + word2);
    console.log("type of answer: " + typeof (realAnswer));

    for (var i = 0; i < incstr.length; i++) {
        console.log(incstr[i]);
        console.log(word2.toUpperCase());
        console.log(word2.toUpperCase().includes(incstr[i]));
        if (!isNaN(realAnswer)) {
            console.log("its a number");
            strcon = word2 == realAnswer;
            console.log(strcon);
            if (!strcon) {
                var msg3 = new SpeechSynthesisUtterance("Wrong try again");
                window.speechSynthesis.speak(msg3)
            }


        } else if (word2.toUpperCase().includes(incstr[i])) {
            strcon = true;
        } else {
            strcon = false;
            var msg3 = new SpeechSynthesisUtterance("Wrong try again");
            window.speechSynthesis.speak(msg3);
            return;
        }
    };
    //console.log(strcon);
    //console.log(word2.toUpperCase().split(" ").pop());
    //console.log(word2.includes(realAnswer));
    //var regex = new RegExp(word2.split(" ").join('|'));
    //console.log(word2.split(" ").join('|'))

    if (strcon) {
        console.log("Correctt");
        var msg2 = new SpeechSynthesisUtterance("Correct");
        window.speechSynthesis.speak(msg2);
        showAnswer2();
    }
}
document.addEventListener('keyup', function (event) {
    if (event.keyCode == 32) {
        console.log('Ready to receive a command.');
        recognition.stop();
    }
});

recognition.onresult = function (event) {
    var last = event.results.length - 1;
    var word = (event.results[last][0].transcript);

    if (word == "next") {
        nextQuestion();
    } else if (word == "answer") {
        showAnswer();
    } else if (word == "edit") {
        addAnswer();
    } else if (word == "question") {
        var msg = new SpeechSynthesisUtterance("question");
        window.speechSynthesis.speak(msg);
        readText("question");
    } else if (word == "previous") {
        previousQuestion();
    } else if (word == "help") {
        var msg = new SpeechSynthesisUtterance("You can say the commands next, previous, edit, question, or help to hear this list again.");
        window.speechSynthesis.speak(msg);
    }
}
//Stops it after a word has been spoken
recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onnomatch = function (event) {
    diagnostic.textContent = 'I didnt recognise that command.';
}

function readText(commandText) {
    var test = "" + document.getElementsByClassName(commandText)[0].innerHTML;
    var msg = new SpeechSynthesisUtterance(test);
    window.speechSynthesis.speak(msg);
}

function mute() {
    if (!muteVoice) {
        muteVoice = true;
        document.getElementById("mutebtn").value = "Voice";
    } else {
        muteVoice = false;
        document.getElementById("mutebtn").value = "Mute";
        readText("question");
    }

}
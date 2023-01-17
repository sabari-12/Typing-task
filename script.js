const quoteApiUrl = "https://api.quotable.io/random?minLength=120&maxLength=150";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;


const renderNewQuote = async () => {

  const response = await fetch(quoteApiUrl);
  let data = await response.json();
  
  quoteSection.innerHTML = quote;
  //Access quote
  quote = data.content;

  
  let arr = quote.split('').map((value) => {
    return ("<span class='quote-chars'>" + value + "</span>");
  });
  //join array for displaying
  quoteSection.innerHTML += arr.join('');
};

//Logic 

userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);

  //array of user input characters
  let userInputChars = userInput.value.split('');

  //loop through each character in quote
  quoteChars.forEach((char, index) => {
    
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }

    //If user hasn't entered anything or backspaced

    else if (userInputChars[index] == null) {
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }

    //If user enter wrong character
    else {
      //Checks if we alreasy have added fail class
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }

    //Returns true if all the characters are entered correctly
    
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    //End test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

//Update Timer on screen
function updateTimer() {
  if (time == 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

//End Test
const displayResult = () => {

  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed() + " wpm";
  document.getElementById("accuracy").innerText =
    Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
};

//Start Test
const startTest = () => {
  userInput.placeholder = "Start Typing...";
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};

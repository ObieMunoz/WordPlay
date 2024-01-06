document.addEventListener("keydown", handleKeyDown);
document.addEventListener("DOMContentLoaded", () => { init(); });

const BOARD_HEIGHT = 6;
const BOARD_WIDTH = 5;

let currentWord;
let wordOfTheDay;
let gameOver = false;
let currentRow = 0;
let letters;

async function init() {
  wordOfTheDay = await fetchWordOfTheDay();
  createBoard(BOARD_HEIGHT, BOARD_WIDTH);
}

function createBoard(height, width) {
  const SCOREBOARD_CONTAINER = document.getElementById('scoreboard');
  for (let i = 1; i <= height * width; i++) {
    const letter = document.createElement('div');
    letter.className = 'scoreboard-letter';
    letter.id = `letter-${i}`;
    SCOREBOARD_CONTAINER.appendChild(letter);
  }

  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.id = 'user-input';
  inputElement.style.visibility = 'hidden';
  inputElement.maxLength = width;
  document.body.appendChild(inputElement);
}

async function fetchWordOfTheDay() {
  let word = ["apple", "beach", "candy", "drama", "eager", "faith", "ghost", "happy", "igloo", "jolly"][Math.floor(Math.random() * 10)];

  try {
    const response = await fetch(
      "https://words.dev-apis.com/word-of-the-day?random=1"
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json();
    word = data.word;
  } catch (error) {
    console.error(error);
    console.warn("Using a default random word instead.")
  }
  console.log(`Word of the day: ${word}`);
  return word;
}

function handleKeyDown(event) {
  if (gameOver) {
    return;
  }

  const letter = event.key;
  const inputElement = document.getElementById('user-input');

  if (letter.match(/^[A-Za-z]$/) && inputElement.value.length < 5) {
    inputElement.value += letter;
    const cellId = currentRow * 5 + inputElement.value.length;
    const cell = document.getElementById(`letter-${cellId}`);
    if (cell) {
      cell.textContent = letter;
    }
  } else if (event.keyCode === 8 || event.which === 8) {
    inputElement.value = inputElement.value.slice(0, -1);
    const cellId = currentRow * 5 + inputElement.value.length + 1;
    const cell = document.getElementById(`letter-${cellId}`);
    if (cell) {
      cell.textContent = '';
      cell.style.backgroundColor = '';
    }
  }

  if (inputElement.value.length === 5) {
    checkWord(inputElement.value);
    inputElement.value = '';
    currentRow = currentRow === 5 ? 0 : currentRow + 1;
  }
}

function displayResult(message) {
  const resultElement = document.getElementById('result');
  resultElement.textContent = message;
  resultElement.style.fontSize = '2em';
  resultElement.style.textAlign = 'center';
}

function checkWord(word) {
  updateColor(word);

  if (word.toLowerCase() === wordOfTheDay.toLowerCase()) {
    gameOver = true;
    displayResult('You won!');
  } else if (currentRow === 5) {
    gameOver = true;
    displayResult('You lost!');
  }
}

function updateColor(word) {
  for (let i = 0; i < word.length; i++) {
    const cellId = currentRow * 5 + i + 1;
    const cell = document.getElementById(`letter-${cellId}`);
    if (cell) {
      if (word[i].toLowerCase() === wordOfTheDay[i].toLowerCase()) {
        cell.style.backgroundColor = 'green';
      } else if (wordOfTheDay.toLowerCase().includes(word[i].toLowerCase())) {
        cell.style.backgroundColor = 'yellow';
      } else {
        cell.style.backgroundColor = '';
      }
    }
  }
}
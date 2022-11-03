/*----------  HTML Elements  ----------*/
const wrapper = document.querySelector('.wrapper')
const playerInputEl = document.querySelector('#player-input')
const labelForPlayerInputEl = document.querySelector('#label-for-input')
const currentWordEl = document.querySelector('#current-word')
const startGameButton = document.querySelector('#start-btn')
const guessButton = document.querySelector('#guess-btn')
const playAgainButton = document.querySelector('#play-again-btn')
const hintButton = document.querySelector('#hint-btn')
const messageEl = document.querySelector('.message')
const guessedWordDisplay = document.querySelector('#guessed-word-display')
const timerDisplay = document.querySelector('#timer')
const guessingForm = document.querySelector('.guessing-form')

// global variables
let seconds = 60
const currentWord = getCurrentRandomWord()
let currentWordCharacters
let guessedCharacters = []
let playerLives = 5

let playerPickedCharacter
// const currentWord = 'test';
startGameButton.addEventListener('click', () => {
  start()
})

/*----------  global var för att kunna stoppa timern från olika ställen i koden  ----------*/
let timeInterval = null

function countDown() {
  let timer = seconds
  // starta timern
  timeInterval = setInterval(() => {
    timerDisplay.textContent = timer
    timer--
    if (timer < 0) {
      playAgain('Tiden är ute!')
      clearInterval(timeInterval)
    }
  }, 1000)
}

/*----------  Plocka ut ETT random ord från förkortad ordlista  ----------*/
function getCurrentRandomWord() {
  const randomIndex = Math.floor(Math.random() * getRandomWordList(wordList).length)
  const currentRandomWord = getRandomWordList(wordList)[randomIndex].toLowerCase()

  return currentRandomWord
}

/*----------  Plocka ut random antal ord från en array med ord  ----------*/
function getRandomWordList(wordList) {
  const totalWordsToGet = 30
  const minWordLength = 4
  const maxWorldLength = 6

  let count = 0
  let wordListArr = []
  while (count < totalWordsToGet) {
    let random = Math.floor(Math.random() * wordList.length)

    if (
      wordList[random].length <= maxWorldLength &&
      wordList[random].length >= minWordLength &&
      wordList[random].indexOf(' ') === -1 &&
      wordList[random].indexOf('-') === -1
    ) {
      wordListArr.push(wordList[random])
      count++
    }
  }

  return wordListArr
}

/*----------  kollar att valda tecken finns i currentWord  ----------*/
function getCorrectCharacters(
) {
  let numberOfCorrectCharactes = []

  currentWord.split('').forEach((char) => {
    if (
      char === playerPickedCharacter.toLowerCase() 
    ) {
      numberOfCorrectCharactes.push(playerPickedCharacter)
      messageEl.innerHTML = 'Rätt gissat!'
    }
  })

  return numberOfCorrectCharactes
}

/*----------  Kollar så att man skrivit en bokstav  ----------*/
function isNotAlphabet() {
  const regex = /^[a-zA-ZäöåÄÖÅ]+$/
  if (!playerPickedCharacter.toString().match(regex)){
    return (messageEl.innerHTML = 'Använd endast a-ö')

  }
}

/*----------  Kolla om gissad bokstav finns i valda ordet och inte en bokstav man redan gissat  ----------*/
function isDuplicatedCharacter() {
  console.log(playerPickedCharacter)
  if (guessedCharacters.includes(playerPickedCharacter)){
    return (messageEl.innerHTML = 'Redan gissat bokstaven')
  }
    
}

function reset() {
  seconds = 60
  showHangMan()
  guessedCharacters = [];
  currentWordEl.innerHTML = ''
  messageEl.innerHTML = ''
  guessedWordDisplay.innerHTML = ''
  guessedCharacters = []
 playerLives = 5
 playerPickedCharacter=''
}

/*----------  Skriver ut   ----------*/
function renderCorrectCharacters() {
  currentWordCharacters.forEach((char) => {
    currentWordEl.innerHTML += `<li>${char}</li>`
  })
}

/*----------  Skriver ut till HTML vilka bokstäver man gissat på  ----------*/
function renderGuessedCharacters() {
  guessedWordDisplay.innerHTML = guessedCharacters
}

/*----------  Startar om spelet genom att ladda om sidan  ----------*/
function playAgain(text) {
  messageEl.innerHTML = text
  guessingForm.classList.add('hidden')
  playAgainButton.classList.remove('hidden')
  playAgainButton.addEventListener('click', () => {
      playAgainButton.classList.add('hidden')
      reset()
      start()
  })
}

/*----------  Ger ett tips  ----------*/
function hint() {
  const hint = currentWord.split('').sort().join('')
  messageEl.innerHTML = `Ordet innehåller bokstäverna: ${hint}`
}

function showHangMan(playerLives) {
  switch (playerLives) {
    case 4:
      document.querySelector('figure').classList.add('scaffold')
      break
    case 3:
      document.querySelector('figure').classList.add('head')
      break
    case 2:
      document.querySelector('figure').classList.add('body')
      break
    case 1:
      document.querySelector('figure').classList.add('arms')
      break
    case 0:
      document.querySelector('figure').classList.add('legs')
      break

    default:
      document
        .querySelector('figure')
        .classList.remove('scaffold', 'head', 'body', 'arms', 'legs')
      break
  }
}
function check(
) {
  if (
    getCorrectCharacters().length > 0
  ) {
    currentWordCharacters.forEach((char, i) => {
      if (currentWord[i] === playerPickedCharacter) {
        currentWordCharacters[i] = playerPickedCharacter
      }
    })
    currentWordEl.innerHTML = ''
    renderCorrectCharacters()
    if (currentWordCharacters.join('') === currentWord) {
      clearInterval(timeInterval)
      playAgain('Grattis du vann!')
    }
    return true

  } else {
    return false
  }
}

playerInputEl.addEventListener('focus', () => {
  playerInputEl.classList.add('focus')
})
playerInputEl.addEventListener('mouseout', () => {
  playerInputEl.classList.remove('focus')
})

/*----------  Start av spel  ----------*/
function start() {
  countDown()
  /*----------  skapar en array med _ beroende på längden av nuvarande ord  ----------*/
  currentWordCharacters = Array.from('_'.repeat(currentWord.length))
  startGameButton.classList.add('hidden')
  guessingForm.classList.remove('hidden')
  renderCorrectCharacters(currentWordCharacters)
 
  /*----------  Ger tips till spelare  ----------*/
  hintButton.addEventListener('click', () => {
    hint()
  })

 
}

 /*----------  Låter spelaren gissa på en bokstav genom att trycka på 'Enter' tangenten  ----------*/
 document.addEventListener('keypress', (event) => {
   if ( playerInputEl.classList.contains('focus')) {
    if(event.key === "Enter"){
      event.preventDefault();
      guessButton.click();
        return
    }
    return
  }
  if (!playerInputEl.classList.contains('focus')) {
    if (playerLives === 0) return
    if (event.key === 'Enter') return;
    playerPickedCharacter = event.key
    console.log(guessedCharacters)
    if (isNotAlphabet()) return 
    if (isDuplicatedCharacter()) return
    guessedCharacters.push(playerPickedCharacter)
    const guessedRight = check()
    if (!guessedRight) {
      playerLives--
      messageEl.innerHTML = `Du har ${playerLives} liv kvar`
      if (playerLives === 0) {
        clearInterval(timeInterval)
        playAgain('Du förlorade!')
      }
      showHangMan(playerLives)
    }
    renderGuessedCharacters()
    playerPickedCharacter=''
  }
  playerInputEl.value = ''

}) 

/*----------  Spelare gissar rätt eller fel bokstav  ----------*/
guessButton.addEventListener('click', () => {
  playerPickedCharacter = playerInputEl.value.trim().toLowerCase()
  // Ser till att spelaren skrivit en bokstav
  if (isNotAlphabet()) return
  if (isDuplicatedCharacter()) return
  guessedCharacters.push(playerPickedCharacter)
  const guessedRight = check()
  if (!guessedRight) {
    playerLives--
    messageEl.innerHTML = `Du har ${playerLives} liv kvar`
    if (playerLives === 0) {
      clearInterval(timeInterval)
      playAgain('Du förlorade!')
    }
    showHangMan(playerLives)
  }
  playerPickedCharacter=''
  playerInputEl.value = ''
  renderGuessedCharacters()
})

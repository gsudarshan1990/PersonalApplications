



// Card symbols using emojis
const cardSymbols = ['🎨', '🎮', '🎲', '🎭', '🎪', '🎯', '🎱', '🎳'];
const gameCards = [...cardSymbols, ...cardSymbols]; // Duplicate symbols for pairs

// Game state variables
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameTimer;
let seconds = 0;
let isGameStarted = false;

// DOM elements
const gameContainer = document.querySelector('.game-container');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const restartButton = document.getElementById('restart');

// Initialize game
function initializeGame() {
    resetGameState();
    shuffleCards();
    renderCards();
    attachEventListeners();
}

// Reset game state
function resetGameState() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    isGameStarted = false;
    movesDisplay.textContent = moves;
    timeDisplay.textContent = seconds;
    clearInterval(gameTimer);
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
}

// Create and render cards
function renderCards() {
    gameContainer.innerHTML = '';
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${symbol}</div>
        `;
        gameContainer.appendChild(card);
    });
}

// Start game timer
function startTimer() {
    gameTimer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = seconds;
    }, 1000);
}

// Handle card click
function handleCardClick(e) {
    const card = e.target.closest('.card');
    
    if (!card || card.classList.contains('flipped') || flippedCards.length >= 2) return;
    
    if (!isGameStarted) {
        isGameStarted = true;
        startTimer();
    }
    
    flipCard(card);
    
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }
}

// Flip card animation
function flipCard(card) {
    card.classList.add('flipped');
    flippedCards.push(card);
}

// Check for card match
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    const match = gameCards[firstCard.dataset.index] === gameCards[secondCard.dataset.index];
    
    match ? handleMatch() : handleMismatch();
}

// Handle matching cards
function handleMatch() {
    matchedPairs++;
    flippedCards = [];
    
    if (matchedPairs === cardSymbols.length) {
        setTimeout(() => {
            clearInterval(gameTimer);
            alert(`Congratulations! You won!\nMoves: ${moves}\nTime: ${seconds} seconds`);
        }, 500);
    }
}

// Handle mismatched cards
function handleMismatch() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }, 1000);
}

// Event listeners
function attachEventListeners() {
    gameContainer.addEventListener('click', handleCardClick);
    restartButton.addEventListener('click', initializeGame);
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

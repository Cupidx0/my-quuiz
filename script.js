const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
function createDeck(){
    deck = [];
    for(const suit of suits){
        for(const rank of values){
            deck.push({suit, rank});
        }
    }
    shuffleDeck();
}
function shuffleDeck(){
    for(let i= deck.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
function getCardValue(rank){
    const lowerValue = rank.toLowerCase();
    if(['j','q','k'].includes(lowerValue)) 
        return 10;
    if(lowerValue === 'a') return 11;
    return parseInt(rank);
}
function getCardImage(card){
    return `images/${card.rank}_of_${card.suit}.png`;
}
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

const playerCardsDiv = document.querySelector('#player-cards');
const dealerCardsDiv = document.querySelector('#dealer-cards');
const playerScoreDiv = document.querySelector('#player-score');
const dealerScoreDiv = document.querySelector('#dealer-score');
const resultText = document.querySelector('#result');

function startGame(){
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateGame();
}
function updateGame(){
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    renderCards(playerCardsDiv, playerHand);
    renderCards(dealerCardsDiv, dealerHand, gameOver);
    playerScoreDiv.textContent = `Score: ${playerScore}`;
    dealerScoreDiv.textContent = `Score: ${gameOver ? dealerScore: "0"}`;
    if(playerScore > 21){
        alert('You bust, dealer wins');
    }else if(gameOver){
        if(dealerScore > 21 || dealerScore < playerScore){
            alert('You win');
        }else if(dealerScore === playerScore){
            alert('Tie game');
        }else{
            alert('Dealer wins');
        }
    } 
}
function renderCards(container, hand, revealAll = true) {
    container.innerHTML = '';
    hand.forEach((card, index) =>{
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = revealAll || index === 0 ? `${card.rank} of ${card.suit}`:'?';
        if(index > 0 || revealAll){
            const image = document.createElement('img');
            image.src = getCardImage(card);
            cardDiv.appendChild(image);
        }else{
            cardDiv.classList.add('back');
        }
        container.appendChild(cardDiv);
    });
}
function calculateScore(hand){
    let score = hand.reduce((sum, card) => sum + getCardValue(card.rank), 0);
    let hasAce = hand.filter(card => card.rank === 'A').length;
    while(score > 21 && hasAce > 0){
        score -= 10;
        hasAce--;
    }
    return score;
}
function playerHit(){
    if(!gameOver) {
        playerHand.push(deck.pop());
        updateGame();
    }
}
function dealerTurn(){
    let dealerCurrentScore = calculateScore(dealerHand);
    while(dealerCurrentScore < 17){
        dealerHand.push(deck.pop());
        dealerCurrentScore = calculateScore(dealerHand);
    }
    dealerScore = dealerCurrentScore;
}
function endGame(message){
    dealerTurn();
    gameOver = true;
    updateGame();
    resultText.textContent = message;
    console.log(message);
}
document.getElementById('restart').addEventListener('click', () => {
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    gameOver = false;
    resultText.textContent = '';
    startGame();
});
document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('stand-btn').addEventListener('click',() =>{
    gameOver = true;
    dealerTurn();
    updateGame();
});
startGame();


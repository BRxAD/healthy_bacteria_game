const canvas = document.getElementById('gameCanvas');
canvas.width = 800;  // Make the screen wider
canvas.height = 700;
const ctx = canvas.getContext('2d');

const pillImg = new Image();
pillImg.src = 'pill.png';
const healthyBacteriaImg = new Image();
healthyBacteriaImg.src = 'healthy_bacteria.png';
const badBacteriaImg = new Image();
badBacteriaImg.src = 'bad_bacteria.png';

let pill = { x: 100, y: 200, width: 32, height: 32 };
let healthyBacteria = [];
let badBacteria = [];
let score = 0;
let gameOver = false;
let startGame = false;
let showPlusOne = false;
let plusOneX = 0;
let plusOneY = 0;

function init() {
    healthyBacteria = [];
    badBacteria = [];
    for (let i = 0; i < 6; i++) {
        healthyBacteria.push({ x: canvas.width + Math.random() * 1000, y: Math.random() * (canvas.height - 64) });
    }
    for (let i = 0; i < 3; i++) {
        badBacteria.push({ x: canvas.width + Math.random() * 3000, y: Math.random() * (canvas.height - 64) });
    }
    score = 0;
    gameOver = false;
    startGame = false;

    // Display initial instructions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText("Your mission is to use antibiotics judiciously -", 50, canvas.height / 2 - 60);
    ctx.fillText("kill the bad bacteria but keep your healthy bacteria safe!", 50, canvas.height / 2 - 20);
    
    const startButton = document.createElement('button');
    startButton.innerHTML = "Start Game";
    startButton.style.position = 'absolute';
    startButton.style.left = `${canvas.offsetLeft + canvas.width / 2 - 50}px`;
    startButton.style.top = `${canvas.offsetTop + canvas.height / 2 + 20}px`;
    document.body.appendChild(startButton);
    
    startButton.addEventListener('click', () => {
        document.body.removeChild(startButton);
        startGame = true;
        requestAnimationFrame(gameLoop);
    });
}

function gameLoop() {
    if (!startGame) return;

    if (gameOver) {
        displayMessage();
        return;
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    pill.y += 1;

    for (let hb of healthyBacteria) {
        hb.x -= 2;
        if (hb.x < -64) {
            hb.x = canvas.width + Math.random() * 1000;
            hb.y = Math.random() * (canvas.height - 64);
        }
        if (isColliding(pill, hb)) {
            gameOver = true;
        }
    }

    for (let bb of badBacteria) {
        bb.x -= 4;
        if (bb.x < -64) {
            bb.x = canvas.width + Math.random() * 3000;
            bb.y = Math.random() * (canvas.height - 64);
        }
        if (isColliding(pill, bb)) {
            score++;
            showPlusOne = true;
            plusOneX = bb.x;
            plusOneY = bb.y;
            setTimeout(() => showPlusOne = false, 500); // Show +1 for half a second
            bb.x = canvas.width + Math.random() * 3000;
            bb.y = Math.random() * (canvas.height - 64);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pillImg, pill.x, pill.y, pill.width, pill.height);

    for (let hb of healthyBacteria) {
        ctx.drawImage(healthyBacteriaImg, hb.x, hb.y, 64, 64);
    }

    for (let bb of badBacteria) {
        ctx.drawImage(badBacteriaImg, bb.x, bb.y, 64, 64);
    }

    if (showPlusOne) {
        ctx.fillStyle = 'red';
        ctx.font = '24px Arial';
        ctx.fillText('+1', plusOneX, plusOneY);
    }

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function isColliding(a, b) {
    return a.x < b.x + 64 && a.x + a.width > b.x && a.y < b.y + 64 && a.y + a.height > b.y;
}

function displayMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '24px Arial';
    ctx.fillText("Antibiotics don't work for all infections,", 10, canvas.height / 2 - 20);
    ctx.fillText("like coughs and colds which are caused by viruses.", 10, canvas.height / 2);
    ctx.fillText("Use antibiotics wisely and keep your healthy bacteria safe!", 10, canvas.height / 2 + 20);
    ctx.fillText("Score: " + score, 10, canvas.height / 2 + 60);

    // Add Play Again button
    const playAgainButton = document.createElement('button');
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.style.position = 'absolute';
    playAgainButton.style.left = `${canvas.offsetLeft + canvas.width / 2 - 50}px`;
    playAgainButton.style.top = `${canvas.offsetTop + canvas.height / 2 + 80}px`;
    document.body.appendChild(playAgainButton);
    
    playAgainButton.addEventListener('click', () => {
        document.body.removeChild(playAgainButton);
        init();
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        pill.y -= 10;  // Increase movement to 3x
    } else if (event.key === 'ArrowDown') {
        pill.y += 10;  // Increase movement to 3x
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        pill.y += 1; // Smoother movement
    }
});

init();


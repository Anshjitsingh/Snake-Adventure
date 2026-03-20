const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let snakeColor = "lime";
const speed = 150;
let gameInterval = null;

// Mappe (mondi)
const maps = ["images/map1.png","images/map2.png","images/map3.png"];
let currentMap = 0;

// ELEMENTI MENU
const startScreen = document.getElementById("startScreen");
const instructions = document.getElementById("instructions");
const skinMenu = document.getElementById("skinMenu");
const gameContainer = document.getElementById("gameContainer");
const gameOverDiv = document.getElementById("gameOver");

// ---------- FUNZIONI MENU ----------
function showMenuScreen() {
    startScreen.classList.remove("hidden");
    instructions.classList.add("hidden");
    skinMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
    gameOverDiv.classList.add("hidden");
}

// ---------- FUNZIONI SKIN ----------
function setSkin(color){
    snakeColor = color;
}

// ---------- FUNZIONI GAME ----------
function startGame() {
    snake = [{x: Math.floor(canvas.width/2/box)*box, y: Math.floor(canvas.height/2/box)*box}];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;
    spawnFood();

    // Cambia mondo ogni partita
    canvas.style.backgroundImage = `url('${maps[currentMap]}')`;
    currentMap = (currentMap+1)%maps.length;

    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);

    gameContainer.classList.remove("hidden");
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "white" : snakeColor;
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function checkCollision(head) {
    if(head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height){
        return true;
    }
    return snake.some((seg, i) => i !== 0 && seg.x === head.x && seg.y === head.y);
}

function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSnake();
    drawFood();

    let headX = snake[0].x;
    let headY = snake[0].y;

    if(direction === "UP") headY -= box;
    if(direction === "DOWN") headY += box;
    if(direction === "LEFT") headX -= box;
    if(direction === "RIGHT") headX += box;

    if(headX === food.x && headY === food.y){
        score++;
        document.getElementById("score").innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }

    let newHead = {x: headX, y: headY};

    if(checkCollision(newHead)){
        clearInterval(gameInterval);
        endGame();
        return;
    }

    snake.unshift(newHead);
}

function endGame() {
    gameContainer.classList.add("hidden");
    gameOverDiv.classList.remove("hidden");
    document.getElementById("finalScore").innerText = score;
}

// ---------- EVENTI TASTI ----------
document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if(e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if(e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if(e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if(e.key === "s"){
        const colors=["lime","cyan","yellow","orange","pink"];
        setSkin(colors[Math.floor(Math.random()*colors.length)]);
    }
});

// ---------- EVENTI MENU ----------
document.getElementById("playBtn").addEventListener("click", () => {
    startScreen.classList.add("hidden");
    startGame();
});
document.getElementById("instructionsBtn").addEventListener("click", () => {
    instructions.classList.remove("hidden");
    startScreen.classList.add("hidden");
});
document.getElementById("backInstr").addEventListener("click", showMenuScreen);
document.getElementById("skinBtn").addEventListener("click", () => {
    skinMenu.classList.remove("hidden");
    startScreen.classList.add("hidden");
});
document.getElementById("backSkin").addEventListener("click", showMenuScreen);
document.querySelectorAll(".skinChoice").forEach(btn => {
    btn.addEventListener("click", () => {
        setSkin(btn.dataset.color);
        showMenuScreen();
    });
});
document.getElementById("restartBtn").addEventListener("click", () => {
    gameOverDiv.classList.add("hidden");
    startGame();
});
document.getElementById("menuBtn").addEventListener("click", showMenuScreen);
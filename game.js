const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Размеры платформ и мяча
let paddleWidth = 100;
let paddleHeight = 10;
let ballRadius = 7;

// Скорость перемещения платформы (увеличена на 30%)
const paddleSpeed = 5 * 1.3;

// Позиции платформ
let playerPaddleX = (canvas.width - paddleWidth) / 2;
let computerPaddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
const speedIncrement = 1.1; // Увеличение скорости мяча

// Управление пользователем
let playerMovingLeft = false;
let playerMovingRight = false;

// Очки
let playerScore = 0;
let computerScore = 0;

// Флаг для проверки окончания игры
let gameOver = false;

// Элементы DOM для экрана окончания игры
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');

// Адаптивное изменение размера холста
function resizeCanvas() {
    if (window.innerWidth <= 768) {
        // Мобильные устройства: холст на весь экран
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        // Компьютеры и горизонтальная ориентация: максимальная высота и ограниченная ширина
        canvas.height = window.innerHeight;
        canvas.width = Math.min(600, window.innerWidth);
    }

    // Скорректируем начальные позиции
    playerPaddleX = (canvas.width - paddleWidth) / 2;
    computerPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Установим начальные размеры

// Рисование игровых элементов
function drawPaddle(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("You: " + playerScore, 10, 30);
    ctx.fillText("Computer: " + computerScore, 10, 50);
}

// Функция для обновления игры
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Движение мячика
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Отскок мяча от стенок
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // Отскок от платформ
    if (ballY + ballRadius > canvas.height - paddleHeight && ballX > playerPaddleX && ballX < playerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
    } else if (ballY - ballRadius < paddleHeight && ballX > computerPaddleX && ballX < computerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
    }

    // Проверка на проигрыш или победу
    if (ballY + ballRadius > canvas.height) {
        computerScore++;
        checkGameOver();
        resetBall();
    } else if (ballY - ballRadius < 0) {
        playerScore++;
        checkGameOver();
        resetBall();
    }

    // Движение платформы игрока
    if (playerMovingLeft && playerPaddleX > 0) {
        playerPaddleX -= paddleSpeed;
    } else if (playerMovingRight && playerPaddleX < canvas.width - paddleWidth) {
        playerPaddleX += paddleSpeed;
    }

    // Движение платформы компьютера
    if (computerPaddleX + paddleWidth / 2 < ballX) {
        computerPaddleX += 3;
    } else {
        computerPaddleX -= 3;
    }

    // Рисование объектов
    drawPaddle(playerPaddleX, canvas.height - paddleHeight);
    drawPaddle(computerPaddleX, 0);
    drawBall();
    drawScore();

    requestAnimationFrame(updateGame);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 2 : -2;
    ballSpeedY = 2;
}

function checkGameOver() {
    if (playerScore === 10) {
        showGameOverScreen("You won!");
    } else if (computerScore === 10) {
        showGameOverScreen("You lost");
    }
}

function showGameOverScreen(message) {
    gameOver = true;
    gameOverMessage.textContent = message;
    gameOverScreen.style.display = "flex";
}

function resetGame() {
    gameOverScreen.style.display = "none";
    playerScore = 0;
    computerScore = 0;
    gameOver = false;
    resetBall();
    updateGame();
}

// Управление для клавиатуры
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        playerMovingLeft = true;
    } else if (event.key === 'ArrowRight') {
        playerMovingRight = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
        playerMovingLeft = false;
    } else if (event.key === 'ArrowRight') {
        playerMovingRight = false;
    }
});

// Управление для сенсорных экранов (мобильные устройства)
canvas.addEventListener('touchstart', function (event) {
    const touchX = event.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        playerMovingLeft = true;
    } else {
        playerMovingRight = true;
    }
});

canvas.addEventListener('touchend', function () {
    playerMovingLeft = false;
    playerMovingRight = false;
});

// Скрываем экран окончания игры при запуске
gameOverScreen.style.display = "none";

// Запуск игры
updateGame();
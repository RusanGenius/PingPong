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
let ballSpeedX = 3;
let ballSpeedY = 3;
const speedIncrement = 1.1; // Увеличение скорости мяча

let computerSpeed = 3; // Начальная скорость компьютера
let bounceCount = 0; // Счётчик отскоков

// Обновляем игру
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
        bounceCount++; // Увеличиваем счётчик отскоков
        updateComputerSpeed(); // Обновляем скорость компьютера
    } else if (ballY - ballRadius < paddleHeight && ballX > computerPaddleX && ballX < computerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
        bounceCount++; // Увеличиваем счётчик отскоков
        updateComputerSpeed(); // Обновляем скорость компьютера
    }

    // Проверка на проигрыш или победу
    if (ballY + ballRadius > canvas.height) {
        computerScore++;
        computerSpeed = 3; // Сбрасываем скорость компьютера после пропуска
        checkGameOver();
        resetBall();
    } else if (ballY - ballRadius < 0) {
        playerScore++;
        computerSpeed = 3; // Сбрасываем скорость компьютера после пропуска
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
        computerPaddleX += computerSpeed;
    } else {
        computerPaddleX -= computerSpeed;
    }

    // Рисование объектов
    drawPaddle(playerPaddleX, canvas.height - paddleHeight);
    drawPaddle(computerPaddleX, 0);
    drawBall();
    drawScore();

    requestAnimationFrame(updateGame);
}

// Управление пользователем
let playerMovingLeft = false;
let playerMovingRight = false;

// Очки
let playerScore = 0;
let computerScore = 0;
let totalScore = 7;

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
    ctx.fillText("Total: " + totalScore, 10, 35);
    ctx.fillText("Computer: " + computerScore, 10, 65);
    ctx.fillText("You: " + playerScore, 10, 85);
}

function drawName() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Rusan is a genius", 10, 100);
}

// Обновление скорости компьютера
function updateComputerSpeed() {
    if (bounceCount >= 7) {
        computerSpeed = 8;
    } else if (bounceCount >= 4) {
        computerSpeed = 5;
    } else {
        computerSpeed = 3;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 3 : -3; // Устанавливаем начальную скорость 3
    ballSpeedY = 3; // Устанавливаем начальную скорость 3
}

function checkGameOver() {
    if (playerScore === totalScore) {
        showGameOverScreen("You won!");
    } else if (computerScore === totalScore) {
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
    bounceCount = 0; // Сбрасываем счётчик отскоков
    gameOver = false;
    resetBall();
    updateGame();
}

// Обработчик для кнопки Play Again
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function () {
    resetGame();
});


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

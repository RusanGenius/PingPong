const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ������� �������� � ����
let paddleWidth = 100;
let paddleHeight = 10;
let ballRadius = 7;

// �������� ����������� ��������� (��������� �� 30%)
const paddleSpeed = 5 * 1.3;

// ������� ��������
let playerPaddleX = (canvas.width - paddleWidth) / 2;
let computerPaddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
const speedIncrement = 1.1; // ���������� �������� ����

let computerSpeed = 3; // ��������� �������� ����������
let bounceCount = 0; // ������� ��������

// ��������� ����
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // �������� ������
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // ������ ���� �� ������
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // ������ �� ��������
    if (ballY + ballRadius > canvas.height - paddleHeight && ballX > playerPaddleX && ballX < playerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
        bounceCount++; // ����������� ������� ��������
        updateComputerSpeed(); // ��������� �������� ����������
    } else if (ballY - ballRadius < paddleHeight && ballX > computerPaddleX && ballX < computerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
        bounceCount++; // ����������� ������� ��������
        updateComputerSpeed(); // ��������� �������� ����������
    }

    // �������� �� �������� ��� ������
    if (ballY + ballRadius > canvas.height) {
        computerScore++;
        computerSpeed = 3; // ���������� �������� ���������� ����� ��������
        checkGameOver();
        resetBall();
    } else if (ballY - ballRadius < 0) {
        playerScore++;
        computerSpeed = 3; // ���������� �������� ���������� ����� ��������
        checkGameOver();
        resetBall();
    }

    // �������� ��������� ������
    if (playerMovingLeft && playerPaddleX > 0) {
        playerPaddleX -= paddleSpeed;
    } else if (playerMovingRight && playerPaddleX < canvas.width - paddleWidth) {
        playerPaddleX += paddleSpeed;
    }

    // �������� ��������� ����������
    if (computerPaddleX + paddleWidth / 2 < ballX) {
        computerPaddleX += computerSpeed;
    } else {
        computerPaddleX -= computerSpeed;
    }

    // ��������� ��������
    drawPaddle(playerPaddleX, canvas.height - paddleHeight);
    drawPaddle(computerPaddleX, 0);
    drawBall();
    drawScore();

    requestAnimationFrame(updateGame);
}

// ���������� �������������
let playerMovingLeft = false;
let playerMovingRight = false;

// ����
let playerScore = 0;
let computerScore = 0;
let totalScore = 7;

// ���� ��� �������� ��������� ����
let gameOver = false;

// �������� DOM ��� ������ ��������� ����
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');

// ���������� ��������� ������� ������
function resizeCanvas() {
    if (window.innerWidth <= 768) {
        // ��������� ����������: ����� �� ���� �����
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        // ���������� � �������������� ����������: ������������ ������ � ������������ ������
        canvas.height = window.innerHeight;
        canvas.width = Math.min(600, window.innerWidth);
    }

    // ������������� ��������� �������
    playerPaddleX = (canvas.width - paddleWidth) / 2;
    computerPaddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // ��������� ��������� �������

// ��������� ������� ���������
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

// ���������� �������� ����������
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
    ballSpeedX = Math.random() > 0.5 ? 3 : -3; // ������������� ��������� �������� 3
    ballSpeedY = 3; // ������������� ��������� �������� 3
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
    bounceCount = 0; // ���������� ������� ��������
    gameOver = false;
    resetBall();
    updateGame();
}

// ���������� ��� ������ Play Again
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function () {
    resetGame();
});


// ���������� ��� ����������
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

// ���������� ��� ��������� ������� (��������� ����������)
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

// �������� ����� ��������� ���� ��� �������
gameOverScreen.style.display = "none";

// ������ ����
updateGame();

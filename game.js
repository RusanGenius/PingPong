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
let ballSpeedX = 2;
let ballSpeedY = 2;
const speedIncrement = 1.1; // ���������� �������� ����

// ���������� �������������
let playerMovingLeft = false;
let playerMovingRight = false;

// ����
let playerScore = 0;
let computerScore = 0;

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
    ctx.fillText("You: " + playerScore, 10, 30);
    ctx.fillText("Computer: " + computerScore, 10, 50);
}

// ������� ��� ���������� ����
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
    } else if (ballY - ballRadius < paddleHeight && ballX > computerPaddleX && ballX < computerPaddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballSpeedX *= speedIncrement;
        ballSpeedY *= speedIncrement;
    }

    // �������� �� �������� ��� ������
    if (ballY + ballRadius > canvas.height) {
        computerScore++;
        checkGameOver();
        resetBall();
    } else if (ballY - ballRadius < 0) {
        playerScore++;
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
        computerPaddleX += 3;
    } else {
        computerPaddleX -= 3;
    }

    // ��������� ��������
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
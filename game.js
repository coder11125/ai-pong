const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const PAD_W = 12, PAD_H = 70, BALL_SIZE = 10;
const WIN_SCORE = 7;
const GREEN = '#33ff33';

let state = 'idle';
let scores = [0, 0];
let ball, playerY, aiY, aiSpeed, ballSpeedMult;
let keys = {};
let mouseY = H / 2;

canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouseY = e.clientY - r.top;
});

canvas.addEventListener('click', () => {
  if (state !== 'playing') startGame();
});

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ' && state !== 'playing') { e.preventDefault(); startGame(); }
  if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
});

document.addEventListener('keyup', e => keys[e.key] = false);

function resetBall(dir = 1) {
  const angle = (Math.random() * 60 - 30) * Math.PI / 180;
  const speed = 4.5 * ballSpeedMult;
  ball = {
    x: W / 2, y: H / 2,
    vx: Math.cos(angle) * speed * dir,
    vy: Math.sin(angle) * speed
  };
}

function startGame() {
  scores = [0, 0];
  playerY = H / 2 - PAD_H / 2;
  aiY = H / 2 - PAD_H / 2;
  aiSpeed = 3.2;
  ballSpeedMult = 1;
  state = 'playing';
  document.getElementById('msg').textContent = '';
  resetBall(Math.random() < 0.5 ? 1 : -1);
  requestAnimationFrame(loop);
}

function drawRect(x, y, w, h, color = GREEN) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawText(txt, x, y, size = 24, color = GREEN, align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `${size}px "Courier New", monospace`;
  ctx.textAlign = align;
  ctx.fillText(txt, x, y);
}

function drawDashedCenter() {
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#1a7a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function update() {
  const playerSpeed = 6;
  if (keys['ArrowUp'] || keys['w'] || keys['W']) {
    playerY -= playerSpeed;
  } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
    playerY += playerSpeed;
  } else {
    playerY = mouseY - PAD_H / 2;
  }
  playerY = clamp(playerY, 0, H - PAD_H);

  // AI movement
  const aiCenter = aiY + PAD_H / 2;
  const diff = ball.y - aiCenter;
  aiY = clamp(aiY + clamp(diff, -aiSpeed, aiSpeed), 0, H - PAD_H);

  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall bounce
  if (ball.y <= 0) { ball.y = 0; ball.vy *= -1; }
  if (ball.y + BALL_SIZE >= H) { ball.y = H - BALL_SIZE; ball.vy *= -1; }

  // Player paddle collision (left)
  const px = 20 + PAD_W;
  if (ball.vx < 0 && ball.x <= px && ball.x >= 20 &&
      ball.y + BALL_SIZE >= playerY && ball.y <= playerY + PAD_H) {
    ball.x = px;
    const hitPos = (ball.y + BALL_SIZE / 2 - playerY) / PAD_H;
    const angle = (hitPos - 0.5) * 100 * Math.PI / 180;
    const speed = Math.hypot(ball.vx, ball.vy) * 1.05;
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    ballSpeedMult = Math.min(ballSpeedMult * 1.05, 2.5);
  }

  // AI paddle collision (right)
  const ax = W - 20 - PAD_W;
  if (ball.vx > 0 && ball.x + BALL_SIZE >= ax && ball.x + BALL_SIZE <= W - 20 &&
      ball.y + BALL_SIZE >= aiY && ball.y <= aiY + PAD_H) {
    ball.x = ax - BALL_SIZE;
    const hitPos = (ball.y + BALL_SIZE / 2 - aiY) / PAD_H;
    const angle = (hitPos - 0.5) * 100 * Math.PI / 180;
    const speed = Math.hypot(ball.vx, ball.vy) * 1.05;
    ball.vx = -Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    ballSpeedMult = Math.min(ballSpeedMult * 1.05, 2.5);
  }

  // Scoring
  if (ball.x < 0) {
    scores[1]++;
    ballSpeedMult = 1;
    if (scores[1] >= WIN_SCORE) { endGame(false); return; }
    resetBall(1);
  }
  if (ball.x > W) {
    scores[0]++;
    ballSpeedMult = 1;
    if (scores[0] >= WIN_SCORE) { endGame(true); return; }
    resetBall(-1);
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawRect(0, 0, W, H, '#000');
  drawDashedCenter();

  drawText(scores[0], W / 4, 55, 36);
  drawText(scores[1], (3 * W) / 4, 55, 36);
  drawText('YOU', W / 4, 80, 11, '#1a7a1a');
  drawText('AI', (3 * W) / 4, 80, 11, '#1a7a1a');

  drawRect(20, playerY, PAD_W, PAD_H);
  drawRect(W - 20 - PAD_W, aiY, PAD_W, PAD_H);
  drawRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

function endGame(playerWon) {
  state = 'over';
  draw();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  drawText(playerWon ? 'YOU WIN!' : 'AI WINS', W / 2, H / 2 - 20, 36);
  drawText(`${scores[0]} — ${scores[1]}`, W / 2, H / 2 + 24, 22);
  document.getElementById('msg').textContent = 'Press SPACE or click to play again';
}

function loop() {
  if (state !== 'playing') return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// Draw idle screen
drawRect(0, 0, W, H, '#000');
drawDashedCenter();
drawText('PONG', W / 2, H / 2 - 10, 48);
drawText('vs AI', W / 2, H / 2 + 30, 18, '#1a7a1a');

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(96, Math.floor(width / 16));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + .4,
    speedX: (Math.random() - .5) * .32,
    speedY: (Math.random() - .5) * .32,
    alpha: Math.random() * .45 + .16
  }));
}

function drawConnections(particle, index) {
  for (let i = index + 1; i < particles.length; i += 1) {
    const other = particles[i];
    const dx = particle.x - other.x;
    const dy = particle.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 120) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(100, 210, 255, ${0.12 * (1 - distance / 120)})`;
      ctx.lineWidth = 1;
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(other.x, other.y);
      ctx.stroke();
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(100, 210, 255, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    drawConnections(particle, index);
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateParticles();

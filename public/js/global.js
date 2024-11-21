document.addEventListener("DOMContentLoaded", () => {
const canvas = document.createElement("canvas");
canvas.id = "particles-canvas";
document.querySelector("#particles-js").appendChild(canvas);

const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
const colors = ["#5800ff", "#ff6600", "#00ccff"];

class Particle {
    constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    }

    draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    }

    update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    this.draw();
    }
}

function initParticles(count) {
    for (let i = 0; i < count; i++) {
    particles.push(new Particle());
    }
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = "rgba(88, 0, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
        }
    }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
    particle.update();
    });

    drawLines();

    requestAnimationFrame(animateParticles);
}

initParticles(80);
animateParticles();
});
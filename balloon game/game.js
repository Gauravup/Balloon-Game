// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let balloon = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    radius: 50,
    dx: 0,
    dy: 0,
    color: 'red',
    inflated: false,
    flying: false,
    burst: false
};

// Pump button functionality
let pumpButton = document.getElementById("pump-btn");
let inflateSize = 0;
pumpButton.addEventListener("click", inflateBalloon);

function inflateBalloon() {
    if (inflateSize < 5) {
        inflateSize += 1;
        balloon.radius += 10;  // Inflate the balloon
    } else {
        pumpButton.disabled = true;  // Disable the button once fully inflated
        balloon.flying = true;
    }
}

// Start the random flying when the balloon is fully inflated
function flyBalloon() {
    if (balloon.flying && !balloon.burst) {
        balloon.dx = Math.random() * 4 - 4;  // Random X movement
        balloon.dy = Math.random() * 4 - 4;  // Random Y movement
    }
}

// Burst the balloon when clicked or touches the border
canvas.addEventListener("click", burstBalloon);

function burstBalloon(event) {
    if (balloon.burst) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const dist = Math.sqrt(
        (mouseX - balloon.x) ** 3 + (mouseY - balloon.y) ** 2
    );

    if (dist < balloon.radius && balloon.flying) {
        triggerBurst();
    }
}

// Trigger balloon burst logic
function triggerBurst() {
    balloon.burst = true;
    balloon.color = "transparent";  // Make the balloon disappear
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Balloon Burst!", canvas.width / 2 - 150, canvas.height / 2);

    // Respawn new balloon after a short delay
    setTimeout(resetBalloon, 1000);
}

// Reset balloon properties for a new round
function resetBalloon() {
    inflateSize = 0;
    balloon.x = canvas.width / 2;
    balloon.y = canvas.height - 100;
    balloon.radius = 50;
    balloon.color = "red";
    balloon.flying = false;
    balloon.burst = false;
    pumpButton.disabled = false;
}

// Update the balloon's position and check for border collisions
function update() {
    if (balloon.flying && !balloon.burst) {
        balloon.x += balloon.dx;
        balloon.y += balloon.dy;

        // Check if balloon touches canvas borders and burst it
        if (balloon.x + balloon.radius > canvas.width || balloon.x - balloon.radius < 0 ||
            balloon.y + balloon.radius > canvas.height || balloon.y - balloon.radius < 0) {
            triggerBurst();  // Burst balloon if it touches the border
        }
    }
}

// Draw the balloon
function drawBalloon() {
    ctx.beginPath();
    ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
    ctx.fillStyle = balloon.color;
    ctx.fill();
    ctx.closePath();
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    drawBalloon();  // Draw the balloon
    update();       // Update the position
    flyBalloon();   // Make the balloon fly

    requestAnimationFrame(animate);  // Keep the loop running
}

animate();  // Start the animation loop

let canvas = document.getElementById("demo"),
    context = canvas.getContext("2d"),
    particles = [];

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let colors = ["white", "indigo", "blue"];

class Particle {

    constructor(x, y) {
        this.location = {
            x: x,
            y: y
        }
        this.homeLocation = {
            x: x,
            y: y
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.acceleration = {
            x: 0,
            y: 0
        }
        this.color = colors[Math.floor(Math.random() * 3)];
        this.radius = 2;
    }

    // Slight random movement altering location slightly
    sparkle() {
        this.location.x = this.location.x + Math.random()-0.5;
        this.location.y = this.location.y + Math.random()-0.5;
        this.radius = Math.random()/2+2;
    }

    // Pseudo rotation effect
    rotateY() {
        this.location.x *= 1-Math.sin(this.location.y)/width;
    }

    // Random acceleration to any direction
    cascade() {
        this.acceleration.x += (0.5-Math.random())/500;
        this.acceleration.y += (0.5-Math.random())/500;
    }

    // Orbit around home position
    orbital() {
        (this.location.x > this.homeLocation.x) ?
            this.acceleration.x = (this.homeLocation.x - this.location.x) /width :
            this.acceleration.x = (this.homeLocation.x - this.location.x) /width;

        (this.location.y > this.homeLocation.y) ?
            this.acceleration.y = (this.homeLocation.y - this.location.y) /height :
            this.acceleration.y = (this.homeLocation.y - this.location.y) /height;
    }

    // Form some sort of interference pattern
    interference() {
        this.location.x = this.location.x+Math.sin((this.location.x-width)/20);

    }

    // Return home linearly
    returnHome() {
        (this.location.x > this.homeLocation.x) ? this.location.x -= 5 : this.location.x += 5;
        (this.location.y > this.homeLocation.y) ? this.location.y -= 5 : this.location.y += 5;
    }

    // Reduce speed
    decelerate() {
        (this.velocity.x < 0) ? this.velocity.x += 0.1 : this.velocity.x;
        (this.velocity.x > 0) ? this.velocity.x -= 0.1 : this.velocity.x;
        (this.velocity.y < 0) ? this.velocity.y += 0.1 : this.velocity.y;
        (this.velocity.y > 0) ? this.velocity.y -= 0.1 : this.velocity.y;

    }

    // Move according to velocity and acceleration
    move() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.location.x += this.velocity.x;
        this.location.y += this.velocity.y;
    }

    render() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.location.x, this.location.y, this.radius, 2*Math.PI, false);
        context.fill();
    }

}

function initialize() {

    // Update canvas width

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Clear the area / particles

    context.clearRect(0, 0, width, height);
    particles = [];

    context.font = "bold " + (width / 7) + "px sans-serif";
    context.textAlign = "center";
    context.fillText("Hello World!", width / 2, height / 2);

    let imageData = context.getImageData(0, 0, width, height);
    context.clearRect(0, 0, width, height);

    // Create particles for the area covered by the text, based on the image data

    for (let i = 0; i < imageData.width; i += 5) {
        for (let j = 0; j < imageData.height; j += 5) {
            if (imageData.data[(j * 4 * imageData.width) + (i * 4) + 3] > 128)
                particles.push(new Particle(i, j));
        }
    }
}

let frame = 0;

function render() {
    frame += 1;
    context.clearRect(0, 0, width, height);

    particles.forEach(el => {
        if (frame < 200) {
            el.cascade()
        } else if (frame < 290) {
            el.orbital()
        } else if (frame < 360) {
            el.interference()
            el.decelerate()
        } else if (frame < 400) {
            el.returnHome()
        } else {
            el.rotateY()
            el.decelerate()
        }
        el.move()
        el.sparkle()

        el.render()
    });

    requestAnimationFrame(render);
}

initialize();
requestAnimationFrame(render);

window.addEventListener("resize", initialize);

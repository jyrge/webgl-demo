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

function render() {
    context.clearRect(0, 0, width, height);
    particles.forEach(el => el.render());
    requestAnimationFrame(render);
}

initialize();
requestAnimationFrame(render);

window.addEventListener("resize", initialize);

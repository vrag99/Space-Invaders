const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const BG_COLOR = '#121212';
const PLAYER_SPEED = 10;
const BULLET_SPEED = 8;

const drawBackground = (color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        const playerImg = new Image();
        playerImg.src = './assets/spaceship.png';
        playerImg.onload = () => {
            const scale = 0.2;
            this.image = playerImg;
            this.width = playerImg.width * scale;
            this.height = playerImg.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }

}

class Invader {
    constructor({ position }) {
        const playerImg = new Image();
        playerImg.src = './assets/invader.png';
        playerImg.onload = () => {
            const scale = 1;
            this.image = playerImg;
            this.width = playerImg.width * scale;
            this.height = playerImg.height * scale;
            this.position = position;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;

        }
    }
}

class BattleFleet{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;

        this.invaders = [];
        this.rows = Math.floor(Math.random()*8 + 4)
        this.cols = Math.floor(Math.random()*3 + 2)
        // this.invaderWidth = new Invader({position: {x:0, y:0}}).width;
        this.invaderWidth = 30;
        for(let i=0; i<this.rows; i++){
            for(let j=0; j<this.cols; j++){
                this.invaders.push(new Invader({
                    position: {
                        x: this.position.x + i*this.invaderWidth,
                        y: this.position.y + j*this.invaderWidth,
                    }
                }))
            }
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.x <=0 || this.position.x + this.cols*this.invaderWidth >= canvas.width){
            this.velocity.x = -(this.velocity.x);
        };
    }
}

class Bullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player();
const fleets = [new BattleFleet({
    position: {x: 0, y: 0},
    velocity: {x: 10, y: 0},
})];

let bullets = [];

const keys = {
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    Space: { pressed: false },
}

function animate() {
    drawBackground(BG_COLOR);
    player.update();
    bullets.forEach(bullet => {
        bullet.update();
    })

    fleets.forEach(battleFleet => {
        battleFleet.update();
        battleFleet.invaders.forEach(invader => {
            invader.update({velocity: battleFleet.velocity});
        });
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -PLAYER_SPEED;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = PLAYER_SPEED;
    } else {
        player.velocity.x = 0;
    }

    window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            break;
        case "Space":
            keys.Space.pressed = true;
            bullets.push(new Bullet({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y,
                },
                velocity: { x: 0, y: -BULLET_SPEED }
            }));
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "Space":
            keys.Space.pressed = false;
            break;
    }
})
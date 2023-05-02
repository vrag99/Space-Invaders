const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const BG_COLOR = '#121212';
const PLAYER_SPEED = 10;

const drawBackground = (color) =>{
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

class Player{
    constructor(){
        this.velocity = {
            x: 0, 
            y: 0
        };

        const img = new Image();
        img.src = './assets/spaceship.png';
        img.onload = () =>{
            const scale = 0.2;
            this.image = img;
            this.width = img.width * scale;
            this.height = img.height * scale;
            this.position = {
                x: canvas.width/2 - this.width/2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        if(this.image){
            this.draw();
            this.position.x += this.velocity.x;
        }
    }

}

const player = new Player();

const keys = {
    ArrowLeft: {pressed: false},
    ArrowRight: {pressed: false},
    Space: {pressed: false},
}

function animate(){
    drawBackground(BG_COLOR);
    player.update();
    if(keys.ArrowLeft.pressed && player.position.x>=0){
        player.velocity.x = -PLAYER_SPEED;
    }else if(keys.ArrowRight.pressed && player.position.x+player.width<=canvas.width){
        player.velocity.x = PLAYER_SPEED;
    }else{
        player.velocity.x = 0;
    }

    window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('keydown', (event)=>{
    switch (event.code){
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            break;
        case "Space":
            keys.Space.pressed = true;
            break;
    }
})

window.addEventListener('keyup', (event)=>{
    switch (event.code){
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
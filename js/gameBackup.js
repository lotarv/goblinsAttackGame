const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");

//Создание изображений заднего фона и переднего
let fg = new Image();
fg.src = "images/fg.jpg"
let bg = new Image();
bg.src = "images/bg.jpg";

let movingLeft = new Image();
movingLeft.src = "images/character/soldatLeft.png";

let movingRight = new Image();
movingRight.src = "images/character/soldatRight.png";

//Переменная, означающая положение "на земле"
let grounded = canvas.height - fg.height;

//Создание массива монстров
let goblin1 = new Goblin(20, 990, grounded, goblinMovingLeft);
let goblin2 = new Goblin(20, 0, grounded, goblinMovingRight);
let currentMonster = null;
let monsters = [goblin1, goblin2];

//Создание объекта для главного герояd
let player = {
    currentSprite: movingRight,
    health: 20,
    ammo: 60,
    x: 512,
    y: canvas.height - fg.height

}

movingRight.onload = () => animation = setInterval(draw, 1000 / 60);



//Переменные, характеризующие поведение главного героя
let isShooting = false;
let isJumping = false;
let isFlying = false;
let isMovingLeft = false;
let isMovingRight = false;

document.addEventListener('keydown', (event) => {
    if (event.code == "Space") {
        isJumping = true;
    }
    if (event.code == "KeyD") {
        isMovingRight = true;
    }
    if (event.code == "KeyA") {
        isMovingLeft = true;
    }
})

document.addEventListener('keyup', (event) => {
    if (event.code == "KeyD") {
        isMovingRight = false;
        console.log('d released')
    }
    if (event.code == "KeyA") {
        isMovingLeft = false;
        console.log('a released')
    }
})

function draw() {
    context.drawImage(bg, 0, 0);
    context.drawImage(fg, 0, canvas.height - fg.height);
    context.drawImage(player.currentSprite, player.x, player.y);

    if (isMovingRight) {
        moveRight();
    }

    if (isMovingLeft) {
        moveLeft();
    }

    if (isJumping) {
        jump();
    }

    if (player.y < grounded) {
        isFlying = true;
        player.y += 2.5;
    }
    else {
        isFlying = false;
        isJumping = false;
    }
    updateMonsters();
}

function moveRight() {
    player.currentSprite = movingRight;
    if (player.x <= canvas.width - player.currentSprite.width) player.x += 5;
    if (isMovingLeft) isMovingLeft = false;
    isMovingRight = true;
}

function moveLeft() {
    player.currentSprite = movingLeft;
    if (player.x >= 0) player.x -= 5;
    if (isMovingRight) isMovingRight = false;
    isMovingLeft = true;
}

function jump() {
    if (!isFlying) {
        player.y -= 150;
    }
}

function updateMonsters() {
    for (let i = 0; i < monsters.length; i++) {
        currentMonster = monsters[i];
        context.drawImage(currentMonster.currentSprite, currentMonster.x, currentMonster.y);
        if (currentMonster.currentSprite == goblinMovingLeft) {
            if ((currentMonster.x >= 0))
                currentMonster.x -= currentMonster.speed;
            else {
                currentMonster.currentSprite = goblinMovingRight;
            }
        }
        else {
            if ((currentMonster.x <= 990))
                currentMonster.x += currentMonster.speed;
            else {
                currentMonster.currentSprite = goblinMovingLeft;
            }
        }
    }

}


function stopAnimation() {
    clearInterval(animation);
}


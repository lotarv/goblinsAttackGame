const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");


//Создание изображений заднего фона и переднего
let fg = new Image();

fg.src = "images/fg.jpg"
let bg = new Image();

bg.src = "images/bg.jpg";

//загрузка спрайтов для главного героя
let movingLeft = new Image();

movingLeft.src = "images/character/soldatLeft.png";

let movingRight = new Image();

movingRight.src = "images/character/soldatRight.png";

//Переменная, означающая положение "на земле"
let grounded = canvas.height - 142;

//пауза
let paused = false;

//счетчик очков
let score = 0;
let record = 0;
//Создание массива монстров
let goblin1 = new Goblin(20,990,grounded,goblinMovingLeft);
let goblin2 = new Goblin(20,0,grounded,goblinMovingRight);

//Необходимые переменные
let currentWave = 0;
let currentMonster = null;
let currentBullet = null;
let damagedEnemyIndex = null;
let monsters = [goblin1, goblin2];
let newMonsterX = null;
let newMonsterY = null;
let spawnCounter = 0;
let killedInWave = 0;
//Создание объекта для главного героя
let player = {
    currentSprite: movingRight,
    hp: 20,
    ammo:20,
    x: 512,
    y:canvas.height - fg.height
    
}



//Переменные, характеризующие поведение главного героя
let isShooting = false;
let isJumping = false;
let isFlying = false;
let isMovingLeft = false;
let isMovingRight = false;

//Назначение клавиш
document.addEventListener('keydown', (event) => {
    if (event.code == "KeyW"){
        isJumping = true;
    }
    if (event.code == "KeyD"){
        isMovingRight = true;
    }
    if (event.code == "KeyA"){
        isMovingLeft = true;
    }
    if (event.code == "Space"){
        event.preventDefault();
        shoot();
    }
})

document.addEventListener('keyup', (event) => {
    if (event.code == "KeyD") {
        isMovingRight = false;
    }
    if (event.code == "KeyA"){
        isMovingLeft = false;
    }
})

let suppliesStarted = false;

let mainMenu = document.querySelector(".menu");
let startButton = document.querySelector(".menu__startBtn");
let gameOverMenu = document.querySelector(".gameOverMenu");
let tryAgainButton = document.querySelector(".tryAgainButton");
startButton.addEventListener('click', startTheGame);
tryAgainButton.addEventListener('click', () => {
    location.reload()
});

function startTheGame(){
    animation = setInterval(draw, 1000 / 60);
    mainMenu.style.display = "none";
    paused = false;
    if (!suppliesStarted){
        startSupplies();
    }
    gameOverMenu.style.display = "none";


}
function draw(){
    context.drawImage(bg,0,0);
    context.drawImage(fg,0,canvas.height - fg.height);
    context.drawImage(player.currentSprite, player.x, player.y);
    
    if (isMovingRight) {
        moveRight();
    }

    if (isMovingLeft){
        moveLeft();
    }

    if (isJumping){
        jump();
    }

    if (isShooting){
        shoot();
        console.log(bullets);
    }

    if (player.y < grounded){
        isFlying = true;
        player.y += 2.5 ;}
    else {
        isFlying = false;
        isJumping = false;
    }
    updateMonsters();
    updateBullets();
    updatePlayerHp();
    updatePLayerAmmo();
    updateWave();
    updateSupplies();
    updateScore();
}

function moveRight(){
    player.currentSprite = movingRight;
    if (player.x <= canvas.width - player.currentSprite.width) player.x += 5;
    if(isMovingLeft) isMovingLeft = false;
    isMovingRight = true;
}

function moveLeft(){
    player.currentSprite = movingLeft;
    if (player.x >= 0)player.x -= 5;
    if(isMovingRight) isMovingRight = false;
    isMovingLeft = true;
}

function jump(){
    if (!isFlying){
        player.y -= 100;
    }
}

//Обновляет позиции монстров, меняет их спрайты когда они достигают стенок
function updateMonsters(){
    for (let i = 0; i < monsters.length; i++){
        currentMonster = monsters[i];
        context.drawImage(currentMonster.currentSprite, currentMonster.x, currentMonster.y);
        //Рисуем здоровье
        context.font = "30px serif";
        context.fillText(`${currentMonster.hp}hp`, currentMonster.x, currentMonster.y - 20);
        if (currentMonster.currentSprite == goblinMovingLeft){
            if((currentMonster.x >= 0))
                currentMonster.x -= currentMonster.speed;
            else {
                currentMonster.currentSprite = goblinMovingRight;
            }
        }
        else {
            if ((currentMonster.x <=990))
                currentMonster.x += currentMonster.speed;
            else {
                currentMonster.currentSprite = goblinMovingLeft;
            }
        }
    }

}


function pause(){
    if (!paused){
        stopAnimation();
        paused = true;
        mainMenu.style.display = "flex";
        startButton.textContent = "continue";
    }
}

function stopAnimation(){
    clearInterval(animation);
}

function startAnimation(){
    animation = setInterval(draw,1000/60);
}



//эта функция обновляет позиции пуль,
//если пуля попадает во врага, враг получает урон, а пуля исчезает
function updateBullets(){
    for (let i = 0; i < bullets.length; i++){
        currentBullet = bullets[i];
        context.drawImage(currentBullet.sprite, currentBullet.x, currentBullet.y);
        if (currentBullet.direction == "left"){
            currentBullet.x -= currentBullet.speed;
        }
        else {
            currentBullet.x += currentBullet.speed;
        }
        if (bulletReachedEnemy(currentBullet) != null) {
            damagedEnemyIndex = bulletReachedEnemy(currentBullet);
            enemyGetsDamage(damagedEnemyIndex);
            bullets.splice(i, 1);

        }

        
    }
}
//Возвращает index монстра, если пуля его достигла
//и null, если не достигла
function bulletReachedEnemy(currentBullet){
    for (let i = 0; i < monsters.length; i++){
        if ((monsters[i].x - 5 <= currentBullet.x && currentBullet.x  <= monsters[i].x + 5) && monsters[i].y -20 <= currentBullet.y && currentBullet.y <= monsters[i].y + 20){
            return i;
        }
    }
    return null;

}
//наносит урон врагу
function enemyGetsDamage(damagedEnemyIndex){
    monsters[damagedEnemyIndex].hp -= 5;
    if (monsters[damagedEnemyIndex].hp <= 0){
        monsters.splice(damagedEnemyIndex, 1);
        // player.ammo += 10;
        killedInWave++;
        score += 1;
        if (record < score){
            record = score;
        }
        
    }

}

//Обновляет HP главного героя, если к нему подошел враг - он получает урон.
function updatePlayerHp(){
    for (let i = 0; i < monsters.length; i++){
        if (
            (monsters[i].x - 5 <= player.x && player.x <= monsters[i].x + 5)
            && monsters[i].y -3 <= player.y && player.y <= monsters[i].y + 3
        )
        if (player.hp >= 1) player.hp -= 1;
    }
    context.font = "36px Arial";
    context.fillStyle = "white";
    context.fillRect(10,95,250,50);
    context.fillStyle = "red";
    context.fillText(`Your HP: ${player.hp}`, 15,135);
    
    if (player.hp <= 0){
        gameOver();
        
    }
}

function gameOver(){
    stopAnimation();
    gameOverMenu.style.display = "flex";
    document.querySelector('.score').textContent = `You have killed ${score} enemies`
    
}
function updatePLayerAmmo(){
    context.font = "36px Arial";
    context.fillStyle = "green";
    context.fillRect(10, 150, 200, 50);
    context.fillStyle = "black";
    context.fillText(`Ammo: ${player.ammo}`, 15, 190);
}

let spawnWaveInterval = null;
let spawnStarted = false;
function updateWave(){ //Спавнит врагов по волнам
    //Вывод текущей волны на экран
    context.font = "36px serif";
    context.fillStyle = "blue";
    context.fillRect(10,35,600,50);
    context.fillStyle = "white";
    context.fillText(`Current wave: ${currentWave}`,15,70);
    context.fillText(`Enemies remain: ${Math.abs(currentWave * 5 - killedInWave)}`, 300, 70);
    
    //Если за текущую волну заспавнилось 10 мобов - прекращаем спавн новых
    if (spawnCounter == currentWave * 5) {
        clearInterval(spawnWaveInterval);
        spawnStarted = false;
    }
    //Спавн определенного количества мобов и обновление числа волны
    if (monsters.length == 0 && !spawnStarted){
        spawnCounter = 0;
        currentWave++;
        killedInWave = 0;
        spawnStarted = true;
        spawnWaveInterval = setInterval(() => {
            //Вычисление позиции монстра по X - справа или слева - определение рандомное
            newMonsterX = Math.floor(Math.random() * 50) % 2 == 0 ? Math.floor(Math.random() * 1) - 50 : Math.floor(Math.random() * 24) + 1000;

            generateNewGoblin(20, newMonsterX,grounded);
            spawnCounter++;
        },1000)
    }
    

}


function updateScore(){
    context.font = "36px Arial";
    context.fillText(`Goblins killed: ${score}`, 10,230);
}

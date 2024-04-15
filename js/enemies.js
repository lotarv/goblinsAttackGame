const goblinMovingLeft = new Image();
const goblinMovingRight = new Image();

goblinMovingLeft.src = "images/enemies/Goblin/GoblinLeft.png";
goblinMovingRight.src = "images/enemies/Goblin/GoblinRight.png";


class Monster{
    constructor(hp, x ,y){
        this.hp = hp,
        this.x = x,
        this.y = y;
    }
}

class Goblin extends Monster{
    constructor(hp, x,y,sprite){
        super(hp,x,y);
        this.currentSprite = sprite;
        this.speed = 2;
    }
}

function generateNewGoblin(hp, x, y) {
    monsters.push(new Goblin(20, x, y, x > 512 ? goblinMovingRight : goblinMovingLeft));
}

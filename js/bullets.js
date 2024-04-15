let bullets = [];

class Bullet{
    constructor(x,y, direction){
        this.speed = 5;
        this.sprite = new Image();
        this.sprite.src = "images/bullet.png";
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
}


function shoot(){
    if (player.ammo <= 0){
        return;
    }
    if (player.currentSprite == movingRight){
        bullets.push(new Bullet(player.x + 40, player.y + 15, "right"));
        player.ammo--;
    }
    else {
        bullets.push(new Bullet(player.x - 15, player.y + 15, "left"));
        player.ammo--;
    }
}

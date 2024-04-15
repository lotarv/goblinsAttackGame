class ammoChest{
    constructor(ammo,x,y){
        this.ammo = ammo;
        this.sprite = new Image();
        this.sprite.src = "images/ammoChest_sprite.png";
        this.x = x;
        this.y = y;
    }
}

class hpChest{
    constructor(health,x,y){
        this.health = health;
        this.sprite = new Image();
        this.sprite.src = "images/hpChest_sprite.png";
        this.x = x;
        this.y = y;
    }
}

let ammo_chests = [];
let hp_chests = [];
let currentAmmoChest = null;
function startSupplies() {
    setInterval(() => {
        if (!paused) ammo_chests.push(new ammoChest(
            Math.floor(Math.random() * 30) + 1, //Количество патронов
            Math.floor(Math.random() * 1024),0));
    }, 2000)
    setInterval(() => {
        if(!paused) hp_chests.push(new hpChest(
            Math.floor(Math.random() * 10) + 1, //Количество здоровья
            Math.floor(Math.random() * 1024),0));
    }, 10000)
}
function updateSupplies(){
    //Снаряжение
    for (let i = 0; i < ammo_chests.length; i++){
        currentAmmoChest = ammo_chests[i];
        context.drawImage(currentAmmoChest.sprite, currentAmmoChest.x, currentAmmoChest.y);
        currentAmmoChest.y++;
        if ((player.x - 20 <= currentAmmoChest.x && currentAmmoChest.x <= player.x + 20)
             && (player.y - 20 <= currentAmmoChest.y && currentAmmoChest.y <= player.y + 20)){
            player.ammo += currentAmmoChest.ammo;
            ammo_chests.splice(i, 1);
            }
    }

    //Здоровье

    for (let i = 0; i < hp_chests.length; i++){
        currentCpChest = hp_chests[i];
        context.drawImage(currentCpChest.sprite, currentCpChest.x, currentCpChest.y);
        currentCpChest.y++;
        if ((player.x - 30 <= currentCpChest.x && currentCpChest.x <= player.x + 30)
             && (player.y - 30 <= currentCpChest.y && currentCpChest.y <= player.y + 30)){
            player.hp += currentCpChest.health;
            hp_chests.splice(i, 1);
            }
    }
}
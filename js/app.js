// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Each new enemy object will have a new speed and initial
    // position
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // All the enemies have a constant "y" coordinate
    // so it updates just the "x" coordinate
    this.x += this.speed * dt;

    // New enemy shows up when an enemy goes out of screen
    if (this.x >= 505) {
        allEnemies.splice(allEnemies.indexOf(this), 1, new Enemy(-101, this.y, speedGen()));
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    this.x = 202;
    this.y = 390;
    this.score = 0;
    this.lives = 3;
};

// Required method for the game
Player.prototype.update = function() {

};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle player inputs by checking the pressed key and moving
// the player around accordingly
Player.prototype.handleInput = function(movement) {
    switch (movement) {

        case 'left':
            (this.x >= 101) ? this.x -= 101 : this.x;
            break;

        case 'up':
            if (this.y >= 83) {
                this.y -= 83;

            // The player gets to the river, it returns to the initial position
            // and the score is updated
            } else {
                this.score++;
                this.x = 202;
                this.y = 390;
            }
            break;

        case 'right':
            (this.x <= 303) ? this.x += 101 : this.x;
            break;

        case 'down':
            (this.y <= 378) ? this.y += 83 : this.y;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Enemy random speed generator
let speedGen = () => 80 + Math.random()*200;

// Instantiating all enemy objects
let allEnemies = [];

allEnemies.push(new Enemy(-101, 63, speedGen()));
allEnemies.push(new Enemy(-101, 146, speedGen()));
allEnemies.push(new Enemy(-101, 229, speedGen()));

// Instantiating the player object
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

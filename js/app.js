// Enemies our player must avoid
let Enemy = function(x, y, speed) {
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
    this.x += Math.floor(this.speed * dt);

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
let Player = function() {
    this.sprite = 'images/char-boy.png';

    this.x = 202;
    this.y = 390;
    this.score = 0;
    this.lives = 3;
    // this.speed = 100; // Player transition speed
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
                this.score+=10;
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

// Collectible items on screen
// Create collectibles items class
let Collectibles = function(x, y){
    this.x = x;
    this.y = y;
    this.count = 10;
};

// Update displayed items on screen
Collectibles.prototype.update = function(dt) {

};

// Draw the items
Collectibles.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// OrangeGem subclass of Collectibles class
let OrangeGem = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Gem Orange.png';
    this.score = 20;
    this.frequency = 50;
};

OrangeGem.prototype = Object.create(Collectibles.prototype);
OrangeGem.prototype.constructor = OrangeGem;

// GreenGem subclass of Collectibles class
let GreenGem = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Gem Green.png';
    this.score = 40;
    this.frequency = 100;
};

GreenGem.prototype = Object.create(Collectibles.prototype);
GreenGem.prototype.constructor = GreenGem;

// BlueGem subclass of Collectibles class
let BlueGem = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Gem Blue.png';
    this.score = 80;
    this.frequency = 250;
};

BlueGem.prototype = Object.create(Collectibles.prototype);
BlueGem.prototype.constructor = BlueGem;

// GoldenKey subclass of Collectibles class
let GoldenKey = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Key.png';
    this.score = 200;
    this.frequency = 500;
};

GoldenKey.prototype = Object.create(Collectibles.prototype);
GoldenKey.prototype.constructor = GoldenKey;

// Heart subclass of Collectibles class
let Heart = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Heart.png';
    this.life = 1;
    this.frequency = 500;
};

Heart.prototype = Object.create(Collectibles.prototype);
Heart.prototype.constructor = Heart;

// Rocks that blocks the way of the player
let Rock = function(x, y) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y;
};

// Update displayed items on screen
Rock.prototype.update = function() {

};

// Draw the items
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle player's inputs from the keyboard regarding the screen:
// these variables controls if any of these keys were pressed,
// and hence they permit option selection on the start screen,
// pause, mute, and restart the game
let enterKey = false; // Enter key pressed (true) / not pressed (false)
let spaceKey = false; // Space key pressed (true) / not pressed (false)
let leftKey = false; // Left key pressed (true) / not pressed (false)
let upKey = false; // Up key pressed (true) / not pressed (false)
let rightKey = false; // Right key pressed (true) / not pressed (false)
let downKey = false; // Down key pressed (true) / not pressed (false)

// Gameplay variable controls if the game is running.
// The value of this boolean variable is assigned to 'true' when the 'space'
// or the 'enter' key is pressed on the Start screen.
let gameplay = false;

// Controls if the Start screen is the current screen
let startScreen = true;

// Controls if the Player selection screen is the current screen
let characterSelect = false;

// This variable controls if the Credits screen is the current screen
let credits = false;

// Controls if the Game Over screen is the current screen
let gameOver = false;

// This variables helps trasitioning elements
let transition = false; // Transitioning player during gameplay
let transLeft = false; // Transitioning left on character selection
let transRight = false; // Transitioning right on character selection
let transX = 202; // Initial X coordinate value for character tranaitioning
                  // on Character selection screen

// This method handle the user's inputs fom the keyboard when the Game screen
// is not running
function handleInput(input) {
    switch (input) {

        case 'enter':
            enterKey = true;
            break;

        case 'space':
            spaceKey = true;
            break;

        case 'left':
            leftKey = true;
            break;

        case 'up':
            upKey = true;
            break;

        case 'right':
            rightKey = true;
            break;

        case 'down':
            downKey = true;
    }
}


// Enemy random speed generator
let speedGen = () => 80 + Math.random()*200;

// Place all enemy objects in an array called allEnemies
let allEnemies = [];

// Instantiating all enemy objects
allEnemies.push(new Enemy(-101, 63, speedGen()));
allEnemies.push(new Enemy(-101, 146, speedGen()));
allEnemies.push(new Enemy(-101, 229, speedGen()));

// Place the player object in a variable called player
// Instantiate the player object
let player = new Player();

// Place all collectibles objects in an array called allCollectibles
let allCollectibles = [];

// Place all rocksobjects in an array called allRocks
let allRocks = [];

// Instatiate the rocks
let rock = new Rock();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause'
    };

    // If gameplay variable is 'true', it means the game is
    // on the Game screen and the keys pressed are sent
    // to Player.handleInput() method, in order to move the player
    // accordingly. Else, the game is not on the Game screen, and
    // the keys are sent to handleInput() method
    if (gameplay === true) {
        player.handleInput(allowedKeys[e.keyCode]);
    } else {
        handleInput(allowedKeys[e.keyCode]);
    }
});
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

// Update the player position on screen
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

// Get the player inputs and calculate the square that the player wants to move in
// This functions returns an object that represents that square
// The object returnes is used by checkSquare() function
Player.prototype.playerNextSquare = function(movement) {
    let playerNextSquare;

    switch (movement) {
        case 'left':
            playerNextSquare = {x: this.x - 66, y: this.y + 75, width: 49, height: 67};
            break;
        case 'up':
            playerNextSquare = {x: this.x + 35, y: this.y - 8, width: 49, height: 67};
            break;
        case 'right':
            playerNextSquare = {x: this.x + 136, y: this.y + 75, width: 49, height: 67};
            break;
        case 'down':
            playerNextSquare = {x: this.x + 35, y: this.y + 158, width: 49, height: 67};
    }

    return playerNextSquare;
}


// Get object square - this data is used to calculate if
// the player is in the same square of the collectible, and to avoid
// rendering 2 collectibles in the same tile, or in a rock tile.
// It used to calculate if there is another object in the same tile.
let getSquare = function() {
    let collSquare = {x: this.x, y: this.y + 75, width: 100, height: 75};

    if (this instanceof Heart || this instanceof GoldenKey) {
        collSquare = {x: this.x, y: this.y + 60, width: 100, height: 75};
    }

    return collSquare;
};

// Check if is there is an item or an rock in the tile, if so
// this function assigns 'true' to 'bool' variable.
// This function is called in player.handleInput() method
// to prevent the player of moving over the rocks,
// and to check is there is a collectible in the tile,
// so the player can collect it.
// It takes two parameters:
// The 'nextSquare' object - that holds the data of the square the player wants
// to move in - and an array of entities.
function checkSquare(nextSquare, entities) {
    let playerSquare = nextSquare;
    let entity;
    let i = 0;

    // Check if there is an entity in the tile that the player wants to move in
    // by using 2D - collision detection algorithm
    for (let ent of entities) {
    //arr.forEach(function(ent) {

        let entSquare = getSquare.call(ent);

        if (entSquare.x < playerSquare.x + playerSquare.width &&
            entSquare.x + entSquare.width > playerSquare.x &&
            entSquare.y < playerSquare.y + playerSquare.height &&
            entSquare.height + entSquare.y > playerSquare.y) {

            entity = {item: ent, itemSquare: entSquare, ind: i};
            i++;
        }
    }
    //});
    return entity;
}

// Collectible items on screen
// Create collectibles items class
let Collectibles = function(x, y){
    this.x = x;
    this.y = y;
    this.count = 10;
};

// This static method places Collectibles objects in an array.
// It takes as parameters the collectible object.
// This method is invoked by displayCollectibles() function.
Collectibles.addCollectibles = function(collectible) {
    this.collectible = collectible;
    allCollectibles.push(collectible);
}

// Remove the earlier Collectibles object
// from the screen. This method is called 10 seconds after
// the object has been displayed.
Collectibles.removeCollectibles = function(index) {
    if (index) {
        allCollectibles.splice(index, 1);
    } else {
        allCollectibles.shift();
    }
}

// Get a random Collectibles object and return it. This method is invoked by
// displayCollectibles() function.
// Each Collectibles object has a probability of being displayed on screen.
Collectibles.getCollectibles = function() {
    let index = getRandomInt(10);
    let collectible;

    switch (index) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            collectible = new OrangeGem(randomX(), randomY());
            break;
        case 5:
        case 6:
            collectible = new GreenGem(randomX(), randomY());
            break;
        case 7:
        collectible = new BlueGem(randomX(), randomY());
            break;
        case 8:
        collectible = new GoldenKey(randomX(), randomY()+15);
            break;
        case 9:
        collectible = new Heart(randomX(), randomY()+15);
    }

    return collectible;
}

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
    this.frequency = 0.5; // probability of be displayed on screen - 50%
};

OrangeGem.prototype = Object.create(Collectibles.prototype);
OrangeGem.prototype.constructor = OrangeGem;

// GreenGem subclass of Collectibles class
let GreenGem = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Gem Green.png';
    this.score = 40;
    this.frequency = 0.2; // probability of be displayed on screen - 20%
};

GreenGem.prototype = Object.create(Collectibles.prototype);
GreenGem.prototype.constructor = GreenGem;

// BlueGem subclass of Collectibles class
let BlueGem = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Gem Blue.png';
    this.score = 80;
    this.frequency = 0.2; // probability of be displayed on screen - 10%
};

BlueGem.prototype = Object.create(Collectibles.prototype);
BlueGem.prototype.constructor = BlueGem;

// GoldenKey subclass of Collectibles class
let GoldenKey = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Key.png';
    this.score = 200;
    this.frequency = 0.10; // probability of be displayed on screen - 10%
};

GoldenKey.prototype = Object.create(Collectibles.prototype);
GoldenKey.prototype.constructor = GoldenKey;

// Heart subclass of Collectibles class
let Heart = function(x, y) {
    Collectibles.call(this, x, y);

    this.sprite = 'images/Heart.png';
    this.life = 1;
    this.frequency = 0.10; // probability of be displayed on screen - 10%
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

// Controls if the Win Screen is the current screen
let winScreen = false;

// This variables helps trasitioning elements
let transition = false; // Transitioning player during gameplay
let transLeft = false; // Transitioning left on character selection
let transRight = false; // Transitioning right on character selection
let transX = 202; // Initial X coordinate value for character tranaitioning
                  // on Character selection screen

// This variable holds the value returned by
let rockInTile = false;
let collectibleInTile;


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

// Random integer generator
// Adapted from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
let getRandomInt = (max) => Math.floor(Math.random()*Math.floor(max));

// Randomized 'x' coordinate display
let randomX = function() {
    let num = getRandomInt(5),
        numPrev = num;
    return (num === 0) ? 0
         : (num === 1) ? 101
         : (num === 2) ? 201
         : (num === 3) ? 301
         :               401;
};

// Randomized 'y' coordinate display
let randomY = function() {
    let num = getRandomInt(3),
        numPrev = num;
    return (num === 0) ? 53
         : (num === 1) ? 136
         :               219;
};

// Get a set of random 'x' coordinates
// Place the values in a set to prevent repeated values
// This set will be used to create the Rock and Collectibles objects
// The 'num' parameter represents the number of differents objects
// that will be created
let getX = function(num) {
    let setX = new Set();

    while (setX.size < num) {
        setX.add(randomX());
    }
    return setX;
}

// Enemy random speed generator
let speedGen = () => 80 + Math.random()*200;

// Place all enemy objects in an array called allEnemies
let allEnemies = [];

// Instantiating all enemy objects
function makeEnemies() {
    allEnemies = [];
    allEnemies.push(new Enemy(-101, 63, speedGen()));
    allEnemies.push(new Enemy(-101, 146, speedGen()));
    allEnemies.push(new Enemy(-101, 229, speedGen()));
}

// Place the player object in a variable called player
// Instantiate the player object
let player = new Player();

// Place all collectibles objects in an array called allCollectibles
let allCollectibles = [];

// Place all Rock objects in an array called allRocks
let allRocks;

// Instatiate the rocks - function makeRocks gets the total number of
// random rocks that will be created and place them into an array
function makeRocks(num) {
    allRocks = [];
    let randomXset = getX(num); // Get random, not repeated, 'x' coordinates
    for (let x of randomXset) {
        allRocks.push(new Rock(x, randomY()));
    }
}

// As the time passes, there is a chance of each collectible be
// displayed on screen. This function takes the time elapsed as
// a parameter (count) to remove the Collectibles objects from the
// screen periodically, and calls addCollectibles() function that
// display new Collectibles objects.
// For each collectible created, it tests if there is already a rock
// object or a collectible in the tile. This function is invoked every
// 5000ms.
let displayCollectibles = function(count) {
    if (gameplay) {
        // Get a new random Collectibles object
        let coll = Collectibles.getCollectibles();
        // Get the square of the Collectibles object
        // It used to calculate if there is another object in the same tile
        let collSquare = getSquare.call(coll);
        console.log(collSquare);
        // Check if there is a Rock in the same tile
        let isRock = checkSquare(collSquare, allRocks);
        // Check if there is another Collectibles object in the same tile
        let isCollectible = checkSquare(collSquare, allCollectibles);

        // Test if there is already a Rock object or another Collectible object
        // in the tile that the new Collectibles object will be displayed.
        // The maximum number of Collectibles displayed at the same time is 3.
        if (!isCollectible && !isRock && allCollectibles.length < 3) {
            Collectibles.addCollectibles(coll);
        }
        // Remove the earlier Collectible from the array if 'i' index
        // is multiple of 3, and the array has at least one element.
        if (count % 3 === 0 && allCollectibles.length >= 1) {
            Collectibles.removeCollectibles();
        }
    }
};

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

        if (allowedKeys[e.keyCode] === 'left'
            || allowedKeys[e.keyCode] === 'up'
            || allowedKeys[e.keyCode] === 'right'
            || allowedKeys[e.keyCode] === 'down') {

            // Check if there is a rock in the tile that the player wants to move in
            // before calling player.handleInput() method - that prevents update the
            // player position before the check
            let nextSquare = player.playerNextSquare(allowedKeys[e.keyCode]);
            rockInTile = checkSquare(nextSquare, allRocks);
            collectibleInTile = checkSquare(nextSquare, allCollectibles);
        }

        // If there is no rock in the tile the player can move in
        if (!rockInTile) {
            // If there is a collectible, collect it
            if (collectibleInTile) {
                if (collectibleInTile.item.score) {
                    player.score += collectibleInTile.item.score;
                // Heart objects doesn't have 'score' property.
                // If score property of the object returns are falsy
                // the player's lives is updated
                } else {
                    player.lives < 3 ? player.lives += 1 : player.lives;
                }
                Collectibles.removeCollectibles(collectibleInTile.ind);
            }
            player.handleInput(allowedKeys[e.keyCode]);
        }
    } else if (startScreen === true || characterSelect === true
               || credits === true || gameOver === true || winScreen === true) {
        handleInput(allowedKeys[e.keyCode]);
    }
});
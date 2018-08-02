/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),

        // The 'hue' variable controls the red component of rgb, so the user
        // can navigate the menu on the Start screen. It permits change the
        // red component of the selected option. The 'direction' variable shows
        // if the red component is moving toward red or black.
        hue = 0,
        direction = 1,
        color, // Glowing red
        colorArr, // An Array with the color codes
        i = 0, // Helper index to assign values properly to 'colorArr'

        char = 0, // Helper index to select a character in an array
        rowCharacters, // Hold the relative URL of character images

        // An array that contains the current, the next,
        // and the previous selected Character index.
        arrChar,

        //Time counter variables
        count = 0,
        seconds = 0,
        minutes = 0,
        timeString = '00:00', // Time string with two digits format (MM:SS)

        lastTime,
        now,
        dt, // Time delta information

        // My requested animation frame ID.
        // This variable keeps track of the current animation frame,
        // so it can be canceled
        requestId;


    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        now = Date.now();
        dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */

        // If startScreen is 'true', the Start screen is displayed
        if (startScreen === true) {
            updateStartScreen(dt);
            renderStartScreen();
        }

        // If characterSelect is 'true', Character Selection screen is displayed
        if (characterSelect === true) {
            updateChaSelScreen();
            renderChaSelScreen(dt);

            // Select player's character
            if (enterKey === true || spaceKey === true) {
                player.sprite = rowCharacters[char];

                enterKey = false;
                spaceKey = false;
                startScreen = false;
                characterSelect = false;
                gameplay = true;
            }
        }

        // After the new game button is pressed, the gameplay variable is
        // assigned to 'true' and the Game screen is displayed as long as
        // the player's lives is different from zero
        if (gameplay === true && gameOver === false) {
            update(dt);
            render();
        }

        // If credits variable is 'true', the Credits screen is shown
        if (credits === true) {
            updateCreditScreen(dt);
            renderCreditScreen();

            // Exits Credit screen if the user hits 'enter' or 'space' keys
            if (enterKey === true || spaceKey === true) {
                enterKey = false;
                spaceKey = false;
                credits = false;
                startScreen = true;
            }
        }

        // If 'enter' or 'space' keys are pressed, the Start screen animation
        // frame stops
        // If the New Game button was glowing - colorArr[0] !== "#436ba8 -
        // the game starts
        if ((enterKey === true || spaceKey === true) && colorArr[0] !== "#436ba8"
            && gameOver === false) {
            enterKey = false;
            spaceKey = false;
            startScreen = false;
            characterSelect = true;
        }

        // If the Credits button was glowing instead - colorArr[0] === "#436ba8 -
        // the credits variable is assigned to 'true', and hence the Credits
        // screen is displayed
        else if ((enterKey === true || spaceKey === true) && colorArr[0] === "#436ba8"
                   && credits === false) {
            enterKey = false;
            spaceKey = false;
            startScreen = false;
            credits = true;
        }

        // When the player's lives reaches zero, the Game Over screen is
        // displayed
        if (player.lives === 0) {
            gameplay = false;
            gameOver = true;
            player = new Player();
            makeRocks(numRocks);
        }

        if (gameOver === true) {
            updateGameOverScreen(dt);
            renderGameOverScreen();
        }

        if ((enterKey === true || spaceKey === true) && gameOver === true) {
                enterKey = false;
                spaceKey = false;
                gameOver = false;
                startScreen = true;
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;


        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        requestId = win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();

        allCollectibles.forEach(function(collectible) {
            collectible.update(dt);
        });
    }

    // This function implements collision detection on entities,
    // if the player collides, the lives are updated and it returns to
    // the initial position
    function checkCollisions() {
        const playerSquare = {x: player.x + 35, y: player.y + 75, width: 49, height: 67};

        allEnemies.forEach(function(enemy) {
            const enemySquare = {x: Math.floor(enemy.x), y: enemy.y + 75, width: 100, height: 75};

            // Thanks to MDN! - 2D collision detection algorithm
            // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
            if (enemySquare.x < playerSquare.x + playerSquare.width &&
                enemySquare.x + enemySquare.width > playerSquare.x &&
                enemySquare.y < playerSquare.y + playerSquare.height &&
                enemySquare.height + enemySquare.y > playerSquare.y) {

                player.x = 202;
                player.y = 390;
                player.lives--;
            }
        });
    }

    // Call counter() every 1000ms
    let setCounterIntervalID = window.setInterval(counter, 1000);

    // A counter for the game
    // Set 'timeString' variable - it is displayed as a counter on screen
    function counter() {
        if (gameplay) {
            count++;
            seconds++;

            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }

            let twoDigMinutes = function() {
                return (minutes === 0) ? '00'
                    : (minutes < 10) ? `0${minutes}`
                    :                  `${minutes}`;
            };

            let twoDigSeconds = function() {
                return (seconds === 0) ? '00'
                    : (seconds < 10) ? `0${seconds}`
                    :                  `${seconds}`;
            };

            timeString = `${twoDigMinutes()}:${twoDigSeconds()}`;

        } else {
            count = 0;
            seconds = 0;
            minutes = 0;
        }
    }

    // Update the start screen
    function updateStartScreen(dt) {
        // The red component ranges from 0 to 255, then from 255 to 0
        // Give a red 'glowing' effect
        function changeRed() {
            if (hue >= 255) {
                direction = -1;
            } else if (hue <= 0) {
                direction = 1;
            }

            const floor = Math.floor(hue + (500*dt * direction));

            // Prevent rgb color from becoming >255 or <0
            if (floor > 255) {
                return 255;
            } else if (floor < 0) {
                return 0;
            } else {
                return floor;
            }
        }

        hue = changeRed();

        color = `rgb(${hue},0,0)`;

        // Alternate the elements of the color codes Array
        // Permit selected button state
        function alternateArr(item1, item2) {
            let arr = [item1, item2];

            if (i % 2 !== 0) {
                arr.reverse();
            }
            return arr;
        }

        // AlternateArr function returns an array that is used
        // to set the color of New Game button and Credits button.
        // The array items are used by renderStartScreen function,
        // on ctx.fillStyle properties.
        colorArr = alternateArr(color, "#436ba8");

        // If the Left or Up key is pressed, the button alternates between
        // selected / unselected states
        if (upKey === true || leftKey === true || downKey === true || rightKey === true) {
            upKey = false;
            leftKey = false;
            downKey = false;
            rightKey = false;
            i++;
        }
    }

    // Update Character Selection screen
    function updateChaSelScreen() {
        // An array that contains the current, the next,
        // and the previous selected Character index.
        arrChar = charPrevCharNext(char);

        // Rotate left the Character row
        if (leftKey === true && transLeft === false
            && transRight === false) {
            leftKey = false;
            transLeft = true;
        }

        // Rotate right the Character row
        if (rightKey === true && transLeft === false
            && transRight === false) {
            rightKey = false;
            transRight = true;
        }
    }

    // Creates an array that contains the current, the next,
    // and the previous selected Character index.
    function charPrevCharNext(char) {
        let charPrev = char-1;
        let charNext = char+1;

        if (char === 0) {
            charPrev = 4;
        }
        if (char === 4) {
            charNext = 0;
        }
        return [charPrev, char, charNext];
    }

    // Return the index of the character that
    // enters the screeen when the carousel turns
    function newCharNext(char) {
        if (transLeft === true) {
            if (char === 3){
                return 0;
            }
            if (char === 4) {
                return 1;
            }
            return char+2;
        }
        if (transRight === true) {
            if (char === 0) {
                return 3;
            }
            if (char === 1) {
                return 4;
            }
            return char-2;
        }
    }

    // Update credits screen
    function updateCreditScreen(dt) {

    }

    // Update game over screen
    function updateGameOverScreen(dt) {

    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
        drawScore();
    }

    // Execute displayCollectibles() method every five seconds if gameplay is 'true'
    let collectIntervalID = window.setInterval(function() {
        displayCollectibles(count)}, 5000);

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        // Fix Collectibles objects and Rock objects overlap correctly on screen
        const items = allCollectibles.concat(allRocks);
        items.sort(function itemsRenderingOrder(itemA, itemB) {
            if (itemA.x + itemA.y < itemB.x + itemB.y) {
                return -1;
            }
            if (itemA.x + itemA.y > itemB.x + itemB.y) {
                return 1;
            }
            return 0;
        });

        items.forEach(function(item) {
            item.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    // Create the score and lives display
    function drawScore() {
        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#3f87a6";
        ctx.textBaseline = "hanging";
        ctx.fillText(`SCORE:`, 2, 15);
        ctx.fillText('LIVES:', 250, 15);

        ctx.fillStyle = "#ff0095";
        ctx.fillText(`${player.score}`, 150, 15);

        // Each player's life draws a heart on the display
        let n = 390;
        for (let i = player.lives; i > 0; i--) {
           ctx.drawImage(Resources.get('images/heart-small.png'), n, 15);
           n += 40;
        }

        // Counter
        ctx.font = "38px Gaegu";
        ctx.fillStyle = "#fffd93";
        ctx.fillText(`TIME: ${timeString}`, 8, 550);
    }

    // Render the start screen
    function renderStartScreen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('Get to the RIVER', 0, 200);

        ctx.font = "48px Gaegu";
        ctx.fillStyle = colorArr[0];
        ctx.fillText('NEW GAME', 10, 300);

        ctx.fillStyle = colorArr[1];
        ctx.fillText('CREDITS', 10, 400);
    }

    // Render the Character Selection screen
    function renderChaSelScreen(dt) {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle = "#ffffffd9";
        ctx.fillRect(0,0,505,606);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('Select Character', 20, 80);

        /* This array holds the relative URL to the image used
         * for that particular character.
         */
        rowCharacters = [
                'images/char-boy.png',
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png',
                'images/Selector.png'
            ];

        ctx.drawImage(Resources.get(rowCharacters[5]), 202, 250);

        if (transLeft === true) {
            ctx.drawImage(Resources.get(rowCharacters[arrChar[0]]), transX-150, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[1]]), transX, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[2]]), transX+150, 250);
            ctx.drawImage(Resources.get(rowCharacters[newCharNext(char)]), transX+300, 250);

            transX = Math.floor(transX - 500 * dt);

            if (transX <= 52){
                transLeft = false;
                transX = 202;

                char++; // Update current Character index
                if (char === 5) {
                    char = 0;
                }
                arrChar = charPrevCharNext(char); // Update array with new char index values
            }
        }

        if (transRight === true) {
            ctx.drawImage(Resources.get(rowCharacters[newCharNext(char)]), transX-300, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[0]]), transX-150, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[1]]), transX, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[2]]), transX+150, 250);

            transX = Math.floor(transX + 500 * dt);

            if (transX >= 352){
                transRight = false;
                transX = 202;

                char--; // Update current Character index
                if (char === -1) {
                    char = 4;
                }
                arrChar = charPrevCharNext(char); // Update array with new char index values
            }

        }

        if (transRight === false && transLeft === false) {
            ctx.drawImage(Resources.get(rowCharacters[arrChar[0]]), 52, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[1]]), 202, 250);
            ctx.drawImage(Resources.get(rowCharacters[arrChar[2]]), 352, 250);
        }
    }

    // Render the credits screen
    function renderCreditScreen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('CREDITS', 10, 200);

        ctx.font = "48px Gaegu";
        ctx.fillText('Author: Nirlan Souza', 10, 300);

    }

    // Render the game over screen
    function renderGameOverScreen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('GAME OVER', 10, 200);

        ctx.font = "48px Gaegu";
        ctx.fillText('TRY AGAIN!', 10, 300);
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {

    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/heart-small.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Selector.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
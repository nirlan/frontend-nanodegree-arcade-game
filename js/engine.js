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
        lastTime,
        requestId, // My requested animation frame ID
        now,
        dt; // Time delta information

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

        if (gameplay === false && player.lives === 3) {
            updateStartScreen(dt);
            renderStartScreen();
        }

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (gameplay === true && player.lives !== 0) {
            update(dt);
            render();
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

    // This function implements collision detection on entities,
    // if the player collides, the lives are updated and it returns to
    // the initial position
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            const enemySquare = {x: Math.floor(enemy.x), y: enemy.y + 75, width: 100, height: 75};
            const playerSquare = {x: player.x + 35, y: player.y + 75, width: 49, height: 67};

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

    // Create the score and lives display
    function drawScore() {
        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#3f87a6";
        ctx.textBaseline = "hanging";
        ctx.fillText(`SCORE: ${player.score}`, 2, 15);
        ctx.fillText('LIVES:', 240, 15);

        // Each player's life draws a heart on the display
        let n = 390;
        for (let i = player.lives; i > 0; i--) {
           ctx.drawImage(Resources.get('images/heart-small.png'), n, 15);
           n += 40;
        }
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
    }

    // Update the start screen
    function updateStartScreen(dt) {
        if (enterKey === true || spaceKey === true) {
            screenNum = 1;
            console.log(`I'm listening (updateStartScreen) ${enterKey} + ${spaceKey}
                         screenNum = ${screenNum}`);
            enterKey = false;
            spaceKey = false;
            win.cancelAnimationFrame(requestId);
            requestId = undefined;
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

        if (player.lives === 0) {
            win.cancelAnimationFrame(requestId);
            gameOverScreen();
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    // Render the start screen
    function renderStartScreen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('Get to the RIVER', 0, 200);

        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('NEW GAME', 10, 300);

        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('CREDITS', 10, 400);
    }

    //Render the credits screen
    function renderCreditScreeen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('CREDITS', 10, 200);

        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('Author: Nirlan Souza', 10, 300);
    }

    //Render the game over screen
    function renderGameOverScreen() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.font = "68px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('GAME OVER', 10, 200);

        ctx.font = "48px Gaegu";
        ctx.fillStyle = "#436ba8";
        ctx.textBaseline = "hanging";
        ctx.fillText('TRY AGAIN!', 10, 300);
    }

    // Display the Start screen
    //function startScreen() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        // now = Date.now();
        // dt = (now - lastTime) / 1000.0;

        // updateStartScreen(dt);
        // renderStartScreen();

        // lastTime = now;
        // requestId = win.requestAnimationFrame(startScreen);
    //}

    // Display the Game Over screen
    function gameOverScreen() {
        now = Date.now();
        dt = (now - lastTime) / 1000.0;

        updateGameOverScreen(dt);
        renderGameOverScreen();

        lastTime = now;


        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        requestId = win.requestAnimationFrame(gameOverScreen);
    };

    // Display the Credits screen
    function creditScreen() {
        now = Date.now();
        dt = (now - lastTime) / 1000.0;

        updateCreditScreen(dt);
        renderCreditScreen();

        lastTime = now;


        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        requestId = win.requestAnimationFrame(creditScreen);
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
        'images/char-boy.png',
        'images/heart-small.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

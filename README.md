# Get to the River
## Udacity Frontend Nanodegree Arcade Game
==================================

This is a Frogger-like browser game implemented in Javascript.

# Getting Started
- download the files and save it on a local folder
- open index.html in a web browser

# How the game works?
In this game you have a Player, Enemies (Bugs), and Collectibles. The goal of the player is to reach the water as many times as possible, without colliding into any one of the enemies, straying from the stones on the way, and collecting items in the meanwhile. The player starts with 3 lives and 0 Score points. Each time the player gets to the river, it socres 10 points. There are 5 types of Collectibles: _Orange Gems, Green Gems, Blue Gems, Golden Keys, and Hearts_. The player gains different scores depending on the item that is collected:
- Orange Gem scores 20 points
- Green Gem scores 40 points
- Blue Gem scores 80 points
- Golden Keys scores 200 points
- Heart increases player life by one

The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. Once a the player collides with an enemy, the player loses one life, and it moves back to the start square. Once the player reaches 1000 Score points in less than 2 minutes, the game is won. If the player loses all its lives, or the game counter reaches 2 minutes, the game is over.

# License
This project is licensed under the MIT License - see the LICENSE file for details.
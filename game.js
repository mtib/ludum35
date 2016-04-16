/*
This is a game by:
Markus "TiByte" Becker   - Lead Developer
Lucas "LFalch"           - Programmer
Aileen                   - Graphic Designer
Kilian "Malloth Rha"     - Musician
Micha                    - Junior Programmer
Using Libraries: Pixi.js and Howler.js
date: 16.04.2016 for LD35
theme: Shapeshift
*/

/*

STRING OF EVENTS:
1. Intro Comic (3 Pictures)
    - socks come to life when unattended
2. Under the bed
    2.1. game
        - avoid hands
    2.2. more story
        - grey sock tells hero to fight sewer monster
3. Sewerfall
    3.1. game
        - falling in the sewer
        - avoid dirt
    3.2. reward (grow arms)
        - if not too dirty
4. Snake game
    4.1. game
        - eat fluff
    4.2. reward (grow bigger)
        - if player ate more than 20 fluff in 30 sec.
5. Plumbing game
    5.1. game
        - turn tiles to connect pipes
    5.2. reward (grow hair)
        - did it in 15 seconds
### Optional ###
0. Platforming game
    0.1. game
    0.2. reward (grow wings)
################
6. Doodle Jump
    6.1. game
        - collect something to gain height
    6.2. more story
        - if won grabbed by sock-hand
        - else falling = losing health
7. Boss fight
    - attack in turns
*/

// Cheat Sheet: https://github.com/mtib/ludum34/blob/master/game.js

// Canvas Size
const WIDTH = 1280;
const HEIGHT = 720;

// Current version
const version = "0.01d"

// Initialize Renderer
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: false, transparent: false, resolution: 1});
renderer.backgroundColor = 0x6ec2cb;
document.getElementById("gamediv").appendChild(renderer.view);

// Master Containter
var stage = new PIXI.Container();

// Layers
var cBack = new PIXI.Container();
var cMiddle = new PIXI.Container();
var cFront = new PIXI.Container();
var cGui = new PIXI.Container();


// Config goes here:
const fontConfig = {font: "30px 'Arial'", fill: "#000000", align: "left"};
const debugConfig = {font: "20px 'Fira Code',monospace,sans-serif", fill: "#FF0000", align: "left"};
const relcenter = (0.5,0.5);
const nKey = keyboard(78);
const enterKey = keyboard(13);

const s001bg = "./scenes/001/background.jpg"; // background for game #1
const ssock = "./scenes/001/sock.png"; // normal sock, for use in all? scenes
const s001armo = "./scenes/001/arm.open.png"; // o = open
const s001armg = "./scenes/001/arm.sock.png"; // g = grabbed

function State() {
    self = this;
    this.debugText = new PIXI.Text("Version: "+version+"\n<Debug Information>",debugConfig);
    this.debugText.position = {x:5,y:5};
    this.debugStateText = new PIXI.Text("State: 0", debugConfig);
    this.debugStateText.position = {x:5,y:45};

    this.doc = {}; // DestroyOnChange

    cGui.addChild(this.debugText);
    cGui.addChild(this.debugStateText);
    this.number = 0;
    this.sock = PIXI.Sprite.fromImage(ssock);
    this.run = function(){
        console.log("default state");
    }

    this.nextState = function(){
        for (var sprite in this.doc) {
            if (this.doc.hasOwnProperty(sprite)) {
                cBack.removeChild(this.doc[sprite]);
            }
        }
        this.number += 1;
        this.switched = true;
        this.debugStateText.text = "State: " + this.number;
        this.run = this.funcarray[this.number];
    }
    this.introfunc = function(){
        console.log("intro func");
        if (nKey.isDown){
            this.nextState();
        }
    }
    this.switched = true;
    this.underTheBed = function(){
        if (this.switched) {
            this.doc["s001bg"] = PIXI.Sprite.fromImage(s001bg);
            this.doc["s001armo"] = PIXI.Sprite.fromImage(s001armo);
            this.doc["s001armg"] = PIXI.Sprite.fromImage(s001armg);

            this.doc["s001bg"].width = WIDTH;
            this.doc["s001bg"].height = HEIGHT;
            cBack.addChild(this.doc["s001bg"]);
            console.log("Dafuq")
            this.switched = false;
        }
    }
    this.funcarray = [this.introfunc, this.underTheBed];

    this.run = this.funcarray[this.number];
}

var gamestate = new State();

/*
    stage
      |
      +-- cBack
      +-- cMiddle
      +-- cFront
      +-- cGui
Drawn from top to bottom
*/
stage.addChild(cBack);
stage.addChild(cMiddle);
stage.addChild(cFront);
stage.addChild(cGui);

PIXI.loader
    .add(s001bg)
    .add(s001armg)
    .add(s001armo)
    .add(ssock)
    .load(setup);

function setup(){
    // Do setup here
    renderStage();
}

// Request Animation Frame
function renderStage(){
    requestAnimationFrame(renderStage);
    gameLoop();
    renderer.render(stage);
}

// Called before rendering
function gameLoop(){
    // after doing logic:
    gamestate.run()
}

// start game
setup();

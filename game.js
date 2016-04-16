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
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {antialiasing: true, transparent: false, resolution: 1});
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
const pointsConfig = {font: "20px monospace", fill: "#FF00FF", align: "right"};

const relcenter = {x:0.5,y:0.5};
const enterKey = keyboard(13);

const leftArrow = keyboard(37);
const upArrow = keyboard(38);
const rightArrow = keyboard(39);
const downArrow = keyboard(40);

const aKey = keyboard(65);
const wKey = keyboard(87);
const dKey = keyboard(68);
const sKey = keyboard(83);

const s000bed1 = "./scenes/000/bed.pic1.jpg";
const s000bed2 = "./scenes/000/bed.pic2.jpg";
const s000bed3 = "./scenes/000/bed.pic3.jpg";
const s001bg = "./scenes/001/background.jpg"; // background for game #1
const ssock = "./scenes/001/sock.png"; // normal sock, for use in all? scenes
const s001armo = "./scenes/001/arm.open.png"; // o = open
const s001armg = "./scenes/001/arm.sock.png"; // g = grabbed

const sceneMusic = [
    new Howl({
        src: ['scenes/000/SockventureIntro.ogg'],
        loop: true,
        volume: 0.4,
    }),
    new Howl({
        src: ['scenes/001/SockventureHand.ogg'],
        loop: true,
        volume: 0.4,
    })
];

function Game1Sock() {
    self = this;
    size = 128 // Pixel
    speed = 3 // Pixel / Frame
    this.sprite = new PIXI.Sprite.fromImage(ssock);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.position = {x: WIDTH*0.5, y: HEIGHT*0.5};
    this.die = function() {
        cMiddle.removeChild(this.sprite);
    }
    this.move = function() {
        delta = {x:0, y:0};
        did = false;
        if ((rightArrow.isDown || dKey.isDown) && this.sprite.position.x < WIDTH - 70) {
            delta.x += speed;
        }
        if ((leftArrow.isDown || aKey.isDown) && this.sprite.position.x > 70) {
            delta.x -= speed;
        }
        if ((upArrow.isDown || wKey.isDown) && this.sprite.position.y > 230) {
            delta.y -= speed;
        }
        if ((downArrow.isDown || sKey.isDown) && this.sprite.position.y < HEIGHT - 100) {
            delta.y += speed;
        }
        magsqr = Math.sqrt(Math.abs(delta.x) + Math.abs(delta.y))
        if (magsqr == 0) {
            return;
        }
        if (delta.x > 0 && this.sprite.scale.x > 0) {
            this.sprite.scale.x *= -1;
        } else if (delta.x < 0 && this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1;
        }
        delta.x /= magsqr;
        delta.y /= magsqr;
        this.sprite.position.x += delta.x;
        this.sprite.position.y += delta.y;
    }
    cMiddle.addChild(this.sprite);
}

function State() {
    self = this;
    this.debugText = new PIXI.Text("Version: "+version+"\n<Debug Information>\nState: ",debugConfig);
    this.debugText.position = {x:5,y:5};
    this.score = new PIXI.Text("0", pointsConfig);
    this.score.position = {x: WIDTH - 5, y: 5};
    this.score.anchor = {x: 1, y:0};
    this.debugStateText = new PIXI.Text("0", debugConfig);
    this.debugStateText.position = {x:89,y:45};

    this.doc = {}; // DestroyOnChange

    cGui.addChild(this.debugText);
    cGui.addChild(this.debugStateText);
    this.number = 0;
    sceneMusic[0].play();
    this.run = function(){
        console.log("default state");
    }

    this.nextState = function(){
        for (var sprite in this.doc) {
            if (this.doc.hasOwnProperty(sprite)) {
                if (this.doc[sprite].die) {
                    this.doc[sprite].die();
                } else {
                    cGui.removeChild(this.doc[sprite])
                    cMiddle.removeChild(this.doc[sprite])
                    cFront.removeChild(this.doc[sprite])
                    cBack.removeChild(this.doc[sprite]);
                }
            }
            delete this.doc[sprite];
        }
        enterKey.press = undefined;

        sceneMusic[this.number++].stop();
        sceneMusic[this.number].play();

        this.switched = true;
        this.debugStateText.text = this.number;
        this.run = this.funcarray[this.number];
    }
    this.introfunc = function(){
        if (this.switched){
            this.doc["pic"] = 1;
            this.doc["s000bed1"] = PIXI.Sprite.fromImage(s000bed1);
            this.doc["s000bed2"] = PIXI.Sprite.fromImage(s000bed2);
            this.doc["s000bed3"] = PIXI.Sprite.fromImage(s000bed3);

            this.doc["s000bed1"].width = WIDTH;
            this.doc["s000bed1"].height = HEIGHT;
            this.doc["s000bed2"].width = WIDTH;
            this.doc["s000bed2"].height = HEIGHT;
            this.doc["s000bed3"].width = WIDTH;
            this.doc["s000bed3"].height = HEIGHT;

            cBack.addChild(this.doc["s000bed1"]);

            enterKey.press = function(){
                if (self.number === 0){
                    if (self.doc["pic"] == 3){
                        self.nextState();
                    }else{
                        cBack.removeChild(self.doc["s000bed"+self.doc["pic"]++]);
                        cBack.addChild(self.doc["s000bed"+self.doc["pic"]]);
                    }
                }
            }

            this.switched = false;
        }
    }
    this.switched = true;
    this.underTheBed = function(){
        if (this.switched) {
            this.starttime = Date.now()
            this.doc["points"] = this.score;
            this.doc["s001bg"] = PIXI.Sprite.fromImage(s001bg);
            this.doc["s001armo"] = PIXI.Sprite.fromImage(s001armo);
            this.doc["s001armg"] = PIXI.Sprite.fromImage(s001armg);

            this.doc["s001bg"].width = WIDTH;
            this.doc["s001bg"].height = HEIGHT;
            cBack.addChild(this.doc["s001bg"]);
            cGui.addChild(this.doc["points"]);
            this.doc["gamesock"] = new Game1Sock();

            this.switched = false;
        }
        this.doc["gamesock"].move();
        this.doc["points"].text = Math.floor((Date.now() - this.starttime) / 1000.0);
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
    // Easteregg: eyes!¬
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

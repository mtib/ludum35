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

/*
000 - Intro
001 - Under the bed game
002 - Story (washing machine)
003 - Sewerfall game
004 - Story (Sockbert)
005 - Snake game
006 - Story (Explanation)
007 - Plumbing game
008 - Story (Break out)
009 - Sewer Jump
010 - Story (Getting grabbed)
011 - Boss fight
012 - Thanks for playing
*/

// Cheat Sheet: https://github.com/mtib/ludum34/blob/master/game.js

// Canvas Size
const WIDTH = 1280;
const HEIGHT = 720;

// Current version
const version = "0.04d"

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
const infoConfig = {font: "60px Arial", fill: "#FFFFFF", align: "center", dropShadow: true, dropShadowColor: "#000000"};

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

const sceneMusic = [ // for the cool kids!
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
        if ((rightArrow.isDown || dKey.isDown) && this.sprite.position.x < WIDTH - 100) {
            delta.x += speed;
        }
        if ((leftArrow.isDown || aKey.isDown) && this.sprite.position.x > 100) {
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

function Game1Hand(position) {
    this.sopen = new PIXI.Sprite.fromImage(s001armo);
    this.sgrab = new PIXI.Sprite.fromImage(s001armg);

    this.sopen.position = position;
    this.sopen.anchor = {x: 0.5, y: 1};
    this.sopen.rotation = Math.atan((this.sopen.position.y - gamestate.playerpos().y)/(this.sopen.position.x -
    gamestate.playerpos().x))+ 90;
    this.sopen.scale = {x: .2, y: .2};

    this.grab = function() {
        this.sgrab.position = this.sopen.position;
        this.sgrab.anchor = this.sopen.anchor;
        this.sgrab.scale = this.sopen.scale;
        this.sgrab.rotation = this.sopen.rotation;
        cFront.removeChild(this.sopen);
        cFront.addChild(this.sgrab);
    }
    this.release = function() {
        // shouldnt be needed...
    }
    this.delta = function() {
        ppos = gamestate.playerpos();
        return {x: this.sopen.position.x - ppos.x, y: this.sopen.position.y - ppos.y};
    }
    this.logic = function() {
        d = this.delta();
        this.sopen.position.x += d.x/100.0;
        this.sopen.position.y += d.y/100.0;
    }
    this.die = function() {
        cFront.removeChild(this.sopen);
        cFront.removeChild(this.sgrab);
        window.clearInterval(this.move);
        delete this;
    }
    this.move = window.setInterval(this.logic, 20);
    cFront.addChild(this.sopen);
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

    this.infotext = new PIXI.Text("", infoConfig); // eg. "press xxx to skip"
    this.infotext.position = {x: WIDTH/2, y: HEIGHT/2};
    this.infotext.anchor = relcenter;

    this.doc = {}; // DestroyOnChange
    this.number = 0;

    this.playerpos = function() {
        switch (this.number) {
            case 1:
                return this.doc["gamesock"].sprite.position;
        }
        return {x: -31415, y:-1337};
    }

    cGui.addChild(this.infotext);
    cGui.addChild(this.debugText);
    cGui.addChild(this.debugStateText);

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
    diasStateGenerator = function(backgrounds) {
        return function(){
            if (this.switched){
                this.infotext.text = "Press <Enter> to proceed"
                this.doc["dias"] = 0;
                for (var bg in backgrounds){
                    this.doc[bg] = PIXI.Sprite.fromImage(backgrounds[bg]);
                    this.doc[bg].width  = WIDTH;
                    this.doc[bg].height = HEIGHT;
                }

                cBack.addChild(this.doc[0]);

                enterKey.press = function(){
                    if (self.doc["dias"] == backgrounds.length - 1){
                        self.nextState();
                        enterKey.press = undefined;
                    }else{
                        cBack.removeChild(self.doc[self.doc["dias"]++]);
                        cBack.addChild(self.doc[self.doc["dias"]]);
                    }
                }

                this.switched = false;
            }
        }
    }
    this.introfunc = diasStateGenerator([s000bed1, s000bed2, s000bed3]);
    this.switched = true;
    this.underTheBed = function(){
        if (this.switched) {
            this.infotext.text = "[WASD] to move";
            this.starttime = Date.now();
            this.doc["points"] = this.score;
            this.doc["s001bg"] = PIXI.Sprite.fromImage(s001bg);
            this.doc["s001armo"] = PIXI.Sprite.fromImage(s001armo);
            this.doc["s001armg"] = PIXI.Sprite.fromImage(s001armg);

            this.doc["s001bg"].width = WIDTH;
            this.doc["s001bg"].height = HEIGHT;
            cBack.addChild(this.doc["s001bg"]);
            cGui.addChild(this.doc["points"]);
            this.doc["gamesock"] = new Game1Sock();

            hidetext = function(that){
                window.setTimeout(function(){that.infotext.text = ""}, 4000);
            }(this);

            this.spawnHands = function(self) {
                window.setTimeout(function () {
                    orientation = Math.floor(Math.random() * 4.0);
                    rx = WIDTH * Math.random();
                    ry = HEIGHT * Math.random();
                    pos = {};
                    switch (orientation) {
                        case 0: // top
                            pos = {x: rx, y: 0};
                            break;
                        case 1: // right
                            pos = {x: 0, y: ry};
                            break;
                        case 2: // bottom
                            pos = {x: rx, y: HEIGHT};
                            break;
                        case 3: // left
                            pos = {x: 0, y: ry};
                            break;
                    }
                    self.doc[Date.now()] = new Game1Hand(pos);
                }, 1200);
            }(this);

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
    .add(s000bed1)
    .add(s000bed2)
    .add(s000bed3)
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

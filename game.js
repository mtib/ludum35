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
000 - Intro                         X
001 - Under the bed game            X
002 - Story (washing machine)       X
003 - Sewerfall game                X
004 - Story (Sockbert)              X
005 - Pacman game                   X
006 - Story (Explanation)
007 - Plumbing game
008 - Story (Break out)
009 - Sewer Jump                    X
010 - Story (Getting grabbed)       X
011 - Boss fight                    X
012 - Thanks for playing            X
*/

// Cheat Sheet: https://github.com/mtib/ludum34/blob/master/game.js

// Canvas Size
const WIDTH = 1280;
const HEIGHT = 720;

// Current version
const version = "0.05d"

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

// Images for Intro Diashow
const s000bed1 = "./scenes/000/bed.pic1.jpg";
const s000bed2 = "./scenes/000/bed.pic2.jpg";
const s000bed3 = "./scenes/000/bed.pic3.jpg";

// First Game
const s001bg = "./scenes/001/background.jpg"; // background for game #1
const ssock = "./scenes/001/sock.png"; // normal sock, for use in all? scenes
const s001armo = "./scenes/001/arm.open.png"; // o = open
const s001armg = "./scenes/001/arm.sock.png"; // g = grabbed

// Second Story Line Diashow
const s002wm1 = "./scenes/002/waschmaschine1.jpg";
const s002wm2 = "./scenes/002/waschmaschine2.jpg";
const s002wm3 = "./scenes/002/waschmaschine3.jpg";
const s002wm4 = "./scenes/002/waschmaschine4.jpg";

// BLOBS for Falling Game
const s003ek1 = "./scenes/003/eklig1.png";
const s003ek2 = "./scenes/003/eklig2.png";
const s003ek3 = "./scenes/003/eklig3.png";
const s003bg = "./scenes/003/falling.bg.jpg";

// Third Story Slideshow
const s004s1 = "./scenes/004/sewer1.jpg";
const s004s2 = "./scenes/004/sewer2.jpg";
const s004s3 = "./scenes/004/sewer3.jpg";
const s004s4 = "./scenes/004/sewer4.jpg";
const s004s5 = "./scenes/004/sewer5.jpg";
const s004s6 = "./scenes/004/sewer6.jpg";
const s004s7 = "./scenes/004/sewer7.jpg";
const s004s8 = "./scenes/004/sewer8.jpg";
const s004s9 = "./scenes/004/sewer9.jpg";
const s004s10 = "./scenes/004/sewer10.jpg";

function newHowl(name) {
    return new Howl({
        src: ['scenes/'+name+'.ogg','scenes/'+name+'.mp3'],
        loop: true,
        volume: 0.4,
    })
}

const introMusic = newHowl("000/SockventureIntro");

const sceneMusic = [ // for the cool kids!
    introMusic,
    newHowl("001/SockventureHand"),
    introMusic,
    newHowl("003/SockventureSewerFall")
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

function vectorDist(d1, d2) {
    return Math.hypot(d1.x - d2.x, d1.y -d2.y);
}

function Game1Hand(startpos, follow) {
    this.sopen = new PIXI.Sprite.fromImage(s001armo);
    this.sgrab = new PIXI.Sprite.fromImage(s001armg);

    this.sopen.position = startpos;
    this.sopen.anchor = {x: 0.5, y: .2};
    this.sopen.pivot = this.sopen.anchor;
    this.sopen.scale = {x: .45, y: .45};

    this.follow = follow;

    this.aim = gamestate.playerpos();
    this.aim = {x: this.aim.x, y: this.aim.y}; // FIXME
    this.return = false;

    this.friction = 50.0;

    if (this.follow) {
        this.friction = 20.0;
    }

    this.correction = -20;

    this.lookatsock = function() {
        this.sopen.rotation = Math.atan((this.sopen.position.y - this.aim.y)/(this.sopen.position.x - this.aim.x));
        if (this.sopen.position.x > this.aim.x) {
            this.sopen.rotation += Math.PI;
        }
        this.sopen.rotation += 90 + this.correction / 180 * Math.PI;
    }

    this.lookatsock();

    this.grabbed = false;

    this.grab = function() {
        this.sgrab.position = this.sopen.position;
        this.sgrab.anchor = this.sopen.anchor;
        this.sgrab.scale = this.sopen.scale;
        this.sgrab.rotation = this.sopen.rotation;
        this.grabbed = true;
        console.log("grabbed...");
        cFront.removeChild(this.sopen);
        cFront.addChild(this.sgrab);
    }
    this.release = function() {
        // shouldnt be needed...
        this.die();
    }
    this.delta = function() {
        return {x: this.sopen.position.x - this.aim.x, y: this.sopen.position.y - this.aim.y};
    }
    this.decideReturn = function(disttoaim) {
        if ( disttoaim < 20  && !this.return) {
            this.return = true;
            this.friction = -40;
        }

        var dist = vectorDist(gamestate.playerpos(), this.sopen.position);
        if (dist < 50) {
            this.grab();
            cMiddle.removeChild(gamestate.doc["gamesock"].sprite);
            this.return = true;
            this.friction = -10;
            window.clearInterval(gamestate.handSpawner);
            gamestate.doc["gamesock"].die();
            delete gamestate.doc["gamesock"];
            window.setTimeout(function(){gamestate.nextState()}, 1000);
        }
    }
    this.logic = function() {
        const d = this.delta();
        const di = vectorDist(d, {x:0,y:0});
        this.sopen.position.x -= (d.x/di * 600) / this.friction;
        this.sopen.position.y -= (d.y/di * 600) / this.friction;
        if (!this.grabbed) {
            this.decideReturn(di);
            if (this.follow) {
                this.aim = gamestate.playerpos();
                this.lookatsock();
            }
        }
        //this.lookatsock();
    }
    this.die = function() {
        cFront.removeChild(this.sopen);
        cFront.removeChild(this.sgrab);
        window.clearInterval(this.move);
    }
    var self = this;
    this.move = window.setInterval(function(){self.logic()}, 20);
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
                if (this.doc["gamesock"]){
                    return this.doc["gamesock"].sprite.position;
                }
                break;
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

        if (sceneMusic[this.number+1]){
            sceneMusic[this.number++].stop();
            sceneMusic[this.number].play();
        } else {
            this.number+=1;
        }

        this.switched = true;
        this.debugStateText.text = this.number;
        this.run = this.funcarray[this.number];
    }
    diasStateGenerator = (backgrounds) => () => {
        if (this.switched){
            this.infotext.text = "Press <Enter> to proceed"
            this.doc["dias"] = 0;
            for (var bg in backgrounds){
                this.doc[bg] = PIXI.Sprite.fromImage(backgrounds[bg]);
                this.doc[bg].width  = WIDTH;
                this.doc[bg].height = HEIGHT;
            }

            cBack.addChild(this.doc[0]);
            self = this
            enterKey.press = () => {
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

    this.introfunc = diasStateGenerator([s000bed1, s000bed2, s000bed3]);
    this.preFallfunc = diasStateGenerator([s002wm1, s002wm2, s002wm3, s002wm4]);
    this.postFallfunc = diasStateGenerator([s004s1, s004s2, s004s3, s004s4, s004s5, s004s6, s004s7, s004s8, s004s9, s004s10]);
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
                return window.setInterval(function () {
                    orientation = Math.floor(Math.random() * 4.0);
                    rx = WIDTH * Math.random();
                    ry = HEIGHT * Math.random();
                    pos = {};
                    margin = 100;
                    switch (orientation) {
                        case 0: // top
                            pos = {x: rx, y: -margin};
                            break;
                        case 1: // right
                            pos = {x: WIDTH+margin, y: ry};
                            break;
                        case 2: // bottom
                            pos = {x: rx, y: HEIGHT+margin};
                            break;
                        case 3: // left
                            pos = {x: -margin, y: ry};
                            break;
                    }
                    self.doc[Date.now()] = new Game1Hand(pos);
                }, 2300);
            };
            this.handSpawner = this.spawnHands(this);

            this.switched = false;
            this.endgame1 = false;
        }
        dt = (Date.now() - this.starttime) / 1000.0;
        if (this.doc["gamesock"]){
            this.doc["gamesock"].move();
        }
        if (this.doc["points"] && dt <= 15){
            this.doc["points"].text = Math.floor(dt);
        } else if (!this.endgame1) {
            window.clearInterval(this.handSpawner)
            this.doc["finalhand"]=new Game1Hand({x:.5*WIDTH,y: -50}, true);
            this.endgame1 = true;
        }
    };

    this.fallgame = () => {
        console.log("Hello World")
    };

    this.funcarray = [this.introfunc, this.underTheBed, this.preFallfunc, this.fallgame, this.postFallfunc];

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
    .add(s002wm1)
    .add(s002wm2)
    .add(s002wm3)
    .add(s002wm4)
    .add(s003ek1)
    .add(s003ek2)
    .add(s003ek3)
    .add(s004s1)
    .add(s004s2)
    .add(s004s3)
    .add(s004s4)
    .add(s004s5)
    .add(s004s6)
    .add(s004s7)
    .add(s004s8)
    .add(s004s9)
    .add(s004s10)
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

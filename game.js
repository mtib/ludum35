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
006 - Skip
007 - Skip
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
const pointsConfig = {font: "50px monospace", fill: "#000000", align: "right", dropShadow: true, dropShadowColor: "#FF0000"};
const infoConfig = {font: "60px Arial", fill: "#FFFFFF", align: "center", dropShadow: true, dropShadowColor: "#000000", dropShadowDistance: 2};

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

resourc = (name) => "./scenes/"+name;

// Images for Intro Diashow
const s000bed1 = resourc("000/bed.pic1.jpg");
const s000bed2 = resourc("000/bed.pic2.jpg");
const s000bed3 = resourc("000/bed.pic3.jpg");

// First Game
const s001bg = resourc("001/background.jpg"); // background for game #1
const ssock = resourc("001/sock.png"); // normal sock, for use in all? scenes
const s001armo = resourc("001/arm.open.png"); // o = open
const s001armg = resourc("001/arm.sock.png"); // g = grabbed

// Second Story Line Diashow
const s002wm1 = resourc("002/waschmaschine1.jpg");
const s002wm2 = resourc("002/waschmaschine2.jpg");
const s002wm3 = resourc("002/waschmaschine3.jpg");
const s002wm4 = resourc("002/waschmaschine4.jpg");

// BLOBS for Falling Game
const s003ek1 = resourc("003/eklig1.png");
const s003ek2 = resourc("003/eklig2.png");
const s003ek3 = resourc("003/eklig3.png");
const s003bg = resourc("003/falling.bg.jpg");

// Third Story Slideshow
const s004s1 = resourc("004/sewer1.jpg");
const s004s2 = resourc("004/sewer2.jpg");
const s004s3 = resourc("004/sewer3.jpg");
const s004s4 = resourc("004/sewer4.jpg");
const s004s5 = resourc("004/sewer5.jpg");
const s004s6 = resourc("004/sewer6.jpg");
const s004s7 = resourc("004/sewer7.jpg");
const s004s8 = resourc("004/sewer8.jpg");
const s004s9 = resourc("004/sewer9.jpg");
const s004s10 = resourc("004/sewer10.jpg");

const s005fl = resourc("005/fluse.png");
const s005bg = resourc("005/snake.bg.jpg");
const s005pac1 = resourc("005/sock.pacman1.png");
const s005pac2 = resourc("005/sock.pacman2.png");

const s008s = resourc("008/pipehome.jpg");

const s009so = resourc("009/soap.png");

const s010s1 = resourc("010/winjump1.jpg");
const s010s2 = resourc("010/winjump2.jpg");

const s011boss = resourc("011/boss.png");

const s009 =

newHowl = (name) => new Howl({
    src: ['scenes/'+name+'.ogg','scenes/'+name+'.mp3'],
    loop: true,
    volume: 0.4,
});

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
    this.die = () => cMiddle.removeChild(this.sprite);
    this.move = () => {
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

function Game3Sock() {
    self = this;
    const size = 128;
    const speed = 3;
    this.sprite = new PIXI.Sprite.fromImage(ssock);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.position = {x: WIDTH*0.5, y: HEIGHT*0.5-150};

    this.update = () => {
        xVel = 0;
        if ((rightArrow.isDown || dKey.isDown) && this.sprite.position.x < WIDTH - 320) {
            xVel += speed;
        }
        if ((leftArrow.isDown || aKey.isDown) && this.sprite.position.x > 320) {
            xVel -= speed;
        }
        this.sprite.x += xVel;
    };

    this.die = () => cMiddle.removeChild(this.sprite);
    cMiddle.addChild(this.sprite);
}

function FallingBackground() {
    this.bgs = [PIXI.Sprite.fromImage(s003bg), PIXI.Sprite.fromImage(s003bg)];
    const H = this.bgs[0].height;

    this.bgs[1].y = H;

    for (var bg in this.bgs){
        this.bgs[bg].width = WIDTH;
        cBack.addChild(this.bgs[bg]);
    }
    this.die = () => {
        for (var bg in this.bgs){
            cBack.removeChild(this.bgs[bg]);
        }
    }
    this.update = () => {
        for (var i in this.bgs){
            bg = this.bgs[i];
            bg.y -= 3;
            if (bg.y < -H){
                bg.y += 2*H;
            }
        }
    }
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

    this.lookatsock = () => {
        this.sopen.rotation = Math.atan((this.sopen.position.y - this.aim.y)/(this.sopen.position.x - this.aim.x));
        if (this.sopen.position.x > this.aim.x) {
            this.sopen.rotation += Math.PI;
        }
        this.sopen.rotation += 90 + this.correction / 180 * Math.PI;
    }

    this.lookatsock();

    this.grabbed = false;

    this.grab = () => {
        this.sgrab.position = this.sopen.position;
        this.sgrab.anchor = this.sopen.anchor;
        this.sgrab.scale = this.sopen.scale;
        this.sgrab.rotation = this.sopen.rotation;
        this.grabbed = true;
        console.log("grabbed...");
        cFront.removeChild(this.sopen);
        cFront.addChild(this.sgrab);
    }
    // shouldnt be needed...
    this.release = () => this.die();
    this.delta = () => {return {x: this.sopen.position.x - this.aim.x, y: this.sopen.position.y - this.aim.y}};
    this.decideReturn = (disttoaim) => {
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
    this.logic = () => {
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
    this.die = () => {
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
    const dbgTxt = "Version: "+version+"\n<Debug Information>\nState: ";
    this.debugText = new PIXI.Text(dbgTxt + 0, debugConfig);
    this.debugText.position = {x:5,y:5};
    this.score = new PIXI.Text("0", pointsConfig);
    this.score.position = {x: WIDTH - 5, y: 5};
    this.score.anchor = {x: 1, y:0};

    this.infotext = new PIXI.Text("", infoConfig); // eg. "press xxx to skip"
    this.infotext.position = {x: WIDTH/2, y: HEIGHT/2};
    this.infotext.anchor = relcenter;

    this.doc = {}; // DestroyOnChange
    this.number = 0;

    this.playerpos = () => {
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

    sceneMusic[0].play();
    this.run = () => console.log("default state");

    this.nextState = () => {
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
        this.debugText.text = dbgTxt + this.number;
        this.run = this.funcarray[this.number];
    }
    diasStateGenerator = (backgrounds) => () => {
        if (this.switched){
            this.infotext.text = "Press <Enter> to proceed";
            hide = (self) => { window.setTimeout(() => {self.infotext.text = 0}, 3000)};
            hide(this);
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
    this.preJump = diasStateGenerator([s008s])
    this.jumpgame = () => {
        this.nextState() // TODO impl game
    }
    this.pacmanGamefunc = () => {
        this.nextState() // TODO impl game
    }
    this.winjump = diasStateGenerator([s010s1, s010s2]);
    this.bossscene = () => {
        // TODO impl ENDING
    }
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

            this.spawnHands = (self) => window.setInterval(
                () => {
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
                },
            2300);
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
        if (this.switched) {
            this.starttime = Date.now();
            this.distanceFallen = 0;
            this.doc.bgs = new FallingBackground();
            this.doc.ek1 = PIXI.Sprite.fromImage(s003ek1);
            this.doc.ek2 = PIXI.Sprite.fromImage(s003ek2);
            this.doc.ek3 = PIXI.Sprite.fromImage(s003ek3);

            this.doc.gamesock = new Game3Sock();

            this.switched = false;
        }
        this.doc.bgs.update()
        this.doc.gamesock.update()

        this.distanceFallen += 3;
    };

    this.funcarray = [
        this.introfunc,         // 000
        this.underTheBed,       // 001
        this.preFallfunc,       // 002
        this.fallgame,          // 003
        this.postFallfunc,      // 004
        this.pacmanGamefunc,    // 005
        this.nextState, // skip    006
        this.nextState, // skip    007
        this.preJump,           // 008
        this.jumpgame,          // 009
        this.winjump,           // 010
        this.bossscene,         // 011
    ];

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
    .add(s003bg)
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
    .add(s005fl)
    .add(s005bg)
    .add(s005pac1)
    .add(s005pac2)
    .add(s008s)
    .add(s009so)
    .add(s010s1)
    .add(s010s2)
    .add(s011boss)
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

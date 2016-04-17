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
const version = "0.08d"

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
const fontConfig = {font: "30px 'Arvo'", fill: "#000000", align: "left", dropShadow: true, dropShadowColor: "#FFFFFF"};
const debugConfig = {font: "20px 'Arvo'", fill: "#FFF", align: "left"};
const pointsConfig = {font: "50px 'Arvo'", fill: "#000000", align: "right", dropShadow: true, dropShadowColor: "#FF0000"};
const infoConfig = {font: "60px 'Arvo'", fill: "#FFFFFF", align: "center", dropShadow: true, dropShadowColor: "#000000", dropShadowDistance: 10};

const relcenter = {x:0.5,y:0.5};
const abscenter = {x:WIDTH/2,y:HEIGHT/2};
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

const s012s1 = resourc("012/boss.bg1.jpg");
const s012s2 = resourc("012/boss.bg2.jpg");
const s012s3 = resourc("012/boss.bg3.jpg");
const s012s4 = resourc("012/boss.bg4.jpg");

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
    newHowl("003/SockventureSewerFall"),
    false,
    newHowl("005/SockventureSnake"),
    introMusic,
    false,
    false,
    newHowl("009/SockventureSewerJump"),
    introMusic,
    newHowl("011/SockventureBoss"),
    false,
    newHowl("009/SockventureSewerJump"),
];

function Game1Sock() {
    self = this;
    size = 128 // Pixel
    speed = 15 // Pixel / Frame
    this.sprite = new PIXI.Sprite.fromImage(ssock);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.position = {x: WIDTH/2,y: HEIGHT/2};
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

function Game3Sock(blobTexes) {
    self = this;
    const size = 96;
    const speed = 4;
    this.sprite = new PIXI.Sprite.fromImage(ssock);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    const scale = this.sprite.scale.x;
    this.sprite.position = {x: WIDTH*0.5, y: HEIGHT*0.5-150};
    this.blobsHit = 0;

    this.blobs = [];

    this.blobSpawner = window.setInterval(() => {
        self.blobs.push(new Blob(blobTexes));
    }, 600);

    this.update = () => {
        xVel = 0;
        if ((rightArrow.isDown || dKey.isDown) && this.sprite.position.x < WIDTH - 320) {
            this.sprite.scale.x = -scale;
            xVel += speed;
        }
        if ((leftArrow.isDown || aKey.isDown) && this.sprite.position.x > 320) {
            this.sprite.scale.x = scale;
            xVel -= speed;
        }
        this.sprite.x += xVel;
        for (var b in this.blobs){
            blob = this.blobs[b];
            blob.update();
            if(blob.sprite.y < -28) {
                blob.die()
                delete this.blobs[b];
            }else if(vectorDist(blob.sprite.position, this.sprite.position) < 76) {
                this.blobsHit++;
                blob.die()
                delete this.blobs[b];
            }
        }
    };

    this.die = () => {
        cMiddle.removeChild(this.sprite)
        window.clearInterval(this.blobSpawner);
        for (var b in this.blobs){
            this.blobs[b].die();
            delete this.blobs[b];
        }
    };
    cMiddle.addChild(this.sprite);
}

function Game9Sock() {
    self = this;
    const size = 96;
    const speed = 7;
    this.sprite = new PIXI.Sprite.fromImage(ssock);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    const scale = this.sprite.scale.x;
    this.sprite.position = {x: WIDTH*0.5, y: HEIGHT*0.5+150};

    this.height = 0;
    this.dltaHt = 0;
    this.yVel = 60;
    this.soaps = [];

    this.soapSpawner = window.setInterval(() => {
        self.soaps.push(new Soap());
    }, 600);

    this.update = () => {
        xVel = 0;
        if ((rightArrow.isDown || dKey.isDown) && this.sprite.position.x < WIDTH - 320) {
            this.sprite.scale.x = -scale;
            xVel += speed;
        }
        if ((leftArrow.isDown || aKey.isDown) && this.sprite.position.x > 320) {
            this.sprite.scale.x = scale;
            xVel -= speed;
        }
        this.yVel -= 0.5;
        this.sprite.x += xVel;
        this.height += this.yVel;
        this.dltaHt = this.yVel;

        for (var sID in this.soaps) {
            soap = this.soaps[sID];
            soap.sprite.y += this.dltaHt;
            soap.update()
            if(vectorDist(soap.sprite.position, this.sprite.position) < 76) {
                this.yVel = Math.max(0, this.yVel);
                this.yVel += 45;
                soap.die()
                delete this.soaps[sID];
            }
        }
    };

    this.die = () => {
        cMiddle.removeChild(this.sprite)
        window.clearInterval(this.soapSpawner);
        for (var s in this.soaps){
            this.soaps[s].die();
            delete this.soaps[s];
        }
    };
    cMiddle.addChild(this.sprite);
}

function Soap(){
    const size = 64;
    this.sprite = PIXI.Sprite.fromImage(s009so);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.y = -32;
    this.sprite.x = Math.random() * (WIDTH - 640) + 320;
    this.rot = (Math.random()-.5)/ 100.0;

    this.die = () => cFront.removeChild(this.sprite);
    this.update = () => this.sprite.rotation += this.rot;
    cFront.addChild(this.sprite);
}

function Blob(blobs) {
    const size = 64;
    this.sprite = PIXI.Sprite.fromImage(blobs[Math.floor(Math.random() * 3)]);
    this.sprite.anchor = relcenter;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.y = HEIGHT+size;
    this.sprite.x = Math.random() * (WIDTH - 640) + 320;
    this.rot = (Math.random()-.5)/ 100.0;

    this.die = () => cFront.removeChild(this.sprite);
    this.update = () => {
        this.sprite.y -= 6;
        this.sprite.rotation += this.rot;
    }
    cFront.addChild(this.sprite);
}

function FallingBackground() {
    this.bgs = [PIXI.Sprite.fromImage(s003bg), PIXI.Sprite.fromImage(s003bg)];
    this.bgs[1].scale.y *= -1;
    this.bgs[1].anchor.y = 1;
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
    this.update = (speed) => {
        for (var i in this.bgs){
            bg = this.bgs[i];
            bg.y += speed;
            if (bg.y < -H){
                bg.y += 2*H;
            }else if(bg.y > H) {
                bg.y -= 2*H;
            }
        }
    }
}

vectorDist = (d1, d2) => Math.hypot(d1.x - d2.x, d1.y -d2.y);

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
        cFront.removeChild(this.sopen);
        cFront.addChild(this.sgrab);
    }
    // shouldnt be needed...
    this.release = () => this.die();
    this.delta = () => {return {x: this.sopen.position.x - this.aim.x, y: this.sopen.position.y - this.aim.y}};
    this.decideReturn = (disttoaim) => {
        if ( disttoaim < 30  && !this.return) {
            this.return = true;
            this.friction = -40;
        }

        var dist = vectorDist(gamestate.playerpos(), this.sopen.position);
        if (dist < 70) {
            this.grab();
            cMiddle.removeChild(gamestate.doc["gamesock"].sprite);
            this.return = true;
            this.friction = -10;
            window.clearInterval(gamestate.handSpawner);
            gamestate.doc["gamesock"].die();
            delete gamestate.doc["gamesock"];
            window.setTimeout(()=>{
                gamestate.health *= gamestate.doc.dt/10;
                gamestate.nextState()
            }, 1000);
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
    this.health = 100; // * x | x>1 if successfull | 0<x<1 if failure
    const dbgTxt = "Version: "+version+" /";
    const hpTxt = " HP";
    this.debugText = new PIXI.Text(dbgTxt+0, debugConfig);
    this.debugText.position = {x:5,y:5};
    this.score = new PIXI.Text("0", pointsConfig);
    this.score.position = {x: WIDTH - 5, y: 5};
    this.score.anchor = {x: 1, y:0};
    this.hpbox = new PIXI.Text("0"+hpTxt, pointsConfig);
    this.hpbox.position = {x: WIDTH - 5, y: HEIGHT - 53};
    this.hpbox.anchor = {x: 1, y:0};

    this.infotext = new PIXI.Text("", infoConfig); // eg. "press xxx to skip"
    this.infotext.position = {x: WIDTH/2, y:HEIGHT/2};
    this.infotext.anchor = relcenter;
    this.infotext.warn = (msg) => {
        this.infotext.text=msg;
        f=(s)=>{window.setTimeout(function(){s.text=""}, 2000)};
        f(this.infotext)
    }

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
    cGui.addChild(this.hpbox);

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

        this.number++;
        if (sceneMusic[this.number]) {
            // Make sure the music is changed
            for (var i = this.number-1; i >= 0; i--)
                if(sceneMusic[i]){
                    sceneMusic[i].stop();
                    break;
                }

            sceneMusic[this.number].play();
        }else
            console.log("Continuing music!")

        this.switched = true;
        this.hpbox.text = Math.round(this.health) + hpTxt;
        this.debugText.text = dbgTxt + this.number;
        this.run = this.funcarray[this.number];
    }
    diasStateGenerator = (backgrounds) => () => {
        if (this.switched){
            this.infotext.warn("Press <Enter> to proceed")
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
    this.switched = true;

    this.funcarray = [
        // STATE 000 //
        diasStateGenerator([
            s000bed1,           // intro sequence
            s000bed2,           // human searching sock
            s000bed3]),
        // STATE 001 //
        () => {
            if (this.switched) {
                this.infotext.warn("Use [WASD] to move");
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
                1500);
                this.handSpawner = this.spawnHands(this);

                this.switched = false;
                this.endgame1 = false;
            }
            this.doc.dt = (Date.now() - this.starttime) / 1000.0;

            if (this.doc["gamesock"]){
                this.doc["gamesock"].move();
            }
            if (this.doc["points"] && this.doc.dt <= 15){
                this.doc["points"].text = Math.floor(this.doc.dt);
            } else if (!this.endgame1) {
                window.clearInterval(this.handSpawner)
                this.doc["finalhand"]=new Game1Hand({x:.5*WIDTH,y: -50}, true);
                this.endgame1 = true;
            }
        },
        // STATE 002 //
        diasStateGenerator([
            s002wm1,            // sock goes down the
            s002wm2,            // drain.
            s002wm3,
            s002wm4]),
        // STATE 003 //
        () => {
            if (this.switched) {
                this.infotext.warn("Avoid the blobs!");
                this.doc.distanceFallen = 0;
                this.doc.bgs = new FallingBackground();
                const blobs = [s003ek1, s003ek2, s003ek3];
                this.doc.points = this.score;
                this.doc.points.text = "0\n0";

                this.doc.gamesock = new Game3Sock(blobs);

                cGui.addChild(this.doc.points);
                this.switched = false;
            }
            this.doc.points.text = Math.floor(this.doc.distanceFallen)+"\n"+this.doc.gamesock.blobsHit;
            this.doc.bgs.update(-6)
            this.doc.gamesock.update()

            this.doc.distanceFallen += 0.01;

            if(this.doc.distanceFallen>30){
                blobsHit = this.doc.gamesock.blobsHit;
                this.health *= this.doc.gamesock.blobsHit == 0 ? 1.5 : Math.pow(0.95, blobsHit);
                this.nextState();
            }
        },
        // STATE 004 //
        diasStateGenerator([
            s004s1,             // sock meets sockbert
            s004s2,             // get's told how to escape
            s004s3,             // goes on adventure
            s004s4,             // character developement
            s004s5,
            s004s6,
            s004s7,
            s004s8,
            s004s9,
            s004s10]),
        // STATE 005 //
        () => {
            if (this.switched) {
                this.pacmandata = {};
                this.pacmandata.down = () => sKey.isDown || downArrow.isDown;
                this.pacmandata.up = () => wKey.isDown || upArrow.isDown;
                this.pacmandata.left = () => aKey.isDown || leftArrow.isDown;
                this.pacmandata.right = () => dKey.isDown || rightArrow.isDown;
                this.pacmandata.warn = "Use [WASD] to collect fluff";
                this.infotext.warn(this.pacmandata.warn);
                this.doc["background"] = PIXI.Sprite.fromImage(s005bg);
                cBack.addChild(this.doc["background"]);
                this.switched = false;
                this.pacmandata.pos = {x: WIDTH/2, y: HEIGHT/2};
                this.pacmandata.sprite = PIXI.Sprite.fromImage(ssock);
                this.doc["pacmansock"] = this.pacmandata.sprite;
                cFront.addChild(this.doc["pacmansock"]);
                this.pacmandata.defscale = {x:0.1, y:0.1};
                this.pacmandata.sprite.scale = {x:this.pacmandata.defscale.x, y:this.pacmandata.defscale.y};
                this.pacmandata.sprite.anchor = relcenter;
                this.pacmandata.sprite.pivot = relcenter;
                this.pacmandata.fluff = []
                this.pacmandata.num = 50;
                this.pacmandata.score = 0;
                this.pacmandata.speed = 10;
                for (var i = 0; i < this.pacmandata.num; i++) {
                    var margin = 100;
                    var vec = {};
                    var found = false
                    while (!found){
                        vec.x = Math.random() * (WIDTH - 2 * margin) + margin;
                        vec.y = Math.random() * (HEIGHT - 2 * margin) + margin;
                        if (vectorDist(this.pacmandata.pos, vec) > 70) {
                            found = true;
                        }
                    }
                    var t = PIXI.Sprite.fromImage(s005fl);
                    t.anchor = relcenter;
                    t.pivot = relcenter;
                    t.position = vec;
                    t.scale = {x:0.1, y:0.1};
                    this.doc["fluff"+i] = t;
                    this.pacmandata.fluff.push(this.doc["fluff"+i]);
                }
                for (var i = 0; i < this.pacmandata.fluff.length; i++) {
                    cMiddle.addChild(this.pacmandata.fluff[i]);
                }
                this.pacmandata.logic = () => {
                    if (this.pacmandata.down())  this.pacmandata.pos.y += this.pacmandata.speed;
                    if (this.pacmandata.up())    this.pacmandata.pos.y -= this.pacmandata.speed;
                    if (this.pacmandata.left())  {
                        this.pacmandata.pos.x -= this.pacmandata.speed;
                        this.pacmandata.sprite.scale.x = this.pacmandata.defscale.x
                    };
                    if (this.pacmandata.right()) {
                        this.pacmandata.pos.x += this.pacmandata.speed;
                        this.pacmandata.sprite.scale.x = -this.pacmandata.defscale.x
                    };
                    this.pacmandata.sprite.position = this.pacmandata.pos;
                    for (var i = 0; i < this.pacmandata.fluff.length; i++) {
                        if (this.pacmandata.fluff[i]){
                            this.pacmandata.fluff[i].rotation += Math.random();
                            if(vectorDist(this.pacmandata.fluff[i].position, this.pacmandata.pos) < 60) {
                                cMiddle.removeChild(this.pacmandata.fluff[i])
                                this.pacmandata.fluff[i]=undefined;
                                this.pacmandata.score += 1;
                            }
                        }
                    }
                    this.score.text = this.pacmandata.score;
                    this.score.style.fill = "#FFFFFF";
                    this.doc["score"] = this.score;
                    cGui.addChild(this.score);
                }
                self = this
                this.pacmandata.loop = window.setInterval(()=>{self.pacmandata.logic()}, 20);
                window.setTimeout(()=>{
                    self.health *= 0.7 + 0.3 * self.pacmandata.score / (self.pacmandata.num / 2);
                    window.clearInterval(self.pacmandata.loop)
                    d = (self) => {window.setTimeout(self.nextState, 1000)};
                    d(self);
                }, 8 * 1000);
            }
        },
        // STATE 006 //
        this.nextState, // skip
        // STATE 007 //
        this.nextState, // skip
        // STATE 008 //
        diasStateGenerator([s008s]),    // go ahead
        // STATE 009 //
        () => {
            if (this.switched) {
                this.infotext.warn("Hit the soup to get up");
                this.doc.points = this.score;
                this.doc.bgs = new FallingBackground();

                this.doc.gamesock = new Game9Sock();

                cGui.addChild(this.doc.points);
                this.switched = false;
            }
            this.doc.points.text = Math.round(this.doc.gamesock.height/33);
            this.doc.bgs.update(this.doc.gamesock.dltaHt);
            this.doc.gamesock.update()
            if (this.doc.gamesock.height > 0x28488){
                this.health *= 2;
                this.nextState();
            }else if (this.doc.gamesock.height < -2000){
                this.health /= 2;
                this.nextState();
                this.nextState();
            }
        },
        // STATE 010 //
        diasStateGenerator([
            s010s1,             // sock gets grabbed by monster
            s010s2]),
        // STATE 011 //
        () => {
            if (this.switched) {
                cGui.removeChild(this.hpbox);
                this.doc.background = new PIXI.Sprite.fromImage(s012s1);
                this.doc.background.width = WIDTH;
                this.doc.background.height = HEIGHT;
                cBack.addChild(this.doc.background);
                var ownHealth = {
                    font: "50px 'Arvo'",
                    fill: "#FFFFFF",
                    dropShadow: true,
                    dropShadowColor: "#990000",
                    dropShadowDistance: 5,
                    align: "center",
                };
                var bossHealth = {
                    font: "70px 'Arvo'",
                    fill: "#FFFFFF",
                    dropShadow: true,
                    dropShadowColor: "#FF0000",
                    dropShadowDistance: 5,
                    align: "center",
                };
                this.bossHealth = 500;
                this.display = {
                    sock: new PIXI.Text(this.health, ownHealth),
                    boss: new PIXI.Text(this.bossHealth, bossHealth)
                }
                this.doc.so = new PIXI.Sprite.fromImage(ssock);
                this.doc.d1 = this.display.sock;
                this.doc.d2 = this.display.boss;

                this.display.sock.position = {x:100, y: 450};
                this.display.sock.anchor = relcenter;
                this.display.boss.position = {x:WIDTH/2, y: 80};
                this.display.boss.anchor = relcenter;
                this.doc.so.position = {x: 100, y:600};
                this.doc.so.anchor = relcenter;
                this.doc.so.scale = {x:-.2,y:.2};

                cGui.addChild(this.display.sock);
                cGui.addChild(this.display.boss);
                cFront.addChild(this.doc.so);

                this.time = Date.now()
                this.yourTurn = true;
                this.updateText = () => {
                    this.display.sock.text = Math.floor(this.health);
                    this.display.boss.text = Math.floor(this.bossHealth);
                }
                this.sockAttack = () => {this.bossHealth -= Math.random() * 60 + 20;   this.updateText()};
                this.bossAttack = () => {this.health -= Math.random() * 20 + 30;       this.updateText()};

                // Fighting
                this.fight = () => {
                    if (this.yourTurn) {
                        this.sockAttack();
                    } else {
                        this.bossAttack();
                    }
                    if ( this.bossHealth < 0)  {
                        // you win
                        window.clearInterval(this.fightloop);
                        this.display.boss.text="DEAD";
                        self = this;
                        window.setTimeout(self.nextState,3000);
                    } else if ( this.health < 0 ) {
                        // you lose
                        window.clearInterval(this.fightloop);
                        this.display.sock.text="DEAD";
                        this.display.boss.text="TRY AGAIN";
                    }
                    this.yourTurn = !this.yourTurn;
                }
                self = this;
                this.fightloop = window.setInterval(()=>{self.fight()},800);
                this.switched = false;
            }
        },
        // STATE 012 //
        diasStateGenerator([s012s1,
            s012s2,             // monster turns into sockbert
            s012s3,             // he says "tanks" // no typo
            s012s4]),
        // STATE 013 //
        () => {
            if (this.switched){
                this.switched = false;
                var msg = new PIXI.Text("Thanks for Playing!", {
                    font: "120px 'Arvo'",
                    fill: "#FFF",
                    align:"center",
                    dropShadow: true,
                    dropShadowColor: "#FF0000",
                    dropShadowDistance: 2,
                });
                msg.anchor = relcenter;
                msg.position = {x: WIDTH/2, y:HEIGHT/2};
                cGui.addChild(msg);
                renderer.backgroundColor = 0x000;
            }
        }
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


function setup(){
    // Do setup here
    // Easteregg: eyes!¬
    renderStage();
}

// Request Animation Frame
function renderStage(){
    requestAnimationFrame(renderStage);
    gamestate.run()
    renderer.render(stage);
}

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
    .add(s012s1)
    .add(s012s2)
    .add(s012s3)
    .load(setup);

// DEBUG STUFF
jmp = (state) => {
    for (var i = 0; i < state; i++) {
        gamestate.nextState();
    }
}

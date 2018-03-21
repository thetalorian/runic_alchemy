/**
 * 
 */

var myGamePiece;
var myDialog;
var myMenu;
var myRuneBag;
var myDominion;
var myAscendance;
var myObstacles = [];
var myRunes = [];
var myNotif = [];
var myScore;
var myBase = 2;
var myStructures = [];

function startGame() {
    //myGamePiece = new component(30, 30, "red", 10, 120);
    //myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myDialog = new dialog();
    myMenu = new menu();
    myRuneBag = new runeBag();
    myDominion = new dominion();
    myAscendance = new ascendance();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        //this.canvas.width = 800;
        //this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
          myGameArea.click = true;
          myGameArea.x = e.pageX;
          myGameArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
          myGameArea.click = false;
          myGameArea.x = false;
          myGameArea.y = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function dialog() {
  // Function for the dialog window object
  // Parameters
  this.open = false;
  this.showing = '';
  this.mode = 'none';
  this.width = 400;
  this.height = 200;
  this.color = "#aaaaaa";
  this.btncolor = "#999999";
  this.left;
  this.right;
  this.top;
  this.bottom;
  this.closebuttonsize = 20;
  this.padding = 5;
  this.x = 400;
  this.y = 400;
  this.realx = this.x - (this.width/2);
  this.realy = this.y - (this.height/2);
  this.enable = function(element, type) {
    this.showing = element;
    this.mode = type;
    this.open = true;  
  }
  this.close = function() {
    this.showing.move();
    this.showing = '';
    this.open = false;
  }
  this.update = function() {
    if (this.open) {
      this.x = myGameArea.canvas.width /2;
      this.y = myGameArea.canvas.height / 2;
      this.left = this.x - (this.width / 2);
      this.right = this.left + this.width;
      this.top = this.y - (this.height / 2);
      this.bottom = this.top + this.height;

      // Draw Dialog window
      ctx = myGameArea.context;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height);

      // Draw Close button
      var top = this.top + this.padding;
      var bottom = this.top + this.closebuttonsize;
      var right = this.right - this.padding;
      var left = right - this.closebuttonsize;
      ctx.fillStyle = this.btncolor;
      ctx.fillRect(left,top,this.closebuttonsize,this.closebuttonsize);
      ctx.fontAlign = "center"
      ctx.font = "10px Consolas";
      ctx.fillStyle = "#000000";
      ctx.fillText("X", left + this.closebuttonsize /2, bottom - 2);
      if (checkClick(top,bottom,left,right,true)) { this.close(); }
      
    }
    //ctx.fillStyle = "#00BB00";
    //if (this.ports[1]) {
    //  ctx.fillRect(this.x - (this.width/2), this.y - (this.height/2), this.width, 5);
    //}  
    //if (this.ports[2]) {
    //  ctx.fillRect(this.x + (this.width/2) - 5, this.y, 5, (this.height/2));
    //  ctx.fillRect(this.x, this.y + (this.height/2) - 5, (this.width/2), 5);
    //}  
    //ctx.font = "30px Consolas";
    //ctx.fillStyle = "#000000";
    //ctx.fillText("Mana: " + this.charge, 30, 30)
  }
}

function rune(name,tier,x,y,draw,drawup,capup,port=0) {
  // Function for rune objects.
  // Parameters
  this.width = 50;
  this.height = 50;
  this.name = name;
  this.tier = tier;
  this.x = x;
  this.y = y;
  this.ox = 0;
  this.oy = 0;
  this.left;
  this.top;
  this.right;
  this.bottom;
  this.port = port;
  this.color = "#aaaaaa";
  if (this.tier == 1) {
    this.color = "#aaaaaa";
  }
  if (this.tier == 2) {
    this.color = "#aaaadd";
  }
  if (this.tier == 3) {
    this.color = "#aaddaa";
  }
  if (this.tier == 4) {
    this.color = "#ddaaaa";
  }
  if (this.tier == 5) {
    this.color = "#ddaadd";
  }
  if (this.tier == 6) {
    this.color = "#ddddaa";
  }
  this.drawrule = draw;
  this.drawupgrade = drawup;
  this.capupgrade = capup;
  this.charge = 0;
  this.cap = 20;
  this.active = false;
  this.enabled = true;
  this.update = function() {
    // Draw the rune
    if (this.enabled && this.active && myGameArea.frame == 1) {
      this.draw();
    }
    if (myRuneBag.visible && this.enabled) {
      // Draw Rune tablet
      ctx = myGameArea.context;
      this.left = myRuneBag.x + this.x - this.width / 2;
      this.right = this.left + this.width;
      this.top = myRuneBag.y + this.y - this.height / 2;
      this.bottom = this.top + this.height;
      
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height);

      // Draw Upgrade Button
      ctx.fillStyle = "#777777";
      var left = this.right - 10;
      var right = this.right;
      var top = this.top;
      var bottom = this.top + 10;
      ctx.fillRect(left, top, 10, 10);
      ctx.font = "30px Consolas";

      if (this.active) {
        ctx.fillStyle = "#000000";
      } else {
        ctx.fillStyle = "#888888";
      }
      ctx.textAlign = "center";
      ctx.font = "30px Consolas";
      ctx.fillText(this.name, this.left + (this.width/2), this.top + 30);
      ctx.textAlign = "right";
      ctx.font = "15px Consolas";
      ctx.fillText(this.charge, this.right - 5, this.bottom - 5);

      // Check for clicks
      if (checkClick(top,bottom,left,right)) { this.upgradedialog(); }
      if (checkClick(this.top,this.bottom,this.left,this.right)) { this.toggle(); }
    }
  }
  this.draw = function() {
    // Don't start to draw if all sources
    // aren't ready. Can also check if it is ok to enable.
    
    var cantake = true; 
    var source;
    var amount = myBase / this.drawrule.length;
    for (i = 0; i < this.drawrule.length; i += 1) {
      source = myRuneBag.tiers[this.drawrule[i][0]][this.drawrule[i][1]];
      if (!source.hasamount(amount,this.port)) {
        cantake = false;
      }
    }
    if (cantake && !this.enabled) {
      this.enabled = true;
      console.log(this.name + " enabled!");
    }
    if (cantake && this.active) {
      var payed = true;
      for (i = 0; i < this.drawrule.length; i += 1) {
        source = myRuneBag.tiers[this.drawrule[i][0]][this.drawrule[i][1]];
        payed = source.remove(amount);
      }
      if (payed) {
        this.charge += 1;
      }
    }
      
  }
  this.toggle = function() {
    this.active = !this.active;
  }  
  this.hasamount = function(amount,port) {
    if (this.charge >= amount) {
      return true;
    } else {
      return false;
    }
  }
  this.remove = function(amount) {
    this.charge -= amount;
    return true;
  }
  this.upgradedialog = function() {
    this.move('center');
    myDialog.enable(this,'rune');
  }
  this.move = function(position) {
    if (position == 'center') {
      this.ox = this.x;
      this.oy = this.y;
      this.x = 400;
      this.y = myDialog.y - myDialog.height/2 - this.height/2 - 10;
    } else {
      this.x = this.ox;
      this.y = this.oy;
    }
    this.realx = this.x - this.width/2;
    this.realy = this.y - this.height/2;
  }
}

function structure(name,draw,baserate,basecost,growth) {
  // Function for structure objects
  // Parameters
  this.width = 100;
  this.height = 50;
  this.port = 0;
  this.name = name;
  this.color = "#aaaaaa";
  this.drawrule = draw;
  this.produces = baserate;
  this.growth = growth;
  this.basecost = basecost;
  this.multiplier = 1;
  this.count = 0;
  this.enabled = true;
  this.update = function() { 
    if (this.enabled) {
      ctx = myGameArea.context;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);
      ctx.font = "15px Consolas";
      ctx.fillStyle = "#000000";
      ctx.fillText(this.name, this.x - (this.width/2) + 5, this.y - 5);
      ctx.fillText(this.count, this.x - (this.width/2) + 5, this.y + (this.height/2) - 5);
    }
  }
  this.draw = function() {
    // Don't start to draw if all sources
    // aren't ready. Can also check if it is ok to enable.
    
    var cantake = true; 
    var source;
    var amount;
    //var drawrule = this.drawrule;
    console.log("Checking " + this.name);
    for (i = 0; i < this.drawrule.length; i += 1) {
      source = myRuneBag.tiers[this.drawrule[i][0]][this.drawrule[i][1]];
      amount = this.cost();
      if (!source.hasamount(amount,this.port)) {
        cantake = false;
      }
    }
    console.log(cantake);
    if (cantake && !this.enabled) {
      this.enabled = true;
      console.log(this.name + " enabled!");
    }
    if (cantake) {
      for (i = 0; i < this.drawrule.length; i += 1) {
        source = myRuneBag.tiers[this.drawrule[i][0]][this.drawrule[i][1]];
        amount = this.cost();
        source.remove(amount);
      }
      this.count += 1;
    }
      
  }
  this.toggle = function() {
    this.active = !this.active;
  }
  this.payout = function() {
    myRuneBag.charge += (this.produces * this.multiplier * this.count);
  }
  this.hasamount = function(amount,port) {
    if (this.charge >= amount) {
      return true;
    } else {
      return false;
    }
  }
  this.remove = function(amount) {
    this.charge -= amount;
  }
  this.checkClicked = function() {
    if (this.enabled) {
      var myleft = this.x - (this.width/2);
      var myright = myleft + (this.width);
      var mytop = this.y - (this.height/2);
      var mybottom = mytop + (this.height);
      var clicked = true;
      if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
        clicked = false;
      }
      if (clicked) {
        // See what kind of click.
        var innerleft = myleft + 5;
        var innerright = myright -5;
        var innertop = mytop + 5;
        var innerbottom = mybottom -5;
        if ((innerbottom < myGameArea.y) || (innertop > myGameArea.y) || (innerright < myGameArea.x) || (innerleft > myGameArea.x)) {
          this.cyclePorts();
        } else {
          this.draw();
        }
        myGameArea.x = false;
        myGameArea.y = false;
      }
    } else {
      return false;
    }
  }
  this.rate = function() {
    return this.produces * this.multiplier;
  }
  this.drawrunes = function() {
    runes = "";
    for (i = 0; i < this.drawrule.length; i += 1) {
      runes += myRuneBag.tiers[this.drawrule[i][0]][this.drawrule[i][1]].name;
    }
    return runes;
  }
  this.cost = function() {
    return (this.basecost + (this.count * this.growth));
  }
}

class Notif {
	constructor(value) {
		this.value = value;
		ctx = myGameArea.context;
	    this.x = myGameArea.canvas.width / 2;
	    this.y = myGameArea.canvas.height / 2;
		this.life = 30; 
	}
	update(){
		if (this.life > 0) {
			ctx = myGameArea.context;
			ctx.font = "20px Consolas";
			ctx.fillStyle = "#000000";
			ctx.fillText("+" + this.value, this.x, this.y);
			this.y -= 5;
			this.life -=1;
		}
	}
}
//function notif(value) {
//  // Floating Numbers
//
//  // Parameters
//  this.value = value;
//  this.x = 400;
//  this.y = 400;
//  this.life = 30;
//
//  this.update = function() {
//    if (this.life > 0) {
//      ctx = myGameArea.context;
//      ctx.font = "20px Consolas";
//      ctx.fillStyle = "#000000";
//      ctx.fillText("+" + this.value, this.x, this.y)
//      this.y -= 5;
//      this.life -=1;
//    }
//  }
//
//}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function channel(active,position) {
  // Channel Objects
  // Parameters
  this.x = 400;
  this.y = 400;
  this.active = active;
  this.start = 0;
  this.end = 0;
  if (position == 1) {
    // Top
    this.start = 1.2 * Math.PI;
    this.end = 1.8 * Math.PI;
  }
  if (position == 2) {
    // Right
    this.start = 1.8 * Math.PI;
    this.end = 0.5 * Math.PI;
  }
  if (position == 3) {
    // Left
    this.start = 0.5 * Math.PI;
    this.end = 1.2 * Math.PI;
  }
  this.update = function() { 
    if (this.active) {
      this.x = myGameArea.canvas.width / 2;
      this.y = myGameArea.canvas.height / 2;
      ctx = myGameArea.context;
      ctx.beginPath();
      ctx.arc(this.x,this.y,27,this.start,this.end);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#aaaaFF";
      ctx.stroke();
    }
  }
  this.draw = function() {
    // Function does nothing
  }
  this.checkClicked = function() {
    // Function does nothing
  }
  this.hasamount = function(amount) {
    if (myRuneBag.charge >= amount) {
      return true;
    } else {
      return false;
    }
  }
  this.remove = function(amount) {
    if (myRuneBag.charge >= amount && this.active) {
      myRuneBag.charge -= amount;
      return true;
    } else {
      return false;
    }
  }

}

function runeBag() {
  // Function for the rune bag
  // Parameters
  this.x = 400;
  this.y = 400;
  this.visible = true;
  this.charge = 0;
  this.clickChargeRate = 1;
  this.notif = 0;
  this.activechannels = 1;
  this.activechannel = 0;
  this.tiers = [];
  // Tier 0
  this.tiers.push([]);
  this.tiers[0].push(new channel(true,1));
  this.tiers[0].push(new channel(false,2));
  this.tiers[0].push(new channel(false,3));
  // Tier 1
  this.tiers.push([]);
  this.tiers[1].push(new rune("ᚠ",1,0,-65,[[0,0]],[[1,0],[1,1]],[],[])); // 0 - Feoh - Wealth
  this.tiers[1].push(new rune("ᚦ",1,65,25,[[0,1]],[[1,2],[1,3]],[],[])); // 1 - Born -  Thorn
  this.tiers[1].push(new rune("ᚩ",1,-65,25,[[0,2]],[[1,4],[1,5]],[],[])); // 2 - Os - Mouth
  // Tier 2
  this.tiers.push([]);
  this.tiers[2].push(new rune("ᛥ",2,-60,-100,[[1,0]],[],[])); // 3 - Stan - Stone
  this.tiers[2].push(new rune("ᛠ",2,60,-100,[[1,0]],[],[])); // 4 - Ear - Earth
  this.tiers[2].push(new rune("ᚺ",2,120,0,[[1,1]],[],[])); // 5 - Hael - Hail
  this.tiers[2].push(new rune("ᛁ",2,60,100,[[1,1]],[],[])); // 6 - Is - Ice
  this.tiers[2].push(new rune("ᛢ",2,-60,100,[[1,2]],[],[])); // 7 - Cweorth - Fire
  this.tiers[2].push(new rune("ᚳ",2,-120,0,[[1,2]],[],[])); // 8 - Cen - Torch
  // Tier 3
  this.tiers.push([]);
  this.tiers[3].push(new rune("ᛟ",3,0,-170,[[2,0],[2,1]],[],[])); // 9 - Ethel - Estate
  this.tiers[3].push(new rune("ᛗ",3,140,-100,[[2,1],[2,2]],[],[])); // 10 - Man - Man
  this.tiers[3].push(new rune("ᛖ",3,140,100,[[2,2],[2,3]],[],[])); // 11 - Eoh - Horse
  this.tiers[3].push(new rune("ᛚ",3,0,170,[[2,3],[2,4]],[],[])); // 12 - Lagu - Lake
  this.tiers[3].push(new rune("ᛋ",3,-140,100,[[2,4],[2,5]],[],[])); // 13 - Sigel - Sun
  this.tiers[3].push(new rune("ᛞ",3,-140,-100,[[2,5],[2,0]],[],[])); // 14 - Dagaz - Day
  // Tier 4
  this.tiers.push([]);
  this.tiers[4].push(new rune("ᛣ",4,95,-195,[[3,0],[3,1]],[],[])); // 15 - Calc - Chalice
  this.tiers[4].push(new rune("ᚱ",4,220,0,[[3,1],[3,2]],[],[])); // 16 - Rad - Ride
  this.tiers[4].push(new rune("ᚢ",4,95,195,[[3,2],[3,3]],[],[])); // 17 - Ur - Cattle
  this.tiers[4].push(new rune("ᚹ",4,-95,195,[[3,3],[3,4]],[],[])); // 18 - Pynn - Joy
  this.tiers[4].push(new rune("ᛄ",4,-220,0,[[3,4],[3,5]],[],[])); // 19 - Jear - Year
  this.tiers[4].push(new rune("ᚷ",4,-95,-195,[[3,5],[3,0]],[],[])); // 20 - Gyfu - Gift
  // Tier 5
  this.tiers.push([]);
  this.tiers[5].push(new rune("ᚸ",5,220,-170,[[4,0],[4,1]],[],[])); // 21 - Gar - Spear
  this.tiers[5].push(new rune("ᛉ",5,220,135,[[4,1],[4,2]],[],[])); // 22 - Eolhx - Elk
  this.tiers[5].push(new rune("ᚾ",5,0,275,[[4,2],[4,3]],[],[])); // 23 - Nyd - Need
  this.tiers[5].push(new rune("ᛈ",5,-220,135,[[4,3],[4,4]],[],[])); // 24 - Pertho - Game
  this.tiers[5].push(new rune("ᚣ",5,-220,-170,[[4,4],[4,5]],[],[])); // 25 - Yr - Bow
  this.tiers[5].push(new rune("ᛡ",5,0,-275,[[4,5],[4,0]],[],[])); // 26 - Iar - Serpent
  // Tier 6
  this.tiers.push([]);
  this.tiers[6].push(new rune("ᛇ",6,320,0,[[5,0],[5,1]],[],[])); // 27 - Eoh - Yew
  this.tiers[6].push(new rune("ᛒ",6,160,275,[[5,1],[5,2]],[],[])); // 28 - Beorc - Birch
  this.tiers[6].push(new rune("ᛏ",6,-160,275,[[5,2],[5,3]],[],[])); // 29 - Tyr
  this.tiers[6].push(new rune("ᚪ",6,-320,0,[[5,3],[5,4]],[],[])); // 30 - Ac - Oak
  this.tiers[6].push(new rune("ᚫ",6,-160,-275,[[5,4],[5,5]],[],[])); // 31 - Aesc - Ash
  this.tiers[6].push(new rune("ᛝ",6,160,-275,[[5,5],[5,0]],[],[])); // 32 - Ing
  this.update = function() {
    if (this.visible) {
      this.x = myGameArea.canvas.width / 2;
      this.y = myGameArea.canvas.height / 2;
      var top;
      var bottom;
      var left;
      var right;
      var width;
      var height;
      // Draw the Circles
      ctx = myGameArea.context;
      ctx.strokeStyle = "#888888";
      ctx.beginPath();
      ctx.arc(this.x,this.y,70,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x,this.y,120,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x,this.y,170,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x,this.y,220,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x,this.y,270,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x,this.y,320,0,2*Math.PI);
      ctx.stroke();

      // Draw the well
      ctx.fillStyle = "#bbbbff";
      ctx.beginPath();
      ctx.arc(this.x,this.y,25,0,2*Math.PI);
      ctx.fill();
      top = (this.y - 25);
      bottom = (this.y + 25);
      left = (this.x - 25);
      right = (this.x + 25);
      if (checkClick(top,bottom,left,right)) { this.clickCharge(); }

      // Draw cycleL
      width = 20;
      height = 20;
      left = this.x - 50;
      right = left + width;
      top = this.y - 30;
      bottom = top + height;
      ctx.fillStyle = "#999999";
      ctx.fillRect(left,top,width,height);
      if (checkClick(top,bottom,left,right)) { this.cycleChannels(-1); }

      // Draw cycleR
      width = 20;
      height = 20;
      left = this.x + 30;
      right = left + width;
      top = this.y - 30;
      bottom = top + height;
      ctx.fillStyle = "#999999";
      ctx.fillRect(left,top,width,height);
      if (checkClick(top,bottom,left,right)) { this.cycleChannels(1); }

      // Draw Mana Count
      ctx.font = "30px Consolas";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.fillText(this.charge, this.x, 30)

    }

    // Cycle through each tier
    for (tierCycle = 0; tierCycle < this.tiers.length; tierCycle += 1) {
      // See each rune in tier.
      for (runeCycle = 0; runeCycle < this.tiers[tierCycle].length; runeCycle += 1) {
        if (this.reverseRunes) {
          curRune = this.tiers[tierCycle].length - (runeCycle + 1);
        } else {
          curRune = runeCycle;
        }
        if (myGameArea.frameNo == 1) {
          this.tiers[tierCycle][curRune].draw();
        }
        if (this.visible) {
          this.tiers[tierCycle][curRune].update();
        }
      }
    }
  }
  this.cycleChannels = function(direction) {
    var active;
    if (this.activechannels == 3) {
      this.tiers[0][0].active = true;
      this.tiers[0][1].active = true;
      this.tiers[0][2].active = true;
      return;
    } else if (this.activechannels == 2) {
      // Ports inverted
      active = false;
    } else {
      active = true;
    }
    this.activechannel += direction;
    if (this.activechannel > 2) {
      this.activechannel = 0;
    }
    if (this.activechannel < 0) {
      this.activechannel = 2;
    }
    for (channelactivator = 0; channelactivator <3; channelactivator += 1) {
      if (channelactivator == this.activechannel) {
        this.tiers[0][channelactivator].active = active;
      } else {
        this.tiers[0][channelactivator].active = !active;
      }
    }
  }
  this.clickCharge = function() {
    this.charge += this.clickChargeRate;
    myNotif[this.notif] = new notif(this.clickChargeRate);
    this.notif += 1;
    if (this.notif > 10) {
      this.notif = 0;
    }
  }
}

function structureTier(tier,page,x,y) {

  // Parameters
  this.tier = tier;
  this.page = page;
  this.x = x;
  this.y = y;
  this.structs = [];
  this.width = 710;
  this.height = 220;
  this.enabled = true;
  this.update = function() {
    if (myDominion.visible) {
      // Draw Backpanel
      ctx = myGameArea.context;
      ctx.fillStyle = "#335555";
      ctx.fillRect(this.x,this.y,this.width,this.height);

      //Draw Runes
      var rune = 0;
      var runerow = 0;
      var runex;
      var runey;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.font = "16px Consolas";
      ctx.textAlign = "center";
      for (ri = 0; ri < myRuneBag.tiers[this.tier].length; ri += 1) {
        ctx.fillStyle = "#113333";
        runex = this.x + 5 + (205 * rune);
        runey = this.y + 5 + (35 * runerow);
        ctx.fillRect(runex, runey, 200, 30);
        ctx.beginPath();
        ctx.arc(runex + 15,runey + 15, 13, 0,2*Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.stroke();
        ctx.fillRect(runex + 30, runey + 3, 165, 24);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(myRuneBag.tiers[this.tier][ri].name, runex + 15, runey + 22);
        ctx.textAlign = "right";
        ctx.fillText(myRuneBag.tiers[this.tier][ri].charge, runex + 200 - 10, runey + 22);
        rune += 1;
        if (rune > 2) {
          rune = 0;
          runerow += 1;
        } 
      }
    }

    // Draw Structures
    var struct = 0;
    var structrow = 0;
    var structx;
    var structy;
    var structw = 230;
    var structh = 40;
    var left;
    var right;
    var top;
    var bottom;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.font = "20px Consolas";
    ctx.textAlign = "center";
    for (si = 0; si < this.structs.length; si += 1) {
      structx = this.x + 5 + ((structw + 5) * struct);
      structy = this.y + 5 + ((structh + 5) * structrow) + 80;
      left = structx;
      right = structx + structw;
      top = structy;
      bottom = structy + structh;
      if (myDominion.visible) {
        ctx.fillStyle = "#99AAAA";
        ctx.fillRect(structx, structy, structw, structh);
        ctx.fillStyle = "#000000";
        ctx.font = "20px Consolas";
        ctx.textAlign = "left";
        ctx.fillText(this.structs[si].name, structx + 5, structy + 20);
        ctx.textAlign = "right";
        ctx.fillText(this.structs[si].count, structx + structw - 5, structy + 20);
        ctx.font = "14px Consolas";
        ctx.textAlign = "left";
        ctx.fillText("+" + this.structs[si].rate() + "/s", structx + 5, structy + 38);
        ctx.textAlign = "right";
        ctx.fillText(this.structs[si].cost() + " " + this.structs[si].drawrunes(), structx + structw -5, structy + 38);
        struct += 1;
        if (struct > 2) {
          struct = 0;
          structrow += 1;
        }
      }
      if (myGameArea.frameNo == 1) {
        this.structs[si].payout();
      }
      if (checkClick(top,bottom,left,right)) { this.structs[si].draw();}
    }
  }
  this.addStruct = function(struct) {
    this.structs.push(struct);
  } 

  this.checkClicked = function() {
    if (myDialog.open) {
      myDialog.checkClicked();
    } else {
      var top;
      var bottom;
      var left;
      var right;

      // Check Structures
      var struct = 0;
      var structrow = 0;
      var structx;
      var structy;
      var structw = 230;
      var structh = 40;
      for (si = 0; si < this.structs.length; si += 1) {
        left = this.x + 5 + ((structw + 5) * struct);
        right = left + structw;
        top = this.y + 5 + ((structh + 5) * structrow) + 80;
        bottom = top + structh;
        if (myGameArea.x && myGameArea.y && (left < myGameArea.x) && (right > myGameArea.x) && (top < myGameArea.y) && (bottom > myGameArea.y)) {
          this.structs[si].draw();
          myGameArea.x = false;
          myGameArea.y = false;
        }
        struct += 1;
        if (struct > 2) {
          struct = 0;
          structrow += 1;
        }
      }
    }
  }
}

function dominion() {

  // Parameters
  this.visible = false;
  this.structures = [];
  this.page = 1;
  this.tiers = [];
  this.tiers.push(new structureTier(1,1,30,70));
  this.tiers.push(new structureTier(2,1,30,300));
  this.tiers.push(new structureTier(3,1,30,530));
  this.tiers.push(new structureTier(4,2,30,16));
  this.tiers.push(new structureTier(5,2,30,266));
  this.tiers.push(new structureTier(6,2,30,548));
  this.tiers[0].addStruct(new structure("Miner",[[1,0]],1,1,1));
  this.tiers[0].addStruct(new structure("Logger",[[1,1]],1,1,1));
  this.tiers[0].addStruct(new structure("Farmer",[[1,2]],1,1,1));
  this.tiers[0].addStruct(new structure("Tracker",[[1,0],[1,1]],5,5,2));
  this.tiers[0].addStruct(new structure("Crier",[[1,1],[1,2]],5,5,2));
  this.tiers[0].addStruct(new structure("Sage",[[1,2],[1,0]],5,5,2));

  this.tiers[1].addStruct(new structure("Mason",[[2,0]],10,10,10));
  this.tiers[1].addStruct(new structure("Grocer",[[2,1]],10,10,10));
  this.tiers[1].addStruct(new structure("Thatcher",[[2,2]],10,10,10));
  this.tiers[1].addStruct(new structure("Mortician",[[2,3]],10,10,10));
  this.tiers[1].addStruct(new structure("Baker",[[2,4]],10,10,10));
  this.tiers[1].addStruct(new structure("Guard",[[2,5]],10,10,10));
  this.tiers[1].addStruct(new structure("Sculpter",[[2,0],[2,3]],20,20,10));
  this.tiers[1].addStruct(new structure("Chef",[[2,1],[2,4]],20,20,10));
  this.tiers[1].addStruct(new structure("Lamplighter",[[2,2],[2,5]],20,20,10));

  this.update = function() {

    // Update tiers
    for (tierCycle = 0; tierCycle < this.tiers.length; tierCycle += 1) {
      if (this.tiers[tierCycle].page == this.page) {
        this.tiers[tierCycle].update();
      }
    }
  }

  this.checkClicked = function() {
    if (myDialog.open) {
      myDialog.checkClicked();
    } else {
      var top;
      var bottom;
      var left;
      var right;
  
      if (myGameArea.x && myGameArea.y) { 
        // Check for Rune Bag
        top = 5;
        bottom = 35;
        left = 765;
        right = 795; 
        if ((myGameArea.y < bottom) && (myGameArea.y > top) && (myGameArea.x > left) && (myGameArea.x < right)) {
          this.visible = false;
          myRuneBag.visible = true;
          myGameArea.x = false;
          myGameArea.y = false;
        }
  
        // Check for Ascension
        top = 40;
        bottom = 70;
        left = 765;
        right = 795;
        if ((myGameArea.y < bottom) && (myGameArea.y > top) && (myGameArea.x > left) && (myGameArea.x < right)) {
          this.visible = false;
          myAscension.visible = true;
          myGameArea.x = false;
          myGameArea.y = false;
        }
  
      }

      // Check Clicks for tiers
      for (tierCycle = 0; tierCycle < this.tiers.length; tierCycle += 1) {
        this.tiers[tierCycle].checkClicked();
      }
    }
  }
}

function ascendance() {
  // Ascendance gage

  // Parameters
  this.visible = false;
  this.update = function() {
    //
  }

  this.checkClicked = function() {
    if (myDialog.open) {
      myDialog.checkClicked();
    } else {
      var top;
      var bottom;
      var left;
      var right;
  
      if (myGameArea.x && myGameArea.y) { 
        // Check for Rune Bag
        top = 5;
        bottom = 35;
        left = 765;
        right = 795; 
        if ((myGameArea.y < bottom) && (myGameArea.y > top) && (myGameArea.x > left) && (myGameArea.x < right)) {
          this.visible = false;
          myRuneBag.visible = true;
          myGameArea.x = false;
          myGameArea.y = false;
        }
  
        // Check for Dominion
        top = 40;
        bottom = 70;
        left = 765;
        right = 795;
        if ((myGameArea.y < bottom) && (myGameArea.y > top) && (myGameArea.x > left) && (myGameArea.x < right)) {
          this.visible = false;
          myDominion.visible = true;
          myGameArea.x = false;
          myGameArea.y = false;
        }
  
      }
    }
  }

}

function menu() {
  // Menu options
  // Parameters
  this.visible = true;
  this.activecolor = "#99FF99";
  this.inactivecolor = "#999999";
  this.buttonwidth = 30;
  this.buttonheight = 30;
  this.padding = 10;
  this.update = function() {
    if (this.visible) { 
      ctx = myGameArea.context;
      var right = myGameArea.canvas.width - this.padding;
      var left = right - this.buttonwidth;
      var top = this.padding;
      var bottom = top + this.buttonheight;

      // Draw Rune Bag Button
      if (myRuneBag.visible) {
        ctx.fillStyle = this.activecolor;
      } else {
        ctx.fillStyle = this.inactivecolor;
      }
      ctx.fillRect(left,top,this.buttonwidth,this.buttonheight);
      if (checkClick(top,bottom,left,right)) {
        myRuneBag.visible = true;
        myDominion.visible = false;
        myAscendance.visible = false;
      }

      // Draw Dominion button
      top = bottom + this.padding;
      bottom = top + this.buttonheight;
      if (myDominion.visible) {
        ctx.fillStyle = this.activecolor;
      } else {
        ctx.fillStyle = this.inactivecolor;
      }
      ctx.fillRect(left,top,this.buttonwidth,this.buttonheight);
      if (checkClick(top,bottom,left,right)) {
        myRuneBag.visible = false;
        myDominion.visible = true;
        myAscenance.visible = false;
      }

      // Draw Ascendance button
      top = bottom + this.padding;
      bottom = top + this.buttonheight;
      if (myAscendance.visible) {
        ctx.fillStyle = this.activecolor;
      } else {
        ctx.fillStyle = this.inactivecolor;
      }
      ctx.fillRect(left,top,this.buttonwidth,this.buttonheight);
      if (checkClick(top,bottom,left,right)) {
        myRuneBag.visible = false;
        myDominion.visible = false;
        myAscendance.visible = true;
      }
    }

  }
}

function updateGameArea() {
  // Activates every 20 ms
  myGameArea.clear();
  myGameArea.canvas.width = myGameArea.canvas.clientWidth;
  myGameArea.canvas.height = myGameArea.canvas.clientHeight;
  //console.log(myGameArea.canvas.clientWidth + " " + myGameArea.canvas.clientHeight);
  myGameArea.frameNo += 1;

  if (myGameArea.frameNo > 50) {
    myGameArea.frameNo = 1;
  }

//  if (myGameArea.x && myGameArea.y) {
//    if (myRuneBag.visible) {
//      myRuneBag.checkClicked();
//    }
//    if (myDominion.visible) {
//      myDominion.checkClicked();
//    }
//    if (myAscendance.visible) {
//      myAscendance.checkClicked();
//    }
//  }

  myRuneBag.update();
  myDominion.update();
  myAscendance.update();

  // Update notifications
  for (noti = 0; noti < myNotif.length; noti += 1) {
    myNotif[noti].update();
  }

  myDialog.update();
  myMenu.update();

// Legacy game code for ref
//    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
//    for (i = 0; i < myObstacles.length; i += 1) {
//        if (myGamePiece.crashWith(myObstacles[i])) {
//            myGameArea.stop();
//            return;
//        } 
//    }
//    if (myGameArea.frameNo == 1 || everyinterval(150)) {
//        x = myGameArea.canvas.width;
//        minHeight = 20;
//        maxHeight = 200;
//        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
//        minGap = 50;
//        maxGap = 200;
//        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
//        myObstacles.push(new component(10, height, "green", x, 0));
//        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
//    }
//    for (i = 0; i < myObstacles.length; i += 1) {
//        myObstacles[i].speedX = -1;
//        myObstacles[i].newPos();
//        myObstacles[i].update();
//    }
    //myScore.update();
    //myGamePiece.newPos();    
    //myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    myGamePiece.speedY = -1; 
}

function movedown() {
    myGamePiece.speedY = 1; 
}

function moveleft() {
    myGamePiece.speedX = -1; 
}

function moveright() {
    myGamePiece.speedX = 1; 
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

function checkClick(top, bottom, left, right, inDialog=false) {
  if (((myDialog.open && inDialog) || !(myDialog.open)) && (myGameArea.click) && (left < myGameArea.x) && (right > myGameArea.x) && (top < myGameArea.y) && (bottom > myGameArea.y)) {
    myGameArea.click = false;
    return true;
  } else {
    return false;
  }
}
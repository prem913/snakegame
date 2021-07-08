
//game variables
let game = document.getElementById('game');
let start = document.getElementById('start');
let pause = document.getElementById('pause');
let pause2=document.getElementById('pause2');
let displayscore = document.getElementById('score');
let restartbtn = document.getElementById('Restart');
let animationid;
var speed = 1;
var body = [
    {
        x: 5,
        y: 5,
    }
]
var curdir = {
    x: 1,
    y: 0
}
var food = {
    x: -1,
    y: -1
}
var prevscore = 0;
var score = 0;
//game state
var ispaused = false;
var isgamestarted = false;
let rows=20;
let columns=20;
function setcanvas(){
    let h=window.innerHeight;
    h=h-40-(h%20);
    let w=window.innerWidth;
    w=w-40-(w%20);
    rows=h/20;
    columns=w/20;
    game.style.gridTemplateRows=`repeat(${rows},20px)`;
    game.style.gridTemplateColumns=`repeat(${columns},20px)`;
    game.style.height=h+"px";
    game.style.width=w+"px";
}
const updatescore = (n) => {
    score += 100;
    if (n) { score = 0; updatespeed() }
    if (gethighscore() < score) {
        sethighscore();
        document.getElementById("highscore").innerText = gethighscore();
    }
    updatespeed();
    displayscore.innerText = score;
}
const updatespeed = () => {
    speed = 1 + difficult + (score / 2000);
}
//===========================one time use==========================
const drawhead = () => {
    let part = document.createElement('div');
    part.id = `0`;
    part.classList.add("headRight")
    part.style.gridColumn = `${body[0].x}/${body[0].x + 1}`;
    part.style.gridRow = `${body[0].y}/${body[0].y + 1}`;
    game.appendChild(part);

}
const drawfood = () => {
    let part = document.createElement('div');
    part.id = `food`;
    part.classList.add("food");
    part.style.gridColumn = `${food.x}/${food.x + 1}`;
    part.style.gridRow = `${food.y}/${food.y + 1}`;
    game.appendChild(part)

}
//=================================================================================

var generatefood = () => {
    var newfood = {
        x: Math.ceil(Math.random() * columns),
        y: Math.ceil(Math.random() * rows),
    }
    food = newfood;
    let part = document.getElementById('food');
    part.style.gridColumn = `${food.x}/${food.x + 1}`;
    part.style.gridRow = `${food.y}/${food.y + 1}`;
}
var addpart = () => {
    let last = body[body.length - 1];

    var newobj = {
        x: last.x - curdir.x,
        y: last.y - curdir.y
    }
    body.push(newobj);
    let n = body.length;
    let part = document.createElement('div');
    part.id = `${n - 1}`;
    part.classList.add("part");
    part.style.gridColumn = `${body[n - 1].x}/${body[n - 1].x + 1}`;
    part.style.gridRow = `${body[n - 1].y}/${body[n - 1].y + 1}`;
    game.appendChild(part);
}
var movesnake = () => {
    let prev = body[0];
    let newx = body[0].x + curdir.x;
    let newy = body[0].y + curdir.y;
    if (newx > columns) {
        newx = 1;
    }
    else if (newx < 1) {
        newx = columns;
    }
    else if (newy > rows) {
        newy = 1;
    }
    else if (newy < 1) {
        newy = rows;
    }
    let newob = {
        x: newx,
        y: newy

    };
    body[0] = newob;
    let n = body.length;
    for (let i = 1; i < n; i++) {
        let temp = body[i];
        body[i] = prev;
        prev = temp;
    }
}
var drawsnake = () => {
    if ((food.x === body[0].x) && (food.y === body[0].y)) {
        updatescore();
        addpart();
        generatefood();
    }
    for (let i = 0; i < body.length; i++) {
        let part = document.getElementById(`${i}`);
        part.style.gridColumn = `${body[i].x}/${body[i].x + 1}`;
        part.style.gridRow = `${body[i].y}/${body[i].y + 1}`;
    }
}
//====================check if game over============
let intersected = false;
const isintersect = () => {
    let n = body.length;
    for (let i = 1; i < n; i++) {
        if ((body[0].x === body[i].x) && (body[0].y === body[i].y)) {
            intersected = true;
            return;
        }
    }

}
// game events
function handlegameover(){
    handlemenu(false);
    return;
}
function restart(){
        body = [{ x: 1, y: 1 }];
        curdir.x = 1;
        curdir.y = 0;
        prevscore = score;
        updatescore(1);
        isgamestarted = false;
        pausegame();
        start.classList.remove('disabled');
        pause.classList.add('disabled');
        game.innerHTML = '';
        drawfood();
        generatefood();
        drawhead();
}
const handlemenu=(state)=>{
    let menu=document.querySelector('.menucontainer');
    let blur=document.documentElement.style;
    if(state){
        blur.setProperty("--blur","0");
        menu.classList.add("fade");
        setTimeout(() => {
            menu.style.setProperty("display","none");
        },400 );
    }
    else{
        blur.setProperty("--blur","5px");
        menu.style.setProperty("display","flex");
        menu.classList.remove("fade");
    }
    return;
}
const startgame = () => {
    if (!isgamestarted) {
        pausegame();
        intersected = false;
        isgamestarted = true;
        start.classList.add('disabled');
        pause.classList.remove('disabled');
        restartbtn.classList.remove('hide');
        game.innerHTML = '';
        drawhead();
        drawfood();
        generatefood();
        tick();
        handlemenu(true);
    }
}
const pausegame = () => {
        pause.innerText = ispaused ? 'Pause' : 'Resume';
    if (isgamestarted) {
        handlemenu(ispaused)
        ispaused = !ispaused;
    }
    else{
        ispaused=false;
        handlemenu(ispaused);
    }
}
//=====================update frames=================

let curtime = new Date().getTime();
var tick = () => {
    if(isgamestarted){
    if (!intersected) {
        animationid=window.requestAnimationFrame(tick);
    }
    else {
        restart();
        handlegameover();

        return;
    }
}  
    let newtime = new Date().getTime();
    if ((newtime - curtime > 200 / speed) && !ispaused) {
        movesnake();
        isintersect();
        drawsnake();
        curtime = newtime;
    }
    else {
        return;
    }
}
//=======================controls==================
start.addEventListener('click', startgame);
pause.addEventListener('click', pausegame);
pause2.addEventListener('click', pausegame);
restartbtn.addEventListener('click', () => {
    restart();
})
window.addEventListener('keydown', (e) => {
    if (!ispaused && isgamestarted) {
        if (e.key === 's') {
            if (curdir.y !== -1) {
                curdir = {
                    x: 0,
                    y: 1
                }
                document.getElementById('0').style.transform = 'rotate(90deg)';
            }
        }
        else if (e.key === 'w') {
            if (curdir.y !== 1) {
                curdir = {
                    x: 0,
                    y: -1
                }
                document.getElementById('0').style.transform = 'rotate(-90deg)';
            }
        }
        else if (e.key === 'd') {
            if (curdir.x !== -1) {
                curdir = {
                    x: 1,
                    y: 0
                }
                document.getElementById('0').style.transform = 'rotate(0deg)';
            }
        }
        else if (e.key === 'a') {
            if (curdir.x !== 1) {
                curdir = {
                    x: -1,
                    y: 0
                }
                document.getElementById('0').style.transform = 'rotate(180deg)';
            }
        }
    }
    if (e.keyCode === 32) {
        if (!isgamestarted) {
            startgame();
        }
        else {
            pausegame();
        }
    }
});
//on game start
let head = document.getElementById('0');
window.onload = () => {
    difficulty(0);
    document.getElementById("highscore").innerText = gethighscore();
setcanvas();
}
//==============difficulty===============
let difficult = 0;
const difficulty = (n) => {
    if (!isgamestarted) {
        difficult = n;
    }
    updatespeed();
    let diff = document.getElementById('difficulty');
    if (difficult === 0) {
        diff.innerText = "Easy";
    }
    if (difficult === 1) {
        diff.innerText = "Normal";

    }
    if (difficult === 2) {
        diff.innerText = "Hard";
    }
}
//===============cookies====================
const sethighscore = () => {
    const d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = score + ";" + expires + ";path=/";
}
const gethighscore = () => {
    let s = document.cookie;
    if (s == '') {
        return -1;
    }
    return s;
}
gethighscore();
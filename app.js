const gameScreen = document.querySelector('.gameScreen')
gameScreenWidth = gameScreen.offsetWidth
gameScreenHeight = gameScreen.offsetHeight
gameScreenLeft  = gameScreen.offsetLeft

blockWidth = 100
blockHeight = 50
const blocks = []

const player = document.createElement('div')
player.classList.add('player')
playerWidth = 100
playerHeight = 20
const playerStartPosition = [gameScreenWidth/2-playerWidth/2,10]
let playerPosition = playerStartPosition[0]
player.style.bottom = "10px"

const ball = document.createElement('div')
ball.classList.add('ball')
ballRadius = 10
const ballStartPosition = [gameScreenWidth/2,11+playerHeight+ballRadius]
let removingClass = false

let endMessage = document.createElement('h1')
endMessage.textContent = "You win! Press F5 to try again"
endMessage.style.position = "absolute"
endMessage.style.left = gameScreenLeft + gameScreenWidth/2 - 50 + "px"
endMessage.style.top = gameScreenHeight + "px"

//Block dimensions properties
class Block {
    constructor(x,y) {
        this.bottomLeft = [x,y]
        this.bottomRight = [x+blockWidth,y]
        this.topLeft = [x,y+blockHeight]
        this.topRight = [x+blockWidth,y+blockHeight]
    }
}

class BallProperties {
    constructor(x,y) {
        this.center = [x,y]
        this.top = [x,y+ballRadius]
        this.right = [x+ballRadius,y]
        this.bottom = [x,y-ballRadius]
        this.left = [x-ballRadius,y]
        this.X_Direction = 0
        this.Y_Direction = 0
    }
}

//Create ranges of blocks
for(let j = 0; j<3; j++)
{
    //Creates a range of blocks
    for(let i = 0; i<9; i++)
    { 
        blocks.push(new Block(10+i*blockWidth+i*10,gameScreenHeight-(j+1)*(blockHeight+10)))
    }
}

//Create the ball
let Ball = new BallProperties(ballStartPosition[0],ballStartPosition[1])

//Add blocks created
function addBlocks(){
    for(let k=0; k<blocks.length; k++)
    {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[k].bottomLeft[0] + "px"
        block.style.bottom = blocks[k].bottomLeft[1] + "px"
        gameScreen.appendChild(block)
    }
}

//Put the player to the good coordinates
function positionPlayer(){
    player.style.left = playerPosition + "px"
    gameScreen.appendChild(player)
}

//Move the player
function movePlayer(e){
    if(e.key==='ArrowLeft')
    {
        if(playerPosition>20)
        {
            playerPosition -= 20
        }
    }
    if(e.key==='ArrowRight')
    {
        if(playerPosition<gameScreenWidth-playerWidth-20)
        {
            playerPosition += 20
        }
    }
    positionPlayer()
}

//Put the ball to the good coordinates
function positionBall(){
    //Saves ball directions before initialising a new Ball with a new position, to put them in ball properties after initialising it
    xDirection = Ball.X_Direction
    yDirection = Ball.Y_Direction
    Ball = new BallProperties(Ball.center[0]+Ball.X_Direction,Ball.center[1]+Ball.Y_Direction)
    Ball.X_Direction = xDirection
    Ball.Y_Direction = yDirection
    ball.style.left = Ball.left[0] + "px"
    ball.style.bottom = Ball.bottom[1] + "px"
    gameScreen.appendChild(ball)
}

//Check if the party end, and in which conditions
function checkEndOfParty()
{
    if(Ball.X_Direction == 0 && ball.classList.contains('ball'))
    {
        ball.classList.remove('ball')
        gameScreen.removeChild(ball)
        endMessage.textContent = "You lose! Press F5 to try again."
        document.body.appendChild(endMessage)
    }
    else
    {
        if(blocks.length == 0)
        {
            Ball.X_Direction = 0
            Ball.Y_Direction = 0
            ball.classList.remove('ball')
            gameScreen.removeChild(ball)
            document.body.appendChild(endMessage)
        }
    }
}

//Move the ball and change directions move if a block is hiten
function moveBall()
{
    blocksOnScreen = Array.from(document.querySelectorAll('.block'))
    for(let i = 0; i<blocks.length; i++)
    {
        //If the ball hits a block horizontally it switches the direction of the horizontal move
        if(Ball.bottom[1] <= blocks[i].topLeft[1] && Ball.top[1] >= blocks[i].bottomLeft[1] && (Ball.right[0]===blocks[i].bottomLeft[0] || Ball.left[0]===blocks[i].bottomRight[0]))
        {
            Ball.X_Direction *= -1
            removingClass = true
        }
        //If the ball hits a block vertically it switches the direction of the vertical move
        if(Ball.right[0] >= blocks[i].topLeft[0] && Ball.left[0] <= blocks[i].topRight[0] && (Ball.bottom[1]===blocks[i].topLeft[1] || Ball.top[1]===blocks[i].bottomLeft[1]))
        {
            Ball.Y_Direction *= -1
            removingClass = true
        }
        //Remove the hiten block
        if(removingClass)
        {
            blocksOnScreen[i].classList.remove('block')
            blocks.splice(i,1)
            removingClass = false
        }
    }
    //if the ball hit the right border or the left border, it switches the direction of the horizontal move
    if(Ball.right[0] >= gameScreenWidth || Ball.left[0] <= 0)
    {
        Ball.X_Direction *= -1
    }
    //if the ball hit the top border, it switches the direction of the vertical move (here to down)
    if(Ball.top[1] >= gameScreenHeight)
    {
        Ball.Y_Direction *= -1
    }
    //if the ball hit the bottom border, the game stop
    if(Ball.bottom[1] <= 0)
    {
        Ball.X_Direction = 0
        Ball.Y_Direction = 0
    }
    //If the ball hit the player we switch the direction of the vertical move
    if(Ball.right[0] >= playerPosition && Ball.left[0] <= playerPosition+playerWidth && (Ball.bottom[1]===playerHeight+10))
    {
        Ball.Y_Direction *= -1
    }

    checkEndOfParty()
    positionBall()
}

function startGame(e)
{
    Ball.Y_Direction == 1
    if((e.key === "ArrowLeft"))
    {
        Ball.X_Direction == -1
    }
    else if(e.key === "ArrowRight")
    {
        Ball.X_Direction == 1
    }
    document.removeEventListener("keydown")
    document.addEventListener('keydown',movePlayer)
    var refresh = setInterval(function(){
        if(Ball.X_Direction == 0)
        {
            clearInterval(refresh);
        }
        else
        {
            moveBall()
        }
    },6)
}

document.addEventListener("keydown",startGame)

addBlocks()
positionPlayer()
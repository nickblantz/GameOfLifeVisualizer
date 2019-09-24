const tileSize     = 50,
      boardTiles   = []
      tileRegex    = /tile-(\d+)-(\d+)/;
var   screenWidth  =  0,
      screenHeight =  0,
      activeBoard  = [],
      inactiveBoard= [],
      isRunning    = false,
      isBlueActive = false,
      activeEvent  = null;

function toggleLife() {
    this.classList.toggle('populated');
    
    var tileCoordinates = tileRegex.exec(this.id);
    activeBoard[tileCoordinates[1]][tileCoordinates[2]] = !activeBoard[tileCoordinates[1]][tileCoordinates[2]];
    
    console.log(`tile-${tileCoordinates[1]}-${tileCoordinates[2]} population changed`);
}

function generateTile(y, x) {
    var tile = document.createElement('div');
    
    tile.id = 'tile-' + y + '-' + x;
    tile.style.cssText = 'position: relative; display: inline-block; height: ' + tileSize + 'px; width: ' + tileSize + 'px;';
    tile.addEventListener('click', toggleLife);
    
    return tile;
}

function getLiveNeighborCount(y, x) {
    var liveNeighborCount = 0
        topC              = (y > 0),
        leftC             = (x > 0),
        bottomC           = (y < (screenHeight / tileSize - 2)),
        rightC            = (x < (screenWidth / tileSize - 2));
    if (topC && leftC && boardTiles[y - 1][x - 1].classList.contains('populated')) // top-left
        liveNeighborCount++;
    if (topC && boardTiles[y - 1][x].classList.contains('populated')) // top-mid
        liveNeighborCount++; 
    if (topC && rightC && boardTiles[y - 1][x + 1].classList.contains('populated')) // top-right
        liveNeighborCount++; 
    if (rightC && boardTiles[y][x + 1].classList.contains('populated')) // mid-right
        liveNeighborCount++; 
    if (bottomC && rightC && boardTiles[y + 1][x + 1].classList.contains('populated')) // btm-right
        liveNeighborCount++; 
    if (bottomC && boardTiles[y + 1][x].classList.contains('populated')) // btm-mid
        liveNeighborCount++; 
    if (bottomC && leftC && boardTiles[y + 1][x - 1].classList.contains('populated')) // btm-left
        liveNeighborCount++; 
    if (leftC  && boardTiles[y][x - 1].classList.contains('populated')) // mid-left
        liveNeighborCount++; 
    return liveNeighborCount;
}

function updateInactiveBoard() {
    for (var y = 0; y < boardTiles.length; y++) {
        for (var x = 0; x < boardTiles[y].length; x++) {
            var liveNeighborCount = getLiveNeighborCount(y, x);
            if (activeBoard[y][x] && liveNeighborCount < 2) {
                inactiveBoard[y][x] = false;
            } else if (activeBoard[y][x] && liveNeighborCount > 3) {
                inactiveBoard[y][x] = false;
            } else if (!activeBoard[y][x] && liveNeighborCount == 3) {
                inactiveBoard[y][x] = true;
            } else {
                inactiveBoard[y][x] = activeBoard[y][x];
            }
        }
    }
}

function toggleActiveBoard() {
    var temp = activeBoard;
    activeBoard = inactiveBoard;
    inactiveBoard = temp;
    
    for (var y = 0; y < boardTiles.length; y++) {
        for (var x = 0; x < boardTiles[y].length; x++) {
            if (boardTiles[y][x].classList.contains('populated') ^ activeBoard[y][x]) {
                boardTiles[y][x].classList.toggle('populated');
            }
        }
    }
}

function toggleGameRunning(e) {
    if (e.keyCode != 32) {
        return;
    } else if (isRunning) {
        isRunning = false;
        document.body.classList.toggle('running_color');
        clearInterval(activeEvent);
    } else {
        isRunning = true;
        document.body.classList.toggle('running_color');
        activeEvent = setInterval(function () { 
            updateInactiveBoard();
            toggleActiveBoard();
        }, 500);
    }
}

function initBoard() {
    var gameBoard           = document.getElementById('board_of_life');
    screenWidth             = document.body.clientWidth;
    screenHeight            = window.innerHeight;
    gameBoard.style.cssText = 'position: relative; margin: ' + Math.floor((screenHeight % (tileSize)) / 2) + 'px ' + Math.floor((screenWidth % tileSize) / 2) + 'px;';
    for (var y = 0; y < (screenHeight / tileSize - 1); y++) {
        activeBoard.push([]);
        inactiveBoard.push([]);
        boardTiles.push([]);
        for (var x = 0; x < (screenWidth / tileSize - 1); x++) {
            var tile = generateTile(y, x);
            gameBoard.appendChild(tile);
            boardTiles[y].push(tile);
            activeBoard[y].push(false);
            inactiveBoard[y].push(false);
        }
    }
    runningEvent = document.addEventListener('keyup', toggleGameRunning);
}

window.onload = initBoard;

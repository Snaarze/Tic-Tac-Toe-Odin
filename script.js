function Gameboard() {
    const rowColumn = 9;    
    const board = [];
    
    // Initialize the board (1D array)
    for (let i = 0; i < 1; i++) {
        board[i] = [];
        for (let j = 0; j < rowColumn; j++) {
            board[i].push(Cell());
        }
    }
    
    // Define winning conditions for a 3x3 grid (2D behavior on a 1D array)
    const winningCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check if a player has won
    const checkWin = (player) => {
        return winningCondition.some(condition => 
            condition.every(index => board[0][index].getValue() === player)
        );
    };
    // 
    const getBoard = () => board;
   
   
    const dropMark = (column, player) => {
        const availableCells = board[0].filter(row => row.getValue() === 0);
        const currentCells = availableCells.length - 1;
       
        console.log(currentCells)
        if (board[0][column].getValue() !== 0)  {
            console.log("Column is already filled");
            return;
        }
        board[0][column].addToken(player);
        return {currentCells}
    };

    const resetBoard = () => board[0].forEach(cell => cell.resetValue());
    
    return { getBoard, dropMark,resetBoard, checkWin, board};
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player; 
    };

    const resetValue =  () => {
        value = 0;
    }
    
    const getValue = () => value;

    return { getValue, addToken, resetValue };
}

function GameController(PlayerOne = "JJ", PlayerTwo = "GG") {
    const Game = Gameboard();
    const Players = [
        { name: PlayerOne, mark: "X", score : 0},
        { name: PlayerTwo, mark: "O", score : 0 }
    ];

    let activePlayer = Players[0];

    const getActivePlayer = () => activePlayer;
    
    const switchTurns = () => {
        activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];   
    };

    console.log(`${getActivePlayer().name} starts the game.`);

    const PlayRound = (column = prompt("Choose a column to drop your mark:")) => {
        const player = getActivePlayer();
       
        console.log(`Current turn: ` + `${getActivePlayer().name}`);
        if (Game.currentCells !== 0) {
            console.log(`${player.name} is dropping to column ${column}`);   
            Game.dropMark(column, player.mark);
        }
        switchTurns()
    };
    
    return { getActivePlayer, switchTurns, PlayRound, Game};
}


function ScreenController(){
    const game = GameController();  
    // selector for all div
    const containerChild = document.querySelectorAll(".container > .markDiv");
    const resetBtn = document.querySelector(".resetBoard");

    // when a user click any div it will change the text content based on the Player's mark
    containerChild.forEach(div => {
        if (!div.hasEventListener) {
            div.addEventListener("click", () => {
                const index = Number(div.getAttribute("data-index"));
                const player = game.getActivePlayer(); // Get the current player before playing the round
                if(game.Game.board[0][index].getValue() === 0){
                    game.PlayRound(index);
                    div.textContent = `${player.mark}`; // Update UI with the current player's mark          
                    if (game.Game.checkWin(player.mark)) { 
                        console.log(`${player.name} wins`)
                        player.score++;
                        return ; // End the game after a win
                    }
                }
                if(game.currentCells === 0){
                    game.Game.resetBoard()
                }
            });
        }
    });
    function resetBoardAndContent(){
        containerChild.forEach(div =>{
            div.textContent = "";
        })
        game.Game.resetBoard();
        game.switchTurns()
    } 

    // when the button is click the board and the textContent will be empty
    resetBtn.addEventListener("click", resetBoardAndContent);
}

ScreenController();
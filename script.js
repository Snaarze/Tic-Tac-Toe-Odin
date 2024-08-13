//A function that will create an array 
function Gameboard() {
    const rowColumn = 9;    
    const board = [];
    
    // Initialize the board
    for (let i = 0; i < 1; i++) {
        board[i] = [];
        for (let j = 0; j < rowColumn; j++) {
            board[i].push(Cell());
        }
    }
    //current state of the board
    const getBoard = () => board;
    
    const dropMark = (column, player) => {
        const availableCells = board[0].filter(cell => cell.getValue() === 0);
        const currentCellCount = availableCells.length - 1
        
        if(currentCellCount === 0){
            console.log("no turn left")
            return;
        }
           
        board[0][column].addToken(player);
        console.log(currentCellCount)
    };

    const resetBoard = () => board[0].filter(row => row.resetValue());
    return { getBoard, dropMark, board, resetBoard};
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

    return { getValue, addToken, resetValue};
}

function GameController(PlayerOne = "JJ", PlayerTwo = "GG") {
    const game = Gameboard();
    const Players = [
        { name: PlayerOne, mark: "X" },
        { name: PlayerTwo, mark: "O" }
    ];

    let activePlayer = Players[0];

    const getActivePlayer = () => activePlayer;
    const switchTurns = () => {
        activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];
    };

    console.log(`${getActivePlayer().name} starts the game.`);

    const PlayRound = (column = prompt("Choose a column to drop your mark:")) => {
       
        if(game.board[0][column].getValue() === 0){
            console.log(`${getActivePlayer().name} is dropping to column ${column}`);   
            game.dropMark(column, getActivePlayer().mark);
            switchTurns();
        }else {
            return
        }
        console.log(`current turn  ` + `${getActivePlayer().name}`)
    };

 


    return { getActivePlayer, switchTurns, PlayRound, game};
}

const game = GameController();
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

    const getBoard = () => board;

    const dropMark = (column, player) => {
        board[0][column].addToken(player);
    };

    console.log("Initial value of board[0][1]:", board[0][1].getValue());
    return { getBoard, dropMark, board };
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;  // Update the cell's value
    };

    const getValue = () => value;

    return { getValue, addToken };
}

function GameController(PlayerOne = "JJ", PlayerTwo = "GG") {
    const game = Gameboard();  // This creates a single game board instance
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


    return { getActivePlayer, switchTurns, PlayRound, game };
}

// Create a single instance of the game controller
const controller = GameController();

// Play multiple rounds using the same controller instance
controller.PlayRound(1); 
controller.PlayRound(2); 
controller.PlayRound(3);
controller.PlayRound(4);
controller.PlayRound(4);
controller.PlayRound(5);
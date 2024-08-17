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

   
    
    //drop the mark of the current player and base on the data index of div to store it into column parameters
    const dropMark = (column, player) => {
        //checks if the current column value is not 0
        if (board[0][column].getValue() !== 0)  {
            console.log("Column is already filled");
            return;
        }   
        board[0][column].addToken(player);
    };

    const resetBoard = () => board[0].forEach(cell => cell.resetValue());
    
    return { getBoard, dropMark,resetBoard, checkWin, board};
}


// inherits the functions to the cell of the board arrays
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


// control the flow of the game
function GameController(PlayerOne = "Snaarze", PlayerTwo = "Computer") {
    const Game = Gameboard();
    const Players = [
        { name: PlayerOne, mark: "X", score : 0},
        { name: PlayerTwo, mark: "O", score : 0 }
    ];

    let activePlayer = Players[0];
    const getActivePlayer = () => activePlayer;
    // changes the active player every turn
    const switchTurns = () => {
        activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];   
    };

    console.log(`${getActivePlayer().name} starts the game.`);
    // drop their mark then switch their turn
    const PlayRound = (column = prompt("Choose a column to drop your mark:")) => {
        const player = getActivePlayer();
        // get the current cells length
        console.log(`Current turn: ` + `${getActivePlayer().name}`);
        console.log(`${player.name} is dropping to column ${column}`);   
        Game.dropMark(column, player.mark);
    
        switchTurns()
    };
    
    return { getActivePlayer, switchTurns, PlayRound, Game, Players};
}

// display all player credentials
function ScreenController(){
    let isWinner = false
    let round  = 0
    const game = GameController();  
    // selector for all div
    const containerChild = document.querySelectorAll(".container > .markDiv");
    const resetBtn = document.querySelector(".resetBoard");
    const player1 = document.querySelector(".Player1-name");
    const player1Score = document.querySelector(".Player1-score");
    const player2 = document.querySelector(".Player2-name");
    const player2Score = document.querySelector(".Player2-score");
    const modal = document.querySelector("#modal-container");
    const playBtn = document.querySelector(".playBtn")
    const  playerResult = document.querySelector(".player-win")
    const newGameBtn = document.querySelector(".newGameBtn");
    const p1previousRounds = document.querySelector(".p1-previous-rounds");
    const p2previousRounds = document.querySelector(".p2-previous-rounds");
    
    // 
    function modalInteraction(){
        playBtn.addEventListener("click", ()=>{
            
            resetBoardAndContent();
            // close() && showModal isnt working, just alternative to use
            modal.close();
        })

         // when the button is click the board and the textContent will be empty
         resetBtn.addEventListener("click", resetBoardAndContent);
         newGameBtn.addEventListener("click", resetGameAndScore )
    }

    modalInteraction();

   
    // display the playername on both sides
    player1.textContent = game.Players[0].name
    player2.textContent = game.Players[1].name
    
    // when a user click any div it will change the text content based on the Player's mark
    function playGame(){
        containerChild.forEach(div => {
            if (!div.hasEventListener) {    
                div.addEventListener("click", () => {
                const index = Number(div.getAttribute("data-index"));
                const player = game.getActivePlayer(); // Get the current player before playing the round
                
                DisplayPreviousMove(player,index)
                if(game.Game.board[0][index].getValue() === 0 && !isWinner){
                    div.textContent = `${player.mark}`; // Update UI with the current player's mark   
                    game.PlayRound(index);
                    checkWin(player);
                    
                }
                if(player.score === 5){
                    playBtn.style.display = "none"
                    return;
                }
                });
            }
        });
    }

    // initial call
    playGame();

    function checkWin(player){
        const availableCells = game.Game.board[0].filter(row => row.getValue() === 0).length
        if (game.Game.checkWin(player.mark)) {    
            isWinner = true;
            player.score++;
            player1Score.textContent = game.Players[0].score
            player2Score.textContent = game.Players[1].score
            if(isWinner === true){
                modal.showModal();
                playerResult.textContent = `Congratulation!, ${player.name} You won the round!`
                if(player.mark === "X"){
                    displayWon(player)
                }else if(player.mark === "O"){
                    displayWon(player)
                }
            }
            console.log(`${player.name} wins && current score : ${player.score}`)
            return isWinner; // End the game after a win
        }else if( availableCells === 0){
            modal.showModal(); 
            playerResult.textContent ="Draw!, Try again next Round!"
            return
        }
    }
    // reset the board && content!
    function resetBoardAndContent(){
        if(game.getActivePlayer().mark !== "X"){
            game.switchTurns()
        }
        // change all the children div of container content to empty
        containerChild.forEach(div =>{
            div.textContent = "";
        })  
        // reset the board
        game.Game.resetBoard();
        isWinner = false;
    } 
    // reset the playerscore && wholeboard!
    function resetGameAndScore(){
        player1Score.textContent = game.Players[0].score = 0
        player2Score.textContent = game.Players[1].score = 0
        resetBoardAndContent();
        modal.close();
    }

    function DisplayPreviousMove(player,index){
        const move = document.createElement("p");
        move.textContent = `${player.name} dropped his mark to column ${index}`
        if(player.mark === "X"){
            p1previousRounds.appendChild(move);
        }else if(player.mark === "O"){
            p2previousRounds.appendChild(move);
        }
    }

    function displayWon(player){
        round++
        const move = document.createElement("p");
        move.textContent = `Congrats ${player.name}!, You won the Round ${round}!`
        if(player.mark === "X"){
            p1previousRounds.appendChild(move);
        }else if(player.mark === "O"){
            p2previousRounds.appendChild(move)
        }
        return round;
    }

   
    return {game}
}



// initial call to start the game.
ScreenController(); 
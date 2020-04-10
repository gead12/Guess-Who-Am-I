const sock = io();
      //hold of the big container
var bigContainer = document.getElementById('bigContainer')
      //Start button
    createButton = document.getElementById('start-btn')  
      //hold of the main container
    mainContainer = document.getElementById('main-container')
      //hold of the nickname buttons container
    nickButtonsContainer = document.getElementById('nickButtonsContainer')
      //hold of the nickanme input form
    nicknInput = document.getElementById('nicknameInput')
      //hold of the main player's name
    mainPlayerName = document.getElementById('name-container-1')
      //join controls
    joinGameControls = document.getElementById('joinControls')  
      //instructions
    playerInstruction = document.getElementById('instructions')
      //join button
    joinButton = document.getElementById('join-btn')
      //player 1 nickname
    playOneNickname = document.getElementById('nickname1')
      //player 1 nickname
    playTwoNickname = document.getElementById('nickname2')
      //player 1 nickname
    playThreeNickname = document.getElementById('nickname3')
      //player 1 nickname
    playFourthNickname = document.getElementById('nickname4')

let cardContainers = [];
for (i = 0; i < 4; i++){
    cardContainers[i] = document.getElementById('card-container-'+(i+1))
}
//hold of the player-1 tag in order to change it with the start button
const player1 = document.getElementById('name1')

//Pushing the start button
createButton.addEventListener('click', startGame)

//Pushing the start button
joinButton.addEventListener('click', joinGame)

//hold of the nickname buttons
const cardButtons = [];
for (j = 0; j < 4; j++){
    cardButtons[j] = document.getElementById('nickname-btn-'+(j+1))
}

//listening for events on the nicname buttons
cardButtons[0].addEventListener('click', setNickname1)
cardButtons[1].addEventListener('click', setNickname2)
cardButtons[2].addEventListener('click', setNickname3)
cardButtons[3].addEventListener('click', setNickname4)

//creating a new player
class player {
    constructor(id,name){
        this.playerId = id;
        this.playerName = name;
        this.playerNickname = null;
    }
}

var ident = 0;
var tempPlayer = null;


//creating a game
function startGame(){
    //hiding the create and join controls
    createButton.classList.add('hide')
    joinGameControls.classList.add('hide')
    cardButtons[0].classList.add('hide')

    //unhiding certain elements
    mainContainer.classList.remove('hide')
    nickButtonsContainer.classList.remove('hide')
    nicknInput.classList.remove('hide')
    playerInstruction.classList.remove('hide')

    //setting the main player's name
    var createName = document.getElementById('createName').value
    const createPlayerName = document.getElementById('name1');
    createPlayerName.innerHTML = createName

    sock.on('playerId',id=>{
        window.tempPlayer = new player(id, createName)
    })

    console.log(createName);
    sock.emit('create-game', createName, (game) =>{
        gameId = game.id;
        console.log('create-game emit', console.log(game.players))
        players = game.players;
        console.log('create-game emit', console.log(players))
    })
}

//joining a game
function joinGame(){
    //checking that a user entered the room
    console.log('A user entered a room')

    //hiding the start button
    createButton.classList.add('hide')
    joinGameControls.classList.add('hide')
    //unhiding certain elements
    mainContainer.classList.remove('hide')
    nickButtonsContainer.classList.remove('hide')
    nicknInput.classList.remove('hide')
    playerInstruction.classList.remove('hide')

    //setting the joined player's name
    var joinedPlayerName = document.getElementById('jgNewName').value;
    gameId = document.getElementById('jg-gameId').value

    //broadcasting the name of the main player
    sock.emit('joinGame', gameId, joinedPlayerName, (_players) => {
        players = _players;
        console.log(players);
        if  (players.length > 4) {
            console.log('game is full');
        }
        players.forEach((player, index) =>{
            const newPlayerName = document.getElementById('name' + (index + 1))
            newPlayerName.innerHTML = player.name;
        })
    });

    //correctly positioning the player and hiding his nickname and button
    sock.on('playerPositioning',playerPos => {
        cardButtons[playerPos].classList.add('hide')
        playOneNickname.innerHTML = 'Card 1'
        const JoinedName = document.getElementById('nickname'+ (playerPos+1))
        JoinedName.innerHTML = 'Your Nickname'
    })

}

//updating the players name
sock.on('updatePlayers', (player) => {
    console.log(player);
    players.push(player);
    console.log(players);
    players.forEach((player, index) =>{
        const newPlayerName = document.getElementById('name' + (index + 1))
        newPlayerName.innerHTML = player.name;
    })
})

//getting the id in order to pass it down to the other players
sock.on('tableId',id => {
    bigContainer.insertAdjacentHTML('beforeend','Your table id is: '+id)
})

//setting the 1st nickname
function setNickname1(){
    console.log(playOneNickname.innerHTML)
    var nick1 = document.getElementById('nicknameInput').value;
    //emit the user's nickname pick
    sock.emit('user-nickname-change-1', nick1);
}

sock.on('server-nickname-change-1', nickname => {
    if (playOneNickname.innerHTML === 'Card 1'){
    nickname1.remove()
    cardContainers[0].insertAdjacentHTML('beforeend',nickname)
    }
})

//setting the 2nd nickname
function setNickname2(){
    var nick2 = document.getElementById('nicknameInput').value;
    //emit the user's nickname pick
    sock.emit('user-nickname-change-2', nick2);
}

sock.on('server-nickname-change-2', nickname => {
    if (playTwoNickname.innerHTML === 'Card 2'){
        nickname2.remove()
        cardContainers[1].insertAdjacentHTML('beforeend',nickname)
    }
})

//setting the 3rd nickname
function setNickname3(){
    var nick3 = document.getElementById('nicknameInput').value;
    //emit the user's nickname pick
    sock.emit('user-nickname-change-3', nick3);
}

sock.on('server-nickname-change-3', nickname => {
    if (playThreeNickname.innerHTML === 'Card 3'){
        nickname3.remove()
        cardContainers[2].insertAdjacentHTML('beforeend',nickname)
    }
})

//setting the 4th nickname
function setNickname4(){
    var nick4 = document.getElementById('nicknameInput').value;
    //emit the user's nickname pick
    sock.emit('user-nickname-change-4', nick4);
}

sock.on('server-nickname-change-4', nickname => {
    if (playFourthNickname.innerHTML === 'Card 4'){
        nickname4.remove()
        cardContainers[3].insertAdjacentHTML('beforeend',nickname)
    }
})
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const Player = require('./src/Entities/player');
const Table = require('./src/Entities/game');
const GameRepository = require('./src/Repository/GameRepository');

const app = express();

//setting the static folder
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketio(server);

let playersIdList = [];
var n = 0;

//Run when client connects
io.on('connection', (sock) => {
    console.log('Start========================================')
    console.log('Someone connected....')

    //emitting the player's id to the client
    let pId = sock.id
    sock.emit('playerId',pId)

    n = n + 1;
    playersIdList.push(pId)

    //listen for player name change
    sock.on('a-new-player',(newPlayer)=>{
        console.log('the player: ' + JSON.stringify(newPlayer) + ' joined')
    })

    //controlling what happens when a player disconnects
    sock.on('disconnect', function(){
        let pos = playersIdList.indexOf('player_id');
        playersIdList.splice(pos) 
        n = n - 1;
      })

    //Creating a game 
    sock.on('create-game', (name, ackCallback) =>{
        const newPlayer = new Player(sock.id, name);
        const newTable = new Table(GameRepository.getLength(), newPlayer);
        console.log(newTable.players);
        GameRepository.creatingTable(newTable);
        ackCallback(newTable);
        thisTableId = newTable.id
        sock.emit('tableId',thisTableId)
        // sock.broadcast.emit('new-player-name', game.id);
    });

    //Joining a game
    sock.on('joinGame', (gameId, name, ackCallback) => {
        console.log(gameId, name);
        const newPlayer = new Player(sock.id, name);
        console.log(GameRepository.getGameTables());
        const game = GameRepository.getGameTablesById(gameId);
        game.players.push(newPlayer);
        sock.broadcast.emit('updatePlayers', newPlayer);
        console.log(game.players);
        playerPos = game.players.findIndex(x => x.id === sock.id)
        console.log('The player who joined has a position' + playerPos)
        sock.emit('playerPositioning',playerPos)
        ackCallback(game.players);
    })

    //listen for nickname change by user
    sock.on('user-nickname-change-1', (nickname) => {
        console.log(nickname)
        io.emit('server-nickname-change-1',nickname);
    });
    
    //listen for nickname change by user
    sock.on('user-nickname-change-2', (nickname) => {
        console.log(nickname)
        io.emit('server-nickname-change-2',nickname);
    });
    
    //listen for nickname change by user
    sock.on('user-nickname-change-3', (nickname) => {
        console.log(nickname)
        io.emit('server-nickname-change-3',nickname);
    });
    
    //listen for nickname change by user
    sock.on('user-nickname-change-4', (nickname) => {
        console.log(nickname)
        io.emit('server-nickname-change-4',nickname);
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});  

server.listen(3000, () => {
    console.log('Guess who started on 3000');
});


//info@iatroi-athina.gr
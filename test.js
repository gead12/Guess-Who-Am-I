const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const Player = require('./src/Entities/Player');
const Game = require('./src/Entities/Game');
const GameRepository = require('./src/Repository/GameRepository');

const app = express();

//setting the static folder
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketio(server);

let players = [];
let identifier = 0;
let player_id = null;
let player_socket = null;
let n = 1;

//Run when client connects
io.on('connection', (sock) => {

    player_id = sock.id;
    player_socket = sock;
    player_identifier = identifier;

    players.push(player_id)

    console.log('Start========================================')
    console.log('Someone connected....')
    console.log(players)

    //emiting the identifier to the connected socket
    player_socket.emit('identity',identifier)

    //controlling what happens when a player disconnects
    sock.on('disconnect', function(){
        let pos = players.indexOf('player_id');
        players.splice(pos) 
        n = n - 1;
        identifier = identifier - 1;
      })
    
    //setting your name for the other players
    //'Create-game'
    sock.on('create-game', (name, ackCallback) =>{
        const newPlayer = new Player(sock.id, name);
        const game = new Game(GameRepository.getLength(), newPlayer);
        console.log(game.players);
        GameRepository.addGameInstance(game);
        ackCallback(game);
        // sock.broadcast.emit('new-player-name', game.id);
    });

    sock.on('join-game', (gameId, name, ackCallback) => {
        console.log(gameId, name);
        const newPlayer = new Player(sock.id, name);
        console.log(GameRepository.getGameInstances());
        const game = GameRepository.getGameInstanceById(gameId);
        console.log(game.players);
        game.players.push(newPlayer);
        sock.broadcast.emit('updatePlayers', newPlayer);
        ackCallback(game.players);
    })

    //listen for nickname change by user
    sock.on('user-nickname-change-2', (nickname, name, gameId) => {
        const game = GameRepository.getGameInstanceById(gameId);
        const playerToChangeNIckname = game.players.find((player) => player.name === name);
        playerToChangeNIckname.nickname = nickname;
        console.log(nickname)
        io.emit('server-nickname-change-2',nickname)
        sock.on('identity-message',identity=>{
            console.log('The player with identity: ' + identity + ' made a change to the 2nd nickname')
        });
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

    //listen for player name change
    sock.on('player-name',(name)=>{
        console.log('the player: ' + name + ' joined')
    })
});

server.on('error', (err) => {
    console.error('Server error:', err);
});  

server.listen(3000, () => {
    console.log('Guess who started on 3000');
});


//info@iatroi-athina.gr
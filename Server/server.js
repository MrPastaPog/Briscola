const socketio = require('socket.io');
const express = require('express');
const {Card, Deck, Player, Room} = require('./classes.js');
const app = express();
app.use(express.static('../Menu'));
app.use('/Game', express.static('../Game'));
app.use('/End', express.static('../End'));
app.use(express.json());
port = 80;
const server = app.listen(port, () => {
  console.log(`running on port: ${port}`);
}) 

app.post('/RoomInfo', (req, res) => {
  console.log(Number(req.body.room));
  let roomfilled = true;
  if (Number(req.body.room) !== NaN) {
    if (rooms[Number(req.body.room)].clients.length !== 2){
      roomfilled = false;
    }
    res.json({
      room : roomfilled
    });
  }
  

});


const io = socketio(server);
let rooms = [];
for (i = 0; i < 1001; i++) {
  rooms.push( new Room(i) );
}

function FindPlayer(clients, sock, you) {
  let output;

  clients.forEach((client) => {
    if (you === true) {
      if (sock.id === client.id) {
        output = client; 
      }
    } else {
      if (sock.id !== client.id) {
        output = client;
      } 
    }
  });

  return output;
}


function GameStart(sock, playerroom, username, their_username, room, client, otherclient) {

  playerroom.deck.Refill();

  io.to(room).emit('Strong_Suit', playerroom.deck.suit_init());
  let firstplayer = Math.round(Math.random());
  let secondplayer = firstplayer === 0 ? 1 : 0;
  playerroom.clients[firstplayer].sock.emit('Disable_Cards', false);
  playerroom.clients[secondplayer].sock.emit('Disable_Cards', true);
  playerroom.clients[firstplayer].sock.emit('Change_Status', 'Your Turn');
  console.log(playerroom.clients[firstplayer].username);
  playerroom.clients[secondplayer].sock.emit('Change_Status', `Wait for ${playerroom.clients[firstplayer].username} to finish`);
  playerroom.clients.forEach((client) => {

    if (client.id !== sock.id) {
      
      their_username = client.username;
      
    }

  })


  io.to(room).emit('Username', {from: sock.id, usernames: [username, their_username]})

  for(i = 0; i < 3; i++) {
    client.hand[i] = playerroom.deck.draw();
    client.sock.emit('New_Image', {image: `/Game/Cards/${client.hand[i]}`, card: `card-yours${i + 1}`});
  }
  for(i = 0; i < 3; i++) {
    otherclient.hand[i] = playerroom.deck.draw(); 
    otherclient.sock.emit('New_Image', {image: `/Game/Cards/${otherclient.hand[i]}`, card: `card-yours${i + 1}`});
  }

}
function NextHand(playerroom, room, winner) {
  
  console.log(playerroom.deck.cards.length);
  let firstplayer;
  playerroom.clients.forEach((client) => {
    if (winner === client.sock) {
      firstplayer = playerroom.clients.indexOf(client);
    }
  });
  
  let secondplayer = firstplayer === 0 ? 1 : 0;
  playerroom.deck.play_feild.forEach((cardimage) => {
    let card = playerroom.deck.find_default_image(cardimage);
    playerroom.clients[firstplayer].score += card.points;
  });
  console.log(playerroom.clients[0].hand);
  if (JSON.stringify(playerroom.clients[0].hand) == JSON.stringify(['', '', ''])) {
    io.to(room).emit('Game_Finished', { 
      firstusername: playerroom.clients[firstplayer].username, secondusername: playerroom.clients[secondplayer].username, 
    firstscore: playerroom.clients[firstplayer].score, secondscore: playerroom.clients[secondplayer].score});
  }
  console.log(`${playerroom.clients[firstplayer].username}: ${playerroom.clients[firstplayer].score}`);
  console.log(`${playerroom.clients[secondplayer].username}: ${playerroom.clients[secondplayer].score}`);
  playerroom.deck.play_feild = [];
  playerroom.clients[firstplayer].sock.emit('Disable_Cards', false);
  playerroom.clients[secondplayer].sock.emit('Disable_Cards', true);
  playerroom.clients[firstplayer].sock.emit('Change_Status', 'Your Turn');
  playerroom.clients[secondplayer].sock.emit('Change_Status', `Wait for ${playerroom.clients[firstplayer].username} to finish`);
  io.to(room).emit('Clear_Play_Feild');
  for(i = 0; i < 3; i++) {
    if (playerroom.clients[firstplayer].hand[i] === '') {
      playerroom.clients[firstplayer].hand[i] = playerroom.deck.draw();
      
    }
    let imagepng = playerroom.clients[firstplayer].hand[i] === '' ? 'Background.png' : playerroom.clients[firstplayer].hand[i];
    playerroom.clients[firstplayer].sock.emit('New_Image', {image: `/Game/Cards/${imagepng}`, card: `card-yours${i + 1}`});
  }
  for(i = 0; i < 3; i++) {
    if (playerroom.clients[secondplayer].hand[i] === '') {
      playerroom.clients[secondplayer].hand[i] = playerroom.deck.draw();
      
    }
    let imagepng = playerroom.clients[secondplayer].hand[i] === '' ? 'Background.png' : playerroom.clients[secondplayer].hand[i];
    playerroom.clients[secondplayer].sock.emit('New_Image', {image: `/Game/Cards/${imagepng}`, card: `card-yours${i + 1}`});
  }
  if (playerroom.deck.cards.length === 0) {
    io.to(room).emit('New_Image', {image: '/Game/Cards/Background.png', card: 'card-strong'});
  }
  console.log(playerroom.deck.cards.length);
}

io.on('connection', (sock) => {
  
  let username = sock.handshake.query.username;
  let room = sock.handshake.query.room;
  let playerroom = rooms[room];
  playerroom.AddClient( new Player(sock, sock.id, username, room ) );
  let client = FindPlayer( playerroom.clients, sock, true);
  let otherclient = FindPlayer(playerroom.clients, sock, false);
  let their_username;
  sock.join(room);
  if(playerroom.clients.length === 2) {
    GameStart(sock, playerroom, username, their_username, room, client, otherclient);
  }

  sock.on('Change_Card', (card) => {

    let image = playerroom.deck.draw();
    console.log(playerroom.deck.strong_card);
    if (image !== '') {io.to(room).emit('New_Image', {image: `/Game/Cards/${image}`, card: card});}
    else {io.to(room).emit('New_Image', {image: '/Game/Cards/Background.png', card: card});}

  });

  sock.on('Played_Card', (args) => {

    let index;
    playerroom.clients.forEach((client) => {
      if (client.id === sock.id) {
        index = playerroom.clients.indexOf(client);
      }
    })
    
    sock.emit('New_Image', {image: `/Game/Cards/${playerroom.clients[index].hand[args.pos - 1]}`, card: 'card-play2'});

    let notfrom;
    playerroom.clients.forEach((client) => {
      if (client.id !== sock.id) {
        notfrom = client;
      }
    })
    
    notfrom.sock.emit('New_Image', {image: `/Game/Cards/${playerroom.clients[index].hand[args.pos - 1]}`, card: 'card-play1'});

    
    sock.emit('Disable_Cards', true);
    
    sock.emit('New_Image', {image: `/Game/Cards/Background.png`,card: `card-yours${args.pos}`});
    
    if (playerroom.deck.play_feild.length === 0) {
      playerroom.deck.play_feild = [playerroom.clients[index].hand[args.pos - 1]];
      console.log(playerroom.deck.play_feild);
      playerroom.clients[index].hand[args.pos - 1] = '';
      notfrom.sock.emit('Disable_Cards', false);
      notfrom.sock.emit('Change_Status', 'Your Turn');
      sock.emit('Change_Status', `Wait for ${notfrom.username} to finish`);
    } else if (playerroom.deck.play_feild.length === 1) {
      playerroom.deck.play_feild.push(playerroom.clients[index].hand[args.pos - 1]);
      console.log(playerroom.deck.play_feild);
      playerroom.clients[index].hand[args.pos - 1] = '';
      let winner = playerroom.deck.Compare(notfrom.sock, sock, playerroom.deck.find_default_image(playerroom.deck.play_feild[0]), playerroom.deck.find_default_image(playerroom.deck.play_feild[1]));
      io.to(room).emit('Change_Status', 'Waiting');
      setTimeout( () => {NextHand(playerroom, room, winner)}, 5000);

    }




  })

  sock.on('disconnect', () => { 

    playerroom.DisconnectClient(sock.id); 
    io.to(room).emit('Reset_Feild');
    playerroom.deck.play_feild = [];
    playerroom.deck.strong_card = undefined;
    playerroom.deck.strong_suit = undefined;
  })

})
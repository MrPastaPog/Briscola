$(function() {

var randomroom = Math.floor(Math.random()*999);
let strong_card;

let button_list_disabled = [false, false, false];
const socket = io(location.host, {
  query: {
    username: JSON.parse(sessionStorage.getItem('Username')),
    room: JSON.parse(sessionStorage.getItem('Room'))
  }
})

let username = JSON.parse(sessionStorage.getItem('Username'))
console.log(socket)

$('.card').click(function() {
    console.log()
    if(this.id === 'card-yours1' || this.id === 'card-yours2' || this.id === 'card-yours3') {
      if (button_list_disabled[Number(this.id.substr(this.id.length - 1)) - 1] === false) {
        socket.emit('Played_Card', {pos: this.id.substr(this.id.length - 1), from: socket.id})
      }
    }

  
})

  button_list_disabled = [false, false, false]


socket.on('New_Image', (args) => {
  console.log(args.image)
  console.log(strong_card)

  if(args.image === `/Game/Cards/${strong_card}`) {

    $('#card-strong').attr('src', '/Game/Cards/Background.png')
  }
  $(`#${args.card}`).attr('src', args.image);

})

socket.on('Game_Finished', (args) => {
  console.log('gamefinished')
  sessionStorage.setItem('firstusername', JSON.stringify(args.firstusername));
  sessionStorage.setItem('secondusername', JSON.stringify(args.secondusername));
  sessionStorage.setItem('firstscore', JSON.stringify(args.firstscore));
  sessionStorage.setItem('secondscore', JSON.stringify(args.secondscore));
  sessionStorage.setItem('firstsocket', JSON.stringify(args.firstsocket));
  sessionStorage.setItem('secondsocket', JSON.stringify(args.secondsocket));
  location.href = location.href + '../End'
})

socket.on('Username', (args) => {
  console.log(args.usernames)
  $('#your-name').text(username);
  let index = args.from === socket.id ? 1 : 0
  $('#their-name').text(args.usernames[index]);
})



socket.on('Strong_Suit', (card) => {
  strong_card = card;
  let suit = card.substr(card.indexOf('_') + 1, card.indexOf('.') - 1 - card.indexOf('_'))
  $('#card-strong').attr('src', `/Game/Cards/${card}`)
})


socket.on('Send Disconnect Page', () => {
  location.href += '../Disconnect'
  
})
socket.on('Clear_Play_Feild', () => {
  $('#card-play1').attr('src', `/Game/Cards/Background.png`)
  $('#card-play2').attr('src', `/Game/Cards/Background.png`)
  $('#card7').attr('src', `/Game/Cards/Background.png`)
  
})


socket.on('Disable_Cards', (booleon) => {
  button_list_disabled = [booleon, booleon, booleon]
})

socket.on('Disable_Button', (index) => {
  button_list_disabled[index] = true;
})


socket.on('Change_Status', (string) => $('#status').text(string))








});



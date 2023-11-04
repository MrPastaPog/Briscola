
  


class Card{
  constructor(name, power, suit, points, image) {
    this.name = name;
    this.power = power;
    this.suit = suit;
    this.points = points;
    this.image = image;
  }
  
}


let card_pack =[ new Card('Ace of gold', 10, 'gold', 11, 'Ace_gold.png')
  ,new Card('Two of gold', 1, 'gold', 0, 'Two_gold.png')
  ,new Card('Three of gold', 9, 'gold', 10, 'Three_gold.png')
  ,new Card('Four of gold', 2, 'gold', 0, 'Four_gold.png')
  ,new Card('Five of gold', 3, 'gold', 0, 'Five_gold.png')
  ,new Card('Six of gold', 4, 'gold', 0, 'Six_gold.png')
  ,new Card('Seven of gold', 5, 'gold', 0, 'Seven_gold.png')
  ,new Card('Woman of gold', 6, 'gold', 2, 'Woman_gold.png')
  ,new Card('Horse of gold', 7, 'gold', 3, 'Horse_gold.png')
  ,new Card('King of gold', 8, 'gold', 4, 'King_gold.png')
  ,new Card('Ace of clubs', 10, 'clubs', 11, 'Ace_clubs.png')
  ,new Card('Two of clubs', 1, 'clubs', 0, 'Two_clubs.png')
  ,new Card('Three of clubs', 9, 'clubs', 10, 'Three_clubs.png')
  ,new Card('Four of clubs', 2, 'clubs', 0, 'Four_clubs.png')
  ,new Card('Five of clubs', 3, 'clubs', 0, 'Five_clubs.png')
  ,new Card('Six of clubs', 4, 'clubs', 0, 'Six_clubs.png')
  ,new Card('Seven of clubs', 5, 'clubs', 0, 'Seven_clubs.png')
  ,new Card('Woman of clubs', 6, 'clubs', 2, 'Woman_clubs.png')
  ,new Card('Horse of clubs', 7, 'clubs', 3, 'Horse_clubs.png')
  ,new Card('King of clubs', 8, 'clubs',4, 'King_clubs.png')
  ,new Card('Ace of cups', 10, 'cups', 11, 'Ace_cups.png')
  ,new Card('Two of cups', 1, 'cups', 0, 'Two_cups.png')
  ,new Card('Three of cups', 9, 'cups', 10, 'Three_cups.png')
  ,new Card('Four of cups', 2, 'cups', 0, 'Four_cups.png')
  ,new Card('Five of cups', 3, 'cups', 0, 'Five_cups.png')
  ,new Card('Six of cups', 4, 'cups', 0, 'Six_cups.png')
  ,new Card('Seven of cups', 5, 'cups', 0, 'Seven_cups.png')
  ,new Card('Woman of cups', 6, 'cups', 2, 'Woman_cups.png')
  ,new Card('Horse of cups', 7, 'cups', 3, 'Horse_cups.png')
  ,new Card('King of cups', 8, 'cups', 4, 'King_cups.png')
  ,new Card('Ace of swords', 10, 'swords', 11, 'Ace_swords.png')
  ,new Card('Two of swords', 1, 'swords', 0, 'Two_swords.png')
  ,new Card('Three of swords', 9, 'swords', 10, 'Three_swords.png')
  ,new Card('Four of swords', 2, 'swords', 0, 'Four_swords.png')
  ,new Card('Five of swords', 3, 'swords', 0, 'Five_swords.png')
  ,new Card('Six of swords', 4, 'swords', 0, 'Six_swords.png')
  ,new Card('Seven of swords', 5, 'swords', 0, 'Seven_swords.png')
  ,new Card('Woman of swords', 6, 'swords', 2, 'Woman_swords.png')
  ,new Card('Horse of swords', 7, 'swords', 3, 'Horse_swords.png')
  ,new Card('King of swords', 8, 'swords', 4, 'King_swords.png')
  ];


class Player {
  constructor(sock, id, username, room) {
    this.id = id;
    this.sock = sock;
    this.username = username;
    this.room = room;
    this.hand = [ , , ];
    this.score = 0;
  }
}
/**
 * @param {string} room Input id of room.
 * @function AddClient function
 */
class Room {
  constructor(room) {
    this.room = room;
    this.clients = [];
    this.deck = new Deck(this.room);

  }

  AddClient(Player) {
    this.clients.push(Player);
  }

  DisconnectClient(Playerid) {
    this.clients.forEach((client) => {
      if (client.id === Playerid) {
        this.clients.splice(this.clients.indexOf(client), 1);
      }
    })
    
  }
}

class Deck{
  constructor(room) {
    this.room = room;
    this.play_feild = [];
    this.strong_card = undefined;
    this.strong_suit = undefined;
    this.cards = structuredClone(card_pack)
  }
  /**
  
 * @returns {string} Returns the image name.
 */
  draw() {
    if (this.strong_card === undefined && this.cards.length === 0) {
      return ''
    } else if (this.cards.length === 0 ) { 
      let cardc = this.strong_card;
      this.strong_card = undefined;
      return cardc
    } else if (this.cards.length > 0) {
      var randomcard = Math.floor(Math.random()*this.cards.length);
      let card = this.cards[randomcard];
      this.cards.splice(this.cards.indexOf(card), 1);
    
      return card.image;
    }
    
  }
  /**
 * @param {string} val Input name or index of card.
 * @returns {string} Returns the card class.
 */
  find(val) {
    cards.forEach((card) => {
      if (card.name === val) {
        return card;
      }
    })
  }
  find_default_image(val) {
    let cardclass;
    card_pack.forEach((card) => {
      if (card.image === val) {
        cardclass = card;
      }
    })
    return cardclass;
  }
  find_default(val) {
    card_pack.forEach((card) => {
      if (card.name === val) {
        return card;
      }
    })
  }

  Refill() {
    this.cards = structuredClone(card_pack)
  }

  suit_init() {
    
    let card = this.draw();
    console.log(`Please: ${card}`)
    this.strong_card = card;
    this.strong_suit = this.strong_card.substr(card.indexOf('_') + 1, card.indexOf('.') - 1 - card.indexOf('_'))
    return card;
  }

  Compare(sock1, sock2, card1, card2) {
  
    if (card1.suit === card2.suit) { // if its the same suit
      if (card1.power > card2.power) {  // if card1 has the higher number
        return sock1
      } else if (card2.power > card1.power) { // if card2 has the higher number
        return sock2
      }
    } else if (card1.suit === this.strong_suit && card2.suit !== this.strong_suit) {  //card1 has strong suit
      return sock1
    } else if (card2.suit === this.strong_suit && card1.suit !== this.strong_suit) {  //card2 has strong suit
      return sock2
    } else if (card1.suit !== card2.suit) { //card2 suit doesent match
      return sock1
    } 

  }
}

//Git worked


module.exports = {Card, Deck, Player, Room};

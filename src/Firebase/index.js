import firebase from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseUrl: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyDYsGreUx-uAHV5sDv6YhiuSEd3k95WkDE',
//   authDomain: 'fsparty-d0c16.firebaseapp.com',
//   databaseUrl: 'https://fsparty-d0c16-default-rtdb.firebaseio.com/',
//   projectId: 'fsparty-d0c16',
//   storageBucket: 'fsparty-d0c16.appspot.com',
//   messagingSenderId: '746505029214',
//   appId: '1:746505029214:web:d7758bf54cf255865596cf',
//   measurementId: 'G-JEVNY56SEG',
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

//  ----------------- Racing game functions ----------------
export const racingGamePlayers = database.ref('1/racingGame/players');

export const getRacingGamePlayers = (gameId, spawned, cb) => {
  const players = database.ref(`${gameId}/racingGame/players`);
  players.on('value', (snapshot) => {
    const list = snapshot.val();
    if (!spawned) {
      cb(list);
      spawned = true;
    }
  });
};

export const updateRacingGamePlayers = (gameId, playerId, cb) => {
  const players = database.ref(`${gameId}/racingGame/players`);
  players.on('child_changed', (snapshot) => {
    const player = snapshot.val();
    if (player.playerId !== playerId) {
      cb(player);
    }
  });
};

export const finishRacingGame = (gameId) => {
  const game = database.ref(`${gameId}/racingGame`);
  game.update({ completed: true });
};

export const addPoints = (gameId, playerId, newPoints) => {
  const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const score = snapshot.val().score;
    const newScore = score + newPoints;
    player.update({ score: newScore });
  });
};

export const platformPlayers = database.ref('1/platformGame/players');

export const serverCoins = database.ref('1/platformGame/coins');

// set up listener for changes to 'users' scope of database
// users.on('value', (snapshot) => {
//   userData.push(snapshot.val());
//   //console.log(userData);
// });

//get tailored firebase ref
const getRef = (gameId, playerId) => {
  if (playerId) {
    return `${gameId}/main/players/${playerId}`;
  } else {
    return `${gameId}/main`;
  }
};
//get players array in a game instance
export function getPlayersfromGame(gameId, cb) {
  const ref = getRef(gameId);
  let players = firebase.database().ref(ref + '/players');
  console.log(players);
  players.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'playerList');
  });
  // return players.off
  return firebase.database().ref(ref).off;
}
//get turn in a game instance
export function getTurn(gameId, cb) {
  let turn = firebase.database().ref(`${gameId}/main/turn`);
  turn.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'turn');
  });
}
//get round in a game instance
export function getRound(gameId, cb) {
  let turn = firebase.database().ref(`${gameId}/main/round`);
  turn.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'round');
  });
}
//increment turn
export function updateTurn(gameId, restartTurns) {
  let turnUpdate = {};
  if (restartTurns === true) turnUpdate[`${gameId}/main/turn`] = 0;
  else {
    getTurn(gameId, (data) => {
      turnUpdate[`${gameId}/main/turn`] = data + 1;
    });
  }
  return firebase.database().ref().update(turnUpdate);
}

//increment round
export function updateRound(gameId) {
  let roundUpdate = {};
  getRound(gameId, (data) => {
    roundUpdate[`${gameId}/main/round`] = data + 1;
  });
  return firebase.database().ref().update(roundUpdate);
}
//get user position
export function getPos(gameId, playerId, cb) {
  let ref = getRef(gameId, playerId);
  let pos = firebase.database().ref(ref + `/position`);
  pos.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data, 'pos');
  });
  return pos.off();
}
//increment position by newPos
export function updatePos(gameId, playerId, diceRoll, cb) {
const player = database.ref(`${gameId}/main/players/${playerId}`);
  player.once('value').then((snapshot) => {
    const position = snapshot.val().position;
    let newPosition = position + diceRoll;
    if (newPosition > 43) newPosition = newPosition - 44;
    player.update({ position: newPosition });
})
  // let updates = {};
  // getPos(gameId, playerId, function (data) {
  //   console.log(data)
  //   updates[`${gameId}/main/players/${playerId}/position`] = data + diceRoll;
  //   return firebase.database().ref().update(updates);
  // });
}
//get shootingGame players
export function getShootingPlayers(gameId, cb) {
  let playerList = firebase.database().ref(`${gameId}/shootingGame/players`);
  playerList.on('value', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  })

}
//get other reticle positions (for shooting game)
export function getOtherReticles(gameId, cb) {
  let playerList = firebase.database().ref(`${gameId}/shootingGame/players`);
  playerList.on('child_changed', (snapshot) => {
    const data = snapshot.val();
    cb(data);
  })
}
//update reticle position
export function updateReticlePos(gameId, playerId, data) {
  let updates = {};
  updates[`${gameId}/shootingGame/players/${playerId}`] = data;
  return firebase.database().ref().update(updates);
}

export function updateScore(gameId, playerId, newScore) {
  let updates ={};
  updates[`${gameId}/main/players/${playerId}/score`] = newScore

  return firebase.database().ref().update(updates);
}



const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════
// LOCATIONS DATABASE (loaded from JSON + landmarks)
// ═══════════════════════════════════════════════════
const locationsJson = require('./locations.json');

// Landmarks (hrady, zámky, kláštery, památky)
const LANDMARKS = [
  {n:"Karlštejn",la:49.9394,lo:14.1883,h:180},
  {n:"Křivoklát",la:50.0375,lo:13.8714,h:90},
  {n:"Trosky",la:50.5164,lo:15.2300,h:270},
  {n:"Loket – hrad",la:50.1853,lo:12.7547,h:180},
  {n:"Buchlov",la:49.0789,lo:17.3189,h:140},
  {n:"Bouzov",la:49.7100,lo:16.8906,h:180},
  {n:"Pernštejn",la:49.4506,lo:16.3172,h:90},
  {n:"Zvíkov",la:49.4631,lo:14.1917,h:0},
  {n:"Helfštýn",la:49.5353,lo:17.6394,h:220},
  {n:"Kokořín",la:50.4358,lo:14.5775,h:0},
  {n:"Lipnice nad Sázavou",la:49.6447,lo:15.4083,h:180},
  {n:"Hukvaldy",la:49.6553,lo:18.2008,h:225},
  {n:"Orlík nad Vltavou",la:49.5117,lo:14.1667,h:180},
  {n:"Bítov",la:48.9525,lo:15.7197,h:90},
  {n:"Český Šternberk",la:49.8078,lo:14.9269,h:270},
  {n:"Kost",la:50.4972,lo:15.1869,h:270},
  {n:"Bezděz",la:50.5317,lo:14.7108,h:200},
  {n:"Landštejn",la:49.0414,lo:15.2836,h:90},
  {n:"Hluboká nad Vltavou – zámek",la:49.0522,lo:14.4414,h:180},
  {n:"Lednice – zámek",la:48.8000,lo:16.8025,h:90},
  {n:"Konopiště",la:49.7806,lo:14.6536,h:0},
  {n:"Červená Lhota",la:49.1931,lo:14.8817,h:0},
  {n:"Litomyšl – zámek",la:49.8694,lo:16.3147,h:270},
  {n:"Kroměříž – zámek",la:49.2997,lo:17.3922,h:180},
  {n:"Telč – zámek",la:49.1836,lo:15.4508,h:90},
  {n:"Vranov nad Dyjí",la:48.8864,lo:15.8189,h:180},
  {n:"Jaroměřice nad Rokytnou",la:49.0953,lo:15.8914,h:270},
  {n:"Valtice – zámek",la:48.7394,lo:16.7567,h:270},
  {n:"Rožmberk nad Vltavou",la:48.6583,lo:14.3644,h:315},
  {n:"Kratochvíle",la:49.1100,lo:14.0264,h:180},
  {n:"Nelahozeves",la:50.2639,lo:14.3069,h:0},
  {n:"Frýdlant – zámek",la:50.9208,lo:15.0817,h:90},
  {n:"Sychrov",la:50.6458,lo:15.1300,h:0},
  {n:"Opočno – zámek",la:50.2664,lo:16.1181,h:270},
  {n:"Náchod – zámek",la:50.4153,lo:16.1656,h:180},
  {n:"Děčín – zámek",la:50.7772,lo:14.2153,h:180},
  {n:"Sedlec – kostnice",la:49.9608,lo:15.2819,h:90},
  {n:"Loreta Praha",la:50.0883,lo:14.3906,h:90},
  {n:"Strahov – klášter",la:50.0842,lo:14.3844,h:180},
  {n:"Plasy – klášter",la:49.9342,lo:13.3967,h:270},
  {n:"Kladruby – klášter",la:49.6678,lo:12.9861,h:180},
  {n:"Zlatá Koruna – klášter",la:48.8594,lo:14.3706,h:270},
  {n:"Broumov – klášter",la:50.5864,lo:16.3350,h:90},
  {n:"Chrám sv. Barbory – Kutná Hora",la:49.9467,lo:15.2628,h:180},
  {n:"Zelená Hora – Žďár",la:49.5761,lo:15.9306,h:180},
  {n:"Karlův most – Praha",la:50.0865,lo:14.4114,h:270},
  {n:"Vyšehrad",la:50.0647,lo:14.4181,h:0},
  {n:"Petřín – rozhledna",la:50.0817,lo:14.3956,h:90},
  {n:"Ještěd",la:50.7264,lo:14.9947,h:180},
  {n:"Žižkovská věž",la:50.0797,lo:14.4511,h:0},
  {n:"Kuks – hospitál",la:50.3939,lo:15.8889,h:180},
  {n:"Špilberk – Brno",la:49.1944,lo:16.5989,h:0},
  {n:"Holašovice",la:48.9603,lo:14.3031,h:90},
  {n:"Chrám sv. Víta – Praha",la:50.0908,lo:14.4000,h:180},
  {n:"Buchlovice",la:49.0853,lo:17.3469,h:90},
  {n:"Jindřichův Hradec – zámek",la:49.1436,lo:15.0028,h:270},
  {n:"Hradec nad Moravicí",la:49.8611,lo:17.8678,h:270},
  {n:"Ploskovice",la:50.5328,lo:14.2078,h:90},
  {n:"Kačina",la:49.9406,lo:15.3511,h:0},
  {n:"Mělník – zámek",la:50.3508,lo:14.4744,h:180},
].map((l, i) => ({ id: 2000 + i, ...l, cat: 'landmark' }));

// Merge: locations from OSM + landmarks
const LOCS = [
  ...locationsJson,
  ...LANDMARKS,
];
console.log(`Loaded ${LOCS.length} total locations (${locationsJson.length} towns/villages + ${LANDMARKS.length} landmarks)`);

/* DELETED: 300+ inline locations – replaced by locations.json */
// GAME ROOMS
// ═══════════════════════════════════════════════════
const rooms = new Map(); // roomCode -> Room

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:5}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function haversine(a,b,c,d) {
  const R=6371, dL=(c-a)*Math.PI/180, dN=(d-b)*Math.PI/180;
  const x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function calcScore(dist, tol) {
  return Math.max(0, Math.round(5000 * Math.exp(-dist / (tol * 1.8))));
}

function createRoom(settings) {
  const code = genCode();
  const locs = shuffle(LOCS.filter(l => settings.cats.includes(l.cat)))
    .slice(0, Math.min(settings.rounds, 60));

  const room = {
    code,
    settings,
    locs,
    round: 0,
    phase: 'lobby',   // lobby | playing | roundResult | finished
    players: new Map(), // socketId -> { name, score, guesses: [] }
    guesses: new Map(), // socketId -> { lat, lng } for current round
    timerHandle: null,
    createdAt: Date.now()
  };
  rooms.set(code, room);
  return room;
}

function getRoomSafeState(room) {
  const players = [...room.players.values()].map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    ready: p.ready || false,
    guessedThisRound: room.guesses.has(p.id)
  }));
  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    totalRounds: room.locs.length,
    settings: room.settings,
    players,
    // Only send location AFTER round ends (prevent cheating)
    currentLoc: room.phase === 'roundResult' || room.phase === 'finished'
      ? room.locs[room.round] : null,
    currentLocCat: room.locs[room.round]?.cat,
    waitingFor: room.locs.length > 0
      ? [...room.players.keys()].filter(id => !room.guesses.has(id)).length
      : 0
  };
}

function startRoundTimer(room) {
  if (room.settings.timerSec <= 0) return;
  if (room.timerHandle) clearTimeout(room.timerHandle);
  room.timerHandle = setTimeout(() => {
    // Auto-submit missing guesses (center of CZ)
    room.players.forEach((_, sid) => {
      if (!room.guesses.has(sid)) {
        room.guesses.set(sid, { lat: 49.75, lng: 15.6, autoSubmit: true });
      }
    });
    resolveRound(room);
  }, room.settings.timerSec * 1000);
}

function resolveRound(room) {
  if (room.timerHandle) { clearTimeout(room.timerHandle); room.timerHandle = null; }
  const loc = room.locs[room.round];
  const results = [];

  room.players.forEach((player, sid) => {
    const guess = room.guesses.get(sid) || { lat: 49.75, lng: 15.6, autoSubmit: true };
    const dist = haversine(guess.lat, guess.lng, loc.la, loc.lo);
    const score = calcScore(dist, room.settings.tol);
    player.score += score;
    player.guesses.push({ round: room.round, dist, score, lat: guess.lat, lng: guess.lng });
    results.push({ id: sid, name: player.name, dist, score, totalScore: player.score, lat: guess.lat, lng: guess.lng, autoSubmit: guess.autoSubmit || false });
  });

  // Sort by score desc
  results.sort((a, b) => b.score - a.score);
  room.phase = 'roundResult';
  room.guesses.clear();

  io.to(room.code).emit('roundResult', {
    loc,
    results,
    round: room.round,
    totalRounds: room.locs.length,
    isLast: room.round >= room.locs.length - 1
  });

  // Auto-advance after 10s (multiplayer only — solo waits for player click)
  if (!room.settings.solo) {
    room.autoAdvance = setTimeout(() => {
      if (room.phase === 'roundResult') advanceRound(room);
    }, 10000);
  }
}

function advanceRound(room) {
  if (room.autoAdvance) { clearTimeout(room.autoAdvance); room.autoAdvance = null; }
  if (room.round >= room.locs.length - 1) {
    finishGame(room);
    return;
  }
  room.round++;
  room.phase = 'playing';
  room.guesses.clear();
  const loc = room.locs[room.round];
  io.to(room.code).emit('newRound', {
    round: room.round,
    totalRounds: room.locs.length,
    locCat: loc.cat,
    locHeading: loc.h,
    locLat: loc.la,
    locLng: loc.lo,
    timerSec: room.settings.timerSec
  });
  startRoundTimer(room);
}

function finishGame(room) {
  room.phase = 'finished';
  const finalScores = [...room.players.values()]
    .map(p => ({ id: p.id, name: p.name, score: p.score, guesses: p.guesses }))
    .sort((a, b) => b.score - a.score);
  io.to(room.code).emit('gameFinished', { finalScores, locs: room.locs });
}

// ═══════════════════════════════════════════════════
// SOCKET.IO EVENTS
// ═══════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log(`[+] ${socket.id} connected`);

  // Create room
  socket.on('createRoom', ({ name, settings }) => {
    const room = createRoom(settings);
    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;

    if (settings.solo) {
      // Solo mode: auto-start immediately, skip waiting room
      room.phase = 'playing';
      player.ready = true;
      const loc = room.locs[0];
      socket.emit('soloStart', {
        round: 0,
        totalRounds: room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec
      });
      startRoundTimer(room);
      console.log(`[SOLO] ${room.code} started by ${name}`);
    } else {
      socket.emit('roomCreated', { code: room.code, state: getRoomSafeState(room) });
      console.log(`[ROOM] ${room.code} created by ${name}`);
    }
  });

  // Join room
  socket.on('joinRoom', ({ code, name }) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) { socket.emit('error', { msg: 'Místnost nenalezena.' }); return; }
    if (room.phase !== 'lobby') { socket.emit('error', { msg: 'Hra již probíhá.' }); return; }
    if (room.players.size >= 8) { socket.emit('error', { msg: 'Místnost je plná (max 8).' }); return; }

    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;
    socket.emit('roomJoined', { code: room.code, state: getRoomSafeState(room) });
    socket.to(room.code).emit('playerJoined', { name, state: getRoomSafeState(room) });
    console.log(`[JOIN] ${name} joined ${room.code}`);
  });

  // Player ready (start game vote)
  socket.on('setReady', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'lobby') return;
    const player = room.players.get(socket.id);
    if (!player) return;
    player.ready = true;
    io.to(room.code).emit('playerReady', { name: player.name, state: getRoomSafeState(room) });

    // Start if all ready and at least 1 player
    const allReady = [...room.players.values()].every(p => p.ready);
    if (allReady && room.players.size >= 1) {
      room.phase = 'playing';
      const loc = room.locs[0];
      io.to(room.code).emit('gameStarted', {
        round: 0,
        totalRounds: room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec
      });
      startRoundTimer(room);
    }
  });

  // Submit guess
  socket.on('submitGuess', ({ lat, lng }) => {
    const room = rooms.get(socket.data.roomCode);
    console.log(`[GUESS] ${socket.id} submitted guess, room=${socket.data.roomCode}, phase=${room?.phase}, guesses=${room?.guesses.size}/${room?.players.size}`);
    if (!room || room.phase !== 'playing') return;
    if (room.guesses.has(socket.id)) return; // already guessed

    room.guesses.set(socket.id, { lat, lng });
    const player = room.players.get(socket.id);
    // Notify others that this player guessed (not the coords)
    io.to(room.code).emit('playerGuessed', {
      name: player?.name,
      waitingFor: [...room.players.keys()].filter(id => !room.guesses.has(id)).length
    });

    // All players guessed → resolve immediately
    console.log(`[GUESS] After set: guesses=${room.guesses.size}/${room.players.size}`);
    if (room.guesses.size >= room.players.size) {
      console.log(`[RESOLVE] All guessed, resolving round ${room.round}`);
      resolveRound(room);
    }
  });

  // Next round (after seeing result)
  socket.on('nextRound', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'roundResult') return;
    const player = room.players.get(socket.id);
    if (player) player.readyNext = true;

    // Solo: advance immediately
    if (room.settings.solo) {
      room.players.forEach(p => p.readyNext = false);
      advanceRound(room);
      return;
    }

    const allNext = [...room.players.values()].every(p => p.readyNext);
    if (allNext) {
      room.players.forEach(p => p.readyNext = false);
      advanceRound(room);
    }
  });

  // Chat message
  socket.on('chat', ({ msg }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    const name = socket.data.name || '?';
    io.to(room.code).emit('chat', { name, msg: msg.substring(0, 120) });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    const player = room.players.get(socket.id);
    room.players.delete(socket.id);
    if (player) {
      io.to(room.code).emit('playerLeft', { name: player.name, state: getRoomSafeState(room) });
    }
    if (room.players.size === 0) {
      if (room.timerHandle) clearTimeout(room.timerHandle);
      if (room.autoAdvance) clearTimeout(room.autoAdvance);
      rooms.delete(room.code);
      console.log(`[ROOM] ${room.code} deleted (empty)`);
    }
    console.log(`[-] ${socket.id} (${player?.name}) disconnected`);
  });
});

// Cleanup old rooms every hour
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, code) => {
    if (now - room.createdAt > 3600000) {
      rooms.delete(code);
    }
  });
}, 3600000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ČeskýGeo server running on port ${PORT}`);
});

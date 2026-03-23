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
// LOCATIONS DATABASE
// ═══════════════════════════════════════════════════
const LOCS = [
  {id:1, n:"Praha – Staré Město",        la:50.0873,lo:14.4208,h:180,cat:"city"},
  {id:2, n:"Praha – Žižkov",             la:50.0875,lo:14.4611,h:90, cat:"city"},
  {id:3, n:"Praha – Vinohrady",          la:50.0750,lo:14.4400,h:270,cat:"city"},
  {id:4, n:"Brno – centrum",             la:49.1953,lo:16.6078,h:45, cat:"city"},
  {id:5, n:"Ostrava – centrum",          la:49.8347,lo:18.2820,h:270,cat:"city"},
  {id:6, n:"Plzeň – nám. Republiky",    la:49.7475,lo:13.3776,h:0,  cat:"city"},
  {id:7, n:"Liberec – centrum",          la:50.7697,lo:15.0581,h:180,cat:"city"},
  {id:8, n:"Olomouc – Horní náměstí",  la:49.5955,lo:17.2519,h:90, cat:"city"},
  {id:9, n:"České Budějovice",          la:48.9747,lo:14.4747,h:0,  cat:"city"},
  {id:10,n:"Hradec Králové",             la:50.2092,lo:15.8328,h:270,cat:"city"},
  {id:11,n:"Pardubice",                  la:50.0375,lo:15.7808,h:180,cat:"city"},
  {id:12,n:"Karlovy Vary – kolonáda",  la:50.2292,lo:12.8739,h:0,  cat:"city"},
  {id:13,n:"Zlín – centrum",             la:49.2270,lo:17.6677,h:180,cat:"city"},
  {id:14,n:"Jihlava",                    la:49.3961,lo:15.5913,h:90, cat:"city"},
  {id:15,n:"Kutná Hora",                 la:49.9483,lo:15.2681,h:90, cat:"town"},
  {id:16,n:"Český Krumlov",              la:48.8128,lo:14.3175,h:0,  cat:"town"},
  {id:17,n:"Tábor",                      la:49.4147,lo:14.6622,h:180,cat:"town"},
  {id:18,n:"Třebíč",                     la:49.2147,lo:15.8794,h:0,  cat:"town"},
  {id:19,n:"Kroměříž",                   la:49.2967,lo:17.3942,h:90, cat:"town"},
  {id:20,n:"Písek",                      la:49.3093,lo:14.1469,h:270,cat:"town"},
  {id:21,n:"Cheb",                       la:50.0794,lo:12.3744,h:90, cat:"town"},
  {id:22,n:"Klatovy",                    la:49.3955,lo:13.2959,h:0,  cat:"town"},
  {id:23,n:"Náchod",                     la:50.4163,lo:16.1639,h:180,cat:"town"},
  {id:24,n:"Šumperk",                    la:49.9678,lo:16.9717,h:90, cat:"town"},
  {id:25,n:"Telč",                       la:49.1833,lo:15.4500,h:180,cat:"town"},
  {id:26,n:"Litomyšl",                   la:49.8680,lo:16.3133,h:0,  cat:"town"},
  {id:27,n:"Domažlice",                  la:49.4397,lo:12.9280,h:270,cat:"town"},
  {id:28,n:"Trutnov",                    la:50.5606,lo:15.9136,h:90, cat:"town"},
  {id:29,n:"Jičín",                      la:50.4356,lo:15.3606,h:0,  cat:"town"},
  {id:30,n:"Mikulov",                    la:48.8064,lo:16.6381,h:0,  cat:"town"},
  {id:31,n:"Znojmo",                     la:48.8553,lo:16.0486,h:180,cat:"town"},
  {id:32,n:"Mariánské Lázně",            la:49.9650,lo:12.7011,h:90, cat:"town"},
  {id:33,n:"Opava",                      la:49.9383,lo:17.9086,h:270,cat:"town"},
  {id:34,n:"Uherské Hradiště",           la:49.0706,lo:17.4594,h:0,  cat:"town"},
  {id:35,n:"Rožnov pod Radhoštěm",      la:49.4581,lo:18.1436,h:270,cat:"town"},
  {id:36,n:"Prostějov",                  la:49.4717,lo:17.1075,h:90, cat:"town"},
  {id:37,n:"Žďár nad Sázavou",           la:49.5628,lo:15.9389,h:0,  cat:"town"},
  {id:38,n:"Pelhřimov",                  la:49.4314,lo:15.2233,h:90, cat:"town"},
  {id:39,n:"Mělník",                     la:50.3508,lo:14.4761,h:270,cat:"town"},
  {id:40,n:"Litoměřice",                 la:50.5358,lo:14.1306,h:180,cat:"town"},
  {id:41,n:"Hluboká nad Vltavou",        la:49.0538,lo:14.4361,h:0,  cat:"village"},
  {id:42,n:"Lednice",                    la:48.7986,lo:16.8033,h:270,cat:"village"},
  {id:43,n:"Loket",                      la:50.1853,lo:12.7547,h:180,cat:"village"},
  {id:44,n:"Holašovice",                 la:48.9603,lo:14.3031,h:90, cat:"village"},
  {id:45,n:"Slavonice",                  la:49.0000,lo:15.3500,h:0,  cat:"village"},
  {id:46,n:"Valtice",                    la:48.7394,lo:16.7567,h:270,cat:"village"},
  {id:47,n:"Třeboň",                     la:49.0053,lo:14.7742,h:90, cat:"village"},
  {id:48,n:"Slavkov u Brna",             la:49.1533,lo:16.8794,h:0,  cat:"village"},
  {id:49,n:"Šumava – Modrava",           la:49.0231,lo:13.4878,h:0,  cat:"nature"},
  {id:50,n:"Krkonoše – Špindlerův Mlýn",la:50.7278,lo:15.6053,h:90, cat:"nature"},
  {id:51,n:"Jeseníky – Karlova Studánka",la:50.0744,lo:17.2325,h:180,cat:"nature"},
  {id:52,n:"Beskydy – Pustevny",         la:49.5258,lo:18.3897,h:270,cat:"nature"},
  {id:53,n:"Český ráj – Hrubá Skála",  la:50.5233,lo:15.1764,h:90, cat:"nature"},
  {id:54,n:"Moravský kras",             la:49.3644,lo:16.6469,h:180,cat:"nature"},
  {id:55,n:"Harrachov",                 la:50.7739,lo:15.4222,h:90, cat:"nature"},
  {id:56,n:"Třinec",                    la:49.6764,lo:18.6692,h:90, cat:"town"},
  {id:57,n:"Kopřivnice",                la:49.5983,lo:18.1461,h:0,  cat:"town"},
  {id:58,n:"Nové Město na Moravě",      la:49.5603,lo:16.0764,h:180,cat:"town"},
  {id:59,n:"Jeseník",                   la:50.2267,lo:17.2044,h:270,cat:"town"},
  {id:60,n:"Prachatice",                la:49.0139,lo:13.9981,h:180,cat:"town"},
];

// ═══════════════════════════════════════════════════
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
    if (room.guesses.size >= room.players.size) {
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

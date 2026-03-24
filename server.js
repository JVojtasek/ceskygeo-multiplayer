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
const GEO_TOURS = require('./geo-tours.json');

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
// ═══════════════════════════════════════════════════
// SEEDED RANDOM (LCG) for Daily Challenge
// ═══════════════════════════════════════════════════
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0x100000000;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTodaySeed() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// ═══════════════════════════════════════════════════
// REGIONS (for filtering locations by Czech region)
// ═══════════════════════════════════════════════════
const CZ_REGIONS = [
  {name:'Praha',la:50.08,lo:14.42,r:0.15},
  {name:'Středočeský',la:49.95,lo:14.55,r:0.65},
  {name:'Jihočeský',la:49.05,lo:14.25,r:0.55},
  {name:'Plzeňský',la:49.55,lo:13.30,r:0.55},
  {name:'Karlovarský',la:50.20,lo:12.75,r:0.40},
  {name:'Ústecký',la:50.55,lo:13.90,r:0.50},
  {name:'Liberecký',la:50.73,lo:15.05,r:0.35},
  {name:'Královéhradecký',la:50.35,lo:15.85,r:0.50},
  {name:'Pardubický',la:49.95,lo:16.10,r:0.45},
  {name:'Vysočina',la:49.40,lo:15.60,r:0.50},
  {name:'Jihomoravský',la:49.00,lo:16.60,r:0.55},
  {name:'Olomoucký',la:49.80,lo:17.10,r:0.50},
  {name:'Zlínský',la:49.20,lo:17.70,r:0.40},
  {name:'Moravskoslezský',la:49.80,lo:18.25,r:0.45},
];
function getRegion(la, lo) {
  let best = null, bestDist = Infinity;
  for (const reg of CZ_REGIONS) {
    const d = Math.sqrt((la - reg.la) ** 2 + (lo - reg.lo) ** 2);
    if (d < reg.r && d < bestDist) { best = reg.name; bestDist = d; }
  }
  return best || 'Česko';
}

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
  const gameMode = settings.gameMode || 'classic';
  let filteredLocs = LOCS.filter(l => settings.cats.includes(l.cat));
  if (settings.region) {
    filteredLocs = filteredLocs.filter(l => getRegion(l.la, l.lo) === settings.region);
  }
  let locs;

  if (gameMode === 'daily') {
    // Deterministic locations based on today's date
    const seedStr = getTodaySeed();
    const seedNum = parseInt(seedStr, 10);
    const rng = seededRandom(seedNum);
    locs = seededShuffle(filteredLocs, rng).slice(0, 5);
  } else if (gameMode === 'streak') {
    // Streak: start with 30 random locations, generate more when needed
    locs = shuffle(filteredLocs).slice(0, 30);
  } else if (gameMode === 'duel') {
    // Duel: best of 5 rounds
    locs = shuffle(filteredLocs).slice(0, 5);
  } else if (gameMode === 'reveal') {
    // Progressive Reveal: same location selection as classic
    locs = shuffle(filteredLocs).slice(0, Math.min(settings.rounds || 5, 60));
  } else if (gameMode === 'speed') {
    // Speed Round: 10 rounds, 15 seconds, all categories
    const speedLocs = LOCS.filter(l => settings.cats.includes(l.cat));
    locs = shuffle(speedLocs).slice(0, 10);
  } else if (gameMode === 'geoword') {
    // GeoWord: filter to only cities and towns (not villages - too obscure)
    const wordLocs = LOCS.filter(l => l.cat === 'city' || l.cat === 'town');
    locs = shuffle(wordLocs).slice(0, Math.min(settings.rounds || 5, 60));
  } else if (gameMode === 'geotour') {
    // GeoTour: use stops from the selected tour
    const tour = GEO_TOURS.find(t => t.id === settings.tourId);
    if (tour) {
      locs = tour.stops.map((s, i) => ({
        id: 5000 + i, n: s.city, la: s.la, lo: s.lo, h: s.h, cat: 'tour',
        fact: s.fact, quiz: s.quiz, stopIndex: i
      }));
    } else {
      locs = shuffle(filteredLocs).slice(0, 5);
    }
  } else {
    // Classic + battleRoyale: use settings.rounds
    locs = shuffle(filteredLocs).slice(0, Math.min(settings.rounds, 60));
  }

  const room = {
    code,
    settings,
    gameMode,
    locs,
    round: 0,
    phase: 'lobby',   // lobby | playing | roundResult | finished
    players: new Map(), // socketId -> { name, score, guesses: [] }
    guesses: new Map(), // socketId -> { lat, lng } for current round
    timerHandle: null,
    createdAt: Date.now(),
    // New game mode fields
    eliminated: [],       // for battleRoyale: array of socketIds
    duelScore: {},        // for duel: { <socketId>: wins }
    streakCount: 0,       // for streak
    tour: null,           // for geotour: the tour object
  };
  // Speed mode: force 10 rounds, 15s timer
  if (gameMode === 'speed') {
    room.settings.rounds = 10;
    room.settings.timerSec = 15;
  }
  // Store tour reference for geotour mode
  if (gameMode === 'geotour') {
    const tour = GEO_TOURS.find(t => t.id === settings.tourId);
    if (tour) room.tour = tour;
  }
  rooms.set(code, room);
  return room;
}

function getActivePlayers(room) {
  // For battle royale, return only non-eliminated players
  if (room.gameMode === 'battleRoyale') {
    const active = new Map();
    room.players.forEach((player, sid) => {
      if (!room.eliminated.includes(sid)) {
        active.set(sid, player);
      }
    });
    return active;
  }
  return room.players;
}

function getRoomSafeState(room) {
  const players = [...room.players.values()].map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    ready: p.ready || false,
    guessedThisRound: room.guesses.has(p.id),
    eliminated: room.eliminated.includes(p.id)
  }));
  const activePlayers = getActivePlayers(room);
  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    totalRounds: room.gameMode === 'streak' ? null : room.locs.length,
    settings: room.settings,
    gameMode: room.gameMode,
    players,
    eliminated: room.eliminated.map(sid => {
      const p = room.players.get(sid);
      return p ? p.name : sid;
    }),
    duelScore: room.duelScore,
    streakCount: room.streakCount,
    // Only send location AFTER round ends (prevent cheating)
    currentLoc: room.phase === 'roundResult' || room.phase === 'finished'
      ? room.locs[room.round] : null,
    currentLocCat: room.locs[room.round]?.cat,
    waitingFor: room.locs.length > 0
      ? [...activePlayers.keys()].filter(id => !room.guesses.has(id)).length
      : 0
  };
}

function startRoundTimer(room) {
  room.roundStartTime = Date.now();

  // Progressive Reveal: set up hint interval
  if (room.gameMode === 'reveal') {
    room.revealStep = 0;
    if (room.revealInterval) { clearInterval(room.revealInterval); room.revealInterval = null; }
    room.revealInterval = setInterval(() => {
      room.revealStep++;
      const loc = room.locs[room.round];
      let hintData = {};

      switch(room.revealStep) {
        case 1: hintData = { type: 'category', value: loc.cat }; break;
        case 2: hintData = { type: 'region', value: getRegion(loc.la, loc.lo) }; break;
        case 3: hintData = { type: 'zoom', lat: loc.la, lng: loc.lo }; break;
        case 4: hintData = { type: 'letter', value: loc.n[0] }; break;
        case 5: hintData = { type: 'population', value: loc.cat === 'city' ? '50 000+' : loc.cat === 'town' ? '5 000 – 50 000' : '< 5 000' }; break;
        case 6: hintData = { type: 'streetview', lat: loc.la, lng: loc.lo, h: loc.h }; break;
        case 7:
          hintData = { type: 'answer', value: loc.n };
          clearInterval(room.revealInterval);
          room.revealInterval = null;
          // Auto-resolve - everyone who hasn't guessed gets 0
          room.players.forEach((p, sid) => {
            if (!room.guesses.has(sid)) {
              room.guesses.set(sid, { lat: loc.la, lng: loc.lo, solved: false, score: 0 });
              if(p) p.guesses.push({ round: room.round, dist: 999, score: 0, lat: loc.la, lng: loc.lo });
            }
          });
          setTimeout(() => resolveRound(room), 2000);
          break;
      }
      hintData.step = room.revealStep;
      hintData.maxScore = Math.max(0, 5000 - room.revealStep * 800);
      io.to(room.code).emit('revealHint', hintData);
    }, 10000);
    return; // Reveal mode uses its own timing, skip standard timer
  }

  if (room.settings.timerSec <= 0) return;
  if (room.timerHandle) clearTimeout(room.timerHandle);
  room.timerHandle = setTimeout(() => {
    // Auto-submit missing guesses (center of CZ)
    const activePlayers = getActivePlayers(room);
    activePlayers.forEach((_, sid) => {
      if (!room.guesses.has(sid)) {
        room.guesses.set(sid, { lat: 49.75, lng: 15.6, autoSubmit: true });
      }
    });
    resolveRound(room);
  }, room.settings.timerSec * 1000);
}

function resolveRound(room) {
  if (room.timerHandle) { clearTimeout(room.timerHandle); room.timerHandle = null; }
  if (room.revealInterval) { clearInterval(room.revealInterval); room.revealInterval = null; }
  const loc = room.locs[room.round];
  const results = [];
  const activePlayers = getActivePlayers(room);

  activePlayers.forEach((player, sid) => {
    if (room.gameMode === 'reveal') {
      // Reveal mode: score comes from guessReveal event; unsolved players get 0
      const revGuess = room.guesses.get(sid);
      const score = revGuess && revGuess.solved ? revGuess.score : 0;
      if (!revGuess || !revGuess.solved) {
        player.guesses.push({ round: room.round, dist: 999, score: 0, lat: loc.la, lng: loc.lo });
      }
      results.push({ id: sid, name: player.name, dist: 0, score, totalScore: player.score, lat: loc.la, lng: loc.lo, autoSubmit: false, solved: revGuess?.solved || false });
    } else if (room.gameMode === 'geoword') {
      // GeoWord: score comes from guessWord event; unsolved players get 0
      const gwGuess = room.guesses.get(sid);
      const score = gwGuess && gwGuess.solved ? gwGuess.score : 0;
      if (!gwGuess || !gwGuess.solved) {
        // Unsolved: record 0 score
        player.guesses.push({ round: room.round, dist: 0, score: 0, lat: loc.la, lng: loc.lo });
      }
      results.push({ id: sid, name: player.name, dist: 0, score, totalScore: player.score, lat: loc.la, lng: loc.lo, autoSubmit: false, solved: gwGuess?.solved || false });
    } else {
      const guess = room.guesses.get(sid) || { lat: 49.75, lng: 15.6, autoSubmit: true };
      const dist = haversine(guess.lat, guess.lng, loc.la, loc.lo);
      const score = calcScore(dist, room.settings.tol);
      player.score += score;
      player.guesses.push({ round: room.round, dist, score, lat: guess.lat, lng: guess.lng });
      results.push({ id: sid, name: player.name, dist, score, totalScore: player.score, lat: guess.lat, lng: guess.lng, autoSubmit: guess.autoSubmit || false });
    }
  });

  // Sort by score desc
  results.sort((a, b) => b.score - a.score);
  room.phase = 'roundResult';
  room.guesses.clear();

  // ── Game mode specific resolution ──

  // DUEL: determine round winner
  let roundWinner = null;
  let duelGameOver = false;
  if (room.gameMode === 'duel' && results.length === 2) {
    // Closer guess (smaller distance) wins the round
    const sorted = [...results].sort((a, b) => a.dist - b.dist);
    roundWinner = sorted[0].name;
    const winnerId = sorted[0].id;
    if (!room.duelScore[winnerId]) room.duelScore[winnerId] = 0;
    room.duelScore[winnerId]++;
    // Check if someone reached 3 wins
    for (const [sid, wins] of Object.entries(room.duelScore)) {
      if (wins >= 3) {
        duelGameOver = true;
        break;
      }
    }
  }

  // BATTLE ROYALE: eliminate worst player
  let eliminatedPlayer = null;
  let brGameOver = false;
  if (room.gameMode === 'battleRoyale' && results.length > 1) {
    // Worst = largest distance
    const sorted = [...results].sort((a, b) => b.dist - a.dist);
    const worst = sorted[0];
    room.eliminated.push(worst.id);
    eliminatedPlayer = { id: worst.id, name: worst.name, dist: worst.dist };
    // Check if only 1 remains
    const remaining = getActivePlayers(room);
    if (remaining.size <= 1) {
      brGameOver = true;
    }
  }

  // STREAK: check if distance within tolerance
  let streakEnded = false;
  if (room.gameMode === 'streak' && results.length > 0) {
    const playerResult = results[0]; // solo, only one player
    if (playerResult.dist > room.settings.tol) {
      streakEnded = true;
    } else {
      room.streakCount++;
    }
  }

  // Build roundResult payload
  const roundPayload = {
    loc,
    results,
    round: room.round,
    totalRounds: room.gameMode === 'streak' ? null : room.locs.length,
    isLast: room.gameMode === 'streak'
      ? streakEnded
      : room.gameMode === 'duel'
        ? duelGameOver
        : room.gameMode === 'battleRoyale'
          ? brGameOver
          : room.round >= room.locs.length - 1,
    gameMode: room.gameMode,
    streakCount: room.streakCount,
  };

  if (room.gameMode === 'duel') {
    roundPayload.roundWinner = roundWinner;
    roundPayload.duelScore = room.duelScore;
  }

  if (room.gameMode === 'battleRoyale' && eliminatedPlayer) {
    roundPayload.eliminatedPlayer = eliminatedPlayer;
  }

  if (room.gameMode === 'geoword') {
    roundPayload.cityName = loc.n;
  }

  if (room.gameMode === 'reveal') {
    roundPayload.cityName = loc.n;
  }

  if (room.gameMode === 'geotour') {
    const stop = room.tour?.stops[room.round];
    roundPayload.tourStop = stop ? { fact: stop.fact, quiz: stop.quiz, city: stop.city } : null;
  }

  io.to(room.code).emit('roundResult', roundPayload);

  // Emit extra events for specific modes
  if (room.gameMode === 'battleRoyale' && eliminatedPlayer) {
    io.to(room.code).emit('playerEliminated', {
      name: eliminatedPlayer.name,
      dist: eliminatedPlayer.dist,
      remainingCount: getActivePlayers(room).size
    });
  }

  if (room.gameMode === 'streak' && streakEnded) {
    io.to(room.code).emit('streakEnded', { streakCount: room.streakCount });
    finishGame(room);
    return;
  }

  // Immediately finish if duel or battle royale game over
  if (duelGameOver || brGameOver) {
    // Let the roundResult be seen, then finish
    // Use a short delay so clients see the round result first
    setTimeout(() => {
      finishGame(room);
    }, 100);
    return;
  }

  // Auto-advance after 10s (multiplayer only -- solo waits for player click)
  if (!room.settings.solo && room.gameMode !== 'duel') {
    room.autoAdvance = setTimeout(() => {
      if (room.phase === 'roundResult') advanceRound(room);
    }, 10000);
  }
}

function advanceRound(room) {
  if (room.autoAdvance) { clearTimeout(room.autoAdvance); room.autoAdvance = null; }

  // Streak mode: generate more locations if needed
  if (room.gameMode === 'streak') {
    if (room.round >= room.locs.length - 1) {
      // Need more locations
      let filteredLocs = LOCS.filter(l => room.settings.cats.includes(l.cat));
      if (room.settings.region) {
        filteredLocs = filteredLocs.filter(l => getRegion(l.la, l.lo) === room.settings.region);
      }
      const moreLocs = shuffle(filteredLocs).slice(0, 30);
      room.locs.push(...moreLocs);
    }
  } else if (room.round >= room.locs.length - 1) {
    finishGame(room);
    return;
  }

  room.round++;
  room.phase = 'playing';
  room.guesses.clear();
  if (room.hints) room.hints.clear();
  const loc = room.locs[room.round];
  const roundData = {
    round: room.round,
    totalRounds: room.gameMode === 'streak' ? null : room.locs.length,
    locCat: loc.cat,
    locHeading: loc.h,
    locLat: loc.la,
    locLng: loc.lo,
    timerSec: room.settings.timerSec,
    gameMode: room.gameMode,
    streakCount: room.streakCount,
    eliminated: room.eliminated.map(sid => {
      const p = room.players.get(sid);
      return p ? p.name : sid;
    }),
  };
  // GeoWord: include word pattern info
  if (room.gameMode === 'geoword') {
    const name = loc.n;
    roundData.wordLength = name.length;
    roundData.wordPattern = name.split('').map(ch => (ch === ' ' ? ' ' : ch === '-' ? '-' : '_')).join('');
    roundData.category = loc.cat;
  }
  io.to(room.code).emit('newRound', roundData);
  startRoundTimer(room);
}

function finishGame(room) {
  room.phase = 'finished';
  const finalScores = [...room.players.values()]
    .map(p => ({ id: p.id, name: p.name, score: p.score, guesses: p.guesses }))
    .sort((a, b) => b.score - a.score);

  const payload = { finalScores, locs: room.locs, gameMode: room.gameMode };

  // DUEL: include duel winner info
  if (room.gameMode === 'duel') {
    let duelWinner = null;
    let maxWins = 0;
    for (const [sid, wins] of Object.entries(room.duelScore)) {
      if (wins > maxWins) {
        maxWins = wins;
        const p = room.players.get(sid);
        duelWinner = p ? p.name : sid;
      }
    }
    payload.duelWinner = duelWinner;
    payload.duelScore = room.duelScore;
    io.to(room.code).emit('duelWinner', { winner: duelWinner, duelScore: room.duelScore });
  }

  // BATTLE ROYALE: the last player standing is the winner
  if (room.gameMode === 'battleRoyale') {
    const remaining = getActivePlayers(room);
    if (remaining.size === 1) {
      const [[sid, player]] = [...remaining.entries()];
      payload.battleRoyaleWinner = player.name;
    }
    payload.eliminated = room.eliminated.map(sid => {
      const p = room.players.get(sid);
      return p ? p.name : sid;
    });
  }

  // STREAK: include streak count
  if (room.gameMode === 'streak') {
    payload.streakCount = room.streakCount;
  }

  // DAILY: include shareable result
  if (room.gameMode === 'daily') {
    const totalScore = finalScores.length > 0 ? finalScores[0].score : 0;
    const seedStr = getTodaySeed();
    const shareText = `GeoStrike Daily ${seedStr} - ${totalScore}/25000 pts`;
    payload.dailyResult = { score: totalScore, seed: seedStr, shareText };
    io.to(room.code).emit('dailyResult', { score: totalScore, seed: seedStr, shareText });
  }

  io.to(room.code).emit('gameFinished', payload);
}

// ═══════════════════════════════════════════════════
// REST API
// ═══════════════════════════════════════════════════
app.get('/api/daily-seed', (req, res) => {
  res.json({ seed: getTodaySeed() });
});

app.get('/api/tours', (req, res) => {
  res.json(GEO_TOURS.map(t => ({
    id: t.id, name: t.name, desc: t.desc, icon: t.icon,
    difficulty: t.difficulty, stops: t.stops.length
  })));
});

// ═══════════════════════════════════════════════════
// SOCKET.IO EVENTS
// ═══════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log(`[+] ${socket.id} connected`);

  // Create room
  socket.on('createRoom', ({ name, settings }) => {
    const room = createRoom(settings);
    const gameMode = room.gameMode;
    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;

    // Initialize duel score for first player
    if (gameMode === 'duel') {
      room.duelScore[socket.id] = 0;
    }

    if (settings.solo || gameMode === 'streak' || gameMode === 'daily' || gameMode === 'geoword' || gameMode === 'reveal' || gameMode === 'speed') {
      // Solo modes: auto-start immediately, skip waiting room
      room.phase = 'playing';
      player.ready = true;
      const loc = room.locs[0];
      const soloData = {
        round: 0,
        totalRounds: gameMode === 'streak' ? null : room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec,
        gameMode,
        streakCount: room.streakCount,
      };
      // GeoWord: include word pattern info
      if (gameMode === 'geoword') {
        const name = loc.n;
        soloData.wordLength = name.length;
        soloData.wordPattern = name.split('').map(ch => (ch === ' ' ? ' ' : ch === '-' ? '-' : '_')).join('');
        soloData.category = loc.cat;
      }
      socket.emit('soloStart', soloData);
      startRoundTimer(room);
      console.log(`[SOLO/${gameMode.toUpperCase()}] ${room.code} started by ${name}`);
    } else {
      socket.emit('roomCreated', { code: room.code, state: getRoomSafeState(room) });
      console.log(`[ROOM/${gameMode.toUpperCase()}] ${room.code} created by ${name}`);
    }
  });

  // Join room
  socket.on('joinRoom', ({ code, name }) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) { socket.emit('error', { msg: 'Místnost nenalezena.' }); return; }
    if (room.phase !== 'lobby') { socket.emit('error', { msg: 'Hra již probíhá.' }); return; }

    // Validate player limits per game mode
    if (room.gameMode === 'duel' && room.players.size >= 2) {
      socket.emit('error', { msg: 'Duel je pouze pro 2 hráče.' }); return;
    }
    if (room.gameMode === 'battleRoyale' && room.players.size >= 10) {
      socket.emit('error', { msg: 'Battle Royale: max 10 hráčů.' }); return;
    }
    if (room.players.size >= 8 && room.gameMode !== 'battleRoyale') {
      socket.emit('error', { msg: 'Místnost je plná (max 8).' }); return;
    }

    socket.join(room.code);
    const player = { id: socket.id, name, score: 0, guesses: [], ready: false };
    room.players.set(socket.id, player);
    socket.data.roomCode = room.code;
    socket.data.name = name;

    // Initialize duel score for second player
    if (room.gameMode === 'duel') {
      room.duelScore[socket.id] = 0;
    }

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

    // Check minimum player requirements per mode
    let minPlayers = 1;
    if (room.gameMode === 'duel') minPlayers = 2;
    if (room.gameMode === 'battleRoyale') minPlayers = 3;

    // Start if all ready and minimum player count met
    const allReady = [...room.players.values()].every(p => p.ready);
    if (allReady && room.players.size >= minPlayers) {
      room.phase = 'playing';
      const loc = room.locs[0];
      const startData = {
        round: 0,
        totalRounds: room.locs.length,
        locCat: loc.cat,
        locHeading: loc.h,
        locLat: loc.la,
        locLng: loc.lo,
        timerSec: room.settings.timerSec,
        gameMode: room.gameMode,
      };
      // GeoWord: include word pattern info
      if (room.gameMode === 'geoword') {
        const name = loc.n;
        startData.wordLength = name.length;
        startData.wordPattern = name.split('').map(ch => (ch === ' ' ? ' ' : ch === '-' ? '-' : '_')).join('');
        startData.category = loc.cat;
      }
      io.to(room.code).emit('gameStarted', startData);
      startRoundTimer(room);
    }
  });

  // Submit guess
  socket.on('submitGuess', ({ lat, lng }) => {
    const room = rooms.get(socket.data.roomCode);
    console.log(`[GUESS] ${socket.id} submitted guess, room=${socket.data.roomCode}, phase=${room?.phase}, guesses=${room?.guesses.size}/${room?.players.size}`);
    if (!room || room.phase !== 'playing') return;
    if (room.guesses.has(socket.id)) return; // already guessed

    // Battle royale: eliminated players cannot guess
    if (room.gameMode === 'battleRoyale' && room.eliminated.includes(socket.id)) {
      return;
    }

    room.guesses.set(socket.id, { lat, lng });
    const player = room.players.get(socket.id);
    const activePlayers = getActivePlayers(room);
    // Notify others that this player guessed (not the coords)
    io.to(room.code).emit('playerGuessed', {
      name: player?.name,
      waitingFor: [...activePlayers.keys()].filter(id => !room.guesses.has(id)).length
    });

    // All active players guessed -> resolve immediately
    const allGuessed = [...activePlayers.keys()].every(id => room.guesses.has(id));
    console.log(`[GUESS] After set: guesses=${room.guesses.size}/${activePlayers.size}`);
    if (allGuessed) {
      console.log(`[RESOLVE] All guessed, resolving round ${room.round}`);
      resolveRound(room);
    }
  });

  // GeoWord: guess word
  // ── GeoWord: LETTER or FULL WORD guessing (hangman style) ──
  // guessWord now accepts: { letter: 'a' } OR { word: 'Praha' }
  socket.on('guessWord', ({ letter, word }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'playing' || room.gameMode !== 'geoword') return;
    if (room.guesses.has(socket.id)) return; // already solved/dead

    const loc = room.locs[room.round];
    const correctName = loc.n;
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    // Init per-player state
    if (!room.gwState) room.gwState = new Map();
    if (!room.gwState.has(socket.id)) {
      room.gwState.set(socket.id, {
        revealed: new Set(), // indices of revealed letters
        lives: 6,            // wrong guesses allowed
        guessedLetters: new Set(), // letters already tried
        hintsUsed: 0,        // paid hints (max 3)
        hintPenalty: 0
      });
    }
    const ps = room.gwState.get(socket.id);

    // === FULL WORD GUESS ===
    if (word && word.trim().length > 1) {
      if (normalize(word) === normalize(correctName)) {
        // CORRECT — full word
        const elapsed = room.roundStartTime ? (Date.now() - room.roundStartTime) / 1000 : 0;
        const maxTime = room.settings.timerSec || 120;
        const timeRatio = Math.max(0, 1 - elapsed / maxTime);
        let score = Math.round(5000 * timeRatio);
        score = Math.max(0, score - ps.hintPenalty);
        // Bonus for remaining lives
        score += ps.lives * 100;

        const player = room.players.get(socket.id);
        player.score += score;
        player.guesses.push({ round: room.round, dist: 0, score, lat: loc.la, lng: loc.lo });
        room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: true, score });

        io.to(room.code).emit('wordSolved', {
          name: player.name, score, elapsed: Math.round(elapsed),
          totalScore: player.score, fullWord: correctName
        });

        if (room.guesses.size >= room.players.size) resolveRound(room);
      } else {
        // WRONG full word = lose 2 lives
        ps.lives -= 2;
        if (ps.lives <= 0) {
          ps.lives = 0;
          // DEAD — 0 points
          const player = room.players.get(socket.id);
          player.guesses.push({ round: room.round, dist: 999, score: 0, lat: loc.la, lng: loc.lo });
          room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: false, score: 0 });
          socket.emit('wordDead', { answer: correctName, lives: 0 });
          if (room.guesses.size >= room.players.size) resolveRound(room);
        } else {
          socket.emit('wordWrong', { word: word.trim(), lives: ps.lives, isFullWord: true });
        }
      }
      return;
    }

    // === SINGLE LETTER GUESS ===
    if (letter && letter.length === 1) {
      const normalLetter = normalize(letter);
      if (ps.guessedLetters.has(normalLetter)) {
        socket.emit('wordAlreadyGuessed', { letter: normalLetter });
        return;
      }
      ps.guessedLetters.add(normalLetter);

      // Check if letter exists in name
      const normalName = normalize(correctName);
      const positions = [];
      for (let i = 0; i < correctName.length; i++) {
        if (correctName[i] !== ' ' && correctName[i] !== '-' && normalize(correctName[i]) === normalLetter) {
          positions.push(i);
          ps.revealed.add(i);
        }
      }

      if (positions.length > 0) {
        // CORRECT letter
        const lettersMap = positions.map(i => ({ pos: i, letter: correctName[i] }));
        socket.emit('wordLetterCorrect', { letter: normalLetter, positions: lettersMap, lives: ps.lives });

        // Check if fully revealed
        let allRevealed = true;
        for (let i = 0; i < correctName.length; i++) {
          if (correctName[i] !== ' ' && correctName[i] !== '-' && !ps.revealed.has(i)) {
            allRevealed = false; break;
          }
        }
        if (allRevealed) {
          // AUTO-SOLVE — all letters found
          const elapsed = room.roundStartTime ? (Date.now() - room.roundStartTime) / 1000 : 0;
          const maxTime = room.settings.timerSec || 120;
          const timeRatio = Math.max(0, 1 - elapsed / maxTime);
          let score = Math.round(5000 * timeRatio);
          score = Math.max(0, score - ps.hintPenalty);
          score += ps.lives * 100;

          const player = room.players.get(socket.id);
          player.score += score;
          player.guesses.push({ round: room.round, dist: 0, score, lat: loc.la, lng: loc.lo });
          room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: true, score });

          io.to(room.code).emit('wordSolved', {
            name: player.name, score, elapsed: Math.round(elapsed),
            totalScore: player.score, fullWord: correctName
          });
          if (room.guesses.size >= room.players.size) resolveRound(room);
        }
      } else {
        // WRONG letter — lose 1 life
        ps.lives -= 1;
        if (ps.lives <= 0) {
          ps.lives = 0;
          const player = room.players.get(socket.id);
          player.guesses.push({ round: room.round, dist: 999, score: 0, lat: loc.la, lng: loc.lo });
          room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: false, score: 0 });
          socket.emit('wordDead', { answer: correctName, lives: 0 });
          if (room.guesses.size >= room.players.size) resolveRound(room);
        } else {
          socket.emit('wordLetterWrong', { letter: normalLetter, lives: ps.lives });
        }
      }
      return;
    }
  });

  // GeoWord: request hint (max 3, costs 500 each, reveals random letter)
  socket.on('requestHint', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'playing' || room.gameMode !== 'geoword') return;
    if (room.guesses.has(socket.id)) return;

    const loc = room.locs[room.round];
    const name = loc.n;

    if (!room.gwState) room.gwState = new Map();
    if (!room.gwState.has(socket.id)) return;
    const ps = room.gwState.get(socket.id);

    // Max 3 hints
    if (ps.hintsUsed >= 3) {
      socket.emit('hintMaxReached', { max: 3 });
      return;
    }

    // Find unrevealed letter (random, not sequential)
    const unrevealed = [];
    for (let i = 0; i < name.length; i++) {
      if (name[i] !== ' ' && name[i] !== '-' && !ps.revealed.has(i)) {
        unrevealed.push(i);
      }
    }
    if (unrevealed.length === 0) return;

    const randIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    ps.revealed.add(randIdx);
    ps.hintsUsed++;
    ps.hintPenalty += 500;

    socket.emit('hintRevealed', {
      pos: randIdx, letter: name[randIdx],
      cost: 500, hintsUsed: ps.hintsUsed, maxHints: 3,
      totalPenalty: ps.hintPenalty
    });

    // Check if auto-solved
    let allRevealed = true;
    for (let i = 0; i < name.length; i++) {
      if (name[i] !== ' ' && name[i] !== '-' && !ps.revealed.has(i)) {
        allRevealed = false; break;
      }
    }
    if (allRevealed) {
      const elapsed = room.roundStartTime ? (Date.now() - room.roundStartTime) / 1000 : 0;
      const maxTime = room.settings.timerSec || 120;
      const timeRatio = Math.max(0, 1 - elapsed / maxTime);
      let score = Math.round(5000 * timeRatio);
      score = Math.max(0, score - ps.hintPenalty);
      const player = room.players.get(socket.id);
      player.score += score;
      player.guesses.push({ round: room.round, dist: 0, score, lat: loc.la, lng: loc.lo });
      room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: true, score });
      io.to(room.code).emit('wordSolved', {
        name: player.name, score, elapsed: Math.round(elapsed),
        totalScore: player.score, fullWord: name
      });
      if (room.guesses.size >= room.players.size) resolveRound(room);
    }
  });

  // Progressive Reveal: guess city name
  socket.on('guessReveal', ({ word }) => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'playing' || room.gameMode !== 'reveal') return;
    if (room.guesses.has(socket.id)) return;

    const loc = room.locs[room.round];
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    if (normalize(word) === normalize(loc.n)) {
      const hintsUsed = room.revealStep || 0;
      const score = Math.max(0, 5000 - hintsUsed * 800);

      const player = room.players.get(socket.id);
      player.score += score;
      player.guesses.push({ round: room.round, dist: 0, score, lat: loc.la, lng: loc.lo });
      room.guesses.set(socket.id, { lat: loc.la, lng: loc.lo, solved: true, score });

      io.to(room.code).emit('revealSolved', { name: player.name, score, hintsUsed, totalScore: player.score });

      if (room.guesses.size >= room.players.size) resolveRound(room);
    } else {
      socket.emit('revealWrong', { word });
    }
  });

  // Next round (after seeing result)
  socket.on('nextRound', () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room || room.phase !== 'roundResult') return;
    const player = room.players.get(socket.id);
    if (player) player.readyNext = true;

    // Solo modes (including streak, daily, reveal, speed): advance immediately
    if (room.settings.solo || room.gameMode === 'streak' || room.gameMode === 'daily' || room.gameMode === 'reveal' || room.gameMode === 'speed') {
      room.players.forEach(p => p.readyNext = false);
      advanceRound(room);
      return;
    }

    // Duel: both players must click next
    if (room.gameMode === 'duel') {
      const allNext = [...room.players.values()].every(p => p.readyNext);
      if (allNext) {
        room.players.forEach(p => p.readyNext = false);
        advanceRound(room);
      }
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

    // For battle royale: if a player disconnects during play, check if game should end
    if (room.gameMode === 'battleRoyale' && room.phase === 'playing') {
      const active = getActivePlayers(room);
      if (active.size <= 1 && active.size > 0) {
        resolveRound(room);
      }
    }

    // For duel: if a player disconnects, the other wins
    if (room.gameMode === 'duel' && room.phase === 'playing' && room.players.size === 1) {
      const [[winnerId, winnerPlayer]] = [...room.players.entries()];
      room.phase = 'finished';
      io.to(room.code).emit('duelWinner', { winner: winnerPlayer.name, reason: 'opponent_disconnected' });
      io.to(room.code).emit('gameFinished', {
        finalScores: [{ id: winnerId, name: winnerPlayer.name, score: winnerPlayer.score, guesses: winnerPlayer.guesses }],
        locs: room.locs,
        gameMode: 'duel',
        duelWinner: winnerPlayer.name,
        duelScore: room.duelScore,
      });
    }

    if (room.players.size === 0) {
      if (room.timerHandle) clearTimeout(room.timerHandle);
      if (room.autoAdvance) clearTimeout(room.autoAdvance);
      if (room.revealInterval) clearInterval(room.revealInterval);
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
  console.log(`GeoStrike server running on port ${PORT}`);
});

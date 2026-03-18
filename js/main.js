/**
 * Motorcycle Arcade - Entry point
 * Game loop, state machine, canvas, visibility API, loading/start screens
 */

import { VERSION } from './version.js';
import { createStateMachine, STATES } from './game/state.js';
import { getHighScore, setHighScore, getMute, setMute, getSelectedRider } from './storage.js';
import { registerServiceWorker, isOffline } from './pwa.js';
import {
  createMotorcycle,
  updateMotorcycle,
  applyOilSlide,
  tryActivateBoost
} from './game/entities.js';
import { renderRoad } from './game/road.js';
import { renderEntities } from './game/render.js';
import {
  checkObstacleCollision,
  checkCollectibleCollision,
  isOffScreen
} from './game/collision.js';
import {
  updateObstacles,
  updateCollectibles,
  trySpawnObstacle,
  trySpawnCollectible
} from './game/spawner.js';
import { setupInput, applyLaneMove } from './game/input.js';
import { laneCenterX } from './game/road.js';
import {
  playHarleyEngineTick,
  playLaneChange,
  playCrash,
  playOilSlide,
  playCollection,
  playBoostRev,
  resumeAudioContext,
  startIntroMusic,
  fadeIntroMusicDown,
  stopIntroMusic,
  startStreetAmbient,
  stopStreetAmbient
} from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas?.getContext('2d');
const loadingScreen = document.getElementById('loading-screen');
const startScreen = document.getElementById('start-screen');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const playBtn = document.getElementById('play-btn');
const highScoreDisplay = document.getElementById('high-score-display');
const muteBtnStart = document.getElementById('mute-btn-start');
const muteBtnPlaying = document.getElementById('mute-btn-playing');
const playingOverlay = document.getElementById('playing-overlay');
const scoreDisplay = document.getElementById('score-display');

const state = createStateMachine();
let lastTime = 0;

// --- Game session (Phase 3) ---
const SCROLL_SPEED = 180;
const BOOST_SCROLL_MULTIPLIER = 1.6;
const DISTANCE_SCORE_RATE = 10;
const OIL_SLIDE_DURATION_MS = 1500;

let motorcycle = null;
let obstacles = [];
let collectibles = [];
let scrollOffset = 0;
let elapsedTime = 0;
let lastObstacleSpawnTime = -2;
let lastCollectibleSpawnTime = -2;
let lastEngineTickTime = 0;
let score = 0;
let distanceScore = 0;
let coinScore = 0;
let inputCleanup = null;

function resetGame() {
  const riderId = getSelectedRider();
  motorcycle = createMotorcycle(riderId);
  obstacles = [];
  collectibles = [];
  scrollOffset = 0;
  elapsedTime = 0;
  lastObstacleSpawnTime = -2;
  lastCollectibleSpawnTime = -2;
  lastEngineTickTime = 0;
  score = 0;
  distanceScore = 0;
  coinScore = 0;
}

// --- Canvas setup and resize (T007) ---
function resizeCanvas() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let rect = canvas.getBoundingClientRect();
  // When canvas is hidden (display:none), rect is 0x0 - use app container
  if (rect.width <= 0 || rect.height <= 0) {
    const app = canvas.closest('#app') || document.documentElement;
    rect = app.getBoundingClientRect();
  }
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }
}

// --- Game loop (T005) ---
function gameLoop(timestamp) {
  const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
  lastTime = timestamp;

  if (state.isPlaying()) {
    render(dt);
  }

  requestAnimationFrame(gameLoop);
}

function render(dt) {
  if (!ctx || !canvas || !motorcycle) return;

  const w = canvas.width;
  const h = canvas.height;
  const motorcycleY = h - 30;

  const scrollMult = motorcycle.isBoosting ? BOOST_SCROLL_MULTIPLIER : 1;
  scrollOffset += SCROLL_SPEED * scrollMult * dt;
  elapsedTime += dt;

  updateMotorcycle(motorcycle, performance.now(), w, laneCenterX);

  const currentScrollSpeed = SCROLL_SPEED * scrollMult;
  updateObstacles(obstacles, currentScrollSpeed, dt);
  updateCollectibles(collectibles, currentScrollSpeed, dt);

  const obsResult = trySpawnObstacle(obstacles, elapsedTime, lastObstacleSpawnTime);
  if (obsResult.spawned) lastObstacleSpawnTime = obsResult.lastSpawnTime;

  const colResult = trySpawnCollectible(collectibles, elapsedTime, lastCollectibleSpawnTime);
  if (colResult.spawned) lastCollectibleSpawnTime = colResult.lastSpawnTime;

  distanceScore = Math.floor(elapsedTime * DISTANCE_SCORE_RATE);

  for (const obs of obstacles) {
    if (checkObstacleCollision(motorcycle, obs, w, h, motorcycleY)) {
      if (obs.type === 'oil') {
        playOilSlide();
        applyOilSlide(motorcycle, OIL_SLIDE_DURATION_MS, performance.now());
        obs._collected = true;
      } else {
        playCrash();
        triggerGameOver();
        return;
      }
    }
  }

  for (const col of collectibles) {
    if (!col._collected && checkCollectibleCollision(motorcycle, col, w, h, motorcycleY)) {
      col._collected = true;
      playCollection();
      if (col.type === 'coin') {
        coinScore += col.value;
      }
    }
  }

  obstacles = obstacles.filter((o) => !o._collected && !isOffScreen(o));
  collectibles = collectibles.filter((c) => !c._collected && !isOffScreen(c));

  score = distanceScore + coinScore;

  setHighScore(score);
  if (scoreDisplay) scoreDisplay.textContent = String(score);

  // Harley engine sound (potato potato) - tick every ~150ms while riding; rev when boosting
  if (!motorcycle.isSliding) {
    if (motorcycle.isBoosting) {
      if (elapsedTime - lastEngineTickTime > 0.08) {
        lastEngineTickTime = elapsedTime;
        playBoostRev();
      }
    } else if (elapsedTime - lastEngineTickTime > 0.15) {
      lastEngineTickTime = elapsedTime;
      playHarleyEngineTick();
    }
  }

  renderRoad(ctx, w, h, scrollOffset);
  renderEntities(ctx, w, h, obstacles, collectibles, motorcycle);
}

function triggerGameOver() {
  state.set(STATES.GAME_OVER);
}

// --- Loading (T009) ---
async function simulateLoading() {
  const steps = [
    { pct: 20, msg: 'Loading...' },
    { pct: 50, msg: 'Preparing...' },
    { pct: 80, msg: 'Almost ready...' },
    { pct: 100, msg: 'Ready!' }
  ];
  for (const { pct, msg } of steps) {
    progressBar.style.width = `${pct}%`;
    progressText.textContent = msg;
    await new Promise((r) => setTimeout(r, 300));
  }
}

async function finishLoading() {
  await simulateLoading();
  state.set(STATES.START);
}

// --- Start screen (T010) ---
function showStartScreen() {
  if (loadingScreen) loadingScreen.classList.add('hidden');
  if (startScreen) startScreen.classList.remove('hidden');
  const gameOverScreen = document.getElementById('game-over-screen');
  if (gameOverScreen) gameOverScreen.classList.add('hidden');
  if (canvas) canvas.classList.add('hidden');
  if (playingOverlay) playingOverlay.classList.add('hidden');
  const hs = getHighScore();
  if (highScoreDisplay) highScoreDisplay.textContent = `High Score: ${hs}`;
  syncMuteUI();
  stopStreetAmbient();

  // Start intro music (amigo sound) on first tap - requires user gesture for audio
  // Skip when tapping play (play handler starts music briefly then fades)
  if (startScreen) {
    const startMusicOnTap = (e) => {
      if (e.target === playBtn) return;
      resumeAudioContext();
      if (!getMute()) startIntroMusic();
    };
    startScreen.addEventListener('click', startMusicOnTap, { once: true });
  }
}

function syncMuteUI() {
  const muted = getMute();
  if (muteBtnStart) {
    muteBtnStart.textContent = muted ? '🔇 Muted' : '🔊 Sound';
  }
  if (muteBtnPlaying) {
    muteBtnPlaying.textContent = muted ? '🔇' : '🔊';
  }
}

function enterPlayingState() {
  fadeIntroMusicDown();
  if (!getMute()) startStreetAmbient();
  if (startScreen) startScreen.classList.add('hidden');
  if (canvas) canvas.classList.remove('hidden');
  if (playingOverlay) playingOverlay.classList.remove('hidden');
  // Resize canvas now that it's visible (was 0x0 when hidden)
  requestAnimationFrame(() => resizeCanvas());
  syncMuteUI();
  resetGame();
  if (inputCleanup) inputCleanup();
  inputCleanup = setupInput(
    document.getElementById('app'),
    (dir) => {
      if (motorcycle && !motorcycle.isSliding) {
        if (dir === 'forward') {
          if (tryActivateBoost(motorcycle, performance.now())) {
            playBoostRev();
          }
        } else {
          const newLane = applyLaneMove(motorcycle.lane, dir);
          if (newLane !== motorcycle.targetLane) {
            motorcycle.targetLane = newLane;
            playLaneChange();
          }
        }
      }
    },
    () => state.isPlaying() && motorcycle && !motorcycle.isSliding
  );
}

// --- Visibility API (T008) ---
function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    if (state.isPlaying()) {
      state.set(STATES.PAUSED);
    }
  } else if (document.visibilityState === 'visible') {
    if (state.isPaused()) {
      state.set(STATES.PLAYING);
    }
  }
}

// --- State subscription ---
state.subscribe(({ prev, next }) => {
  if (next === STATES.START) {
    showStartScreen();
  } else if (next === STATES.PLAYING) {
    if (prev === STATES.START) enterPlayingState();
  } else if (next === STATES.GAME_OVER) {
    showGameOverScreen();
  }
});

function showGameOverScreen() {
  stopStreetAmbient();
  if (playingOverlay) playingOverlay.classList.add('hidden');
  if (canvas) canvas.classList.add('hidden');
  const gameOverScreen = document.getElementById('game-over-screen');
  const startScreenEl = document.getElementById('start-screen');
  if (gameOverScreen) {
    if (startScreenEl) startScreenEl.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    const finalScoreEl = document.getElementById('final-score');
    const highScoreEl = document.getElementById('game-over-high-score');
    if (finalScoreEl) finalScoreEl.textContent = `Score: ${score}`;
    if (highScoreEl) highScoreEl.textContent = `High Score: ${getHighScore()}`;
  }
}


// --- PWA & offline (T025, T026) ---
function showOfflineFirstVisitMessage() {
  const offlineMsg = document.getElementById('offline-message');
  const loadingEl = document.getElementById('loading-screen');
  if (offlineMsg && loadingEl) {
    loadingEl.classList.add('hidden');
    offlineMsg.classList.remove('hidden');
  }
}

function checkOfflineFirstVisit() {
  if (isOffline() && !navigator.serviceWorker?.controller) {
    showOfflineFirstVisitMessage();
    return true;
  }
  return false;
}

// --- Init ---
function init() {
  const versionEl = document.getElementById('version-display');
  if (versionEl) versionEl.textContent = `v${VERSION}`;

  registerServiceWorker();

  if (checkOfflineFirstVisit()) {
    const retryBtn = document.getElementById('offline-retry-btn');
    if (retryBtn) retryBtn.addEventListener('click', () => location.reload());
    window.addEventListener('online', () => location.reload());
    return;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      try {
        if (state.isStart()) {
          resumeAudioContext();
          if (!getMute()) startIntroMusic();
          fadeIntroMusicDown();
          state.set(STATES.PLAYING);
        }
      } catch (err) {
        // eslint-disable-next-line no-undef -- browser global
        console.error('Play button error:', err);
      }
    });
  }

  if (muteBtnStart) {
    muteBtnStart.addEventListener('click', () => {
      resumeAudioContext();
      setMute(!getMute());
      syncMuteUI();
      if (getMute()) {
        stopIntroMusic();
      } else {
        startIntroMusic();
      }
    });
  }

  if (muteBtnPlaying) {
    muteBtnPlaying.addEventListener('click', () => {
      resumeAudioContext();
      setMute(!getMute());
      syncMuteUI();
      if (getMute()) {
        stopStreetAmbient();
      } else if (state.isPlaying()) {
        startStreetAmbient();
      }
    });
  }

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (state.isGameOver()) {
        state.set(STATES.START);
      }
    });
  }

  requestAnimationFrame(gameLoop);
  finishLoading();
}

if (canvas && ctx) {
  init();
}

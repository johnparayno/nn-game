/**
 * Audio module - Web Audio API for sound effects
 * Per spec FR-017: movement, collision, collection with mute support
 * Uses procedural sounds (no asset files) for MVP
 */

import { getMute } from './storage.js';

let audioCtx = null;

// Intro music (amigo/80s arcade style) - loop on start screen
let introMusicGain = null;
let introMusicInterval = null;

// Street ambient - low rumble during gameplay
let streetAmbientNode = null;
let streetAmbientGain = null;

/**
 * Ensure AudioContext exists and is running (required after user gesture)
 * @returns {AudioContext|null}
 */
function getContext() {
  if (getMute()) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Resume audio context on first user interaction (browser autoplay policy)
 * Call once when user taps play or interacts with the game
 */
export function resumeAudioContext() {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

/**
 * Start intro music (amigo/80s arcade style) - plays on start screen
 * Call when start screen is shown and user has interacted
 */
export function startIntroMusic() {
  if (getMute()) return;
  stopIntroMusic();
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  introMusicGain = ctx.createGain();
  introMusicGain.gain.setValueAtTime(0.25, now);
  introMusicGain.connect(ctx.destination);

  // 80s arcade melody - simple catchy loop (Amiga-style chip tune)
  const melody = [
    { freq: 330, dur: 0.15 },
    { freq: 392, dur: 0.15 },
    { freq: 494, dur: 0.15 },
    { freq: 392, dur: 0.15 },
    { freq: 494, dur: 0.3 },
    { freq: 587, dur: 0.3 },
    { freq: 494, dur: 0.15 },
    { freq: 392, dur: 0.15 },
    { freq: 330, dur: 0.3 },
    { freq: 262, dur: 0.15 },
    { freq: 330, dur: 0.15 },
    { freq: 392, dur: 0.3 },
    { freq: 330, dur: 0.15 },
    { freq: 262, dur: 0.6 }
  ];

  const loopDuration = melody.reduce((acc, n) => acc + n.dur, 0);

  function scheduleLoop() {
    const start = ctx.currentTime;
    let t = start;
    melody.forEach(({ freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(introMusicGain);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
  }

  scheduleLoop();
  introMusicInterval = window.setInterval(() => {
    if (getMute() || !introMusicGain) return;
    scheduleLoop();
  }, loopDuration * 1000);
}

/**
 * Fade intro music down and stop - call when play is pressed
 */
export function fadeIntroMusicDown() {
  if (!introMusicGain) return;
  const ctx = getContext();
  if (ctx) {
    const now = ctx.currentTime;
    introMusicGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
  }
  if (introMusicInterval) {
    window.clearInterval(introMusicInterval);
    introMusicInterval = null;
  }
  setTimeout(() => {
    introMusicGain = null;
  }, 600);
}

/**
 * Stop intro music immediately
 */
export function stopIntroMusic() {
  if (introMusicInterval) {
    window.clearInterval(introMusicInterval);
    introMusicInterval = null;
  }
  introMusicGain = null;
}

/**
 * Start street ambient (low rumble) - plays during gameplay
 */
export function startStreetAmbient() {
  if (getMute()) return;
  stopStreetAmbient();
  const ctx = getContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 0.15;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  streetAmbientGain = ctx.createGain();
  streetAmbientGain.gain.setValueAtTime(0.08, ctx.currentTime);
  source.connect(streetAmbientGain);
  streetAmbientGain.connect(ctx.destination);
  source.start(0);
  streetAmbientNode = source;
}

/**
 * Stop street ambient
 */
export function stopStreetAmbient() {
  if (streetAmbientNode) {
    try {
      streetAmbientNode.stop();
    } catch { /* already stopped */ }
    streetAmbientNode = null;
  }
  streetAmbientGain = null;
}

/**
 * Play a short procedural sound
 * @param {Object} opts
 * @param {number} opts.freq - Base frequency (Hz)
 * @param {number} opts.duration - Duration in seconds
 * @param {string} opts.type - Oscillator type: 'sine'|'square'|'triangle'|'sawtooth'
 * @param {number} [opts.gain=0.15] - Volume 0-1
 * @param {number} [opts.freqEnd] - End frequency for sweep (optional)
 */
function playTone({ freq, duration, type = 'sine', gain = 0.15, freqEnd }) {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
  }
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Harley V-twin "potato potato" engine tick - call periodically while riding
 */
export function playHarleyEngineTick() {
  if (getMute()) return;
  playTone({
    freq: 85,
    duration: 0.06,
    type: 'sawtooth',
    gain: 0.08,
    freqEnd: 65
  });
}

/**
 * Sound: lane change (Harley-style whoosh / engine blip)
 */
export function playLaneChange() {
  if (getMute()) return;
  playTone({
    freq: 120,
    duration: 0.1,
    type: 'sawtooth',
    gain: 0.1,
    freqEnd: 90
  });
}

/**
 * Sound: crash (car, roadblock) - loud impact, metal crunch
 */
export function playCrash() {
  if (getMute()) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
  osc.frequency.setValueAtTime(80, now + 0.15);
  osc.frequency.exponentialRampToValueAtTime(25, now + 0.4);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Sound: oil slide / skid
 */
export function playOilSlide() {
  if (getMute()) return;
  playTone({
    freq: 100,
    duration: 0.15,
    type: 'sawtooth',
    gain: 0.12,
    freqEnd: 50
  });
}

/**
 * Sound: collectible coin - "ching ching" double tap
 */
export function playCollection() {
  if (getMute()) return;
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880 + i * 220, now + i * 0.08);
    gainNode.gain.setValueAtTime(0, now + i * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.12);
  }
}

/**
 * Sound: boost / revving - engine revs up
 */
export function playBoostRev() {
  if (getMute()) return;
  playTone({
    freq: 120,
    duration: 0.12,
    type: 'sawtooth',
    gain: 0.14,
    freqEnd: 200
  });
}

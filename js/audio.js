/**
 * Audio module - Web Audio API for sound effects
 * Per spec FR-017: movement, collision, collection with mute support
 * Uses procedural sounds (no asset files) for MVP
 */

import { getMute } from './storage.js';

let audioCtx = null;

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

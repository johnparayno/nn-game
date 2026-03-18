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
 * Sound: lane change / movement
 */
export function playMovement() {
  if (getMute()) return;
  playTone({
    freq: 220,
    duration: 0.08,
    type: 'sine',
    gain: 0.12,
    freqEnd: 280
  });
}

/**
 * Sound: collision (car, roadblock, oil)
 */
export function playCollision() {
  if (getMute()) return;
  playTone({
    freq: 80,
    duration: 0.2,
    type: 'sawtooth',
    gain: 0.2,
    freqEnd: 40
  });
}

/**
 * Sound: collectible (coin, fuel)
 */
export function playCollection() {
  if (getMute()) return;
  playTone({
    freq: 600,
    duration: 0.1,
    type: 'sine',
    gain: 0.15,
    freqEnd: 800
  });
}

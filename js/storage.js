/**
 * sessionStorage helpers for high score, mute, selectedRider
 * Per data-model.md
 */

const KEYS = Object.freeze({
  HIGH_SCORE: 'nn-game-highScore',
  MUTE: 'nn-game-mute',
  SELECTED_RIDER: 'nn-game-selectedRider'
});

function safeGet(key, defaultValue) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getHighScore() {
  const v = safeGet(KEYS.HIGH_SCORE, 0);
  return typeof v === 'number' && v >= 0 ? v : 0;
}

export function setHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    safeSet(KEYS.HIGH_SCORE, score);
    return score;
  }
  return current;
}

export function getMute() {
  const v = safeGet(KEYS.MUTE, false);
  return typeof v === 'boolean' ? v : false;
}

export function setMute(muted) {
  safeSet(KEYS.MUTE, Boolean(muted));
}

export function getSelectedRider() {
  const v = safeGet(KEYS.SELECTED_RIDER, 1);
  return [1, 2, 3].includes(v) ? v : 1;
}

export function setSelectedRider(riderId) {
  if ([1, 2, 3].includes(riderId)) {
    safeSet(KEYS.SELECTED_RIDER, riderId);
  }
}

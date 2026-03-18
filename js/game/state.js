/**
 * Game state machine: loading, start, playing, paused, game-over
 * Per data-model.md and plan.md
 */

export const STATES = Object.freeze({
  LOADING: 'loading',
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game-over'
});

export function createStateMachine() {
  let current = STATES.LOADING;
  const listeners = new Set();

  function get() {
    return current;
  }

  function set(next) {
    if (!Object.values(STATES).includes(next)) {
      throw new Error(`Invalid state: ${next}`);
    }
    if (current === next) return;
    const prev = current;
    current = next;
    listeners.forEach((fn) => fn({ prev, next }));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function isPlaying() {
    return current === STATES.PLAYING;
  }

  function isPaused() {
    return current === STATES.PAUSED;
  }

  function isStart() {
    return current === STATES.START;
  }

  function isGameOver() {
    return current === STATES.GAME_OVER;
  }

  function isLoading() {
    return current === STATES.LOADING;
  }

  return {
    get,
    set,
    subscribe,
    isPlaying,
    isPaused,
    isStart,
    isGameOver,
    isLoading,
    STATES
  };
}

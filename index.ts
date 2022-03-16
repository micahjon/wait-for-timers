type NonEmptyArray<T> = T[] & { 0: T };

/**
 * Wait for a queue of sequential timers to complete before calling
 * a callback. Returns cancellation function to abort queue.
 * @param timerQueue Array of timers:
 * - "raf" -> requestAnimationFrame
 * - "ric" -> requestIdleCalback
 * - {number} -> setTimeout
 * @param onComplete Called after queue of timers completes
 * @returns Cancellation function that can be called to abort queue
 */
export default function waitForTimers(
  timerQueue: NonEmptyArray<'raf' | 'ric' | number>,
  onComplete: Function
): () => void {
  // Cancel current timer (gets overridden as timer changes)
  let cancelTimer = () => {};

  // Process first timer in queue
  nextTimer(0);

  return () => cancelTimer();

  function nextTimer(index: number) {
    // All timers have completed
    if (index >= timerQueue.length) return onComplete();

    const timer = timerQueue[index];
    const startNextTimer = () => nextTimer(++index);
    if (typeof timer === 'number') {
      cancelTimer = getTimers().timeout(startNextTimer, timer);
    } else {
      cancelTimer = getTimers()[timer](startNextTimer);
    }
  }

  function getTimers() {
    return {
      raf: (fn) => {
        const rafId = requestAnimationFrame(fn);
        return () => cancelAnimationFrame(rafId);
      },
      ric: (fn) => {
        const ricId = requestIdleCallback(fn);
        return () => cancelIdleCallback(ricId);
      },
      timeout: (fn, timeoutMs) => {
        const timeoutId = setTimeout(fn, timeoutMs);
        return () => clearTimeout(timeoutId);
      },
    };
  }
}

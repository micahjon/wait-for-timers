# wait-for-timers

Simple helper function that makes it easy to chain (and cancel) multiple DOM timers with a simple unified API.

- `requestAnimationFrame`
- `requestIdleCallback`
- `setTimeout`

```js
// TLDR
import waitForTimers from 'wait-for-timers';

const cancel = waitForTimers([1000, 'ric', 'raf'], () => {
  // Wait a second, then for browser to be idle, then
  // for frame to be ready, then do something...
});
```

## Chaining multiple timers

Avoid deep nesting:

```js
// Before
setTimeout(() => {
  requestIdleCallback(() => {
    requestAnimationFrame(() => {
      // Do something
    });
  });
}, 3000);
```

```js
// After
import waitForTimers from 'wait-for-timers';

waitForTimers([3000, 'ric', 'raf'], () => {
  // Do something
});
```

## Cancelling multiple timers

This is where the abstraction really comes in handy...

```js
// Before
let timeoutId, ricId, rafId;

timeoutId = setTimeout(() => {
  ricId = requestIdleCallback(() => {
    rafId = requestAnimationFrame(() => {
      // Do something
    });
  });
}, 3000);

const cancelQueue = () => {
  clearTimeout(timeoutId);
  cancelIdleCallback(ricId);
  cancelAnimationFrame(rafId);
};
```

```js
// After
const cancelQueue = waitForTimers([3000, 'ric', 'raf'], () => {
  // Do something
});
```

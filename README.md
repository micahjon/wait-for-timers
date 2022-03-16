# wait-for-timers

Simple helper function that makes it easy to chain (and cancel) multiple DOM timers, e.g.

- requestAnimationFrame
- requestIdleCallback
- setTimeout

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

// After
waitFortimers([3000, 'raf', 'ric'], () => {
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

const cancelQueueManually = () => {
  clearTimeout(timeoutId);
  cancelIdleCallback(ricId);
  cancelAnimationFrame(rafId);
};

// After
const cancelQueueSimply = waitFortimers([3000, 'raf', 'ric'], () => {
  // Do something
});
```

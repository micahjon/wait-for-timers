# wait-for-timers

[![npm](https://img.shields.io/npm/v/wait-for-timers.svg)](https://www.npmjs.com/package/wait-for-timers)
[![minzip](https://img.shields.io/bundlephobia/minzip/wait-for-timers.svg)](https://www.npmjs.com/package/wait-for-timers)
![types](https://img.shields.io/badge/types-typescript-blueviolet)

A tiny utility that makes it easy to chain (and cancel) multiple DOM timers with a simple unified API:

- `requestAnimationFrame -> "raf"`
- `requestIdleCallback -> "ric"`
- `setTimeout -> ms`

```js
import waitForTimers from 'wait-for-timers';

const cancel = waitForTimers([1000, 'ric', 'raf'], () => {
  // Wait a second, then for browser to be idle, then
  // for frame to be ready, then do something...
});
```

Install via npm or yarn:

```bash
npm install wait-for-timers
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
waitForTimers([3000, 'ric', 'raf'], () => {
  // Do something
});
```

## Cancelling multiple timers

This is where the abstraction really comes in handy:

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

## React Hooks

Great for cancellable animations, e.g.

```js
// Toast component (starts off hidden)
const [styles, setStyles] = useState({
  transform: 'translateY(1rem)',
  opacity: '0',
});

useLayoutEffect(() => {
  // Fade-in new toast
  let cancel = waitForTimers(['raf'], () => {
    setStyles({});

    // Fade-out toast after 3 seconds
    cancel = waitForTimers([3000, 'raf'], () => {
      setStyles({ opacity: '0' });

      // Remove toast from DOM after fade-out animation completes
      cancel = waitForTimers([200], () => removeToast());
    });
  });

  // Allow cancellation at any point
  return () => cancel();
}, []);

return <Toast style={styles}>...</Toast>;
```

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// false on the server and while React takes over the pre-rendered homepage (entry-server.jsx), true
// right after; true from the start when a page renders in the browser only. For the few parts drawn
// differently per device, which the server can't know: render them once this is true, so the
// pre-rendered markup always matches the browser's first render.
export default function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

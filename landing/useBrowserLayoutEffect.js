import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect in the browser. Pre-rendering (entry-server.jsx) has no layout to read, and React
// warns about layout effects there; on the server this is useEffect, which doesn't run at all.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default useBrowserLayoutEffect;

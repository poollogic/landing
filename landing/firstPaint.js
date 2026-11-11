import { SCROLL_FX_QUERY } from './useHeroScrollFx.js';
import { KEY, TOUCH_QUERY, DARK_QUERY } from './preview/previewTheme.js';

// The pre-rendered homepage's first script, inlined in its <head> (entry-server.jsx,
// scripts/prerender.mjs). It runs before the page paints and tells the CSS what the scripts will
// draw, so the first paint already matches (hero.css, "Before the scripts run"):
//   pv-pending       this visitor's dashboard preview will be light (the same choice as
//                    previewTheme.js: their saved pick; else, on touch screens, the device's
//                    appearance; else dark), while the page was drawn dark
//   lt-pending       the laptop's dashboard starts tilted back (hero.css), as the scroll effect draws it
//                    (the same query as useHeroScrollFx.js)
// The scripts take them off. If they never run, the preview shows (dark) and the dashboard lies flat
// after 4s anyway.
const q = JSON.stringify;
export const homeFirstPaintScript = `(function(){var d=document.documentElement;function m(x){try{return matchMedia(x).matches}catch(e){return false}}var s=null;try{s=localStorage.getItem(${q(KEY)})}catch(e){}var t=s==='light'||s==='dark'?s:m(${q(TOUCH_QUERY)})?(m(${q(DARK_QUERY)})?'dark':'light'):'dark';if(t!=='dark'){d.classList.add('pv-pending');setTimeout(function(){d.classList.remove('pv-pending')},4000)}if(m(${q(SCROLL_FX_QUERY)})){d.classList.add('lt-pending');setTimeout(function(){d.classList.remove('lt-pending')},4000)}})();`;

/**
 * Inline <head> script for the one-time nav logo intro (D-013), styled in
 * NavLogo.module.css. It runs before the body is parsed, so the intro does not
 * wait for hydration, and it only ever opts IN: any failure leaves the plain
 * logo. Sets html[data-logo-intro]:
 *   "wait" — first load of the session, motion allowed, clip-path supported;
 *   "play" — logo PNG and its layer copies are loaded and decoded;
 *   removed — when the intro has finished, on error, or after 3 s of waiting.
 * Removing it after the intro means remounts on client-side navigation stay static.
 */
export const LOGO_INTRO_SCRIPT = `(function(){var d=document.documentElement,k='dc-logo-intro',done=0,t;
function stop(){if(done)return;done=1;clearTimeout(t);d.removeAttribute('data-logo-intro');
document.removeEventListener('load',on,true);document.removeEventListener('error',on,true)}
function on(e){var el=e.target;if(done||!el||!el.hasAttribute||!el.hasAttribute('data-logo-base'))return;
if(e.type==='error')return stop();
try{var ls=el.parentNode.querySelectorAll('[data-logo-layer]');
if(!ls.length)return stop();
Promise.all(Array.prototype.map.call(ls,function(i){return i.decode?i.decode():null})).then(function(){
if(done)return;clearTimeout(t);try{sessionStorage.setItem(k,'1')}catch(_){}
d.setAttribute('data-logo-intro','play');t=setTimeout(stop,1600)},stop)}catch(_){stop()}}
try{if(sessionStorage.getItem(k))return;
if(!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(!(window.CSS&&CSS.supports&&CSS.supports('clip-path','polygon(0 0,1px 0,0 1px)'))||!window.Promise)return;
t=setTimeout(stop,3000);
document.addEventListener('load',on,true);document.addEventListener('error',on,true);
d.setAttribute('data-logo-intro','wait')}catch(_){stop()}})();`;

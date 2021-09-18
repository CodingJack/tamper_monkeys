// ==UserScript==
// @name         DailyWire
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  good to understand what kind of garbage people are reading..
// @author       CodingJack
// @match        https://www.dailywire.com/*
// @icon         https://www.google.com/s2/favicons?domain=dailywire.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [my 2c]
 */
(() => {
  document.documentElement.id = 'f-this-guy';
  const style = document.createElement( 'style' );
  style.innerHTML = `
    #f-this-guy .this-dudes-a-pos {
      overflow: auto !important;
      height: auto !important;
    }
  `;
  document.head.appendChild( style );
  Array.from(
    document.querySelectorAll( '*[class^="css-"]' )
  ).forEach( itm => {
    itm.classList.add( 'this-dudes-a-pos' );
  });
})();
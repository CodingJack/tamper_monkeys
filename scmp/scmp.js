// ==UserScript==
// @name         South China Morning Post
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the articles they send
// @author       CodingJack
// @match        https://www.scmp.com/*
// @icon         https://www.google.com/s2/favicons?domain=scmp.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [my 2c]
 */
window.addEventListener( 'load', () => {
  Array.from(
    document.getElementsByTagName( 'script' )
  ).forEach( script => {
    const { type } = script;
    if( type !== 'application/ld+json' ) {
      return;
    }
    const obj = JSON.parse( script.innerHTML );
    if( ! obj || ! obj.articleBody ) {
      return;
    }
    const div = document.createElement( 'div' );
    const style = {
      position: 'absolute',
      zIndex: 9999999,
      left: 0,
      top: 0,
      height: 'auto',
      padding: '50px',
      font: '18px/36px courier',
      background: 'white',
      overflow: 'scroll',
    };
    Object.keys( style ).forEach( itm => {
      div.style[ itm ] = style[ itm ];
    });
    const { articleBody = '' } = obj;
    div.innerHTML = articleBody;
    document.body.appendChild( div );
    document.documentElement.style.overflow = 'scroll';
  });
});
// ==UserScript==
// @name         Economist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the articles they send
// @author       You
// @match        https://www.economist.com/*
// @icon         https://www.google.com/s2/favicons?domain=economist.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [my 2c]
 */
(() => {
  const frag = document.createDocumentFragment();
  Array.from( document.querySelectorAll( '.article__body-text' ) ).forEach( itm => {
    frag.appendChild(itm);
  });
  const wrap = document.createElement( 'div' );
  wrap.id = 'yoyoyo';

  const style = document.createElement( 'style' );
  style.innerHTML = `
    #yoyoyo {
      position: absolute;
      z-index: 9999999;
      left: 0;
      top: 0;
      background: linear-gradient(160deg, #69EACB, #EACCF8, #6654F1);
      color: black;
      width: 100%;
      text-align: center;
    }
    #yoyoyo #hellcat-huncho {
      padding: 50px;
      max-width: 1500px;
      margin: 0 auto;
    }
    #yoyoyo img {
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
    #yoyoyo h1 {
      font-size: 48px;
      color: black;
      font-family: verdana;
      margin-bottom: 10px;
    }
    #yoyoyo h2 {
      margin-top: 0;
    }
    #yoyoyo p {
      margin: 20px 0;
      padding: 20px;
      background-color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      line-height: 28px;
      font-family: monospace;
      text-align: left;
    }
    span[data-ornament="ufinish"] {
      display: none;
    }
  `;
  const temp = document.createDocumentFragment();
  Array.from(
    document.querySelectorAll( '.article__lead-image img' )
  ).forEach( img => {
    temp.appendChild( img );
  })
  Array.from(
    document.getElementsByClassName( 'article__header' )
  ).forEach( itm => {
    wrap.appendChild( itm );
  });
  const inner = document.createElement( 'div' );
  inner.id = 'hellcat-huncho';
  inner.appendChild( frag );
  wrap.appendChild( temp );
  wrap.appendChild( inner );
  document.head.appendChild( style );
  document.body.appendChild( wrap );
})();
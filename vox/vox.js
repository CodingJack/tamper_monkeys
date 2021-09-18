// ==UserScript==
// @name         vox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the articles they send
// @author       CodingJack
// @include      https://nymag.com/*
// @include      https://www.thecut.com/*
// @include      https://www.vulture.com/*
// @include      https://www.curbed.com/*
// @include      https://www.grubstreet.com/*
// @icon         https://www.google.com/s2/favicons?domain=thecut.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [my 2c]
 */
(() => {
  const ar = Array
    .from( document.querySelectorAll( '.clay-paragraph' ) )
    .map( itm => itm.innerHTML );
  const frag = document.createDocumentFragment();
  const d = document.createElement( 'div' );
  const h1 = document.createElement( 'h1' );
  const header = document.querySelector( '.headline-primary' );
  const img = document.querySelector( '.lede-image-wrapper' );
  const imag = document.createElement( 'div' );
  ar.forEach( itm => {
    const p = document.createElement( 'p' );
    p.innerHTML = itm;
    frag.appendChild( p );
  });
  imag.innerHTML = img.innerHTML;
  imag.style.paddingBottom = '30px';
  imag.style.textAlign = 'center';
  h1.style.textAlign = 'center';
  h1.innerHTML = header.innerHTML;
  d.appendChild( h1 );
  d.appendChild( imag );
  const style = {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: '50%',
    height: '100%',
    padding: '50px',
    overflow: 'scroll',
    fontSize: '18px',
    lineHeight: '32px',
    fontFamily: 'courier',
    transform: 'translate(-50%, 0)',
  };
  Object.keys( style ).forEach( prop => {
    d.style[ prop ] = style[ prop ];
  });
  d.appendChild( frag );
  document.body.innerHTML = '';
  document.body.appendChild( d );
  document.documentElement.style.overflow = 'auto';
  document.body.style.position = 'static';
})();
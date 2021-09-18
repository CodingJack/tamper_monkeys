// ==UserScript==
// @name         Break NYTimes Paywall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the articles they send
// @author       CodingJack
// @match        https://www.nytimes.com/*
// @icon         https://www.google.com/s2/favicons?domain=nytimes.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [my 2c]
 */
(() => {
  const paragraphs = Array
    .from( document.querySelectorAll( '.StoryBodyCompanionColumn p' ) )
    .map( itm => itm.innerHTML );
  if( ! paragraphs.length ) {
    return;
  }
  const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: '#111',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '36px',
    fontFamily: 'courier',
    transition: 'all 0.3s ease-out',
    opacity: 0,
    zIndex: 9999999999,
  };
  const loader = document.createElement( 'div' );
  Object.keys( style ).forEach( prop => {
    loader.style[ prop ] = style[ prop ];
  });
  loader.innerHTML = 'Preparing Article... by CodingJack';
  document.body.appendChild( loader );

  void loader.offsetWidth;
  loader.style.opacity = 1;

  const fixDoc = () => {
    const top = document.getElementById( 'top-wrapper' );
    const bottom = document.getElementById( 'bottom-wrapper' );
    const wrap = top ? [ top ] : [];
    if( bottom ) {
      wrap.push( bottom );
    }
    [
      ...Array.from( document.getElementsByTagName( 'iframe' ) ),
      ...Array.from( document.getElementsByTagName( 'video' ) ),
      ...Array.from( document.querySelectorAll( 'div[id^="story-ad"]' ) ),
      ...Array.from( document.querySelectorAll( 'div[id^="google_ads"]' ) ),
      ...Array.from( document.getElementsByClassName( 'ad' ) ),
      ...wrap,
    ].forEach( itm => {
      itm.remove();
    });
    Array.from( document.querySelectorAll( 'div[class^="css-"]' ) ).forEach( itm => {
      itm.style.background = 'transparent';
    });
    Array.from( document.body.children ).forEach( itm => {
      const pos = window
        .getComputedStyle( itm, null )
        .getPropertyValue( 'position' );
      if( pos === 'fixed' || pos === 'absolute' ) {
        if( itm !== loader ) {
          itm.remove();
        }
      }
    });
    const article = document.querySelector( 'section[name="articleBody"]' );
    if( ! article ) return;
    const container = article.querySelector( '.StoryBodyCompanionColumn' );
    if( ! container ) return;
    const content = container.querySelector( 'div' );
    if( ! content ) return;
    const p = content.querySelector( 'p' );
    if( ! p ) return;

    const clas = p.className;
    const frag = document.createDocumentFragment();
    paragraphs.forEach( text => {
      const p = document.createElement( 'p' );
      p.className = clas;
      p.innerHTML = text;
      frag.appendChild( p );
    });
    content.appendChild( frag );
    loader.style.transitionDelay = '300ms';
    window.requestIdleCallback( () => {
      loader.style.visibility = 'hidden';
      loader.style.opacity = 0;
      loader.style.color = '#111';
    });
  };
  const run = () => {
    const article = document.querySelectorAll( 'div[class^="css-mcm"]' );
    const paywall = document.getElementById( 'gateway-content' );
    let passed;
    if( paywall ) {
      paywall.style.display = 'none';
    }
    if( article ) {
      Array.from( article ).forEach( itm => {
        itm.style.position = 'static';
        itm.style.height = 'auto';
        itm.style.overflow = 'scroll';
      });
      passed = !! paywall;
    }
    if( ! passed ) {
      window.requestIdleCallback( run );
    } else {
      fixDoc();
    }
  }
  window.requestIdleCallback( run );
})();
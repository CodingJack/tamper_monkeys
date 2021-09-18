// ==UserScript==
// @name         Washington Post
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  read the articles they send
// @author       CodingJack
// @match        https://www.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?domain=washingtonpost.com
// @grant        none
// ==/UserScript==

/*
 * the full article is already in the page source.
 * this is just a presentation wrapper for it.
 * and if they don't want people reading certain parts of their source code, 
 * they shouldn't freely and willingly send it to us [ my 2c ]
 */
(() => {
  const script = document.getElementById( '__NEXT_DATA__' );
  const text = script.innerHTML;
  const data = JSON.parse( text );
  const { props } = data;
  const { pageProps } = props;
  const { globalContent } = pageProps;
  const { content_elements:content } = globalContent;
  const paragraphs = content.map( itm => {
    const { content = '' } = itm;
    if( content.substr( 0, 3 ) !== '<b>' ) {
      return content;
    }
    return content.replace( '<b>', '<b style="margin-top: 30px' );
  }).join( '<br>' );
  const article = paragraphs
    .replace( /<br><br>/g, '<br>' )
    .replace( /<br>/g, '<br><br>' );

  const style = document.createElement( 'style' );
  style.innerHTML = `
    html,
    body {
      position: static !important;
      overflow: scroll !important;
      overflow-x: hidden !important;
      height: auto !important;
    }
    body > * {
      display: none !important;
    }
    #funtimes {
      position: absolute;
      background: white;
      top: 0;
      left: 0;
      width: 100%;
      overflow: scroll;
      z-index: 999999;
      font: 18px/27px Courier;
    }
    body #funtimes {
      display: block !important;
    }
    #morefun {
      max-width: 590px;
      padding: 50px;
      margin: 60px auto 0;
      opacity: 0;
      transition: opacity 0.3s ease-out 0.3s;
    }
    #morefun h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    #morefun figure {
      margin-bottom: 0;
    }
    #morefun img {
      max-width: 100%;
      height: auto;
    }
    #morefun * {
      filter: none !important;
    }
    .paywall-overlay {
      display: none !impoortant;
    }
  `;
  const header = document.querySelector( 'h1' )
  const headline = header ? header.innerHTML : 'Information for All';
  const container = document.createElement( 'div' );
  container.appendChild(
    Array.from(
      document.getElementsByTagName( 'nav' )
    ).shift()
  );
  const inner = document.createElement( 'div' );
  inner.id = 'morefun';
  inner.innerHTML = `<h1>${ headline }</h1>${ article }`;
  const figure = Array.from(
    document.getElementsByTagName( 'figure' )
  );
  if( figure.length ) {
    inner.insertBefore(
      figure[0], inner.querySelector( 'h1' ).nextSibling
    );
  }
  container.appendChild( inner );
  container.id = 'funtimes';

  const frag = document.createDocumentFragment();
  frag.appendChild( style );
  frag.appendChild( container );
  document.body.appendChild( frag );

  void inner.offsetWidth;
  inner.style.opacity = 1;
})();
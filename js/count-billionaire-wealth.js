// ==UserScript==
// @name         billionaires
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  counts the billionaire scumbags total world wealth
// @author       CodingJack
// @match        https://www.forbes.com/billionaires/
// @icon         https://www.google.com/s2/favicons?domain=forbes.com
// @grant        none
// ==/UserScript==

/*
 * rich people are scum.
 * run this TamperMonkey script on forbes.com to see how much of the world's money they actually have
 * we should shame them constantly, and treat them like the scum of the earth that they are
 * they should live in a world where only money can buy their friendship
 * the rest of us have a duty to spit in their faces every chance we get
 */
window.addEventListener('load', () => {
  const worldWealth = 256; // trillions as of 2016, https://www.mvorganizing.org/what-would-happen-if-wealth-was-evenly-distributed/
  const onlyUS = false;
  let money = 0;
  let people = 0;
  let counter = 1;
  let pages;
  const notice = document.createElement( 'div' );
  const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'inline-block',
    padding: '30px',
    background: 'white',
    color: 'black',
    fontSize: '24px',
    border: '10px solid red',
    boxShadow: '5px 5px',
    zIndex: 999999,
  };
  Object.keys( style ).forEach( prop => {
    notice.style[ prop ] = style[ prop ];
  })
  notice.innerHTML = 'hang tight, total coming...'
  const run = () => {
    const table = Array.from( document.querySelectorAll( '.netWorth' ) );
    const country = Array.from( document.querySelectorAll( '.countryOfCitizenship' ) );
    let ar = [];
    table.forEach( ( itm, index ) => {
      if( onlyUS ) {
        if( country[ index ].innerText === 'United States' ) {
          ar = [ ...ar, ...Array.from( itm.children ) ];
        }
      } else {
        ar = [ ...ar, ...Array.from( itm.children ) ];
      }
    });
    const all = ar
      .map( itm => itm.innerText )
      .filter( itm => itm.charAt(0) === '$' )
      .map( itm => parseFloat( itm.replace( ' B', '' ).replace( '$', '' ) ) );
    people += all.length;
    money += all.reduce( ( prev, cur ) => prev + cur );
    runner();
  };
  const onGo = () => {
    setTimeout( run, 1000 );
  };
  const btns = Array.from( document.querySelectorAll( '.goto-page__btn' ) );
  pages = btns.length;
  btns.forEach( btn => {
    btn.addEventListener( 'click', onGo );
  });
  document.body.appendChild( notice );
  const runner = () => {
    if( counter < pages ) {
      btns[ counter ].click();
    } else {
      const tril = money / 100;
      const scumbags = people.toString().replace( /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',' );
      const area = ! onlyUS ? 'world' : 'U.S.';
      notice.innerHTML = `
        ${ scumbags } scumbags in the ${ area } own ${ tril.toFixed(2) } trillion
        <br>
        the rest of the world owns ${ ( worldWealth - tril).toFixed(2) } trillion
      `;
    }
    counter++;
  };
  onGo();
});
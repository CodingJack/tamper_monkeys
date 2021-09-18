// ==UserScript==
// @name         ws journal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  when data gets attached as a global, we can read the entire thing
// @author       CodingJack
// @match        https://www.wsj.com/articles/*
// @icon         https://www.google.com/s2/favicons?domain=wsj.com
// @grant        none
// ==/UserScript==

/*
 * this is an example of why code should never be accessible from the global scope
 * here you can see an amazing dump of data, 
 * and the most important thing is that once I gain access to the function, then it can be used.
 * "runFunctions" below is set to false, and therefore functions will not be invoked.  
 * that's also not recommended, as you could be making inappropriate server calls...
 * but it's there to give an idea how this could work.
 */
window.addEventListener( 'load', () => {
  // run functions?
  const runFunctions = false;
  // hijack window?
  const hijackWindow = true;

  const meta = document.createElement( 'meta' );
  meta.setAttribute( 'http-equiv', 'Content-Security-Policy' );
  meta.setAttribute( 'content', 'upgrade-insecure-requests' );

  const blankTrue = () => true;
  const blankFalse = () => false;
  const unloader = e => {
     e.preventDefault();
     e.returnValue = 'no';
  };
  const params = [ {}, {}, {}, {}, {}, ];
  const onReset = () => {
    window.onbeforeunload = unloader;
    window.onerror = blankTrue;
    window.FormData = false;
    window.alert = blankFalse;
    window.print = blankFalse;
    window.prompt = blankFalse;
    window.confirm = blankFalse;
    Notification.onshow = blankTrue;
    navigator.sendBeacon = blankFalse;
    document.head.appendChild( meta );
  };
  const reset = hijackWindow ? onReset : () => {};
  const printItm = ( path, key, wildcard ) => {
    const parsed = parseInt( key, 10 );
    const prefix = isNaN( parsed) ? `.${ key }` : `[${ key }]`;
    console.log( `${ path }${ prefix } = ${ wildcard }` );
  };
  const ripObject = ( obj, path ) => {
    Object.keys( obj ).forEach( key => {
      runItBack( obj, path, key );
    });
  };
  const ripArray = ( arr, path ) => {
    arr.forEach( ( itm, index ) => {
      if( typeof itm === 'object' ) {
        window.requestIdleCallback( () => {
          if( ! Array.isArray( itm ) ) {
            ripObject( itm, `${ path }[${ index }]` );
          } else {
            ripArray( itm, `${ path }[${ index }]` );
          }
        });
      } else {
        printItm( path, index, itm );
      }
    });
  };
  const runItBack = ( obj, path, key ) => {
    const wildcard = typeof obj === 'object' ? obj[ key ] : obj;
    const primitive = typeof wildcard;
    if( wildcard && primitive === 'object' ) {
      window.requestIdleCallback( () => {
        if( ! Array.isArray( wildcard ) ) {
          ripObject( wildcard, `${ path }.${ key }` );
        } else {
          ripArray( wildcard, `${ path }.${ key }` );
        }
      });
    } else if( runFunctions && primitive === 'function' ) {
      window.requestIdleCallback( () => {
        try {
          obj[ key ]( ...params );
        } catch(e) {
          console.log(e);
        } finally {
          reset();
        }
      });
    } else {
      printItm( path, key, wildcard );
    }
  };
  const timer = () => {
    setTimeout( () => {
      if( window.globalThis ) {
        reset();
        ripObject( window.globalThis, 'globalThis' );
      } else {
        timer();
      }
    }, 500 );
  };
  timer();
});
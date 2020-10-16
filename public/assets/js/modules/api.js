// import { constructBookmarksSection, removeBookmarks } from './bookmarks.js';
// import { resetFields, displayErrorMessage }           from './formEdit.js';
// import { formController }                             from './formControl.js';

const
	domainUrl = window.location.protocol + '//' + window.location.hostname + ( ( window.location.port ) ? ':' + window.location.port : '' ) + '/',

	// API PROMISE && AJAX CALL
	// AJAX
	call = ( resolve, reject, verb, url, params ) => {
		const xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				const status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
			       		resolve( JSON.parse( this.responseText ) );
		            } else {
		            	reject( this.responseText );
		            }
				} else {
					reject( this.responseText );
				}
			}	        
	    };
	    xhr.open( verb, domainUrl + url, true );
	    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	    xhr.send( params );	
	},

	// THIS PROMISE HANDLES ALL API ACTIONS (VERBS): GET, POST, DELETE, PUT.
	scheduleApiCall = ( verb, url, params = '' ) => {

		let promise = new Promise ( ( resolve, reject ) => {
			call( resolve, reject, verb, url, params );
		});

		return promise.then( ( data ) => { 
			if ( verb === 'GET' ) {
				if ( data.length > 0 ) {
		   			sessionStorage.setItem( 'bookmarksData', JSON.stringify( data ) );
		   			import( './bookmarks.js' ).then( ( module ) => {
		   				module.constructBookmarksSection( data );
		   			} );
				} else {	
		   			import( './formControl.js' ).then( ( module ) => {
		   				module.formController( 'create', 'group' );
		   			} );
		   			import( './modal.js' ).then( ( module ) => {
		   				module.toggleModalHelp( 'helpEmptyDatabase' );
		   			} );
		   			import( './bookmarks.js' ).then( ( module ) => {
		   				module.removeBookmarks();
		   			} );		   					   			
   				}	
			} else {
				import( './api.js' ).then( ( module ) => {
					module.scheduleApiCall( 'GET', 'bookmarks' );
				} );
				import( './formEdit.js' ).then( ( module ) => {
					module.resetFields();
				} );
			}
		} ).catch( ( error ) => { 
			import( './formEdit.js' ).then( ( module ) => {
				module.displayErrorMessage( error );
			} );			
		} )

	};

export { scheduleApiCall } 
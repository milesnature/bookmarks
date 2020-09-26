const
	domainUrl = window.location.protocol + '//' + window.location.hostname + ( ( window.location.port ) ? ':' + window.location.port : '' ) + '/',

	// API CALLS
	api = {
		getBookmarks : ( resolve, reject ) => {
			console.log( resolve, reject );
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
		    xhr.open( 'GET', domainUrl + 'bookmarks', true );
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send();
		},

		getBookmarks2 : ( resolve, reject ) => {
			console.log( resolve, reject );
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
		    xhr.open( 'GET', domainUrl + 'bookmarks', true );
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send();
		},

		verbBookmark : ( action, url, params ) => {
			const xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function () {
				if( xhr.readyState === XMLHttpRequest.DONE ) {
					const status = xhr.status;
					if ( status === 0 || ( status >= 200 && status < 400 ) ) {
				       	if ( this.responseText ) {
			       			api.getBookmarks();
			            } else {
			            	edit.displayErrorMessage( this.responseText );
			            }
					} else {
						edit.displayErrorMessage( this.responseText );
					}
				}	        
		    };
		    
		    xhr.open( action, url, true );
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send( params );	
		}
	};	

export { api }
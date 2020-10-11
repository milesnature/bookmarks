const
	domainUrl = window.location.protocol + '//' + window.location.hostname + ( ( window.location.port ) ? ':' + window.location.port : '' ) + '/',

	// API CALLS
	api = {

		verbBookmark : ( resolve, reject, verb, url, params ) => {
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
		}
		
	};	

export { api } 
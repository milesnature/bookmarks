import { scheduleApiCall } from './modules/api.js';
	
// INITIATE GET BOOKMARKS PROMISE
scheduleApiCall( 'GET', 'bookmarks' );

import( './modules/bookmarks.js' ).then( ( module ) => {  } );
import( './modules/footer.js' ).then( ( module ) => {  } );
	
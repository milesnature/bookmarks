import { bookmarks }                         from './modules/bookmarks.js'; /* REMOVE ? */
import { api }                               from './modules/api.js';
import { setupFooter }                       from './modules/footer.js';
import { setStoredState, setStoredSettings } from './modules/storage.js';

// SETUP AFTER PAGE LOADS	
window.onload = () => {
	
	// INITIATE GET BOOKMARKS PROMISE
	api.scheduleApiCall( 'GET', 'bookmarks' );

};
import { scheduleApiCall }                   from './modules/api.js';
import { setupFooter }                       from './modules/footer.js';
import { setStoredState, setStoredSettings } from './modules/storage.js';

// SETUP AFTER PAGE LOADS	
window.onload = () => {
	
	// INITIATE GET BOOKMARKS PROMISE
	scheduleApiCall( 'GET', 'bookmarks' );

};
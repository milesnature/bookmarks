import { bookmarks }                         from './modules/bookmarks.js';
import { api }                               from './modules/api.js';
import { setStoredState, setStoredSettings } from './modules/storage.js';

// SETUP AFTER PAGE LOADS	
window.onload = () => {

	// DISPLAY LOADING ICON WHILE BOOKMARKS ARE RETRIEVED.
	bookmarks.toggleBookmarksLoader( 'add' );
	
	// INITIATE GET BOOKMARKS PROMISE
	api.makeApiCall( 'GET', 'bookmarks' );

	setStoredState();
	setStoredSettings();

	// FOOTER COPYRIGHT DATE 
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();

};
import { edit }     from './edit.js';
import { settings } from './settings.js';

// RESTORE LAST SELECTED FORM STATE OR PREFERENCE FROM LOCAL STORAGE.
const 

	body               = document.body,
	bmkSection         = document.getElementById('bookmarks'),	
	editState          = ( localStorage.getItem('editState') )          ? localStorage.getItem('editState') : '',
	settingsState      = ( localStorage.getItem('settingsState') )      ? localStorage.getItem('settingsState') : '',
	settingsAppearance = ( localStorage.getItem('settingsAppearance') ) ? localStorage.getItem('settingsAppearance') : '',
	settingsStyle      = ( localStorage.getItem('settingsStyle') )      ? localStorage.getItem('settingsStyle') : '',

	setStoredState = () => {
		if ( editState === 'open' ) {
			edit.toggleEdit( 'add' );
		}
		if ( settingsState === 'open' ) {
			settings.toggleSettings( 'add' );
		}
	},

	setStoredSettings = () => {
		if ( settingsAppearance !== 'default' ) {
			body.classList.add( settingsAppearance + '-mode' );
		}
		if ( settingsStyle === 'tidy' ) {
			bmkSection.classList.add( 'tidy' );
		}
	};

export { setStoredState, setStoredSettings }

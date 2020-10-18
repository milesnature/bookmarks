// RESTORE LAST SELECTED FORM STATE OR PREFERENCE FROM LOCAL STORAGE.
const 
	body               = document.body,
	bmkSection         = document.getElementById('bookmarks'),	
	editState          = ( localStorage.getItem('editState') )          ? localStorage.getItem('editState') : '',
	settingsState      = ( localStorage.getItem('settingsState') )      ? localStorage.getItem('settingsState') : '',
	settingsAppearance = ( localStorage.getItem('settingsAppearance') ) ? localStorage.getItem('settingsAppearance') : '',
	settingsStyle      = ( localStorage.getItem('settingsStyle') )      ? localStorage.getItem('settingsStyle') : '',

	setStoredState = (() => {
		if ( editState === 'open' && settingsState === 'open' ) {
			localStorage.setItem( 'settingsState', 'closed' );			
		}
		if ( editState === 'open' ) {
			import('./formEdit.js').then( ( module ) => {
				module.toggleFormEdit( 'add' );
			} );
		}
		if ( settingsState === 'open' ) {
			import('./formSettings.js').then( ( module ) => {
				module.toggleFormSettings( 'add' );
			} );
		}
	})(),

	setStoredSettings = (() => {
		if ( settingsAppearance !== 'default' ) {
			body.classList.add( settingsAppearance + '-mode' );
		}
		if ( settingsStyle === 'tidy' ) {
			bmkSection.classList.add( 'tidy' );
		}
	})();

export { setStoredState, setStoredSettings };
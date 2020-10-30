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
		switch ( settingsAppearance ) {
			case 'default':
				body.classList.remove( 'light-mode', 'dark-mode' );
				body.classList.add( 'default' );
				break;
			case 'light':
				body.classList.remove( 'dark-mode', 'default' );
				body.classList.add( 'light-mode' );
				break;
			case 'dark':
				body.classList.remove( 'light-mode', 'default' );
				body.classList.add( 'dark-mode' );				
				break;	
			default:
				break;
		}
		if ( settingsStyle === 'tidy' ) {
			bmkSection.classList.add( 'tidy' );
		}
	})();

export { setStoredState, setStoredSettings };
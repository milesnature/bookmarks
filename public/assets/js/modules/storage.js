// RESTORE LAST SELECTED FORM STATE OR PREFERENCE FROM LOCAL STORAGE.
const 
	body               = document.body,
	bmkSection         = document.getElementById( 'bookmarks' ),	
	editState          = ( localStorage.getItem( 'editState' ) )          ? localStorage.getItem( 'editState' ) : '',
	settingsState      = ( localStorage.getItem( 'settingsState' ) )      ? localStorage.getItem( 'settingsState' ) : '',
	settingsAppearance = ( localStorage.getItem( 'settingsAppearance' ) ) ? localStorage.getItem( 'settingsAppearance' ) : 'light',
	settingsStyle      = ( localStorage.getItem( 'settingsStyle' ) )      ? localStorage.getItem( 'settingsStyle' ) : '',
	groupsState        = ( localStorage.getItem( 'groupsState' ) )        ? localStorage.getItem( 'groupsState' ) : '',

	setStoredState = (() => {
		if ( editState === 'open' && settingsState === 'open' ) {
			localStorage.setItem( 'settingsState', 'closed' );			
		}
		if ( editState === 'open' ) {
			import( './formControl.js' ).then( ( module ) => { module.formController( 'create' ) } );
		}
		if ( settingsState === 'open' ) {
			import( './formControl.js' ).then( ( module ) => { module.formController( 'settings' ) } );
		}
		if ( groupsState === 'open' ) {
			import( './formControl.js' ).then( ( module ) => { module.formController( 'groups' ) } );
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
				localStorage.setItem( 'settingsAppearance', 'light' );
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

let formSettingsContainer;

const
	// SETTINGS FORM DOM ELEMENTS AND METHODS.
	toggleFormSettings = ( action ) => {

		formSettingsContainer = document.getElementById( 'formSettings' );

		const 
			body       = document.body,
			bmkSection = document.getElementById('bookmarks');

		switch ( action ) {

			case 'remove':
				if ( formSettingsContainer ) { 
					formSettingsContainer.remove(); 
					body.classList.remove( 'form-open' );
					import( './footer.js' ).then( ( module ) => { module.updateFooterButtons() } );
					localStorage.setItem( 'settingsState', 'closed' );
					import( './openGroup.js' ).then( ( module ) => {
						module.setupOpenGroupEventHandler( bmkSection );
					} );					
				}
				break;

			case 'add':

				if ( !formSettingsContainer ) {

					const 
						clone  = templateFormSettings.content.cloneNode( true ),
						footer = document.getElementsByTagName( 'footer' )[0];
					footer.parentNode.insertBefore( clone, footer );
					body.classList.add( 'form-open' );
					localStorage.setItem( 'settingsState', 'open' );

					import( './openGroup.js' ).then( ( module ) => {
						module.removeOpenGroupEventHandler( bmkSection );
					} );

					formSettingsContainer = document.getElementById( 'formSettings' );

					const
						appearanceDefault  = document.getElementById( 'appearanceDefault' ),
						appearanceLight    = document.getElementById( 'appearanceLight' ),
						appearanceDark     = document.getElementById( 'appearanceDark' ),
						styleDefault       = document.getElementById( 'styleDefault' ),
						styleTidy          = document.getElementById( 'styleTidy' ),
						settingsAppearance = ( localStorage.getItem( 'settingsAppearance' ) ) ? localStorage.getItem( 'settingsAppearance' ) : 'default',
						settingsStyle      = ( localStorage.getItem( 'settingsStyle' ) ) ? localStorage.getItem( 'settingsStyle' ) : 'default';

					switch ( settingsAppearance ) {
						case 'default':
							appearanceDefault.checked = true;
							break;
						case 'light':
							appearanceLight.checked = true;
							break;
						case 'dark':
							appearanceDark.checked = true;
							break;
						default:
							break;
					};

					switch ( settingsStyle ) {
						case 'default':
							styleDefault.checked = true;
							break;
						case 'tidy':
							styleTidy.checked = true;
							break;
						default:
							break;
					};

					// LISTEN FOR SETTINGS CHANGES
					formSettingsContainer.addEventListener('change', ( e ) => {
						const 
							target = e.target,
							tag    = target.tagName,
							name   = target.name,
							value  = target.value;
						switch ( name ) {
							case 'settingsAppearance':
								switch ( tag ) {
									case 'INPUT':
										body.classList.remove( 'light-mode', 'dark-mode', 'default' );
										switch ( value ) {
											case 'default':
												localStorage.setItem( 'settingsAppearance', 'default' );
												body.classList.add( 'default' );
												break;
											case 'light':
												localStorage.setItem( 'settingsAppearance', 'light' );
												body.classList.add( 'light-mode' );
												break;
											case 'dark':
												localStorage.setItem( 'settingsAppearance', 'dark' );
												body.classList.add( 'dark-mode' );
												break;
											default:
												break;
										}
										break;
									default:
										break;
								}
								break;
							case 'settingsStyle': 
								switch ( tag ) {
									case 'INPUT':
										bmkSection.classList.remove( 'tidy', 'default' );
										switch ( value ) {
											case 'default':
												localStorage.setItem( 'settingsStyle', 'default' );
												bmkSection.classList.add( 'default' );
												break;
											case 'tidy':
												localStorage.setItem( 'settingsStyle', 'tidy' );
												bmkSection.classList.add( 'tidy' );
												break;
											default:
												break;
										}
										break;
									default:
										break;
								}
								break;
							default:
								break;
						}
					});

					// LISTEN FOR CLOSE. 
					formSettingsContainer.addEventListener('click', ( e ) => {
						const 
							target = e.target,
							tag    = target.tagName,
							remove = 'remove';
						switch ( tag ) {
							case 'BUTTON':
								toggleFormSettings( remove );
								break;
							case 'svg':
								toggleFormSettings( remove );
								break;
							case 'path':
								toggleFormSettings( remove );
								break;					
							case 'polyline':
								toggleFormSettings( remove );
								break;
							default:
								break;			
						}
					});
				}
				break;

			default:
				break;
		}
	};

export { toggleFormSettings };
const
	// SETTINGS FORM DOM ELEMENTS AND METHODS.
	settings = {

		toggleSettings : ( action ) => {

			const 
				body       = document.body,
				bmkSection = document.getElementById('bookmarks'),
				s          = document.getElementById('settings');

			switch ( action ) {

				case 'remove':
					if ( s ) { 
						settings.container.removeEventListener('change', ( e ) => {});
						settings.container.removeEventListener('click',  ( e ) => {});
						s.remove(); 
						localStorage.setItem( 'settings', 'closed' );
					}
					break;

				case 'add':

					if ( !s ) {

						body.prepend( templateFormSettings.content.cloneNode( true ) );

						localStorage.setItem( 'settings', 'open' );

						const 
							appearance = localStorage.getItem( 'appearance' ),
							style      = localStorage.getItem( 'style' );

						if ( appearance ) { document.querySelector( 'input[value=' + appearance + ']'  ).checked = 'checked'; }
						if ( style )      { document.querySelector( 'input[value=' + style + ']'  ).checked = 'checked'; }

						settings[ 'container' ] = document.forms[0];					

						// LISTEN FOR SETTINGS CHANGES
						settings.container.addEventListener('change', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								name   = target.name,
								value  = target.value;
							switch ( name ) {
								case 'appearance':
									switch ( tag ) {
										case 'INPUT':
											body.classList.remove( 'light-mode', 'dark-mode' );
											switch ( value ) {
												case 'default':
													localStorage.setItem( 'appearance', 'default' );
													break;
												case 'light':
													localStorage.setItem( 'appearance', 'light' );
													body.classList.add( 'light-mode' );
													break;
												case 'dark':
													localStorage.setItem( 'appearance', 'dark' );
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
								case 'style': 
									switch ( tag ) {
										case 'INPUT':
											bmkSection.classList.remove( 'tidy' );
											switch ( value ) {
												case 'default':
													localStorage.setItem( 'style', 'default' );
													break;
												case 'tidy':
													localStorage.setItem( 'style', 'tidy' );
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
						settings.container.addEventListener('click', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								remove = 'remove';
							switch ( tag ) {
								case 'BUTTON':
									settings.toggleSettings( remove );
									break;
								case 'svg':
									settings.toggleSettings( remove );
									break;
								case 'path':
									settings.toggleSettings( remove );
									break;					
								case 'polyline':
									settings.toggleSettings( remove );
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
		}
	};

export { settings }
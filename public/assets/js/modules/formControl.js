import { toggleFormEdit, actionState, elementState } from './formEdit.js';
import { toggleFormSettings }                        from './formSettings.js';
import { toggleFormGroups }                          from './formGroups.js';

const 
	formController = ( action, element ) => {

		const 
			edit = ( action, element ) => {
				toggleFormGroups( 'remove' );
				toggleFormSettings( 'remove' );
				toggleFormEdit( 'add' );
				const 
					a = ( action )  ? document.querySelector( 'input[value=' + action  + ']' ) : '',
					e = ( element ) ? document.querySelector( 'input[value=' + element + ']' ) : '';
				if ( a ) { 
					a.checked = true; 
					if ( !e ) { a.focus(); }
				}
				if ( e ) { e.checked = true; }
				actionState();
				elementState();			
			},

			elem = document.documentElement,

			/* View in fullscreen */
			openFullscreen = () => {
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.webkitRequestFullscreen) { /* Safari */
					elem.webkitRequestFullscreen();
				} else if (elem.msRequestFullscreen) { /* IE11 */
					elem.msRequestFullscreen();
				}
			},

			/* Close fullscreen */
			closeFullscreen = () => {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) { /* Safari */
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) { /* IE11 */
					document.msExitFullscreen();
				}
			};

		switch ( action ) {
			case 'settings':
				toggleFormEdit( 'remove' );
				toggleFormGroups( 'remove' );
				toggleFormSettings( 'add' );
				document.querySelector( 'input' ).focus();	
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'settings' ); } );		
				break;
			case 'create':
				edit( action, element );
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'create' ); } );
				break;
			case 'delete':
				edit( action, element );
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'delete' ); } );
				break;
			case 'update':
				edit( action, element );
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'update' ); } );
				break;
			case 'groups':
				toggleFormEdit( 'remove' );
				toggleFormSettings( 'remove' );
				toggleFormGroups( 'add' );
				if ( document.querySelector( 'input' ) ) { document.querySelector( 'input' ).focus(); }
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'groups' ); } );
				break;
			default:
				break;
		}

		// window.scrollTo( 0, document.body.scrollHeight );

		// openFullscreen();

	}

export { formController };
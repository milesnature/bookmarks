import { toggleFormEdit, actionState, elementState } from './formEdit.js';
import { toggleFormSettings }                        from './formSettings.js';
import { toggleFormGroups }                          from './formGroups.js';

const 
	formController = ( action, element ) => {

		const edit = ( action, element ) => {
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
				document.querySelector( 'input' ).focus();	
				import( './footer.js' ).then( ( module ) => { module.updateFooterButtons( 'groups' ); } );
				break;
			default:
				break;
		}

		window.scrollTo( 0, document.body.scrollHeight );

	}

export { formController };
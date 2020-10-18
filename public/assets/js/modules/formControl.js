import { toggleFormEdit, actionState, elementState } from './formEdit.js';
import { toggleFormSettings }                        from './formSettings.js';

const 
	formEdit       = document.getElementById( 'edit' ),
	formSettings   = document.getElementById( 'settings' ),
	formController = ( action, element ) => {
		switch ( action ) {
			case 'settings':
				if ( !formSettings ) {
					if ( formEdit ) { formEdit.remove(); }
					toggleFormSettings( 'add' );
				}
				break;
			default:
				if ( !formEdit ) { 
					if ( formSettings ) { formSettings.remove(); }
					toggleFormEdit( 'add' );
				}
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
		}
	}

export { formController };
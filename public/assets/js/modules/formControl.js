import { toggleFormEdit, actionState, elementState } from './formEdit.js';
import { toggleFormSettings }                        from './formSettings.js';

const 

	formController = ( action, element ) => {

		switch ( action ) {
			case 'settings':
				toggleFormEdit( 'remove' );
				toggleFormSettings( 'add' );
				break;
			default:
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
				break;
		}

	}

export { formController };
import { toggleFormEdit, actionState, elementState } from './formEdit.js';
import { toggleFormSettings }                        from './formSettings.js';
import { toggleFormGroups }                          from './formGroups.js';

const 

	formController = ( action, element ) => {

		const edit = ( action, element ) => {
			toggleFormEdit( 'add' );
			toggleFormGroups( 'remove' );
			toggleFormSettings( 'remove' );
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
				break;
			case 'create':
				edit( action, element );
				break;
			case 'delete':
				edit( action, element );
				break;
			case 'update':
				edit( action, element );
				break;
			case 'groups':
				toggleFormEdit( 'remove' );
				toggleFormGroups( 'add' );
				toggleFormSettings( 'remove' );
				break;
			default:
				break;
		}

	}

export { formController };
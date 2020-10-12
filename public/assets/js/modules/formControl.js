import { edit }     from './formEdit.js';
import { settings } from './formSettings.js';

const 
	formEdit     = document.getElementById( 'edit' ),
	formSettings = document.getElementById( 'settings' ),
	formController = ( action, element ) => {
		switch ( action ) {
			case 'settings':
				if ( !formSettings ) {
					if ( formEdit ) { formEdit.remove(); }
					settings.toggleSettings( 'add' );
				}
				break;
			default:
				if ( !formEdit ) { 
					if ( formSettings ) { formSettings.remove(); }
					edit.toggleEdit( 'add' );
				}
				const 
					a = ( action )  ? document.querySelector( 'input[value=' + action  + ']' ) : '',
					e = ( element ) ? document.querySelector( 'input[value=' + element + ']' ) : '';
				if ( a ) { 
					a.checked = true; 
					if ( !e ) { a.focus(); }
				}
				if ( e ) { e.checked = true; }
				edit.actionState();
				edit.elementState();
		}
	}

export { formController };
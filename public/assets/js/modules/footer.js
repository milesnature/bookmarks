import { edit }            from './edit.js';
import { toggleModalHelp } from './modal.js';
import { settings }        from './settings.js';

const 
	
	footer = {

		actionFromFooter : ( action, element ) => {

			const formEdit     = document.getElementById( 'edit' ),
				  formSettings = document.getElementById( 'settings' );
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
					a.checked = 'checked';
					if ( !e ) {  
						a.focus();
					} else {
						e.checked = 'checked';
					}
					edit.actionState();
					edit.elementState();
			}
		}

	};

	document.getElementsByTagName('footer')[0].addEventListener('click', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			id     = target.id,
			name   = target.className;
		switch ( tag ) {
			case 'BUTTON':
				footer.actionFromFooter( name );  
				document.body.scrollTop = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				break;
			case 'A':
				if ( id === 'help' ) { toggleModalHelp(); }
				break;
			default:
				break;
		}
	});	

export { footer }
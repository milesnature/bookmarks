const

	actionFromFooter = ( action, element ) => {
		const formEdit     = document.getElementById( 'edit' ),
			  formSettings = document.getElementById( 'settings' );
		switch ( action ) {
			case 'settings':
				if ( !formSettings ) {
					if ( formEdit ) { formEdit.remove(); }
					settings.toggleSettings( 'add' );
				}
				document.querySelector( 'input[name="appearance"]:checked' ).focus();
				break;
			default:
				if ( !formEdit ) { 
					if ( formSettings ) { formSettings.remove(); }
					edit.toggleEdit( 'add' );
				}
				const 
					a = ( action )  ? document.querySelector( 'input[value=' + action + ']' )  : '',
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
	};

export { actionFromFooter }
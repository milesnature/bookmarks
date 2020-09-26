let

	// TRAP FOCUS 
	trapFocus = ( action ) => {
		const 
			anchors = Array.prototype.slice.call( document.getElementsByTagName( 'A' ) ),
			inputs  = Array.prototype.slice.call( document.getElementsByTagName( 'INPUT' ) ),
			selects = Array.prototype.slice.call( document.getElementsByTagName( 'SELECT' ) ),
			buttons = Array.prototype.slice.call( document.getElementsByTagName( 'BUTTON' ) ),
			groups  = Array.prototype.slice.call( document.getElementsByClassName( 'bookmarks' ) );
		switch ( action ) {
			case 'add':
				document.body.classList.add('no-scroll');
				anchors.forEach( ( item, index ) => { item.setAttribute( 'tabindex', '-1' ) } );
				inputs.forEach(  ( item, index ) => { item.setAttribute( 'tabindex', '-1' ) } );
				selects.forEach( ( item, index ) => { item.setAttribute( 'tabindex', '-1' ) } );
				buttons.forEach( ( item, index ) => { item.setAttribute( 'tabindex', '-1' ) } );
				groups.forEach(  ( item, index ) => { item.setAttribute( 'tabindex', '-1' ) } );
				break;
			case 'remove':
				document.body.classList.remove('no-scroll');
				anchors.forEach( ( item, index ) => { item.removeAttribute( 'tabindex' ) } );
				inputs.forEach(  ( item, index ) => { item.removeAttribute( 'tabindex' ) } );
				selects.forEach( ( item, index ) => { item.removeAttribute( 'tabindex' ) } );
				buttons.forEach( ( item, index ) => { item.removeAttribute( 'tabindex' ) } );
				buttons.forEach( ( item, index ) => { item.setAttribute( 'tabindex', '0' ) } );
				break;	
			default:
				break;			
		}
	},

	// MODAL HANDLER
	toggleModalHelp = ( id ) => {
		const 
			container = 'div.modal-container',
			modal     = document.querySelector( container ),
			event     = ( e ) => {
				const
					target  = e.target,
					tag     = ( target.tagName ) ? target.tagName.toLowerCase() : '',
					type    = e.type,
					key     = ( e.key ) ? e.key.toLowerCase() : '',
					keyCode = e.keyCode;
				switch ( type ) {
					case 'click':
						if ( tag === 'svg' || tag === 'circle' || tag === 'line' || tag === 'g' ) { toggleModalHelp(); }
						break;
					case 'keyup':
						if ( tag === 'svg' && ( key === 'enter' || keyCode === '13' ) ) { toggleModalHelp(); }
						break;
					default:
						break;
				}
			};
		switch ( ( modal ) ? true : false ) {
			case true:
				if ( modal ) {
					const c = document.querySelector( container );
					c.removeEventListener( 'click', event ); 
   					c.removeEventListener( 'keyup', event ); 				 
					modal.remove(); 
					trapFocus( 'remove' );
				}				
				break;
			case false:
				if ( !modal ) {
  					document.body.appendChild( templateModalHelp.content.cloneNode( true ) );   					
   					const
   						s = ( ( id ) ? ( '#' + id ) : '#helpOpenForm' ) + ' summary', 
   						c = document.querySelector( container );
   					if ( id ) { document.getElementById( id ).open = true; }
   					document.querySelector( s ).focus();
					c.addEventListener( 'click', event ); 
   					c.addEventListener( 'keyup', event );
   					trapFocus( 'add' ); 					
				}
				break;
		  	default:
				break;
		}
	};

export { trapFocus, toggleModalHelp }
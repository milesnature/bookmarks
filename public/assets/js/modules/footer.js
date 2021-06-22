const 
	setupFooter = (() => {

		// EVENT HANDLER FOOTER BUTTONS AND LINKS.
		document.getElementsByTagName('footer')[0].addEventListener('click', ( e ) => {
			const 
				target = e.target,
				tag    = target.tagName,
				id     = target.id,
				name   = target.className;
			switch ( tag ) {
				case 'BUTTON':
					e.preventDefault();
					import( './formControl.js' ).then( ( module ) => { module.formController( name ); } );
					target.classList.add( 'active' );
					break;
				case 'A':
					if ( id !== 'about' ) {
						e.preventDefault();
						if ( id === 'help' ) { 
							import( './modal.js' ).then( ( module ) => { module.toggleModalHelp(); } );
						}
					}
					break;
				default:
					break;
			}
		});	

		// FOOTER COPYRIGHT DATE.
		const year = new Date();
		document.getElementById('year').innerText = year.getFullYear();	

	})(),

	updateFooterButtons = ( btn ) => {
		const btns = Array.prototype.slice.call( document.getElementsByTagName( 'footer' )[0].getElementsByTagName( 'nav' )[0].getElementsByTagName( 'button' ) );
		btns.forEach( ( item, index ) => { item.classList.remove( 'active' ); } );
		if ( btn ) {
			document.querySelector( 'button.' + btn ).classList.add( 'active' );
		}
	};

export { setupFooter, updateFooterButtons };
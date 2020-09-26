const

	// GENERIC CONTENT REMOVAL TOOL
	removeChildNodes = ( e ) => {
		const hasContent     = ( e && e.hasChildNodes( ) ),
		      tag            = e.tagName,
		      removeChildren = ( e ) => {
		      		let child = e.lastElementChild;  
			        while ( child ) { 
			            e.removeChild( child ); 
			            child = e.lastElementChild; 
			        } 
		      };
		if ( hasContent ) {
			switch ( tag ) {
				case 'TEXTAREA':
					e.textContent = '';
					break;
				case 'SECTION':
					dropEvents( 'remove' );
					dragEnterEvents( 'remove' );
					removeChildren( e );
					break;
				default:
					removeChildren( e );
			}
		}
	};

export default removeChildNodes;
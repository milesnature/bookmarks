const
	// CLICKING A GROUP NAME OPENS ALL BOOKMARKS WITHIN. OTHERWISE, LINKS ARE OPENED WITH ANCHOR TAGS.
	openNewTab = ( value, index, array ) => {
		window.open( value, '_blank' );
		window.focus();
	},

	getUrls = ( items ) => {
		let urls_array = [],
		buildArray = ( value, index, array ) => {
			urls_array.push( value.firstChild.href );
		}; 
		items.forEach( buildArray );
		return urls_array;
	},

	openTabs = ( e ) => {
		let 
			target     = e.target,
			elements   = [], 
			list_items = [], 
			urls       = [];
			elements   = Array.prototype.slice.call( target.parentNode.children );
			list_items = Array.prototype.slice.call( elements[1].getElementsByTagName('LI') );
			urls       = getUrls( list_items );
			urls.forEach( openNewTab );	
	},
	
	setupOpenGroupEventHandler = ( bmkSection ) => {
		bmkSection.addEventListener('click', ( e ) => {
			const target = e.target; 			
			if ( target.classList.contains('all') ) { openTabs( e ); }
		});
	}

export { setupOpenGroupEventHandler }
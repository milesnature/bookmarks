const
	bmkSection = document.getElementById('bookmarks'),	

	// BOOKMARKS METHODS
	bookmarks = {

		constructList : ( item, group ) => {
			/* 
			<ul class='bookmarks'>
				<li><button class='all'>Group Name</button>
					<ul>
						<li><a id='9' href='http://random.com' target='_blank'>Name</a></li>
						...
					</ul>
				</li>
			</ul>
			*/
			let fragment           = document.createDocumentFragment(),
				groupName          = item,
				outer_UL           = document.createElement  ( 'UL' ),
				outer_UL_class     = document.createAttribute( 'class' ),
				outer_UL_id        = document.createAttribute( 'id' ),
				outer_UL_title     = document.createAttribute( 'title' ),
				outer_UL_tabindex  = document.createAttribute( 'tabindex' ),
				outer_LI           = document.createElement  ( 'LI' ),
				outer_BUTTON       = document.createElement  ( 'BUTTON' ),
				outer_BUTTON_class = document.createAttribute( 'class' ),
				outer_BUTTON_text  = document.createTextNode ( groupName ),
				outer_BUTTON_title = document.createAttribute( 'title' ),
				inner_UL           = document.createElement  ( 'UL' ),
				i;
			// SET CLASS & ID ATTRIBUTES FOR OUTER UL.
			outer_UL_class.value     = 'bookmarks';
			outer_UL.setAttributeNode( outer_UL_class );
			outer_UL_id.value        = '_' + groupName;
			outer_UL.setAttributeNode( outer_UL_id );
			outer_UL_title.value     = groupName + ' Group';
			outer_UL.setAttributeNode( outer_UL_title );
			outer_UL_tabindex.value  = '0';
			outer_UL.setAttributeNode( outer_UL_tabindex );						
			// SET CLASS ATTRIBUTE AND TEXT FOR BUTTON.
			outer_BUTTON_class.value = 'all';
			outer_BUTTON.setAttributeNode( outer_BUTTON_class );
			outer_BUTTON_title.value = 'Open all bookmarks in ' + groupName + ' group.';
			outer_BUTTON.setAttributeNode( outer_BUTTON_title );			
			outer_BUTTON.appendChild( outer_BUTTON_text );
			// CREATE INDIVIUDAL BOOKMARKS.
			for ( i = 0; i < group.length; i += 1 ) {
				let bookmark = group[i];
				if ( !bookmark.group || !bookmark.name || !bookmark.url ) { continue; }
				let li     = document.createElement   ( 'LI' ),
				    a      = document.createElement   ( 'A' ),
					id     = document.createAttribute ( 'id' ),
					href   = document.createAttribute ( 'href' ),
					target = document.createAttribute ( 'target' ),
					rel    = document.createAttribute ( 'rel' ),
					text   = document.createTextNode  ( bookmark.name );
				// SET ATTRIBUTES FOR BOOKMARK.
				id.value = bookmark._id;
				a.setAttributeNode( id );
				href.value = bookmark.url;
				a.setAttributeNode( href );
				target.value = '_blank';
				a.setAttributeNode( target );
				rel.value = 'noreferrer';
				a.setAttributeNode( rel );				
				a.appendChild( text );
				// INSERT ACHOR ELEMENT NITO IT'S LISTEN ITEM.
				li.appendChild( a );
				// INSERT LIST ITEM INTO IT'S UL CONTAINER.
				inner_UL.appendChild( li );
			}
			// ASSEMBLE FINAL OUTPUT, WORKING FROM THE INSIDE OUT.
			outer_LI.appendChild( outer_BUTTON );
			outer_LI.appendChild( inner_UL );
			outer_UL.appendChild( outer_LI );
			// UPDATE HTML FRAGMENT.
			fragment.appendChild( outer_UL );
			// RETURN COMPLETED LIST.
			return fragment;
		},

		// SORT BOOKMARKS
		sortIntoGroups : ( bookmarksData ) => {
			let 
				groupsByName = {},
				groups       = [],
				sortGroup = ( item, index ) => {
					const groupName = item.group;
					if ( groupName ) {
						if ( groupsByName.hasOwnProperty( groupName ) ) {
							groupsByName[ groupName ].push( item );
						} else {
							groupsByName[ groupName ] = [ item ];
							groups.push( groupName );
						}
					}			
				};
			bookmarksData.forEach( sortGroup );
			sessionStorage.setItem( 'bookmarksSorted', JSON.stringify( groupsByName ) );
			sessionStorage.setItem( 'groups',          JSON.stringify( groups ) );
			return groupsByName;
		},

		// CONTENT REMOVAL TOOL
		removeChildNodes : ( e ) => {
			const 
				hasContent     = ( e && e.hasChildNodes( ) ),
			    removeChildren = ( e ) => {
		      		let child = e.lastElementChild;  
			        while ( child ) { 
			            e.removeChild( child ); 
			            child = e.lastElementChild; 
			        } 
			    };
			if ( hasContent ) {
				//dropEvents( 'remove' );
				//dragEnterEvents( 'remove' );
				removeChildren( e );
			}
		},

		toggleBookmarksLoader : ( action ) => {
			const hasSvg = bmkSection.querySelector('svg#loader');
			switch ( action ) {
				case 'remove':
					if ( hasSvg ) { bookmarks.removeChildNodes( bmkSection ) }
					break;
				case 'add':
					if ( !hasSvg ) {
	  					bmkSection.appendChild( templateLoader.content.cloneNode( true ) );
	  				}
					break;
				default:
				break;
			}
		}					
		
	};

export { bookmarks }
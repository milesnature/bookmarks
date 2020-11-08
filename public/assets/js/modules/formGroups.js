let 
	formGroupsContainer,
	groups       = [],
	groupsObject = {};

const
	updateBookmarks = ( obj, dom ) => {
		const keys = Object.keys( obj );
		keys.forEach( ( item, index ) => {
			if ( obj[ item ] === false ) {
				dom.getElementById( '_' + item ).classList.add( 'hide' );
			} else {
				dom.getElementById( '_' + item ).classList.remove( 'hide' );
			}
		} );
	},
	setStorageGroups = ( obj ) => {
		localStorage.setItem( 'groupsStorage', JSON.stringify( obj ) );
	},
	getStorageGroups = () => {
		const storedGroups = ( localStorage.getItem( 'groupsStorage' ) ) ? JSON.parse( localStorage.getItem( 'groupsStorage' ) ) : '';
		return storedGroups;
	},
	// GROUPS FORM DOM ELEMENTS AND METHODS.
	toggleFormGroups = ( action ) => {
		formGroupsContainer = document.getElementById('formGroups');
		const 
			body       = document.body,
			bmkSection = document.getElementById('bookmarks');
		switch ( action ) {
			case 'remove':
				if ( formGroupsContainer ) { 
					formGroupsContainer.remove();
					document.body.classList.remove( 'form-open' );
					import( './footer.js' ).then( ( module ) => { module.updateFooterButtons() } );
					groups       = [],
					groupsObject = {},
					localStorage.setItem( 'groupsState', 'closed' );					
				}
				break;
			case 'add':
				if ( !formGroupsContainer ) {

					const 
						clone  = templateFormGroups.content.cloneNode( true ),
						footer = document.getElementsByTagName( 'footer' )[0];
					footer.parentNode.insertBefore( clone, footer );

					document.body.classList.add( 'form-open' );
					localStorage.setItem( 'groupsState', 'open' );

					formGroupsContainer = document.getElementById('formGroups');
					
					const 
						bookmarkLists     = Array.prototype.slice.call( document.getElementsByClassName( 'bookmarks' ) ),
						buildGroupsArray  = ( item, index ) => {
							groups.push( item.id.substring(1) );
						},
						buildGroupsObject = ( item, index ) => {
							groupsObject[ item ] = true;
						},
						inputs            = document.createDocumentFragment(),
						constructInput    = ( item, index ) => {
							/* 
							<label>Group Name:
								<input id="group_name" type="checkbox" value="group_name" />
							</label>
							*/
							let group       = item,
								fragment    = document.createDocumentFragment(),
								label       = document.createElement  ( 'label' ),
								label_text  = document.createTextNode ( group ),
								input       = document.createElement  ( 'input' ),
								input_id    = document.createAttribute( 'id' ),
								input_type  = document.createAttribute( 'type' ),
								input_value = document.createAttribute( 'value' );				
							input_id.value    = group;
							input.setAttributeNode( input_id );
							input_type.value  = 'checkbox';
							input.setAttributeNode( input_type );
							input_value.value = group;
							input.setAttributeNode( input_value );
							label.appendChild( label_text );
							label.appendChild( input );
							fragment.appendChild( label );
							inputs.appendChild( fragment );		
						},
						getInputs = () => {
							let fragment = document.createDocumentFragment();
							bookmarkLists.forEach( buildGroupsArray );
							groups.forEach( constructInput );
							return inputs;						
						},
						addToForm = ( inputs ) => {
							document.querySelector('#formGroups .groups').appendChild( inputs );
						},
						updateInput = ( item, index ) => {
							document.getElementById( item ).checked = groupsObject[ item ];
						};

					/*  Construct inputs and append to the DOM */
					addToForm( getInputs() );

					/* Check for stored groups object or build default (sets all to true). Manage state and storage. */
					let storedGroups = getStorageGroups();
					if ( storedGroups ) {
						groupsObject = storedGroups;
						updateBookmarks( groupsObject, document );
					} else {
						groups.forEach( buildGroupsObject );
					}

					/* Update input states  */
					groups.forEach( updateInput );

					// LISTEN FOR GROUPS CHANGES
					formGroupsContainer.addEventListener('change', ( e ) => {
						const 
							target = e.target,
							id     = target.id;
						/* UPDATE groupsObject && Storage */
						groupsObject[ id ] = document.getElementById( id ).checked;
						setStorageGroups( groupsObject );
						updateBookmarks( groupsObject, document );
					});

					// LISTEN FOR CLOSE. 
					formGroupsContainer.addEventListener('click', ( e ) => {
						const 
							target = e.target,
							tag    = target.tagName,
							remove = 'remove';
						switch ( tag ) {
							case 'BUTTON':
								toggleFormGroups( remove );
								break;
							case 'svg':
								toggleFormGroups( remove );
								break;
							case 'path':
								toggleFormGroups( remove );
								break;					
							case 'polyline':
								toggleFormGroups( remove );
								break;
							default:
								break;			
						}
					});
				}
				break;

			default:
				break;
		}
	};

export { toggleFormGroups, getStorageGroups, updateBookmarks };
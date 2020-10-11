const

	// FORM DOM ELEMENTS AND METHODS.
	edit = {

		toggleEdit : ( action ) => {

			const f = document.getElementById('edit');

			switch ( action ) {

				case 'remove':

					if ( f ) { 
						edit.container.removeEventListener('change', ( e ) => {} );
						edit.container.removeEventListener('click',  ( e ) => {} );
						f.remove(); 
						localStorage.setItem( 'editState', 'closed' );
					}
					break;

				case 'add':

					if ( !f ) {

	  					document.body.prepend( templateFormEdit.content.cloneNode( true ) );

  						edit[ 'container' ]                 = document.forms[0];
  						edit[ 'errorMessage' ]              = document.getElementById('errorMessage');
						edit[ 'bookmark' ]                  = document.getElementById('bookmark');
						edit[ 'group' ]                     = document.getElementById('group');
						edit[ 'bookmarksSelect' ]           = document.getElementById('bookmarksSelect');
						edit[ 'groupText' ]     	        = document.getElementById('groupText');
						edit[ 'groupSelect' ]   	        = document.getElementById('groupSelect');
						edit[ 'nameText' ]     		        = document.getElementById('nameText');
						edit[ 'nameSelect' ]    	        = document.getElementById('nameSelect');
						edit[ 'urlText' ]       	        = document.getElementById('urlText');
						edit[ 'buttonSubmit' ]              = document.getElementById('submit');
						edit[ 'updateBookmarkSelectValue' ] = () => { return bookmarksSelect.value };
						edit[ 'updateBookmarkSelectText' ]  = () => { return ( bookmarksSelect.options.length > 0  ) ? bookmarksSelect.options[bookmarksSelect.selectedIndex].text : '' };
						edit[ 'groupValue' ]       		    = () => { return groupText.value };
						edit[ 'groupSelectValue' ] 		    = () => { return groupSelect.value };
						edit[ 'groupSelectText' ]  		    = () => { return ( groupSelect.options.length > 0 ) ? groupSelect.options[groupSelect.selectedIndex].text : '' };
						edit[ 'titleValue' ]       		    = () => { return nameText.value };
						edit[ 'titleSelectValue' ] 		    = () => { return nameSelect.value };
						edit[ 'titleSelectText' ]  		    = () => { return ( nameSelect.options.length > 0  ) ? nameSelect.options[nameSelect.selectedIndex].text : '' };
						edit[ 'urlValue' ]         		    = () => { return urlText.value };
						edit[ 'actionValue' ]               = () => { return document.querySelector('input[name="action"]:checked').value };
						edit[ 'elementValue' ]              = () => { return document.querySelector('input[name="element"]:checked').value };
						edit[ 'removeClasses' ]             = ( ...classes ) => { if ( edit.container ) { edit.container.classList.remove( ...classes ); } };
						edit[ 'addClasses' ]                = ( ...classes ) => { if ( edit.container ) { edit.container.classList.add( ...classes ); } };
						edit[ 'updateButton' ]              = ( action )     => { if ( edit.container ) { edit.buttonSubmit.value = action; } };

	  					if ( edit.container ) {

	  						let sortedList = JSON.parse( sessionStorage.getItem( 'bookmarksSorted' ) );

		  					edit.constructGroupOptions();
							edit.constructNameOptions( sortedList );

						    localStorage.setItem( 'editState', 'open' );						

							// HIDE/SHOW FORM ELEMENTS WHEN CHANGES OCCUR. THE DISPLAY OF FORM ELEMENTS IS MODIFED BASED ON THE DESIRED OUTCOME. 
							edit.container.addEventListener('change', ( e ) => {
								const 
									target = e.target,
									tag    = target.tagName,
									name   = target.name;
								switch ( tag ) {
									case 'INPUT':
										switch ( name ) {
											case 'action':
												edit.actionState();
												edit.elementState();
												break;
											case 'element':
												edit.elementState();
												break;
										}
										break;
									case 'SELECT':
										if ( name === 'name_select' ) { edit.updatePrefill() }
										break;
									default:
										break;
								}
							});

							// LISTEN FOR FORM SUBMIT AND CLOSE. 
							edit.container.addEventListener('click', ( e ) => {
								const 
									target = e.target,
									tag    = target.tagName,
									name   = target.name,
									remove = 'remove';
								switch ( tag ) {
									case 'INPUT': 
										if ( name === 'submit' ) { edit.editSubmit( e ); }
										break;
									case 'BUTTON':
										edit.toggleEdit( remove );
										break;
									case 'svg':
										edit.toggleEdit( remove );
										break;
									case 'path':
										edit.toggleEdit( remove );
										break;					
									case 'polyline':
										edit.toggleEdit( remove );
										break;
									default:
										break;			
								}
							});

						}					
					}
					break;
				default:
					break;
			}			
		},

		clearSelectOptions : ( e ) => {
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
				removeChildren( e );
			}			
		},

		constructGroupOptions : () => { 
			// <option value='News'>News</option>
			let fragment = document.createDocumentFragment(),
			    groups   = JSON.parse( sessionStorage.getItem( 'groups' ) ),
				buildOptions = ( item, index ) => {
					let
						option = document.createElement   ( 'OPTION' ),
						val    = document.createAttribute ( 'value' ),
						text   = document.createTextNode  ( item );
					val.value = item;
					option.setAttributeNode( val );
					option.appendChild( text );
					fragment.appendChild( option );
				};
			groups.forEach( buildOptions );
			if ( edit.container ) {
				if ( edit.groupSelect.hasChildNodes() ) {
			        edit.clearSelectOptions( edit.groupSelect );
				}
				edit.groupSelect.appendChild( fragment );
			}
		},

		constructNameOptions : ( sortedList, target ) => { 
			// <optgroup label='News'><option id='5ec592b3fcceb051486e9c2f'>Ars Technica</option></optgroup>
			let fragment = (() => { return document.createDocumentFragment() })(),
				group    = [];
			for ( let item in sortedList ) { 
				if ( !item ) { continue; };
				group = sortedList[ item ];
				let groupFramgment = document.createDocumentFragment(),
					optgroup       = document.createElement   ( 'OPTGROUP' ),
					label          = document.createAttribute ( 'label' ),
					buildOptions  = ( item, index ) => {
						let
							option = document.createElement   ( 'OPTION' ),
							val    = document.createAttribute ( 'value' ),
							text   = document.createTextNode  ( item.name );
						val.value = item._id;
						option.setAttributeNode( val );
						option.appendChild( text );
						groupFramgment.appendChild( option );
					};
				label.value = item;
				optgroup.setAttributeNode( label );
				group.forEach( buildOptions );
				optgroup.appendChild( groupFramgment );
				fragment.appendChild( optgroup );
			}
			if ( edit.container ) {
				if ( edit.nameSelect.hasChildNodes() ) {
			        edit.clearSelectOptions( edit.nameSelect );
				}
				if ( edit.bookmarksSelect.hasChildNodes() ) {
			        edit.clearSelectOptions( edit.bookmarksSelect );
				}
				let fragment2 = fragment.cloneNode( true );
				edit.nameSelect.appendChild( fragment );
				edit.bookmarksSelect.appendChild( fragment2 );
				edit.updatePrefill();
			}
		},

		// THIS PREFILLS BOOKMARK DATA TO FACILITATE UPDATING BOOKMARKS
		updatePrefill : () => {
			const bookmarksData = JSON.parse( sessionStorage.getItem( 'bookmarksData' ) );
			if ( bookmarksData ) {
				let group = '',
					name  = edit.updateBookmarkSelectText(),
					url   = '',
					id    = edit.updateBookmarkSelectValue(),
					findBookmarkDetails = ( item, index ) => {
						if ( item._id === id ) {
							group = item.group;
							url   = item.url;
						}
					};
				bookmarksData.forEach( findBookmarkDetails );
				if ( edit.groupText ) { edit.groupText.value = group };
				if ( edit.nameText )  { edit.nameText.value  = name };
				if ( edit.urlText )   { edit.urlText.value   = url };
			}		
		},

		actionState : () => {
			const action = edit.actionValue();
			edit.removeClasses( 'create', 'delete', 'update' );
			edit.resetFields();
			edit.clearErrorMessage();
			edit.addClasses( action );
			edit.updateButton( action );
			if ( action === 'update' ) { 
				edit.bookmark.checked = 'checked';
				edit.updatePrefill();
			}
		},
		
		elementState : () => {
			const
				element = edit.elementValue(),
				action  = edit.actionValue();
			edit.removeClasses( 'bookmark', 'group' );
			edit.clearErrorMessage();
			edit.addClasses( element );
			if ( action !== 'update' ) { edit.resetFields(); }	
		},
		
		getStates : () => {
			const 
				action  = edit.actionValue(),
			    element = edit.elementValue();
			return {
				'isCreate'   : ( action  === 'create' ),
				'isDelete'   : ( action  === 'delete' ),
				'isUpdate'   : ( action  === 'update' ),
				'isGroup'    : ( element === 'group' ),
				'isBookmark' : ( element === 'bookmark' ),
				'action'     : action,
				'element'    : element			
			}
		},

		getValues : () => {  
			const 
				state  = edit.getStates(),
				config = {
					'group' : (() => { 
						if ( ( state.isGroup && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) { 
							return edit.groupValue();
						} else if ( ( state.isGroup && state.isDelete ) || ( state.isBookmark && state.isCreate ) ) {
							return edit.groupSelectText();
						} else {
							return '';
						}
					})(),
					'id' : (() => { 
						if ( state.isBookmark && state.isDelete ) {
							return edit.titleSelectValue();
						} else if ( state.isBookmark && state.isUpdate ) {
							return edit.updateBookmarkSelectValue();
						} else {
							return '';
						}
					})(),								   
					'name' : (() => {
						if ( state.isBookmark && state.isDelete ) {
							return edit.titleSelectText();
						} else if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate )  ) {
							return edit.titleValue();
						} else {
							return '';
						}
					})(),
					'url' : (() => {
						if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) {
							return edit.urlValue();
						} else {
							return '';
						}
					})()
				};
			return { 
				'action' : state.action, 'element': state.element, 'state': state, 'config': config 
			};
		},

		resetFields : () => {
			if ( edit.groupText ) { edit.groupText.value = '' };
			if ( edit.nameText )  { edit.nameText.value  = '' };
			if ( edit.urlText )   { edit.urlText.value   = '' };
		},

		// GENERAL ERROR MESSAGE CONTAINER. FIRST REMOVES OLD MESSAGE THEN APPENDS NEW MESSAGE.
		displayErrorMessage : ( ...message ) => {
			if ( edit.errorMessage ) {
				if ( edit.errorMessage.value ) { edit.clearErrorMessage() };
				if ( message ) {
					if ( Array.isArray( message ) && message.length > 0 ) {
						let fragment = document.createDocumentFragment(),
							createTextItem = ( item, index ) => {
								let lineEnding = String.fromCharCode(13);
								if ( item === '' ) { return }
							    lineEnding = ( message.length === ( index + 1 ) ) ? '' : lineEnding;
								let textNode = document.createTextNode( item + lineEnding );
								fragment.appendChild( textNode );
							};
						message.forEach( createTextItem );
						edit.errorMessage.appendChild( fragment );
					} else {
				        let fragment = document.createDocumentFragment(),
				        	textNode = document.createTextNode( message );
				        fragment.appendChild( textNode );
				        edit.errorMessage.appendChild( fragment );
					}
					edit.errorMessage.focus();
				}
			}
		},	

		clearErrorMessage : () => {
			edit.errorMessage.textContent = '';
		},

		dispatchApiCallRequest : ( details ) => {
			const event = new CustomEvent('apiCallRequest', { detail: details } );
			document.body.dispatchEvent( event );
		},	

		// FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID.
		editSubmit : ( e ) => {
			e.preventDefault();
			edit.clearErrorMessage();
			const 
				values     = edit.getValues(),
				state      = values.state,
				valid      = '',
				urlCheck   = /((http|ftp|https|file):\/\/)/,
				validation = {
					action  : (() => { 
						if ( !values.action ) { return 'Action is required.'; }
						else if ( values.action && values.action.length > 25 ) { return 'Action exceeds maximum character length of 25.'; }
						else { return valid; }
					})(),
					element : (() => { 
						if ( !values.element ) { return 'Element is required.'; }
						else if ( values.element && values.element.length > 25 ) { return 'Element exceeds maximum character length of 25.'; }
						else { return valid; }
					})(),
					name    : (() => {
						if ( !values.config.name ) { return 'Name is required.'; }
						else if ( values.config.name.length > 100 ) { return 'Name exceeds maximum character length of 100.'; }
						else { return valid; }
					})(),
					url     : (() => {
						if ( !values.config.url ) { return 'URL is required.'; }
						else if ( values.config.url.length > 2083 ) { return 'URL exceeds maximum character length of 2083.'; }
						else if ( urlCheck.test( values.config.url ) === false ) { return 'URL is invalid.' ; }
						else { return valid; }
					})(),
					group   : (() => {
						if ( !values.config.group  ) { return 'Group is required.'; }
						else if ( values.config.group.length > 100 ) { return 'Group exceeds maximum character length of 100.'; }
						else { return valid; }
					})(),
					id      : (() => {
						if ( !values.config.id ) { return 'ID is required.'; }
						else if ( values.config.id.length > 25 ) { return 'ID exceeds maximum character length of 25.'; }
						else { return valid; }
					})()
				};

			let params = '';
			// CHOOSE API CALL BASED ON FORM STATE AND VALUES.
			if ( validation.action === valid && validation.element === valid ) {
				if ( state.isCreate && ( state.isBookmark || state.isGroup ) ) {
					if ( validation.name === valid && validation.url === valid && validation.group === valid ) {
						params = 'name=' + values.config.name + '&url=' + encodeURIComponent( values.config.url ) + '&group=' + values.config.group;
						edit.dispatchApiCallRequest( { 'verb' : 'POST', 'url': 'bookmarks', 'params' : params } );
					} else {
						edit.displayErrorMessage( validation.group, validation.name, validation.url );
					}
				}
				if ( state.isDelete && state.isBookmark  ) {
					if ( validation.id === valid ) {
						edit.dispatchApiCallRequest( { 'verb' : 'DELETE', 'url': 'bookmarks/' + values.config.id, 'params' : params } );
					} else {
						edit.displayErrorMessage( validation.id );
					}
				}
				if ( state.isDelete && state.isGroup ) {
					if ( validation.group === valid ) {
						edit.dispatchApiCallRequest( { 'verb' : 'DELETE', 'url': 'bookmarks/group/' + values.config.id, 'params' : params } );
					} else {
						edit.displayErrorMessage( validation.group );
					}
				}
				if ( state.isUpdate && state.isBookmark ) {
					if ( validation.name === valid && validation.url === valid && validation.group === valid && validation.id === valid ) {
						params = 'name=' + values.config.name + '&url=' + encodeURIComponent( values.config.url ) + '&group=' + values.config.group;
						edit.dispatchApiCallRequest( { 'verb' : 'PUT', 'url': 'bookmarks/' + values.config.id, 'params' : params } );
					} else {
						edit.displayErrorMessage( validation.group, validation.name, validation.url, validation.id );
					}
				}
			} else {
				edit.displayErrorMessage( validation.action, validation.element );
			}
		}	
	};

export { edit }
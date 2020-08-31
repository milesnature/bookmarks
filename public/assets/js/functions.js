const 
	html                 = document.getElementsByTagName("HTML")[0],
	body                 = document.body,
	bmkSection           = document.getElementById('bookmarks'),
	footer               = document.getElementsByTagName('footer')[0],
	templateFormEdit     = document.getElementById('templateFormEdit'),
	templateFormSettings = document.getElementById('templateFormSettings'),
	templateModalHelp    = document.getElementById('templateModalHelp'),
	templateLoader       = document.getElementById('templateLoader'),
	urlCheck             = /((http|ftp|https|file):\/\/)/,
	domainUrl            = window.location.protocol + '//' + window.location.hostname + ( ( window.location.port ) ? ':' + window.location.port : '' ) + '/',

	// API CALLS
	api = {
		getBookmarks : () => {
			const xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function () {
				if( xhr.readyState === XMLHttpRequest.DONE ) {
					const status = xhr.status;
					if ( status === 0 || ( status >= 200 && status < 400 ) ) {
				       	if ( this.responseText ) {
				       		bookmarksArray = JSON.parse( this.responseText );
				       		// bookmarks.storage.set( this.responseText );	
				       		if ( bookmarksArray.length > 0 ) {
			       				bookmarks.constructSection();
			       			} else {
			       				actionFromFooter( 'create', 'group' );
			       				toggleModalHelp( 'add' );
			       				document.getElementById( 'helpEmptyDatabase' ).open = true;
			       				bookmarks.remove();
			       			}
			            } else {
			            	edit.displayErrorMessage( this.responseText );
			            }
					} else {
						edit.displayErrorMessage( this.responseText );
					}
				}	        
		    };
		    xhr.open( 'GET', domainUrl + 'bookmarks', true );
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send();	
		},

		verbBookmark : ( action, url, params, cbf ) => {
			const xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function () {
				if( xhr.readyState === XMLHttpRequest.DONE ) {
					const status = xhr.status;
					if ( status === 0 || ( status >= 200 && status < 400 ) ) {
				       	if ( this.responseText ) {
							edit.resetFields();
			       			cbf();
			            } else {
			            	edit.displayErrorMessage( this.responseText );
			            }
					} else {
						edit.displayErrorMessage( this.responseText );
					}
				}	        
		    };
		    
		    xhr.open( action, url, true );
		    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		    xhr.send( params );	
		}
	},

	// BOOKMARKS METHODS
	bookmarks = {
		sortGroup : ( item, index ) => {
			const groupName = item.group;
			if ( groupName ) {
				if ( groupsByName.hasOwnProperty( groupName ) ) {
					groupsByName[ groupName ].push( item );
				} else {
					groupsByName[ groupName ] = [ item ];
					groups.push( groupName );
				}
			}			
		},

		sortIntoGroups : ( b ) => {
			groupsByName = [];
			groups       = [];
			b.forEach( bookmarks.sortGroup );
			return groupsByName;
		},

		constructList : ( group ) => {
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

		constructSection : () => {
			let b         = bookmarksArray,
				fragments = document.createDocumentFragment();
			sortedList = bookmarks.sortIntoGroups( b );
			bookmarks.remove();
			for ( item in sortedList ) { 
				if ( !item ) { continue; };
				group = sortedList[ item ];
				fragments.appendChild( bookmarks.constructList( group ) );
			}
			bmkSection.appendChild( fragments );
			openGroup.setupEventHandler();
			if ( edit.container ) {
		  		bookmarks.constructGroupOptions();
				bookmarks.constructNameOptions( sortedList );
				edit.resetFields();
				removeChildNodes( edit.errorMessage );
			}
			dropEvents( 'add' );
			dragEnterEvents( 'add' );
		},

		remove : () => {
			if ( bmkSection.hasChildNodes() ) {
				removeChildNodes( bmkSection );
			}
		},	

		constructGroupOptions : () => { 
			// <option value='News'>News</option>
			let fragment      = document.createDocumentFragment(),
				buildOptions  = ( item, index ) => {
					option    = document.createElement   ( 'OPTION' ),
					val       = document.createAttribute ( 'value' ),
					text      = document.createTextNode  ( item );
					val.value = item;
					option.setAttributeNode( val );
					option.appendChild( text );
					fragment.appendChild( option );
				};
			groups.forEach( buildOptions );
			if ( edit.container ) {
				if ( edit.groupSelect.hasChildNodes() ) {
			        removeChildNodes( edit.groupSelect );
				}
				edit.groupSelect.appendChild( fragment );
			}
		},

		constructNameOptions : ( sortedList, target ) => { 
			// <optgroup label='News'><option id='5ec592b3fcceb051486e9c2f'>Ars Technica</option></optgroup>
			let fragment = (() => { return document.createDocumentFragment() })(),
				group    = [];
			for ( item in sortedList ) { 
				if ( !item ) { continue; };
				group = sortedList[ item ];
				let groupFramgment = document.createDocumentFragment(),
					optgroup       = document.createElement   ( 'OPTGROUP' ),
					label          = document.createAttribute ( 'label' ),
					buildOptions  = ( item, index ) => {
						option    = document.createElement   ( 'OPTION' ),
						val       = document.createAttribute ( 'value' ),
						text      = document.createTextNode  ( item.name );
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
			        removeChildNodes( edit.nameSelect );
				}
				if ( edit.bookmarksSelect.hasChildNodes() ) {
			        removeChildNodes( edit.bookmarksSelect );
				}
				let fragment2 = fragment.cloneNode( true );
				edit.nameSelect.appendChild( fragment );
				edit.bookmarksSelect.appendChild( fragment2 );
				edit.updatePrefill();
			}
		},

		storage : {
			set : ( bookmarks ) => {
				localStorage.setItem( 'bookmarks', bookmarks );
			},
			get : () => {
				const bookmarks = localStorage.getItem( 'bookmarks' );
				return ( bookmarks ) ? JSON.parse( bookmarks ) : '';
			}		
		},		

		toggleLoader : ( action ) => {
			const hasSvg = bmkSection.querySelector('svg#loader');
			switch ( action ) {
				case 'remove':
					if ( hasSvg ) { bookmarks.remove(); }
					break;
				case 'add':
					if ( !hasSvg ) {
	  					bmkSection.appendChild( templateLoader.content.cloneNode( true ) );
	  				}
  					break;
  			}				
		}		
	},

	// CLICKING A GROUP NAME OPENS ALL BOOKMARKS WITHIN. OTHERWISE, LINKS ARE OPENED WITH ANCHOR TAGS.
	openGroup = {
		
		getLists : () => { 
			return Array.prototype.slice.call( document.getElementsByClassName('bookmarks') );
		},

		openNewTab : ( value, index, array ) => {
			window.open( value, '_blank' );
			window.focus();
		},

		getUrls : ( items ) => {
			let urls_array = [],
			buildArray = ( value, index, array ) => {
				urls_array.push( value.firstChild.href );
			}; 
			items.forEach( buildArray );
			return urls_array;
		},

		openTabs : ( e ) => {
			let 
				target     = e.target,
				elements   = [], 
				list_items = [], 
				urls       = [];
				elements   = Array.prototype.slice.call( target.parentNode.children );
				list_items = Array.prototype.slice.call( elements[1].getElementsByTagName('LI') );
				urls       = openGroup.getUrls( list_items );
				urls.forEach( openGroup.openNewTab );	
		},
		
		setupEventHandler : ( value, index, array ) => {
			bmkSection.addEventListener('click', ( e ) => {
				const target = e.target; 			
				if ( target.classList.contains('all') ) { openGroup.openTabs( e ); }
			});
		}
	},

	settings = {

		toggleSettings : ( action ) => {

			const s = document.getElementById('settings');

			switch ( action ) {

				case 'remove':
					if ( s ) { 
						settings.container.removeEventListener('change', ( e ) => {});
						settings.container.removeEventListener('click',  ( e ) => {});
						s.remove(); 
						localStorage.setItem( 'settings', 'closed' );
					}
					break;

				case 'add':

					if ( !s ) {

						body.prepend( templateFormSettings.content.cloneNode( true ) );

						localStorage.setItem( 'settings', 'open' );

						const appearance = localStorage.getItem( 'appearance' );

						if ( appearance ) { document.querySelector( 'input[value=' + appearance + ']'  ).checked = 'checked'; }

						settings[ 'container' ] = document.forms[0];					

						// LISTEN FOR SETTINGS CHANGES
						settings.container.addEventListener('change', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								value  = target.value;
							switch ( tag ) {
								case 'INPUT':
									body.classList.remove( 'light-mode', 'dark-mode' );
									switch ( value ) {
										case 'default':
											localStorage.setItem( 'appearance', 'default' );
											break;
										case 'light':
											localStorage.setItem( 'appearance', 'light' );
											body.classList.add( 'light-mode' );
											break;
										case 'dark':
											localStorage.setItem( 'appearance', 'dark' );
											body.classList.add( 'dark-mode' );
											break;

									}
									break;
							}
							});

						// LISTEN FOR CLOSE. 
						settings.container.addEventListener('click', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								remove = 'remove';
							switch ( tag ) {
								case 'BUTTON':
									settings.toggleSettings( remove );
									break;
								case 'svg':
									settings.toggleSettings( remove );
									break;
								case 'path':
									settings.toggleSettings( remove );
									break;					
								case 'polyline':
									settings.toggleSettings( remove );
									break;			
							}
						});


					
					}
					break;
			}

		}

	},

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
						localStorage.setItem( 'edit', 'closed' );
					}
					break;

				case 'add':

					if ( !f ) {

	  					body.prepend( templateFormEdit.content.cloneNode( true ) );

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

		  					bookmarks.constructGroupOptions();
							bookmarks.constructNameOptions( sortedList );

						    localStorage.setItem( 'edit' , 'open' );						

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
								}
							});

						}					
					}
					break;
			}			
		},
		
		// THIS PREFILLS BOOKMARK DATA TO FACILITATE UPDATING BOOKMARKS
		updatePrefill : () => {
			if ( bookmarksArray.length > 0 ) {
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
				bookmarksArray.forEach( findBookmarkDetails );
				if ( edit.groupText ) { edit.groupText.value = group };
				if ( edit.nameText )  { edit.nameText.value  = name };
				if ( edit.urlText )   { edit.urlText.value   = url };
			}		
		},

		actionState : () => {
			const action = edit.actionValue();
			edit.removeClasses( 'create', 'delete', 'update' );
			edit.resetFields();
			removeChildNodes( edit.errorMessage );
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
			removeChildNodes( edit.errorMessage );
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
			if ( edit.errorMessage.value ) { removeChildNodes( edit.errorMessage ) };
			if ( message ) {
				if ( Array.isArray( message ) && message.length > 0 ) {
					let fragment = document.createDocumentFragment(),
						createTextItem = ( item, index ) => {
							if ( item === '' ) { return }
							let textNode = document.createTextNode( item + String.fromCharCode(13) );
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

		},		

		// FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID.
		editSubmit : ( e ) => {
			e.preventDefault();
			removeChildNodes( edit.errorMessage );
			const 
				values     = edit.getValues(),
				state      = values.state,
				valid      = '',
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
						params = 'name=' + values.config.name + '&url=' + values.config.url + '&group=' + values.config.group;
						api.verbBookmark( 
							'POST', 
							domainUrl + 'bookmarks', 
							params,
							api.getBookmarks
						);
					} else {
						edit.displayErrorMessage( validation.group, validation.name, validation.url );
					}
				}
				if ( state.isDelete && state.isBookmark  ) {
					if ( validation.id === valid ) {
						api.verbBookmark( 
							'DELETE', 
							domainUrl + 'bookmarks/' + values.config.id, 
							params, 
							api.getBookmarks
						);
					} else {
						edit.displayErrorMessage( validation.id );
					}
				}
				if ( state.isDelete && state.isGroup ) {
					if ( validation.group === valid ) {
						api.verbBookmark( 
							'DELETE', 
							domainUrl + 'bookmarks/group/' + values.config.group, 
							params, 
							api.getBookmarks
						);
					} else {
						edit.displayErrorMessage( validation.group );
					}
				}
				if ( state.isUpdate && state.isBookmark ) {
					if ( validation.name === valid && validation.url === valid && validation.group === valid && validation.id === valid ) {
						params = 'name=' + values.config.name + '&url=' + values.config.url + '&group=' + values.config.group;
						api.verbBookmark( 
							'PUT', 
							domainUrl + 'bookmarks/' + values.config.id, 
							params, 
							api.getBookmarks
						); 
					} else {
						edit.displayErrorMessage( validation.group, validation.name, validation.url, validation.id );
					}
				}
			} else {
				edit.displayErrorMessage( validation.action, validation.element );
			}
		}	
	},

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
	},	

	// DRAG AND DROP BROWSER LOCATION
	allowDrop = ( event ) => { event.preventDefault(); },

	dragStart = ( event ) => { 
		const 
			t        = event.target,
			tag      = ( t.tagName )   ? t.tagName : '',
			href     = ( t.href )      ? t.href : '',
			text     = ( t.text )      ? t.text : '',
			id       = ( t.id )        ? t.id : '',
			bookmark = ( tag === 'A' );
		if ( bookmark ) {
			event.dataTransfer.setData( 'tag',  tag );
			event.dataTransfer.setData( 'href', href ); 
			event.dataTransfer.setData( 'text', text );
			event.dataTransfer.setData( 'id',   id );
		}
	},

	dragEnter = ( event ) => {
		let t = event.target,
	  		g = t.closest('ul.bookmarks');
	  	event.preventDefault();
		cleanupDragHover();
		g.classList.add( 'drag-hover' );
	},

	cleanupDragHover = () => {
		let lists = openGroup.getLists();
		removeBackgroundColor = ( item, index ) => { item.classList.remove( 'drag-hover' );; };
		lists.forEach( removeBackgroundColor );
	},

	drop = ( event ) => {
	  	event.preventDefault();
	  	let 
	  		t        = event.target,
	  		tag      = ( event.dataTransfer.getData( 'tag' ) )  ? event.dataTransfer.getData( 'tag' )  : '',
	  		href     = ( event.dataTransfer.getData( 'href' ) ) ? event.dataTransfer.getData( 'href' ) : '',
	  		text     = ( event.dataTransfer.getData( 'text' ) ) ? event.dataTransfer.getData( 'text' ) : '',
	  		id       = ( event.dataTransfer.getData( 'id' ) )   ? event.dataTransfer.getData( 'id' )   : '',
	  		group    = t.closest('ul.bookmarks'),
	  		groupId  = group.id.substr(1),
	  		external = ( tag === '' && href === '' ),
	  		local    = ( tag === 'A' && href && id ),
	  		validUrl = ( url ) => { return urlCheck.test( href ) };
	  	if ( external ) {
	  		href = text;
		  	if ( validUrl( href ) ) { 
	  			actionFromFooter( 'create' );
				body.scrollTop                     = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				edit.urlText.value                 = href;
				edit.groupSelect.value             = groupId;
		  	}	  		
	  	}
	  	if ( local ) {
		  	if ( validUrl( href ) ) { 
	  			actionFromFooter( 'update' );
				body.scrollTop                     = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				bookmarksSelect.value              = id;
				edit.updatePrefill();
				edit.groupText.value               = groupId;
		  	}	  		
	  	}
	  	cleanupDragHover();
	},

	dropEvents = ( action ) => {
		lists      = openGroup.getLists(),
		addDrop    = ( item, index ) => { item.addEventListener(    'drop', ( event ) => { drop( event ) } ); },
		removeDrop = ( item, index ) => { item.removeEventListener( 'drop', ( event ) => { drop( event ) } ); };
		switch (action) {
			case 'add':		
				lists.forEach( addDrop );
				break;
			case 'remove':
				lists.forEach( removeDrop );
				break;
		}
	},

	dragEnterEvents = ( action ) => {
		lists           = openGroup.getLists(),
		addDragEnter    = ( item, index ) => { item.addEventListener(    'dragenter', ( event ) => { dragEnter( event ) } ); },
		removeDragEnter = ( item, index ) => { item.removeEventListener( 'dragenter', ( event ) => { dragEnter( event ) } ); };
		switch (action) {
			case 'add':
				lists.forEach( addDragEnter );
				break;
			case 'remove':
				lists.forEach( removeDragEnter );
				break;
		}
		
	},	

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
	},

	// MODAL HANDLER
	toggleModalHelp = ( action ) => {
		const modal = document.querySelector('div.modal.help');
		switch ( action ) {
			case 'remove':
				if ( modal ) { modal.remove(); }
				break;
			case 'add':
				if ( !modal ) {
  					document.body.appendChild( templateModalHelp.content.cloneNode( true ) );	
				}
				break;
			}
	}

let 
	bookmarksArray = [],
	groupsByName   = [],
	groups         = [],
	sortedList     = [];

// SETUP AFTER PAGE LOADS	
window.onload = () => {

	bookmarks.toggleLoader('add');

	// THIS LOADS BOOKMARKS FROM LOCAL STORAGE BEFORE CALLING API. FALLBACK FOR CONNECTION OR API ISSUES AND FOR WORKING OFFLINE.   
	// let bookmarksStored = bookmarks.storage.get();

	// if ( bookmarksStored ) {
	// 	bookmarksArray = bookmarksStored;
	// 	bookmarks.constructSection();
	// }

	// LOAD PAGE ELEMENTS USING DB VALUES.
	api.getBookmarks();

	// CHECK STATE OF LOCAL STORAGE TO RESTORE FORM STATE ON RELOAD. THIS IS LESS IMPORTANT NOW THAT THE FORM IS USING AJAX.
	const editState     = localStorage.getItem('edit');
	const settingsState = localStorage.getItem('settings');
	const appearance    = localStorage.getItem('appearance');
	
	if ( editState === 'open' ) {
		edit.toggleEdit( 'add' );
	} else if ( settingsState === 'open' ) {
		settings.toggleSettings( 'add' );
	}

	if ( appearance && appearance !== 'default' ) {
		body.classList.add( appearance + '-mode' );
	}

	// EVENT HANDLER FOR FOOTER BUTTONS.
	footer.addEventListener('click', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			id     = target.id,
			name   = target.className;
		switch ( tag ) {
			case 'BUTTON':
				actionFromFooter( name );
				body.scrollTop = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				break;
			case 'A':
				if ( id === 'help' ) { toggleModalHelp( 'add' ); }
				break;
		}
	});

	// FOOTER COPYRIGHT DATE 
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();

	html.addEventListener( 'dragover',  ( event ) => { allowDrop( event ) } );
	html.addEventListener( 'dragstart', ( event ) => { dragStart( event ) } );	

};
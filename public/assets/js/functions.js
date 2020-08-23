const 
	html              = document.getElementsByTagName("HTML")[0],
	body              = document.body,
	bmkSection        = document.getElementById('bookmarks'),
	footer            = document.getElementsByTagName('footer')[0],
	templateForm      = document.getElementById('templateForm'),
	templateModalHelp = document.getElementById('templateModalHelp'),
	templateLoader    = document.getElementById('templateLoader'),
	urlCheck          = /((http|ftp|https|file):\/\/)/,
	domainUrl         = window.location.protocol + '//' + window.location.hostname + ( ( window.location.port ) ? ':' + window.location.port : '' ) + '/',

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
			       				form.actionFromFooter( 'create', true );
			       				toggleModalHelp( 'add' );
			       				bookmarks.remove();
			       			}
			            } else {
			            	form.displayErrorMessage( this.responseText );
			            }
					} else {
						form.displayErrorMessage( this.responseText );
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
							form.resetFields();
			       			cbf();
			            } else {
			            	form.displayErrorMessage( this.responseText );
			            }
					} else {
						form.displayErrorMessage( this.responseText );
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
				outer_LI           = document.createElement  ( 'LI' ),
				outer_BUTTON       = document.createElement  ( 'BUTTON' ),
				outer_BUTTON_class = document.createAttribute( 'class' ),
				outer_BUTTON_text  = document.createTextNode ( groupName ),
				inner_UL           = document.createElement  ( 'UL' ),
				i;
			// SET CLASS & ID ATTRIBUTES FOR OUTER UL.
			outer_UL_class.value     = 'bookmarks';
			outer_UL.setAttributeNode( outer_UL_class );
			outer_UL_id.value        = '_' + groupName;
			outer_UL.setAttributeNode( outer_UL_id );
			// SET CLASS ATTRIBUTE AND TEXT FOR BUTTON.
			outer_BUTTON_class.value = 'all';
			outer_BUTTON.setAttributeNode( outer_BUTTON_class );
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
			if ( form.container ) {
		  		bookmarks.constructGroupOptions();
				bookmarks.constructNameOptions( sortedList );
				form.resetFields();
				removeChildNodes( form.errorMessage );
			}
			addDropEvents();
			addDragEnterEvents();
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
			if ( form.container ) {
				if ( form.groupSelect.hasChildNodes() ) {
			        removeChildNodes( form.groupSelect );
				}
				form.groupSelect.appendChild( fragment );
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
			if ( form.container ) {
				if ( form.nameSelect.hasChildNodes() ) {
			        removeChildNodes( form.nameSelect );
				}
				if ( form.bookmarksSelect.hasChildNodes() ) {
			        removeChildNodes( form.bookmarksSelect );
				}
				let fragment2 = fragment.cloneNode( true );
				form.nameSelect.appendChild( fragment );
				form.bookmarksSelect.appendChild( fragment2 );
				form.updatePrefill();
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

	// FORM DOM ELEMENTS AND METHODS.
	form = {

		toggleForm : ( action ) => {

			const f = document.forms[0];

			switch ( action ) {

				case 'remove':

					if ( f ) { 
						form.container.removeEventListener('change', ( e ) => {} );
						form.container.removeEventListener('click',  ( e ) => {} );
						f.remove(); 
						localStorage.setItem( 'form', 'closed' );
					}
					break;

				case 'add':

					if ( !f ) {

	  					body.prepend( templateForm.content.cloneNode( true ) );

  						form[ 'container' ]                 = document.forms[0];
  						form[ 'errorMessage' ]              = document.getElementById('errorMessage');
						form[ 'bookmark' ]                  = document.getElementById('bookmark');
						form[ 'group' ]                     = document.getElementById('group');
						form[ 'bookmarksSelect' ]           = document.getElementById('bookmarksSelect');
						form[ 'groupText' ]     	        = document.getElementById('groupText');
						form[ 'groupSelect' ]   	        = document.getElementById('groupSelect');
						form[ 'nameText' ]     		        = document.getElementById('nameText');
						form[ 'nameSelect' ]    	        = document.getElementById('nameSelect');
						form[ 'urlText' ]       	        = document.getElementById('urlText');
						form[ 'buttonSubmit' ]              = document.getElementById('submit');
						form[ 'updateBookmarkSelectValue' ] = () => { return bookmarksSelect.value };
						form[ 'updateBookmarkSelectText' ]  = () => { return ( bookmarksSelect.options.length > 0  ) ? bookmarksSelect.options[bookmarksSelect.selectedIndex].text : '' };
						form[ 'groupValue' ]       		    = () => { return groupText.value };
						form[ 'groupSelectValue' ] 		    = () => { return groupSelect.value };
						form[ 'groupSelectText' ]  		    = () => { return ( groupSelect.options.length > 0 ) ? groupSelect.options[groupSelect.selectedIndex].text : '' };
						form[ 'titleValue' ]       		    = () => { return nameText.value };
						form[ 'titleSelectValue' ] 		    = () => { return nameSelect.value };
						form[ 'titleSelectText' ]  		    = () => { return ( nameSelect.options.length > 0  ) ? nameSelect.options[nameSelect.selectedIndex].text : '' };
						form[ 'urlValue' ]         		    = () => { return urlText.value };
						form[ 'actionValue' ]               = () => { return document.querySelector('input[name="action"]:checked').value };
						form[ 'elementValue' ]              = () => { return document.querySelector('input[name="element"]:checked').value };
						form[ 'removeClasses' ]             = ( ...classes ) => { if ( form.container ) { form.container.classList.remove( ...classes ); } };
						form[ 'addClasses' ]                = ( ...classes ) => { if ( form.container ) { form.container.classList.add( ...classes ); } };
						form[ 'updateButton' ]              = ( action )     => { if ( form.container ) { form.buttonSubmit.value = action; } };

	  					if ( form.container ) {

		  					bookmarks.constructGroupOptions();
							bookmarks.constructNameOptions( sortedList );

						    localStorage.setItem( 'form' , 'open' );						

							// HIDE/SHOW FORM ELEMENTS WHEN CHANGES OCCUR. THE DISPLAY OF FORM ELEMENTS IS MODIFED BASED ON THE DESIRED OUTCOME. 
							form.container.addEventListener('change', ( e ) => {
								const 
									target = e.target,
									tag    = target.tagName,
									name   = target.name;
								switch ( tag ) {
									case 'INPUT':
										switch ( name ) {
											case 'action':
												form.actionState();
												form.elementState();
												break;
											case 'element':
												form.elementState();
												break;
										}
										break;
									case 'SELECT':
										if ( name === 'name_select' ) { form.updatePrefill() }
										break;
								}
							});

							// LISTEN FOR FORM SUBMIT AND CLOSE. 
							form.container.addEventListener('click', ( e ) => {
								const 
									target = e.target,
									tag    = target.tagName,
									name   = target.name,
									remove = 'remove';
								switch ( tag ) {
									case 'INPUT': 
										if ( name === 'submit' ) { form.formSubmit( e ); }
										break;
									case 'BUTTON':
										form.toggleForm( remove );
										break;
									case 'svg':
										form.toggleForm( remove );
										break;
									case 'path':
										form.toggleForm( remove );
										break;					
									case 'polyline':
										form.toggleForm( remove );
										break;			
								}
							});
						}					
					}
					break;
			}			
		},
		
		actionFromFooter : ( action ) => {
			form.toggleForm( 'add' );
			document.querySelector( 'input[value=' + action + ']' ).checked = 'checked';
			form.actionState();
			form.elementState();		
		},
		
		// THIS PREFILLS BOOKMARK DATA TO FACILITATE UPDATING BOOKMARKS
		updatePrefill : () => {
			if ( bookmarksArray.length > 0 ) {
				let group = '',
					name  = form.updateBookmarkSelectText(),
					url   = '',
					id    = form.updateBookmarkSelectValue(),
					findBookmarkDetails = ( item, index ) => {
						if ( item._id === id ) {
							group = item.group;
							url   = item.url;
						}
					};
				bookmarksArray.forEach( findBookmarkDetails );
				if ( form.groupText ) { form.groupText.value = group };
				if ( form.nameText )  { form.nameText.value  = name };
				if ( form.urlText )   { form.urlText.value   = url };
			}		
		},

		actionState : () => {
			const action = form.actionValue();
			form.removeClasses( 'create', 'delete', 'update' );
			form.resetFields();
			removeChildNodes( form.errorMessage );
			form.addClasses( action );
			form.updateButton( action );		
			if ( action === 'update' ) { 
				form.bookmark.checked = 'checked';
				form.updatePrefill();
			}
		},
		
		elementState : () => {
			const
				element = form.elementValue(),
				action  = form.actionValue();
			form.removeClasses( 'bookmark', 'group' );
			removeChildNodes( form.errorMessage );
			form.addClasses( element );
			if ( action !== 'update' ) { form.resetFields(); }	
		},
		
		getStates : () => {
			const 
				action  = form.actionValue(),
			    element = form.elementValue();
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
				state  = form.getStates(),
				config = {
					'group' : (() => { 
						if ( ( state.isGroup && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) { 
							return form.groupValue();
						} else if ( ( state.isGroup && state.isDelete ) || ( state.isBookmark && state.isCreate ) ) {
							return form.groupSelectText();
						} else {
							return '';
						}
					})(),
					'id' : (() => { 
						if ( state.isBookmark && state.isDelete ) {
							return form.titleSelectValue();
						} else if ( state.isBookmark && state.isUpdate ) {
							return form.updateBookmarkSelectValue();
						} else {
							return '';
						}
					})(),								   
					'name' : (() => {
						if ( state.isBookmark && state.isDelete ) {
							return form.titleSelectText();
						} else if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate )  ) {
							return form.titleValue();
						} else {
							return '';
						}
					})(),
					'url' : (() => {
						if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) {
							return form.urlValue();
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
			if ( form.groupText ) { form.groupText.value = '' };
			if ( form.nameText )  { form.nameText.value  = '' };
			if ( form.urlText )   { form.urlText.value   = '' };
		},

		// GENERAL ERROR MESSAGE CONTAINER. FIRST REMOVES OLD MESSAGE THEN APPENDS NEW MESSAGE.
		displayErrorMessage : ( ...message ) => {
			removeChildNodes( form.errorMessage );
			if ( message ) {
				if ( Array.isArray( message ) && message.length > 0 ) {
					let fragment = document.createDocumentFragment(),
						createListItem = ( item, index ) => {
							if ( item === '' ) { return }
							let LI       = document.createElement( 'LI' ),
							    textNode = document.createTextNode( item );
							LI.appendChild( textNode );
							fragment.appendChild( LI );
						};
					message.forEach( createListItem );
					form.errorMessage.appendChild( fragment );
				} else {
			        let fragment = document.createDocumentFragment(),
			        	textNode = document.createTextNode( message );
			        fragment.appendChild( textNode );
			        form.errorMessage.appendChild( fragment );
				}
			}
		},		

		// FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID.
		formSubmit : ( e ) => {
			e.preventDefault();
			removeChildNodes( form.errorMessage );
			const 
				values     = form.getValues(),
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
						form.displayErrorMessage( validation.group, validation.name, validation.url );
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
						form.displayErrorMessage( validation.id );
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
						form.displayErrorMessage( validation.group );
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
						form.displayErrorMessage( validation.group, validation.name, validation.url, validation.id );
					}
				}
			} else {
				form.displayErrorMessage( validation.action, validation.element );
			}
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
	  			form.actionFromFooter( 'create' );
				body.scrollTop                     = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				form.urlText.value                 = href;
				form.groupSelect.value             = groupId;
		  	}	  		
	  	}
	  	if ( local ) {
		  	if ( validUrl( href ) ) { 
	  			form.actionFromFooter( 'update' );
				body.scrollTop                     = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				bookmarksSelect.value              = id;
				form.updatePrefill();
				form.groupText.value               = groupId;
		  	}	  		
	  	}
	  	cleanupDragHover();
	},

	addDropEvents = () => {
		lists   = openGroup.getLists(),
		addDrop = ( item, index ) => { item.addEventListener( 'drop', ( event ) => { drop( event ) } ); };
		lists.forEach( addDrop );
	},

	addDragEnterEvents = () => {
		lists        = openGroup.getLists(),
		addDragEnter = ( item, index ) => { item.addEventListener( 'dragenter', ( event ) => { dragEnter( event ) } ); };
		lists.forEach( addDragEnter );
	},	

	// GENERIC CONTENT REMOVAL TOOL
	removeChildNodes = ( e ) => {
		if ( e && e.hasChildNodes( ) ) {
	        let child = e.lastElementChild;  
	        while ( child ) { 
	            e.removeChild( child ); 
	            child = e.lastElementChild; 
	        } 
		}
		if ( e && e.textContent.length ) {
			e.textContent = '';
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
	const formState = localStorage.getItem('form');
	
	if ( formState === 'open' ) {
		form.toggleForm( 'add' );
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
				form.actionFromFooter( name );
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
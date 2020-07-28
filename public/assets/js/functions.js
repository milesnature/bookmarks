const 
	body           = document.body,
	bmkSection     = document.getElementById('bookmarks'),
	errorMessage   = document.getElementById('errorMessage'),
	footer         = document.getElementsByTagName('footer')[0],
	modalHelp      = document.getElementById('modelHelp'),
	loaderTemplate = document.getElementsByTagName("template")[0],

	// CLICKING A GROUP NAME OPENS ALL BOOKMARKS WITHIN. OTHERWISE, LINKS ARE OPENED WITH ANCHOR TAGS.
	openGroup    = {
		
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
		'container'                 : document.forms[0],
		'bookmark'                  : document.getElementById('bookmark'),
		'group'                     : document.getElementById('group'),
		'bookmarksSelect'           : document.getElementById('bookmarksSelect'),
		'groupText'      		    : document.getElementById('groupText'),
		'groupSelect'    		    : document.getElementById('groupSelect'),
		'nameText'       		    : document.getElementById('nameText'),
		'nameSelect'     		    : document.getElementById('nameSelect'),		
		'urlText'        		    : document.getElementById('urlText'),
		'buttonSubmit'         	    : document.getElementById('submit'),
		'updateBookmarkSelectValue' : () => { return bookmarksSelect.value },
		'updateBookmarkSelectText'  : () => { return ( bookmarksSelect.options.length > 0  ) ? bookmarksSelect.options[bookmarksSelect.selectedIndex].text : '' },
		'groupValue'        		: () => { return groupText.value },
		'groupSelectValue'  		: () => { return groupSelect.value },
		'groupSelectText'   		: () => { return ( groupSelect.options.length > 0 ) ? groupSelect.options[groupSelect.selectedIndex].text : '' },
		'titleValue'        		: () => { return nameText.value },
		'titleSelectValue'  		: () => { return nameSelect.value },
		'titleSelectText'   		: () => { return ( nameSelect.options.length > 0  ) ? nameSelect.options[nameSelect.selectedIndex].text : '' },
		'urlValue'          		: () => { return urlText.value },
		'actionValue'               : () => { return document.querySelector('input[name="action"]:checked').value },
		'elementValue'              : () => { return document.querySelector('input[name="element"]:checked').value },	
		'removeClasses'             : ( ...classes ) => { form.container.classList.remove( ...classes ); },
		'addClasses'                : ( ...classes ) => { form.container.classList.add( ...classes ); },
		'updateButton'              : ( action )     => { form.buttonSubmit.value = action; },

		openClose : () => { 
			body.classList.toggle( 'edit' );
			if ( body.classList.contains( 'edit' ) ) {
				localStorage.setItem( 'form' , 'open' );
				form.container.reset();
				removeChildNodes( errorMessage );
			} else {
				localStorage.setItem( 'form', 'closed' );
			}
		},
		
		actionFromFooter : ( action, empty ) => {
			if ( !body.classList.contains( 'edit' ) ) { form.openClose(); }
			document.querySelector( 'input[value=' + action + ']' ).checked = 'checked';
			if ( !empty ) { 
				form.bookmark.checked = 'checked'; 
			} else {
				form.group.checked = 'checked'; 
			}
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
				form.groupText.value = group;
				form.nameText.value  = name;
				form.urlText.value   = url;
			}		
		},

		actionState : () => {
			const action = form.actionValue();
			form.removeClasses( 'create', 'delete', 'update' );
			form.resetFields();
			removeChildNodes( errorMessage );
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
			removeChildNodes( errorMessage );
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
			form.groupText.value = '';
			form.nameText.value  = '';
			form.urlText.value   = '';
		},

		// GENERAL ERROR MESSAGE CONTAINER. FIRST REMOVES OLD MESSAGE THEN APPENDS NEW MESSAGE.
		displayErrorMessage : ( ...message ) => {
			removeChildNodes( errorMessage );
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
					errorMessage.appendChild( fragment );
				} else {
			        let fragment = document.createDocumentFragment(),
			        	textNode = document.createTextNode( message );
			        fragment.appendChild( textNode );
			        errorMessage.appendChild( fragment );
				}
			}
		},

		// FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID.
		formSubmit : ( e ) => {
			e.preventDefault();
			removeChildNodes( errorMessage );
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
							window.location.href + 'bookmarks', 
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
							window.location.href + 'bookmarks/' + values.config.id, 
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
							window.location.href + 'bookmarks/group/' + values.config.group, 
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
							window.location.href + 'bookmarks/' + values.config.id, 
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
				outer_LI           = document.createElement  ( 'LI' ),
				outer_BUTTON       = document.createElement  ( 'BUTTON' ),
				outer_BUTTON_class = document.createAttribute( 'class' ),
				outer_BUTTON_text  = document.createTextNode ( groupName ),
				inner_UL           = document.createElement  ( 'UL' ),
				i;
			// SET CLASS ATTRIBUTE FOR OUTER UL.
			outer_UL_class.value     = 'bookmarks';
			outer_UL.setAttributeNode( outer_UL_class );
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
					text   = document.createTextNode  ( bookmark.name );
				// SET ATTRIBUTES FOR BOOKMARK.
				id.value = bookmark._id;
				a.setAttributeNode( id );
				href.value = bookmark.url;
				a.setAttributeNode( href );
				target.value = '_blank';
				a.setAttributeNode( target );
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
			let b          = bookmarksArray,
				sortedList = bookmarks.sortIntoGroups( b ),
				fragments  = document.createDocumentFragment();
			bookmarks.remove();
			for ( item in sortedList ) { 
				if ( !item ) { continue; };
				group = sortedList[ item ];
				fragments.appendChild( bookmarks.constructList( group ) );
			}
			bmkSection.appendChild( fragments );
			openGroup.setupEventHandler();
			bookmarks.constructGroupOptions();
			bookmarks.constructNameOptions( sortedList );
			form.resetFields();
			removeChildNodes( errorMessage );		
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
			if ( form.groupSelect.hasChildNodes() ) {
		        removeChildNodes( form.groupSelect );
			}
			form.groupSelect.appendChild( fragment );
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
		},

		toggleLoader = ( action ) => {
			const hasSvg = bmkSection.querySelector('svg#loader');
			switch ( action ) {
				case "remove":
					if ( hasSvg ) { bookmarks.remove(); }
					break;
				case "add":
					if ( !hasSvg ) {
				  		const loader = loaderTemplate.content.cloneNode( true );
	  					bmkSection.appendChild( loader );
	  				}
  					break;
  			}				
		}	
	},

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
				       		if ( bookmarksArray.length > 0 ) {
			       				bookmarks.constructSection();
			       			} else {
			       				form.actionFromFooter( 'create', true );
			       				toggleModalHelp();
			       				bookmarks.remove();
			       			}
			            } else {
			            	bmkSection.textContent = this.responseText;
			            }
					} else {
						bmkSection.textContent = this.responseText;
					}
				}	        
		    };
		    xhr.open( 'GET', window.location.href + 'bookmarks', true );
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

	// GENERIC CONTENT REMOVAL TOOL
	removeChildNodes = ( e ) => {
		if ( e.hasChildNodes( ) ) {
	        let child = e.lastElementChild;  
	        while ( child ) { 
	            e.removeChild( child ); 
	            child = e.lastElementChild; 
	        } 
		}
		if ( e.textContent.length ) {
			e.textContent = '';
		}
	},

	// MODAL HANDLER
	toggleModalHelp = () => document.getElementsByClassName('modal')[0].classList.toggle('show');	  

let 
	bookmarksArray = [],
	groupsByName   = [],
	groups         = [];

// SETUP AFTER PAGE LOADS	
window.onload = () => {

	bookmarks.toggleLoader('add');
	
	// LOAD PAGE ELEMENTS USING DB VALUES.
	api.getBookmarks();

	// CHECK STATE OF LOCAL STORAGE TO RESTORE FORM STATE ON RELOAD. THIS IS LESS IMPORTANT NOW THAT THE FORM IS USING AJAX.
	const formState = localStorage.getItem('form');
	
	if ( formState === 'open' ) {
		if ( !body.classList.contains('edit') ) {
			form.openClose();
		}
	}
	
	// HIDE/SHOW FORM ELEMENTS WHEN CHANGES OCCUR. THE DISPLAY OF FORM ELEMENTS IS MODIFED BASED ON THE DESIRED OUTCOME. 
	form.container.addEventListener('change', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			name   = target.name,
			id     = target.id;
					
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
			id     = target.id;
		switch ( tag ) {
			case 'INPUT': 
				if ( name === 'submit' ) { form.formSubmit( e ); }
				break;
			case 'BUTTON':
				form.openClose();
				break;
			case 'svg':
				form.openClose();
				break;
			case 'polyline':
				form.openClose();
				break;				
		}

	});

	// EVENT HANDLER FOR FOOTER BUTTONS.
	footer.addEventListener('click', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			name   = target.className;
		switch ( tag ) {
			case 'BUTTON':
				form.actionFromFooter( name );
				body.scrollTop = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				break;
			case 'A':
				if ( id = 'help' ) { toggleModalHelp(); }
				break;
		}
	});

	// CLOSE MODAL.
	modelHelp.addEventListener('click', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			name   = target.className;
		if ( tag === 'A' && name === 'close') { toggleModalHelp(); }
	});

	// FOOTER COPYRIGHT DATE 
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();
};

const 
	body         = document.body,
	bmkSection   = document.getElementById("bookmarks"),
	errorMessage = document.getElementById("errorMessage"),
	year         = new Date(),

	openGroup    = {

		/* CLICKING A GROUP NAME OPENS ALL BOOKMARKS WITHIN. OTHERWISE, LINKS ARE OPENED WITH ANCHOR TAGS. */
		
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
			bmkSection.addEventListener("click", ( e ) => {
				const target = e.target; 			
				if ( target.classList.contains('all') ) { openGroup.openTabs( e ); }
			});
		}
	},


	/* FORM DOM ELEMENTS AND METHODS. */
	form = {
		"container"                 : document.forms[0],
		"bookmark"                  : document.getElementById('bookmark'),
		"group"                     : document.getElementById('group'),
		"bookmarksSelect"           : document.getElementById('bookmarksSelect'),
		"groupText"      		    : document.getElementById('groupText'),
		"groupSelect"    		    : document.getElementById('groupSelect'),
		"nameText"       		    : document.getElementById('nameText'),
		"nameSelect"     		    : document.getElementById('nameSelect'),		
		"urlText"        		    : document.getElementById('urlText'),
		"buttonSubmit"         	    : document.getElementById('submit'),
		"updateBookmarkSelectValue" : () => { return bookmarksSelect.value },
		"updateBookmarkSelectText"  : () => { return ( bookmarksSelect.options.length > 0  ) ? bookmarksSelect.options[bookmarksSelect.selectedIndex].text : "" },
		"groupValue"        		: () => { return groupText.value },
		"groupSelectValue"  		: () => { return groupSelect.value },
		"groupSelectText"   		: () => { return ( groupSelect.options.length > 0 ) ? groupSelect.options[groupSelect.selectedIndex].text : "" },
		"titleValue"        		: () => { return nameText.value },
		"titleSelectValue"  		: () => { return nameSelect.value },
		"titleSelectText"   		: () => { return ( nameSelect.options.length > 0  ) ? nameSelect.options[nameSelect.selectedIndex].text : "" },
		"urlValue"          		: () => { return urlText.value },
		"actionValue"               : () => { return document.querySelector('input[name="action"]:checked').value },
		"elementValue"              : () => { return document.querySelector('input[name="element"]:checked').value },	
		formRemoveClasses           : ( ...classes ) => { form.container.classList.remove( ...classes ); },
		formAddClasses              : ( ...classes ) => { form.container.classList.add( ...classes ); },
		formUpdateButton            : ( action )     => { form.buttonSubmit.value = action; },

		openCloseForm : () => { 
			body.classList.toggle( 'edit' );
			if ( body.classList.contains( 'edit' ) ) {
				localStorage.setItem( "form" , "open" );
				form.container.reset();
				removeChildNodes( errorMessage );
			} else {
				localStorage.setItem( "form", "closed" );
			}
		},
		
		actionFromFooter : ( action, empty ) => {
			if ( !body.classList.contains( 'edit' ) ) { form.openCloseForm(); }
			document.querySelector( 'input[value=' + action + ']' ).checked = "checked";
			if ( !empty ) { 
				form.bookmark.checked = "checked"; 
			} else {
				form.group.checked = "checked"; 
			}
			form.formActionState();
			form.formElementState();		
		},
		
		/* THIS PREFILLS BOOKMARK DATA TO FACILITATE UPDATING BOOKMARKS */
		updateBookmarkPrefill : () => {
			if ( bookmarksArray.length > 0 ) {
				let group = "",
					name  = form.updateBookmarkSelectText(),
					url   = "",
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

		formActionState : () => {
			const action = form.actionValue();
			form.formRemoveClasses( 'create', 'delete', 'update' );
			form.resetFormFields();
			removeChildNodes( errorMessage );
			form.formAddClasses( action );
			form.formUpdateButton( action );		
			if ( action === 'update' ) { 
				form.bookmark.checked = "checked";
				form.updateBookmarkPrefill();
			}
		},
		
		formElementState : () => {
			const
				element = form.elementValue(),
				action  = form.actionValue();
			form.formRemoveClasses( 'bookmark', 'group' );
			removeChildNodes( errorMessage );
			form.formAddClasses( element );
			if ( action !== 'update' ) { form.resetFormFields(); }	
		},
		
		formGetStates : () => {
			const 
				action  = form.actionValue(),
			    element = form.elementValue();
			return {
				"isCreate"   : ( action  === 'create' ),
				"isDelete"   : ( action  === 'delete' ),
				"isUpdate"   : ( action  === 'update' ),
				"isGroup"    : ( element === 'group' ),
				"isBookmark" : ( element === 'bookmark' ),
				"action"     : action,
				"element"    : element			
			}
		},

		getFormValues : () => {  
			const 
				state  = form.formGetStates(),
				config = {
					"group" : (() => { 
						if ( ( state.isGroup && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) { 
							return form.groupValue();
						} else if ( ( state.isGroup && state.isDelete ) || ( state.isBookmark && state.isCreate ) ) {
							return form.groupSelectText();
						} else {
							return "";
						}
					})(),
					"id" : (() => { 
						if ( state.isBookmark && state.isDelete ) {
							return form.titleSelectValue();
						} else if ( state.isBookmark && state.isUpdate ) {
							return form.updateBookmarkSelectValue();
						} else {
							return "";
						}
					})(),								   
					"name" : (() => {
						if ( state.isBookmark && state.isDelete ) {
							return form.titleSelectText();
						} else if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate )  ) {
							return form.titleValue();
						} else {
							return "";
						}
					})(),
					"url" : (() => {
						if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) {
							return form.urlValue();
						} else {
							return "";
						}
					})()
				};
			return { 
				"action" : state.action, "element": state.element, "state": state, "config": config 
			};
		},

		resetFormFields : () => {
			form.groupText.value = "";
			form.nameText.value  = "";
			form.urlText.value   = "";
		},

		/* GENERAL ERROR MESSAGE CONTAINER. FIRST REMOVES OLD MESSAGE THEN APPENDS NEW MESSAGE. */
		displayErrorMessage : ( ...message ) => {
			removeChildNodes( errorMessage );
			if ( message ) {
				if ( Array.isArray( message ) && message.length > 0 ) {
					let fragment = document.createDocumentFragment(),
						createListItem = ( item, index ) => {
							if ( item === "" ) { return }
							let LI       = document.createElement( "LI" ),
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

		/* FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID. */
		formSubmit : ( event ) => {
			event.preventDefault();
			removeChildNodes( errorMessage );
			// Logic to determine action.		
			const 
				values     = form.getFormValues(),
				state      = values.state,
				valid      = "",
				validation = {
						action  : (() => { 
							if ( !values.action ) { return "Action is required."; }
							else if ( values.action && values.action.length > 25 ) { return "Action exceeds maximum character length of 25."; }
							else { return valid; }
						})(),
						element : (() => { 
							if ( !values.element ) { return "Element is required."; }
							else if ( values.element && values.element.length > 25 ) { return "Element exceeds maximum character length of 25."; }
							else { return valid; }
						})(),
						name    : (() => {
							if ( !values.config.name ) { return "Name is required."; }
							else if ( values.config.name.length > 100 ) { return "Name exceeds maximum character length of 100."; }
							else { return valid; }
						})(),
						url     : (() => {
							if ( !values.config.url ) { return "URL is required."; }
							else if ( values.config.url.length > 2083 ) { return "URL exceeds maximum character length of 2083."; }
							else { return valid; }
						})(),
						group   : (() => {
							if ( !values.config.group  ) { return "Group is required."; }
							else if ( values.config.group.length > 100 ) { return "Group exceeds maximum character length of 100."; }
							else { return valid; }
						})(),
						id      : (() => {
							if ( !values.config.id ) { return "ID is required."; }
							else if ( values.config.id.length > 25 ) { return "ID exceeds maximum character length of 25."; }
							else { return valid; }
						})()
				},
				getValidationString = ( item ) => { return ( item === valid ) ? "" : item };

			let params = "";
			if ( validation.action === valid && validation.element === valid ) {
				if ( state.isCreate && ( state.isBookmark || state.isGroup ) ) {
					if ( validation.name === valid && validation.url === valid && validation.group === valid ) {
						params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
						verbBookmark( 
							'POST', 
							window.location.href + "bookmarks", 
							params,
							getBookmarks
						);
					} else {
						form.displayErrorMessage( validation.group, validation.name, validation.url );
					}
				}
				if ( state.isDelete && state.isBookmark  ) {
					if ( validation.id === valid ) {
						verbBookmark( 
							'DELETE', 
							window.location.href + "bookmarks/" + values.config.id, 
							params, 
							getBookmarks
						);
					} else {
						form.displayErrorMessage( validation.id );
					}
				}
				if ( state.isDelete && state.isGroup ) {
					if ( validation.group === valid ) {
						verbBookmark( 
							'DELETE', 
							window.location.href + "bookmarks/group/" + values.config.group, 
							params, 
							getBookmarks
						);
					} else {
						form.displayErrorMessage( validation.group );
					}
				}
				if ( state.isUpdate && state.isBookmark ) {
					if ( validation.name === valid && validation.url === valid && validation.group === valid && validation.id === valid ) {
						params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
						verbBookmark( 
							'PUT', 
							window.location.href + "bookmarks/" + values.config.id, 
							params, 
							getBookmarks
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

	/* GENERIC CONTENT REMOVAL TOOL */
	removeChildNodes = ( e ) => {
		if ( e.hasChildNodes( ) ) {
	        let child = e.lastElementChild;  
	        while ( child ) { 
	            e.removeChild( child ); 
	            child = e.lastElementChild; 
	        } 
		}
		if ( e.textContent.length ) {
			e.textContent = "";
		}
	},

	/* BOOKMARK METHODS */
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
	},

	sortBookmarksIntoGroups = ( bookmarks ) => {
		groupsByName = [];
		groups       = [];
		bookmarks.forEach( sortGroup );
		return groupsByName;
	},

	constructBookmarkList = ( group ) => {
		/* 
		<ul class="bookmarks">
			<li><button class="all">Group Name</button>
				<ul>
					<li><a id="9" href="http://random.com" target="_blank">Name</a></li>
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
		// Set class attribute for outer UL
		outer_UL_class.value     = "bookmarks";
		outer_UL.setAttributeNode( outer_UL_class );
		// Set class attribute and text for BUTTON
		outer_BUTTON_class.value = "all";
		outer_BUTTON.setAttributeNode( outer_BUTTON_class );
		outer_BUTTON.appendChild( outer_BUTTON_text );
		for ( i = 0; i < group.length; i += 1 ) {
			let bookmark = group[i];
			if ( !bookmark.group || !bookmark.name || !bookmark.url ) { continue; }
			// Create individual bookmarks.
			let li     = document.createElement   ( 'LI' ),
			    a      = document.createElement   ( 'A' ),
				id     = document.createAttribute ( 'id' ),
				href   = document.createAttribute ( 'href' ),
				target = document.createAttribute ( 'target' ),
				text   = document.createTextNode  ( bookmark.name );
			// Set anchor tag attributes and text.
			id.value = bookmark._id;
			a.setAttributeNode( id );
			href.value = bookmark.url;
			a.setAttributeNode( href );
			target.value = "_blank";
			a.setAttributeNode( target );
			a.appendChild( text );
			// Insert anchor element into list item.
			li.appendChild( a );
			// Insert the list item into it's container, an unordered list.
			inner_UL.appendChild( li );
		}
		// Assemble final output, working from the inside out.
		outer_LI.appendChild( outer_BUTTON );
		outer_LI.appendChild( inner_UL );
		outer_UL.appendChild( outer_LI );
		// Update html fragment
		fragment.appendChild( outer_UL );
		// Add to the DOM
		return fragment;
	},

	constructBookmarksSection = () => {
		let bookmarks  = bookmarksArray,
			sortedList = sortBookmarksIntoGroups( bookmarks ),
			fragments  = document.createDocumentFragment();
		removeBookmarks();
		for ( item in sortedList ) { 
			if ( !item ) { continue; };
			group = sortedList[ item ];
			fragments.appendChild( constructBookmarkList( group ) );
		}
		bmkSection.appendChild( fragments );
		openGroup.setupEventHandler();
		constructBookmarkGroupOptions();
		constructBookmarkNameOptions( sortedList );
		form.resetFormFields();
		removeChildNodes( errorMessage );		
	},

	removeBookmarks = () => {
		if ( bmkSection.hasChildNodes() ) {
			removeChildNodes( bmkSection );
		}
	},	

	constructBookmarkGroupOptions = () => { 
		/* <option value="News">News</option> */
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

	constructBookmarkNameOptions = ( sortedList, target ) => { 
		/* <optgroup label="News"><option id="5ec592b3fcceb051486e9c2f">Ars Technica</option></optgroup> */
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
		form.updateBookmarkPrefill();
	},

	/* AJAX CALLS */
	getBookmarks = () => {
		const xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				const status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
			       		bookmarksArray = JSON.parse( this.responseText );
			       		if ( bookmarksArray.length > 0 ) {
		       				constructBookmarksSection();
		       			} else {
		       				form.actionFromFooter( 'create', true );
		       				toggleModalHelp();
		       				removeBookmarks();
		       			}
		            } else {
		            	bmkSection.textContent = this.responseText;
		            }
				} else {
					bmkSection.textContent = this.responseText;
				}
			}	        
	    };
	    xhr.open( 'GET', window.location.href + "bookmarks", true );
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.send();	
	},

	verbBookmark = ( action, url, params, cbf ) => {
		const xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				const status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
						form.resetFormFields();
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
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.send( params );	
	},

	toggleModalHelp  = () => document.getElementsByClassName('modal')[0].classList.toggle('show');	  

let 
	bookmarksArray = [],
	groupsByName   = [],
	groups         = [];

// SETUP AFTER PAGE LOADS	
window.onload = () => {
	
	// LOAD PAGE ELEMENTS USING DB VALUES.
	getBookmarks();

	// CHECK STATE OF LOCAL STORAGE TO RESTORE FORM STATE ON RELOAD. THIS IS LESS IMPORTANT NOW THAT THE FORM IS USING AJAX.
	const formState = localStorage.getItem("form");
	
	if ( formState === "open" ) {
		if ( !body.classList.contains('edit') ) {
			form.openCloseForm();
		}
	}
	
	// EVENT HANDLER TO HIDE/SHOW FORM INPUTS BASED ON REQUESTED ACTION.
	form.container.addEventListener("click", ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			name   = target.name;		
		if ( tag === "INPUT" ) {
			switch (name) {
				case "action":
					 form.formActionState();
					 form.formElementState();
					 break;
					 
				case "element":
					form.formElementState();
					break;
				
				case "close":
					form.openCloseForm();
					break;
					
				case "submit":
					form.formSubmit( e );
					break;
										
			}
		}
		if ( ( tag === "BUTTON" && name === "close" ) || tag === "svg" || tag === "polyline" ) {
			form.openCloseForm(); 
		}
	});

	// EVENT HANDLER FOR FOOTER BUTTONS.
	document.getElementsByTagName("footer")[0].addEventListener("click", ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			name   = target.className;
		if ( tag === "BUTTON" ) {
			form.actionFromFooter( name );
			body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
	});

	/* FOOTER COPYRIGHT DATE */
	document.getElementById('year').innerText = year.getFullYear();

};
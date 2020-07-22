/* OPEN ALL BOOKMARKS WITHIN A GROUP. ALL BOOKMARKS WITHIN EACH GROUP ARE LAUNCHED WHEN CLIKCING ON A GROUP NAME. OTHERWISE, LINKS ARE OPENED INDIVIDUALLY VIA THEIR RESPECTIVE ANCHOR TAGS. */
const bmkSection   = document.getElementById("bookmarks"),
	  ajaxResponse = document.getElementById("ajaxResponse"),
	  year         = new Date();

let bookmarksArray = [],
	
	getLists = () => { 
		return Array.prototype.slice.call( document.getElementsByClassName('bookmarks') );
	},
	
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
		let target     = e.target,
			elements   = [], 
			list_items = [], 
			urls       = [];
		elements   = Array.prototype.slice.call( target.parentNode.children );
		list_items = Array.prototype.slice.call( elements[1].getElementsByTagName('LI') );
		urls       = getUrls( list_items );
		urls.forEach( openNewTab );	
	},
	
	setupGroupsEventHandler = ( value, index, array ) => {
		bmkSection.addEventListener("click", ( e ) => {
			let target = e.target; 			
			if ( target.classList.contains('all') ) { openTabs( e ); }
		});
	},

	/* FORM DOM ELEMENTS. THIS IS FOR EDITING DATA WITH MSQLI.  */
	f = {
		"container"             	 : document.forms[0],
		"bookmark"                   : document.getElementById('bookmark'),
		"group"                      : document.getElementById('group'),
		"bookmarksSelect"            : document.getElementById('bookmarksSelect'),
		"groupText"      		     : document.getElementById('groupText'),
		"groupSelect"    		     : document.getElementById('groupSelect'),
		"nameText"       		     : document.getElementById('nameText'),
		"nameSelect"     		     : document.getElementById('nameSelect'),		
		"urlText"        		     : document.getElementById('urlText'),
		"buttonSubmit"         		 : document.getElementById('buttonSubmit'),
		"updateBookmarkSelectValue"  : () => { return bookmarksSelect.value },
		"updateBookmarkSelectText"   : () => { return ( bookmarksSelect.options.length > 0  ) ? bookmarksSelect.options[bookmarksSelect.selectedIndex].text : "" },
        "groupValue"        		 : () => { return groupText.value },
		"groupSelectValue"  		 : () => { return groupSelect.value },
		"groupSelectText"   		 : () => { return ( groupSelect.options.length > 0 ) ? groupSelect.options[groupSelect.selectedIndex].text : "" },
		"titleValue"        		 : () => { return nameText.value },
		"titleSelectValue"  		 : () => { return nameSelect.value },
		"titleSelectText"   		 : () => { return ( nameSelect.options.length > 0  ) ? nameSelect.options[nameSelect.selectedIndex].text : "" },
		"urlValue"          		 : () => { return urlText.value },
		"actionValue"                : () => { return document.querySelector('input[name="action"]:checked').value },
		"elementValue"               : () => { return document.querySelector('input[name="element"]:checked').value }	
	},

	formRemoveClasses = ( ...classes ) => { f.container.classList.remove( ...classes ); },
	formAddClasses    = ( ...classes ) => { f.container.classList.add( ...classes ); },
	formUpdateButton  = ( action )     => { f.buttonSubmit.value = action; },	

	openCloseForm = () => { 
		document.body.classList.toggle( 'edit' );
		if ( document.body.classList.contains( 'edit' ) ) {
			localStorage.setItem( "form" , "open" );
			f.container.reset();
			removeChildNodes( ajaxResponse );
		} else {
			localStorage.setItem( "form", "closed" );
		}
	},
	
	actionFromFooter = ( action, empty ) => {
		if ( !document.body.classList.contains( 'edit' ) ) { openCloseForm(); }
		document.querySelector( 'input[value=' + action + ']' ).checked = "checked";
		if ( !empty ) { 
			f.bookmark.checked = "checked"; 
		} else {
			f.group.checked = "checked"; 
		}
		formActionState();
		formElementState();		
	},
	
	updateBookmarkPrefill = () => {
		if ( bookmarksArray.length > 0 ) {
			let group = "",
				name  = f.updateBookmarkSelectText(),
				url   = "",
				id    = f.updateBookmarkSelectValue(),
				findBookmarkDetails = ( item, index ) => {
					if ( item._id === id ) {
						group = item.group;
						url   = item.url;
					}
				};
			bookmarksArray.forEach( findBookmarkDetails );
			f.groupText.value = group;
			f.nameText.value  = name;
			f.urlText.value   = url;
		}		
	},

	formActionState = () => {
		let action = f.actionValue();
		formRemoveClasses( 'create', 'delete', 'update' );
		resetFormFields();
		removeChildNodes( ajaxResponse );
		formAddClasses( action );
		formUpdateButton( action );		
		if ( action === 'update' ) { 
			f.bookmark.checked = "checked";
			updateBookmarkPrefill();
		}
	},
	
	formElementState = () => {
		let element = f.elementValue(),
			action  = f.actionValue();
		formRemoveClasses( 'bookmark', 'group' );
		removeChildNodes( ajaxResponse );
		formAddClasses( element );
		if ( action !== 'update' ) { resetFormFields(); }	
	},
	
	formGetStates = () => {
		let action  = f.actionValue(),
		    element = f.elementValue();
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

	getFormValues = () => {  
		let state  = formGetStates(),
			config = {
				"group" : (() => { 
					if ( ( state.isGroup && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) { 
						return f.groupValue();
					} else if ( ( state.isGroup && state.isDelete ) || ( state.isBookmark && state.isCreate ) ) {
						return f.groupSelectText();
					} else {
						return "";
					}
				})(),
				"id" : (() => { 
					if ( state.isBookmark && state.isDelete ) {
						return f.titleSelectValue();
					} else if ( state.isBookmark && state.isUpdate ) {
						return f.updateBookmarkSelectValue();
					} else {
						return "";
					}
				})(),								   
				"name" : (() => {
					if ( state.isBookmark && state.isDelete ) {
						return f.titleSelectText();
					} else if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate )  ) {
						return f.titleValue();
					} else {
						return "";
					}
				})(),
				"url" : (() => {
					if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) {
						return f.urlValue();
					} else {
						return "";
					}
				})()
			};
		return { 
			"action" : state.action, "element": state.element, "state": state, "config": config 
		};
	},

	resetFormFields = () => {
		f.groupText.value = "";
		f.nameText.value  = "";
		f.urlText.value   = "";
	},

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

	setAjaxResponse = ( message ) => {
		removeChildNodes( ajaxResponse );
		if ( message ) {
	        let fragment = document.createDocumentFragment(),
	        	textNode = document.createTextNode( message );
	        fragment.appendChild( textNode );
	        ajaxResponse.appendChild( fragment );
		}
	},

	sortGroup = ( item, index ) => {
		let groupName = item.group;
		if ( groupName ) {
			if ( groupsByName.hasOwnProperty( groupName ) ) {
				groupsByName[ groupName ].push( item );
			} else {
				groupsByName[ groupName ] = [ item ];
				groups.push( groupName );
			}
		}			
	},

	groupsByName = [],
	groups       = [],
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

	removeBookmarks = () => {
		if ( bmkSection.hasChildNodes() ) {
			removeChildNodes( bmkSection );
		}
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
		setupGroupsEventHandler();
		constructBookmarkGroupOptions();
		constructBookmarkNameOptions( sortedList );
		resetFormFields();
		removeChildNodes( ajaxResponse );		
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
		if ( f.groupSelect.hasChildNodes() ) {
	        removeChildNodes( f.groupSelect );
		}
		f.groupSelect.appendChild( fragment );
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
		if ( f.nameSelect.hasChildNodes() ) {
	        removeChildNodes( f.nameSelect );
		}
		if ( f.bookmarksSelect.hasChildNodes() ) {
	        removeChildNodes( f.bookmarksSelect);
		}
		let fragment2 = fragment.cloneNode( true );
		f.nameSelect.appendChild( fragment );
		f.bookmarksSelect.appendChild( fragment2 );
		updateBookmarkPrefill();
	},

	/* AJAX CALLS */
	getBookmarks = () => {
		let	xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				let status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
			       		bookmarksArray = JSON.parse( this.responseText );
			       		if ( bookmarksArray.length > 0 ) {
		       				constructBookmarksSection();
		       			} else {
		       				actionFromFooter( 'create', true );
		       				toggleModalHelp();
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
		let	xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				let status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
						resetFormFields();
		       			cbf();
		            } else {
		            	setAjaxResponse( this.responseText );
		            }
				} else {
					setAjaxResponse( this.responseText );
				}
			}	        
	    };
	    
	    xhr.open( action, url, true );
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.send( params );	
	},

	formSubmit = ( event ) => {
		event.preventDefault();
		removeChildNodes( ajaxResponse );
		// Logic to determine action.		
		let values     = getFormValues(),
			state      = values.state,
			params     = "",
			validation = {
					action  : (() => { 
						if ( !values.action ) { return "Action is required."; }
						else if ( values.action && values.action.length > 25 ) { return "Action exceeds maximum character length of 25."; }
						else { return ""; }
					})(),
					element : (() => { 
						if ( !values.element ) { return "Element is required."; }
						else if ( values.element && values.element.length > 25 ) { return "Element exceeds maximum character length of 25."; }
						else { return ""; }
					})(),
					name    : (() => {
						if ( !values.config.name ) { return "Name is required."; }
						else if ( values.config.name.length > 100 ) { return "Name exceeds maximum character length of 100."; }
						else { return ""; }
					})(),
					url     : (() => {
						if ( !values.config.url ) { return "URL is required."; }
						else if ( values.config.url.length > 2083 ) { return "URL exceeds maximum character length of 2083."; }
						else { return ""; }
					})(),
					group   : (() => {
						if ( !values.config.group  ) { return "Group is required."; }
						else if ( values.config.group.length > 100 ) { return "Group exceeds maximum character length of 100."; }
						else { return ""; }
					})(),
					id      : (() => {
						if ( !values.config.id ) { return "ID is required."; }
						else if ( values.config.id.length > 25 ) { return "ID exceeds maximum character length of 25."; }
						else { return ""; }
					})()
			};
		if ( validation.action === "" && validation.element === "" ) {
			if ( state.isCreate && ( state.isBookmark || state.isGroup ) ) {
				if ( validation.name === "" && validation.url === "" && validation.group === "" ) {
					let params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
					verbBookmark( 
						'POST', 
						window.location.href + "bookmarks", 
						params,
						getBookmarks
					);
				} else {
					setAjaxResponse( validation.group + " " + validation.name + " " + validation.url );
				}
			}
			if ( state.isDelete && state.isBookmark  ) {
				if ( validation.id === "" ) {
					verbBookmark( 
						'DELETE', 
						window.location.href + "bookmarks/" + values.config.id, 
						params, 
						getBookmarks
					);
				} else {
					setAjaxResponse( validation.id );
				}
			}
			if ( state.isDelete && state.isGroup ) {
				if ( validation.group === "" ) {
					verbBookmark( 
						'DELETE', 
						window.location.href + "bookmarks/group/" + values.config.group, 
						params, 
						getBookmarks
					);
				} else {
					setAjaxResponse( validation.group );
				}
			}
			if ( state.isUpdate && state.isBookmark ) {
				if ( validation.name === "" && validation.url === "" && validation.group === "" && validation.id === "" ) {
					let params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
					verbBookmark( 
						'PUT', 
						window.location.href + "bookmarks/" + values.config.id, 
						params, 
						getBookmarks
					); 
				} else {
					setAjaxResponse( validation.group + " " + validation.name + " " + validation.url + " " + validation.id );
				}
			}
		} else {
			setAjaxResponse( validation.action + " " + validation.element );
		}
	},

	toggleModalHelp  = () => document.getElementsByClassName('modal')[0].classList.toggle('show');

// SETUP AFTER PAGE LOADS	
window.onload = () => {
	
	// LOAD PAGE ELEMENTS USING DB VALUES.
	getBookmarks();

	// CHECK STATE OF LOCAL STORAGE TO RESTORE FORM STATE ON RELOAD. THIS IS LESS IMPORTANT NOW THAT THE FORM IS USING AJAX.
	let formState = localStorage.getItem("form");
	
	if ( formState === "open" ) {
		if ( !document.body.classList.contains('edit') ) {
			openCloseForm();
		}
	}
	
	// EVENT HANDLER TO HIDE/SHOW FORM INPUTS BASED ON REQUESTED ACTION.
	f.container.addEventListener("click", ( e ) => {
		let target = e.target,
			tag    = target.tagName,
			name   = target.name;		
		if ( tag === "INPUT" ) {
			switch (name) {
				case "action":
					 formActionState();
					 formElementState();
					 break;
					 
				case "element":
					formElementState();
					break;
				
				case "cancel":
					openCloseForm();
					break;
					
				case "submit":
					formSubmit( e );
					break;
										
			}
		}
		if ( ( tag === "BUTTON" && name === "cancel" ) || tag === "svg" || tag === "polyline" ) {
			openCloseForm(); 
		}
	});

	// EVENT HANDLER FOR FOOTER BUTTONS.
	document.getElementsByTagName("footer")[0].addEventListener("click", ( e ) => {
		let target = e.target,
			tag    = target.tagName,
			name   = target.className;
		if ( tag === "BUTTON" ) {
			actionFromFooter( name );
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
	});

	document.getElementById('year').innerText = year.getFullYear();

};
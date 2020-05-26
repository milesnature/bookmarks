/* OPEN ALL BOOKMARKS WITHIN A GROUP. THIS ADDS AN EVENT LISTENER TO EACH GROUP. ALL BOOKMARKS WITHIN EACH GROUP ARE LAUNCHED WHEN CLIKCING ON GROUP NAME. OTHERWISE, LINKS ARE OPENED INDIVIDUALLY VIA THEIR RESPECTIVE ANCHOR TAGS. */
var bmkSection     = document.getElementById("bmkSection"),
	ajaxResponse   = document.getElementById("ajaxResponse"),
	noGroups,
	noBookmarks,
	bookmarksArray = [],
	
	getLists = function () { 
		return Array.prototype.slice.call( document.getElementsByClassName('bookmarks') );
	},
	
	openNewTab = function ( value, index, array ) {
		window.open( value, '_blank' );
		window.focus();
	},

	getUrls = function ( items ) {
		var urls_array = [],
			buildArray = function( value, index, array ) {
				urls_array.push( value.firstChild.href );
			}; 
		items.forEach( buildArray );
		return urls_array;
	},
	
	openTabs = function ( e ) {
		var target = e.target,
			elements = [], list_items = [], urls = [];
		elements   = Array.prototype.slice.call( target.parentNode.children );
		list_items = Array.prototype.slice.call(  elements[1].getElementsByTagName('LI') );
		urls       = getUrls( list_items );
		urls.forEach( openNewTab );
		
	},
	
	setupGroupsEventHandler = function ( value, index, array ) {
		var bmkSection = document.getElementById("bmkSection");
		bmkSection.addEventListener("click", function( e ) {
			var target = e.target; 			
			if ( target.classList.contains('all') ) { openTabs( e ); }
		});
	},

	/* FORM DOM ELEMENTS. THIS IS FOR EDITING DATA WITH MSQLI.  */
	formElmnts = {
			
		"bmksForm"             : document.forms[0],

		"actionCreate"         : document.getElementById('actionCreate'),
		"actionDelete"         : document.getElementById('actionDelete'),
		"actionUpdate"         : document.getElementById('actionUpdate'),

		"elementBookmark"      : document.getElementById('elementBookmark'),
		"elementGroup"         : document.getElementById('elementGroup'),

		"detailUpdateBookmarkSelect" : document.getElementById('detailUpdateBookmarkSelect'),
		"detailGroupText"      : document.getElementById('detailGroupText'),
		"detailGroupSelect"    : document.getElementById('detailGroupSelect'),
		// "detailParentText"     : document.getElementById('detailParentText'),		
		// "detailParentSelect"   : document.getElementById('detailParentSelect'),
		"detailNameText"       : document.getElementById('detailNameText'),
		"detailNameSelect"     : document.getElementById('detailNameSelect'),		
		"detailUrlText"        : document.getElementById('detailUrlText'),

		"buttonSubmit"         : document.getElementById('buttonSubmit'),
		"buttonCancel"         : document.getElementById('buttonCancel'),		

		"hasCreateClass"       : function () { return formElmnts.bmksForm.classList.contains('create') },
		"hasDeleteClass"       : function () { return formElmnts.bmksForm.classList.contains('delete') },
		"hasUpdateClass"       : function () { return formElmnts.bmksForm.classList.contains('update') },

		"hasBookmarkClass"     : function () { return formElmnts.bmksForm.classList.contains('bookmark') },
		"hasGroupClass"        : function () { return formElmnts.bmksForm.classList.contains('group') },
		
		"isCreateChecked"      : function () { return formElmnts.actionCreate.checked },
		"isDeleteChecked"      : function () { return formElmnts.actionDelete.checked },
		"isUpdateChecked"      : function () { return formElmnts.actionUpdate.checked },

		"isBookmarkChecked"    : function () { return formElmnts.elementBookmark.checked },
		"isGroupChecked"       : function () { return formElmnts.elementGroup.checked },
				
		"updateBookmarkSelectText"    : function () { return detailUpdateBookmarkSelect.options[detailUpdateBookmarkSelect.selectedIndex].text },
		"updateBookmarkSelectValue"   : function () { return detailUpdateBookmarkSelect.value },		
        "bmkGroupValue"        : function () { return detailGroupText.value },
		"bmkGroupSelectValue"  : function () { return detailGroupSelect.value },
		"bmkGroupSelectText"   : function () { return detailGroupSelect.options[detailGroupSelect.selectedIndex].text },
		// "bmkParentSelectText"  : function () { return ( detailParentSelect.options.length ) ? detailParentSelect.options[detailParentSelect.selectedIndex].value : 0; },
		"bmkTitleValue"        : function () { return detailNameText.value },
		"bmkTitleSelectValue"  : function () { return detailNameSelect.value },
		"bmkTitleSelectText"   : function () { return detailNameSelect.options[detailNameSelect.selectedIndex].text },
		"bmkUrlValue"          : function () { return detailUrlText.value },

		"bmkActionValue"    : function () { 
							    var action = "";
								if ( formElmnts.hasCreateClass() ) { action = 'create' }
								if ( formElmnts.hasDeleteClass() ) { action = 'delete' }
								if ( formElmnts.hasUpdateClass() ) { action = 'update' }
								return action;
							},
							
		"bmkElementValue"   : function () { 
								var element = "";
								if ( formElmnts.hasBookmarkClass() ) { element = 'bookmark' }
								if ( formElmnts.hasGroupClass() )    { element = 'group' }
								return element;
							}
							
	},
	
	openCloseForm = function () { 
	
		document.body.classList.toggle('edit');
		
		if ( document.body.classList.contains('edit') ) {
			localStorage.setItem("form","open");
			formElmnts.bmksForm.reset();
			removeChildNodes( ajaxResponse );
		} else {
			localStorage.setItem("form","closed");
		}
		
	},
	
	actionFromFooter = function ( action ) {
		
		if ( !document.body.classList.contains('edit') ) { 
			openCloseForm();
		}
		if ( action === "createBookmark" ) {
			formElmnts.actionCreate.checked = "checked";
		}		
		if ( action === "deleteBookmark" ) {
			formElmnts.actionDelete.checked = "checked";
		}
		if ( action === "updateBookmark" ) {
			formElmnts.actionUpdate.checked = "checked";
		}

		formElmnts.elementBookmark.checked = "checked";
		formActionState();
		formElementState();		
		
	},
	
	bookmarkFiller = function () {

		var group = "",
			name  = formElmnts.updateBookmarkSelectText(),
			url   = "",
			id    = formElmnts.updateBookmarkSelectValue(),

			findBookmarkDetails = function ( item, index ) {

				if ( item._id === id ) {
					group = item.group;
					url   = item.url;
				}
			};

		bookmarksArray.forEach( findBookmarkDetails );

		formElmnts.detailGroupText.value = group;
		formElmnts.detailNameText.value  = name;
		formElmnts.detailUrlText.value   = url;		
	},

	formActionState = function () { 

		formElmnts.bmksForm.classList.remove( 'create' );
		formElmnts.bmksForm.classList.remove( 'delete' );
		formElmnts.bmksForm.classList.remove( 'update' );

		resetFormFields();

		removeChildNodes( ajaxResponse );

		if ( formElmnts.isCreateChecked() ) {
			if ( !formElmnts.hasCreateClass() ) {
				formElmnts.bmksForm.classList.add( 'create' );
				formElmnts.buttonSubmit.value = 'Create';
			}
		}
		if ( formElmnts.isDeleteChecked() ) {
			if ( !formElmnts.hasDeleteClass() ) {
				formElmnts.bmksForm.classList.add( 'delete' );
				formElmnts.buttonSubmit.value = 'Delete';
			}
		}

		if ( formElmnts.isUpdateChecked() ) {
			formElmnts.bmksForm.classList.add( 'update' );
			formElmnts.buttonSubmit.value = 'Update';
			formElmnts.elementBookmark.checked = "checked";
			bookmarkFiller();
		}
		
	},
	
	formElementState = function () {
					
		removeChildNodes( ajaxResponse );

		if ( formElmnts.isBookmarkChecked() ) {
			if ( !formElmnts.hasBookmarkClass() ) {
				formElmnts.bmksForm.classList.add( 'bookmark' );
			}
			formElmnts.bmksForm.classList.remove( 'group' );
		}
		if ( formElmnts.isGroupChecked() ) {
			if ( !formElmnts.hasGroupClass() ) {
				formElmnts.bmksForm.classList.add( 'group' );
			}
			formElmnts.bmksForm.classList.remove( 'bookmark' );
		}
		if ( formElmnts.isUpdateChecked() ) {
			formElmnts.bmksForm.classList.add( 'bookmark' );
			formElmnts.bmksForm.classList.remove( 'group' );
		}
		
	},
	
	getFormValues = function () {
	
		var action  = formElmnts.bmkActionValue(),
			element = formElmnts.bmkElementValue(),
			config  = {

				"group" : function() { 
					if ( ( element === 'group' && action === 'create' ) || ( element === 'bookmark' && action === 'update' ) ) { 
						return formElmnts.bmkGroupValue();
					} else if ( ( element === 'group' && action === 'delete' ) || ( element === 'bookmark' && action === 'create' ) ) {
						return formElmnts.bmkGroupSelectText();
					} else {
						return "";
					}
				}(),
				
				"id" : function() { 
					if ( element === 'bookmark' && action === 'delete' ) {
						return formElmnts.bmkTitleSelectValue();
					} else if ( element === 'bookmark' && action === 'update' ) {
						return formElmnts.updateBookmarkSelectValue();
					} else {
						return "";
					}
				}(),								   
				
				"name" : function() {
					if ( element === 'bookmark' && action === 'delete' ) {
						return formElmnts.bmkTitleSelectText();
					} else if ( ( ( element === 'bookmark' || element === 'group' ) && action === 'create' ) || ( element === 'bookmark' && action === 'update' )  ) {
						return formElmnts.bmkTitleValue();
					} else {
						return "";
					}
				}(),
				
				"url" : function() {
					if ( ( ( element === 'bookmark' || element === 'group' ) && action === 'create' ) || ( element === 'bookmark' && action === 'update' ) ) {
						return formElmnts.bmkUrlValue();
					} else {
						return "";
					}
				}()

			};
		
		return { 
			"action" : action, "element": element, "config": config 
		};
	
	},

	resetFormFields = function () {
		detailGroupText.value = "";
		detailNameText.value  = "";
		detailUrlText.value   = "";
	},

	removeChildNodes = function ( e ) {
		if ( e.hasChildNodes( ) ) {
	        var child = e.lastElementChild;  
	        while ( child ) { 
	            e.removeChild( child ); 
	            child = e.lastElementChild; 
	        } 
		}
		if ( e.textContent.length ) {
			e.textContent = "";
		}
	},

	setAjaxResponse = function ( message ) {
		removeChildNodes( ajaxResponse );
		if ( message ) {
	        var fragment = document.createDocumentFragment(),
	        	textNode = document.createTextNode( message );
	        fragment.appendChild( textNode );
	        ajaxResponse.appendChild( fragment );
		}
	},

	groupsByName = [];
	groups       = [];

	sortGroup = function( item, index ) {

		var groupName = item.group;

		if ( groupName ) {

			if ( groupsByName.hasOwnProperty( groupName ) ) {
				groupsByName[ groupName ].push( item );
			} else {
				groupsByName[ groupName ] = [ item ];
				groups.push( groupName );
			}

		}			

	},

	sortBookmarksIntoGroups = function( bookmarks ) {

		groupsByName = [];
		groups       = [];

		bookmarks.forEach( sortGroup );

		return groupsByName;

	},

	constructBookmarkLists = function( ) {

		/* HTML STRUCTURE
		<ul class="bookmarks">
			<li><button class="all">Group Name</button>
				<ul>
					<li><a id="9" href="http://random.com" target="_blank">Name</a></li>
					...
				</ul>
			</li>
		</ul>
		*/

		var bookmarks = bookmarksArray;

		if ( bookmarks.length ) {

			var fragment   = document.createDocumentFragment(),
				sortedList = sortBookmarksIntoGroups( bookmarks ),
				group      = [],
				i;

			for ( item in sortedList ) { 

				if ( !item ) { continue; };

				group = sortedList[ item ];

				var groupName          = item,
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

					var bookmark = group[i];

					if ( !bookmark.group || !bookmark.name || !bookmark.url ) { continue; }

					// Create individual bookmarks.
					var li     = document.createElement   ( 'LI' ),
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

					// Insert the list item into it's conatiner, an unordered list.
					inner_UL.appendChild( li );

				}

				// Assemble final output, working from the inside out.
				outer_LI.appendChild( outer_BUTTON );
				outer_LI.appendChild( inner_UL );
				outer_UL.appendChild( outer_LI );

				// Update html fragment
				fragment.appendChild( outer_UL );

			}

			// Add to the DOM
			if ( bmkSection.hasChildNodes() ) {
				removeChildNodes( bmkSection );
			}
			
			bmkSection.appendChild( fragment );

		}

		setupGroupsEventHandler();
		constructBookmarkGroupOptions();
		constructBookmarkNameOptions( sortedList );
		resetFormFields();
		removeChildNodes( ajaxResponse );

	},

	constructBookmarkGroupOptions = function ( ) { 
		
		/* HTML STRUCTURE
		   <option value="News">News</option> 
		*/

		var fragment      = document.createDocumentFragment(),
			
			buildOptions  = function ( item, index ) {
				option    = document.createElement   ( 'OPTION' ),
				val       = document.createAttribute ( 'value' ),
				text      = document.createTextNode  ( item );
				val.value = item;
				option.setAttributeNode( val );
				option.appendChild( text );
				fragment.appendChild( option );
			};

		groups.forEach( buildOptions );


		if ( formElmnts.detailGroupSelect.hasChildNodes() ) {
	        removeChildNodes( formElmnts.detailGroupSelect );
		}
		
		formElmnts.detailGroupSelect.appendChild( fragment );

	},

	constructBookmarkNameOptions = function ( sortedList, target ) { 
		
		/* HTML STRUCTURE
			<optgroup label="News"><option id="5ec592b3fcceb051486e9c2f">Ars Technica</option></optgroup>
		*/

		var fragment = function () { return document.createDocumentFragment() } (),
			group    = [];

		for ( item in sortedList ) { 

			if ( !item ) { continue; };

			group = sortedList[ item ];

			var groupFramgment = document.createDocumentFragment(),
				optgroup       = document.createElement   ( 'OPTGROUP' ),
				label          = document.createAttribute ( 'label' ),

				buildOptions  = function ( item, index ) {
					option    = document.createElement   ( 'OPTION' ),
					val       = document.createAttribute ( 'value' ),
					text      = document.createTextNode  ( item.name );
					val.value = item._id;
					option.setAttributeNode( val );
					option.appendChild( text );
					groupFramgment.appendChild( option );
				};

			label.value  = item;
			optgroup.setAttributeNode( label );

			group.forEach( buildOptions );

			optgroup.appendChild( groupFramgment );
			fragment.appendChild( optgroup );

		}

		if ( formElmnts.detailNameSelect.hasChildNodes() ) {
	        removeChildNodes( formElmnts.detailNameSelect );
		}

		if ( formElmnts.detailUpdateBookmarkSelect.hasChildNodes() ) {
	        removeChildNodes( formElmnts.detailUpdateBookmarkSelect);
		}

		var fragment2 = fragment.cloneNode( true );

		formElmnts.detailNameSelect.appendChild( fragment );
		formElmnts.detailUpdateBookmarkSelect.appendChild( fragment2 );

		bookmarkFiller();

	},

	/* AJAX CALLS */
	getBookmarks = function ( ) {
		var	xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function( ) {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				var status = xhr.status;
				if ( status === 0 || ( status >= 200 && status < 400 ) ) {
			       	if ( this.responseText ) {
			       		bookmarksArray = JSON.parse( this.responseText );
		       			constructBookmarkLists( );
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

	verbBookmark = function ( action, url, params, cbf ) {
		var	xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function( ) {
			// In local files, status is 0 upon success in Mozilla Firefox
			if( xhr.readyState === XMLHttpRequest.DONE ) {
				var status = xhr.status;
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

	formSubmit = function( event ) {
		
		event.preventDefault();

		removeChildNodes( ajaxResponse );

		// Logic to determine action.		
		var values     = getFormValues(),
			params     = "",
			validation = {
					action  : function () { 
						if ( !values.action ) { return "Action is required."; }
						else if ( values.action && values.action.length > 50 ) { return "Action exceeds maximum character length of 50."; }
						else { return ""; }
					}(),
					element : function () { 
						if ( !values.element ) { return "Element is required."; }
						else if ( values.element && values.element.length > 50 ) { return "Element exceeds maximum character length of 50."; }
						else { return ""; }
					}(),
					name    : function () {
						if ( !values.config.name ) { return "Name is required."; }
						else if ( values.config.name.length > 100 ) { return "Name exceeds maximum character length of 100."; }
						else { return ""; }
					}(),
					url     : function () {
						if ( !values.config.url ) { return "URL is required."; }
						else if ( values.config.url.length > 2083 ) { return "URL exceeds maximum character length of 2083."; }
						else { return ""; }
					}(),
					group   : function () {
						if ( !values.config.group  ) { return "Group is required."; }
						else if ( values.config.group.length > 100 ) { return "Group exceeds maximum character length of 100."; }
						else { return ""; }
					}(),
					id      : function () {
						if ( !values.config.id ) { return "ID is required. Something may be wrong with database entry."; }
						else if ( values.config.id.length > 25 ) { return "ID exceeds maximum character length of 25."; }
						else { return ""; }
					}()
			};

		if ( validation.action === "" && validation.element === "" ) {

			if ( values.action === "create" && ( values.element === "bookmark" || values.element === "group" ) ) {
				if ( validation.name === "" && validation.url === "" && validation.group === "" ) {
					var params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
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


			if ( values.action === "delete" && values.element === "bookmark"  ) {
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

			if ( values.action === "delete" && values.element === "group" ) {
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

			if ( values.action === "update" && values.element === "bookmark" ) {
				if ( validation.name === "" && validation.url === "" && validation.group === "" && validation.id === "" ) {
					var params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
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

	toggleModalAbout = function(  ) {
		document.getElementsByClassName('modal')[0].classList.toggle('show');
	},

	toggleModalHelp = function(  ) {
		document.getElementsByClassName('modal')[1].classList.toggle('show');
	};


		
// SETUP AFTER PAGE LOADS	
window.onload = function () {
	
	// LOAD PAGE ELEMENTS USING DB VALUES.
	getBookmarks();

	// CHECK STATE OF LOCAL STORAGE TO RESTORE FORM STATE ON RELOAD. THIS IS LESS IMPORTANT NOW THAT THE FORM IS USING AJAX.
	var formState = localStorage.getItem("form");
	
	if ( formState === "open" ) {
		if ( !document.body.classList.contains('edit') ) {
			openCloseForm();
		}
	}
	
	// EVENT HANDLER TO HIDE/SHOW FORM INPUTS BASED ON REQUESTED ACTION.
	formElmnts.bmksForm.addEventListener("click", function( e ) {
		
		var target = e.target,
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
	document.getElementsByTagName("footer")[0].addEventListener("click", function( e ) {
		
		var target = e.target,
			tag    = target.tagName,
			name   = target.className;
												
		if ( tag === "BUTTON" ) {
			switch (name) {
				case "createBookmark":
					actionFromFooter( 'createBookmark' );
					break;
					 
				case "deleteBookmark":
					actionFromFooter( 'deleteBookmark' );
					break;

				case "updateBookmark":
					actionFromFooter( 'updateBookmark' );
					break;
				
			}
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
		
	});
	
};
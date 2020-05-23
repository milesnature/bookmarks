/* OPEN ALL BOOKMARKS WITHIN A GROUP. THIS ADDS AN EVENT LISTENER TO EACH GROUP. ALL BOOKMARKS WITHIN EACH GROUP ARE LAUNCHED WHEN CLIKCING ON GROUP NAME. OTHERWISE, LINKS ARE OPENED INDIVIDUALLY VIA THEIR RESPECTIVE ANCHOR TAGS. */
var bmkSection     = document.getElementById("bmkSection"),
	ajaxResponse   = document.getElementById("ajaxResponse"),
	noGroups,
	noBookmarks,
	bookmarksArray = [],

	// user = function () {
	// 	var path = window.location.pathname,
	// 		u;
	// 	u = path.replace("/users/", "");
	// 	u = u.replace("/", "");
	// 	return u;
	// },
	
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
		"elementBookmark"      : document.getElementById('elementBookmark'),
		"elementGroup"         : document.getElementById('elementGroup'),
		"detailGroupText"      : document.getElementById('detailGroupText'),
		"detailGroupSelect"    : document.getElementById('detailGroupSelect'),
		// "detailParentSelect"   : document.getElementById('detailParentSelect'),
		"detailNameText"       : document.getElementById('detailNameText'),
		"detailNameSelect"     : document.getElementById('detailNameSelect'),		
		"detailUrlText"        : document.getElementById('detailUrlText'),
		"buttonSubmit"         : document.getElementById('buttonSubmit'),
		"buttonCancel"         : document.getElementById('buttonCancel'),		

		"hasCreateClass"       : function () { return formElmnts.bmksForm.classList.contains('create') },
		"hasDeleteClass"       : function () { return formElmnts.bmksForm.classList.contains('delete') },
		"hasBookmarkClass"     : function () { return formElmnts.bmksForm.classList.contains('bookmark') },
		"hasGroupClass"        : function () { return formElmnts.bmksForm.classList.contains('group') },
		
		"isCreateChecked"      : function () { return formElmnts.actionCreate.checked },
		"isDeleteChecked"      : function () { return formElmnts.actionDelete.checked },
		"isBookmarkChecked"    : function () { return formElmnts.elementBookmark.checked },
		"isGroupChecked"       : function () { return formElmnts.elementGroup.checked },
				
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
			ajaxResponse.innerHTML = "";
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
			formElmnts.elementBookmark.checked = "checked";
			formActionState();
			formElementState();
		}		
		if ( action === "deleteBookmark" ) {
			formElmnts.actionDelete.checked = "checked";
			formElmnts.elementBookmark.checked = "checked";
			formActionState();
			formElementState();
		}
		
	},
	
	formActionState = function () { 
					
		if ( formElmnts.isCreateChecked() ) {
			if ( !formElmnts.hasCreateClass() ) {
				formElmnts.bmksForm.classList.add( 'create' );
				formElmnts.buttonSubmit.value = 'Create';
				ajaxResponse.innerHTML = "";
			}
			formElmnts.bmksForm.classList.remove( 'delete' );
		}
		if ( formElmnts.isDeleteChecked() ) {
			if ( !formElmnts.hasDeleteClass() ) {
				formElmnts.bmksForm.classList.add( 'delete' );
				formElmnts.buttonSubmit.value = 'Delete';
				ajaxResponse.innerHTML = "";
			}
			formElmnts.bmksForm.classList.remove( 'create' );
		}
		
	},
	
	formElementState = function () {
					
		if ( formElmnts.isBookmarkChecked() ) {
			if ( !formElmnts.hasBookmarkClass() ) {
				formElmnts.bmksForm.classList.add( 'bookmark' );
				ajaxResponse.innerHTML = "";
			}
			formElmnts.bmksForm.classList.remove( 'group' );
		}
		if ( formElmnts.isGroupChecked() ) {
			if ( !formElmnts.hasGroupClass() ) {
				formElmnts.bmksForm.classList.add( 'group' );
				ajaxResponse.innerHTML = "";
			}
			formElmnts.bmksForm.classList.remove( 'bookmark' );
		}
		
	},

	noBookmarksSetup = function ( noBookmarks ) {
		
		if ( noBookmarks === true && !formElmnts.bmksForm.classList.contains('noGroups') ) {
			
			if ( !formElmnts.bmksForm.classList.contains('noBookmarks') ) {
	        	formElmnts.bmksForm.classList.add('noBookmarks');
	        }
	        
	        formElmnts.actionCreate.checked    = "checked";
	        formElmnts.elementBookmark.checked = "checked";
	        formActionState();
	        formElementState();
	        document.body.classList.add('edit');
	        ajaxResponse.innerHTML = "No bookmarks were found. Please create a bookmark. \<a class=\"get-help\" onclick=\"toggleModalHelp()\">Help\<\/a>.";	        
	        	        
        } else {
	        
	        if ( formElmnts.bmksForm.classList.contains('noBookmarks') ) {
	        	formElmnts.bmksForm.classList.remove('noBookmarks');
	        }
	        	        
        }	
        	
	},
	
	getFormValues = function () {
	
		var action  = formElmnts.bmkActionValue(),
			element = formElmnts.bmkElementValue(),
			config  = {

			    // "parent"           : function() { 
			    // 					   if ( element === 'group' && action === 'create' ) { 
			    // 					       return formElmnts.bmkParentSelectText();
			    // 					   } else if ( element === 'bookmark' && action === 'create' ) {
			    // 					   	   return formElmnts.bmkParentSelectText();
			    // 					   } else {
			    // 					   	   return "";
			    // 					   }
			    // 				   }(),
				"group"            : function() { 
									   if ( element === 'group' && action === 'create' ) { 
										   return formElmnts.bmkGroupValue();
									   } else if ( element === 'group' && action === 'delete' ) {
										   return formElmnts.bmkGroupSelectText();
									   } else if ( element === 'bookmark' && action === 'create' ) { 
										   return formElmnts.bmkGroupSelectText(); 
									   } else {
										   return "";
									   }
								   }(),
				"id"               : function() { 
									   if ( element === 'bookmark' && action === 'delete' ) { 
										   return formElmnts.bmkTitleSelectValue();
									   } else {
										   return "";
									   }
								   }(),								   
				"name"             : function() { 
									   if ( element === 'bookmark' && action === 'delete' ) { 
										   return formElmnts.bmkTitleSelectText(); 
									   } else if ( ( element === 'bookmark' || element === 'group' ) && action === 'create' ) { 
										   return formElmnts.bmkTitleValue(); 
									   } else {
										   return "";
									   }
								   }(),
				"url"              : function() {
								       if ( ( element === 'bookmark' || element === 'group' ) && action === 'create' ) {
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
		        var child = bmkSection.lastElementChild;  
		        while (child) { 
		            bmkSection.removeChild(child); 
		            child = bmkSection.lastElementChild; 
		        } 
				bmkSection.appendChild( fragment );
			} else {
				bmkSection.appendChild( fragment );
			}

		}

		setupGroupsEventHandler();
		constructBookmarkGroupOptions();
		constructBookmarkNameOptions( sortedList );

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
	        var child = formElmnts.detailGroupSelect.lastElementChild;  
	        while (child) { 
	            formElmnts.detailGroupSelect.removeChild(child); 
	            child = formElmnts.detailGroupSelect.lastElementChild; 
	        } 
			formElmnts.detailGroupSelect.appendChild( fragment );
		} else {
			formElmnts.detailGroupSelect.appendChild( fragment );
		}

	},

	constructBookmarkNameOptions = function ( sortedList ) { 
		
		/* HTML STRUCTURE
			<optgroup label="News"><option id="5ec592b3fcceb051486e9c2f">Ars Technica</option></optgroup>
		*/

		var fragment = document.createDocumentFragment(),
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
	        var child = formElmnts.detailNameSelect.lastElementChild;  
	        while (child) { 
	            formElmnts.detailNameSelect.removeChild(child); 
	            child =formElmnts.detailNameSelect.lastElementChild; 
	        } 
			formElmnts.detailNameSelect.appendChild( fragment );
		} else {
			formElmnts.detailNameSelect.appendChild( fragment );
		}

	},

	/* AJAX CALLS */
	// userParam = "?user="+user(),
	
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
		            	bmkSection.innerHTML = this.responseText;
		            }
				} else {
					bmkSection.innerHTML = this.responseText;
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
		            	ajaxResponse.innerHTML = this.responseText;
		            }
				} else {
					ajaxResponse.innerHTML = this.responseText;
				}
			}	        
	    };
	    
	    xhr.open( action, url, true );
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.send( params );	
	},

	formSubmit = function( event ) {
		
		event.preventDefault();

		// Logic to determine action.		
		var values = getFormValues(),
			params = "";

		if ( values.action === "create" && ( values.element === "bookmark" || values.element === "group" ) ) {
			var params = "name=" + values.config.name + "&url=" + values.config.url + "&group=" + values.config.group;
			verbBookmark( 
				'POST', 
				window.location.href + "bookmarks", 
				params,
				getBookmarks
			);
		}

		if ( values.action === "delete" && values.element === "bookmark"  ) {
			verbBookmark( 
				'DELETE', 
				window.location.href + "bookmarks/" + values.config.id, 
				params, 
				getBookmarks
			);
		}

		if ( values.action === "delete" && values.element === "group" ) {
			verbBookmark( 
				'DELETE', 
				window.location.href + "bookmarks/group/" + values.config.group, 
				params, 
				getBookmarks
			);
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
				
			}
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
		
	});
	
};
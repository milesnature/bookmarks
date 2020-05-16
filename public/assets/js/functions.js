/* OPEN ALL BOOKMARKS WITHIN A GROUP. THIS ADDS AN EVENT LISTENER TO EACH GROUP. ALL BOOKMARKS WITHIN EACH GROUP ARE LAUNCHED WHEN CLIKCING ON GROUP NAME. OTHERWISE, LINKS ARE OPENED INDIVIDUALLY VIA THEIR RESPECTIVE ANCHOR TAGS. */
var bmkSection   = document.getElementById("bmkSection"),
	ajaxResponse = document.getElementById("ajaxResponse"),
	noGroups,
	noBookmarks,
	
	user = function () {
		var path = window.location.pathname,
			u;
		u = path.replace("/users/", "");
		u = u.replace("/", "");
		return u;
	},
	
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
		"detailParentSelect"   : document.getElementById('detailParentSelect'),
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
		"bmkParentSelectText"  : function () { return ( detailParentSelect.options.length ) ? detailParentSelect.options[detailParentSelect.selectedIndex].value : 0; },
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

	noGroupsSetup = function ( noGroups ) {
		
		if ( noGroups === true ) {

			if ( !formElmnts.bmksForm.classList.contains('noGroups') ) {
	        	formElmnts.bmksForm.classList.add('noGroups');
	        }
	        
	        formElmnts.actionCreate.checked = "checked";
	        formElmnts.elementGroup.checked = "checked";
	        formActionState(); 
	        formElementState();
	        document.body.classList.add('edit');
	        ajaxResponse.innerHTML = "No groups were found. Please create a group. \<a class=\"get-help\" onclick=\"toggleModalHelp()\">Help\<\/a>.";
	        	        
        } else {
	        
	        if ( formElmnts.bmksForm.classList.contains('noGroups') ) {
	        	formElmnts.bmksForm.classList.remove('noGroups');
	        }
	        	        
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
	
	getFormParams = function () {
	
		var action  = formElmnts.bmkActionValue(),
			element = formElmnts.bmkElementValue(),
			config  = {
				"bmk_action"     : "bmk_action=" + action,
				"bmk_element"    : "bmk_element=" + element,
				"bmk_group_id"   : function() {
									   if ( element === 'group' && action === 'delete' ) {
										   return "bmk_group_id=" + formElmnts.bmkGroupSelectValue();
									   } else if ( element === 'bookmark' && action === 'create' ) { 
										   return "bmk_group_id=" + formElmnts.bmkGroupSelectValue(); 
									   } else {
										   return "";
									   }
								   },
			    "bmk_parent_id"  : function() { 
			    					   if ( element === 'group' && action === 'create' ) { 
			    					       return "bmk_parent_id=" + formElmnts.bmkParentSelectText();
			    					   } else if ( element === 'bookmark' && action === 'create' ) {
			    					   	   return "bmk_parent_id=" + formElmnts.bmkParentSelectText();
			    					   } else {
			    					   	   return "";
			    					   }
			    				   },
				"bmk_group_text" : function() { 
									   if ( element === 'group' && action === 'create' ) { 
										   return "bmk_group_text=" + formElmnts.bmkGroupValue();
									   } else if ( element === 'group' && action === 'delete' ) {
										   return "bmk_group_text=" + formElmnts.bmkGroupSelectText();
									   } else if ( element === 'bookmark' && action === 'create' ) { 
										   return "bmk_group_text=" + formElmnts.bmkGroupSelectText(); 
									   } else {
										   return "";
									   }
								   },
				"bmk_title_id"   : function() { 
									   if ( element === 'bookmark' && action === 'delete' ) { 
										   return "bmk_title_id=" + formElmnts.bmkTitleSelectValue();
									   } else {
										   return "";
									   }
								   },								   
				"bmk_title_text" : function() { 
									   if ( element === 'bookmark' && action === 'delete' ) { 
										   return "bmk_title_text=" + formElmnts.bmkTitleSelectText(); 
									   } else if ( element === 'bookmark' && action === 'create' ) { 
										   return "bmk_title_text=" + formElmnts.bmkTitleValue(); 
									   } else {
										   return "";
									   }
								   },
				"bmk_url"        : function() {
								       if ( element === 'bookmark' && action === 'create' ) {
								           return "bmk_url=" + formElmnts.bmkUrlValue();
								       } else {
									       return "";
								       }
								   }
			},
			
			params = [];
			
		params.push( config.bmk_action );
		params.push( config.bmk_element );
		if ( config.bmk_group_id()   !== "" ) { params.push( config.bmk_group_id()   ) };
		if ( config.bmk_parent_id()  !== "" ) { params.push( config.bmk_parent_id()  ) };
		if ( config.bmk_group_text() !== "" ) { params.push( config.bmk_group_text() ) };
		if ( config.bmk_title_id()   !== "" ) { params.push( config.bmk_title_id()   ) };
		if ( config.bmk_title_text() !== "" ) { params.push( config.bmk_title_text() ) };
		if ( config.bmk_url()        !== "" ) { params.push( config.bmk_url()        ) };
		params.push( "user=" + user() );
		
		//console.log( params.join('&') );
		
		return params.join('&');
	
	},

	buildBookmarkLists = function( bookmarks ) {

		var html = "";

		html += '<ul class="bookmarks">';
		html += '<li><button class="all">' + bookmark.group + '</button>';
		html += '<ul>';



	
	
	/* SCHEMA
	<ul class="bookmarks">
		<li><button class="all" id="1">Development</button>
			<ul>
				<li><a id="9" href="http://caniuse.com/#search=text-shadow" target="_blank">caniuse</a></li>
				<li><a id="4" href="https://panel.dreamhost.com/" target="_blank">DreamHost</a></li>
				<li><a id="7" href="https://favicon.io/favicon-converter/" target="_blank">favicon.io</a></li>
				<li><a id="5" href="https://github.com/" target="_blank">GitHub</a></li>
				<li><a id="136" href="https://help.dreamhost.com/hc/en-us/articles/360029083351-Installing-a-custom-version-of-NVM-and-Node-js" target="_blank">Intall Node Dreamhost</a></li>
				<li><a id="8" href="https://jsonformatter.curiousconcept.com" target="_blank">jsonformatter</a></li>
				<li><a id="2" href="http://milesnature-dist:8888/" target="_blank">milesnature-src</a></li>
				<li><a id="1" href="https://milesnature.com/" target="_blank">milesnature.com</a></li>
				<li><a id="6" href="https://myfonts.com" target="_blank">MyFonts</a></li>
				<li><a id="137" href="https://node.milesnature.com/" target="_blank">node.milesnature.com</a></li>
				<li><a id="139" href="https://notes.milesnature.com/" target="_blank">Notes</a></li>
				<li><a id="10" href="http://regexpal.com/" target="_blank">Regex Tester</a></li>
				<li><a id="3" href="http://speedtest.net/" target="_blank">Speedtest</a></li>
				<li><a id="90" href="https://www.w3schools.com" target="_blank">w3schools</a></li>
				<li><a id="138" href="https://cart.milesnature.com/" target="_blank">Zen Cart</a></li>
			</ul>
		</li>
	</ul>
	*/

	},


	/* AJAX CALLS */
	userParam = "?user="+user(),
	
	getBookmarks = function () {
		
		var xhr = new XMLHttpRequest();
			    
	    xhr.onreadystatechange = function() {
		    
	        if (this.readyState == 4 && this.status == 200) {
		       	if ( this.responseText ) {
	            	bmkSection.innerHTML = this.responseText;
					setupGroupsEventHandler();
	            } else {
	            	bmkSection.innerHTML = "";
	            }
	        } else {
		        if ( this.responseText ) {
		        	//ajaxResponse.innerHTML = this.responseText;
		        }
	        }
	        
	    };
	    
	    xhr.open("GET", window.location.href + "bookmarks?group=News", true);
	    xhr.send();
	
	},

	getBookmarkGroupOptions = function () {
	    
		console.log({ "window.location" : window.location });

	    var xhr = new XMLHttpRequest();
	    
	    xhr.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
		        if ( this.responseText ) { 
	            	detailGroupSelect.innerHTML = this.responseText;
	            	detailParentSelect.innerHTML = "<option id=\"none\" name=\"none\" value=\"0\">None</option>" + this.responseText;
	            	noGroupsSetup(false);
	            } else {
		            noGroupsSetup(true);
	            }
	        } else {
		        if ( this.responseText ) {
		        	//ajaxResponse.innerHTML = this.responseText;
		        }
	        }
	        
	    };
	    
	    xhr.open("GET", window.location.href + "bookmarks", true);
	    xhr.send();
	
	},	

	getBookmarkNameOptions = function () {
	    
	    var xhr = new XMLHttpRequest();
	    
	    xhr.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
		        if ( this.responseText ) { 
	            	detailNameSelect.innerHTML = this.responseText;
	            	noBookmarksSetup(false);
	            } else {
		            noBookmarksSetup(true);
	            }	            	
	        } else {
		        if ( this.responseText ) { 
		        	//ajaxResponse.innerHTML = this.responseText;
		        }
	        }
	    };
	    
	    xhr.open("GET", "https://bookmarks.milesnature.com/bmk-name-options.php"+userParam, true);
	    xhr.send();
	
	},

	formSubmit = function( event ) {
		
		event.preventDefault();
		
		var xhr = new XMLHttpRequest();
		
	    xhr.onreadystatechange = function() {
		    
	        if (this.readyState == 4 && this.status == 200) {
	         
				if ( !this.responseText ) {
					
	            	getBookmarks();
					getBookmarkGroupOptions();
					getBookmarkNameOptions();					
					detailGroupText.value = "";
					detailNameText.value = "";
					detailUrlText.value = "";	 
				
				} else {
					
					 ajaxResponse.innerHTML = this.responseText;
				
				}         
	            
	        } else {
		        
		        ajaxResponse.innerHTML = this.responseText;
		        
	        }
	        
	    };
	    
	    xhr.open("POST", "https://bookmarks.milesnature.com/form.php", true);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.send( getFormParams() );
	
	},
	toggleModalAbout = function(  ) {
		document.getElementsByClassName('modal')[0].classList.toggle('show');
	},
	toggleModalHelp = function(  ) {
		console.log(document.getElementsByClassName('modal')[1]);
		document.getElementsByClassName('modal')[1].classList.toggle('show');
	};


		
// SETUP AFTER PAGE LOADS	
window.onload = function () {
	
	// LOAD PAGE ELEMENTS USING DB VALUES.
	//getBookmarkGroupOptions();
	//getBookmarkNameOptions();
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

/* DRAG AND DROP SANDBOX
function allowDrop( ev ) {
	ev.preventDefault();
	
	console.log("allowDrop", ev);
}

function drag( ev ) {
	ev.dataTransfer.setData("text", ev.target.id);

	console.log("drag", ev);
}

function drop( ev ) {
	
	ev.preventDefault();
	//var data = ev.dataTransfer.getData("text");
	//ev.target.appendChild(document.getElementById(data));
  
	console.log("drop", ev);
 
}
*/
	
/* TODO: CHECK FOR POPUP BLOCKING AND ALERT USER. LOW PRIORITY.
var popup = window.open( );
	setTimeout( function() {
    	if(!popup || popup.outerHeight === 0) {
        	//First Checking Condition Works For IE & Firefox
			//Second Checking Condition Works For Chrome
			alert("Popup Blocker is enabled! Please add this site to your exception list.");
			window.location.href = 'warning.html';
    	} else {
        	//Popup Blocker Is Disabled
			window.open('','_self');
			window.close();
    	} 
	}, 25);	
*/				
				
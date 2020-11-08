import { scheduleApiCall } from './api.js';

// FORM DOM ELEMENTS AND METHODS. 
let
	formEditContainer,
	formEditErrorMessage,
	formEditBookmark,
	formEditGroup,
	formEditBookmarksSelect,
	formEditGroupText,
	formEditGroupSelect,
	formEditNameText,
	formEditNameSelect,
	formEditUrlText,
	formEditButtonSubmit,
	formEditUpdateBookmarkSelectValue,
	formEditUpdateBookmarkSelectText,
	formEditGroupValue,
	formEditGroupSelectValue,
	formEditGroupSelectText,					
	formEditTitleValue,
	formEditTitleSelectValue,
	formEditTitleSelectText,
	formEditUrlValue,
	formEditActionValue,
	formEditElementValue,
	formEditRemoveClasses,
	formEditAddClasses,
	formEditUpdateButton;

const          
	toggleFormEdit = ( action ) => {

		formEditContainer = document.getElementById('formEdit');

		switch ( action ) {

			case 'remove':

				if ( formEditContainer ) { 
					formEditContainer.remove(); 
					document.body.classList.remove( 'form-open' );
					import( './footer.js' ).then( ( module ) => { module.updateFooterButtons() } );
					localStorage.setItem( 'editState', 'closed' );
				}
				break;

			case 'add':

				if ( !formEditContainer ) {

					const 
						clone  = templateFormEdit.content.cloneNode( true ),
						footer = document.getElementsByTagName( 'footer' )[0];
					footer.parentNode.insertBefore( clone, footer );

  					document.body.classList.add( 'form-open' );

					formEditContainer                 = document.getElementById('formEdit');
					formEditErrorMessage              = document.getElementById('errorMessage');
					formEditBookmark                  = document.getElementById('bookmark');
					formEditGroup                     = document.getElementById('group');
					formEditBookmarksSelect           = document.getElementById('bookmarksSelect');
					formEditGroupText    	          = document.getElementById('groupText');
					formEditGroupSelect   	          = document.getElementById('groupSelect');
					formEditNameText     		      = document.getElementById('nameText');
					formEditNameSelect   	          = document.getElementById('nameSelect');
					formEditUrlText      	          = document.getElementById('urlText');
					formEditButtonSubmit              = document.getElementById('submit');
					formEditUpdateBookmarkSelectValue = () => { return formEditBookmarksSelect.value };
					formEditUpdateBookmarkSelectText  = () => { return ( formEditBookmarksSelect.options.length > 0  ) ? formEditBookmarksSelect.options[formEditBookmarksSelect.selectedIndex].text : '' };
					formEditGroupValue      		  = () => { return formEditGroupText.value };
					formEditGroupSelectValue		  = () => { return formEditGroupSelect.value };
					formEditGroupSelectText 		  = () => { return ( formEditGroupSelect.options.length > 0 ) ? formEditGroupSelect.options[formEditGroupSelect.selectedIndex].text : '' };
					formEditTitleValue      		  = () => { return formEditNameText.value };
					formEditTitleSelectValue 		  = () => { return formEditNameSelect.value };
					formEditTitleSelectText  		  = () => { return ( formEditNameSelect.options.length > 0  ) ? formEditNameSelect.options[formEditNameSelect.selectedIndex].text : '' };
					formEditUrlValue        		  = () => { return formEditUrlText.value };
					formEditActionValue               = () => { return document.querySelector('input[name="action"]:checked').value };
					formEditElementValue              = () => { return document.querySelector('input[name="element"]:checked').value };
					formEditRemoveClasses             = ( ...classes ) => { if ( formEditContainer ) { formEditContainer.classList.remove( ...classes ); } };
					formEditAddClasses                = ( ...classes ) => { if ( formEditContainer ) { formEditContainer.classList.add( ...classes ); } };
					formEditUpdateButton              = ( action )     => { if ( formEditContainer ) { formEditButtonSubmit.value = action; } };

  					if ( formEditContainer ) {

  						let sortedList = JSON.parse( sessionStorage.getItem( 'bookmarksSorted' ) );

	  					constructGroupOptions();
						constructNameOptions( sortedList );

					    localStorage.setItem( 'editState', 'open' );						

						// HIDE/SHOW FORM ELEMENTS WHEN CHANGES OCCUR. THE DISPLAY OF FORM ELEMENTS IS MODIFED BASED ON THE DESIRED OUTCOME. 
						formEditContainer.addEventListener('change', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								name   = target.name;
							switch ( tag ) {
								case 'INPUT':
									switch ( name ) {
										case 'action':
											actionState();
											elementState();
											break;
										case 'element':
											elementState();
											break;
									}
									break;
								case 'SELECT':
									if ( name === 'name_select' ) { updatePrefill() }
									break;
								default:
									break;
							}
						});

						// LISTEN FOR FORM SUBMIT AND CLOSE. 
						formEditContainer.addEventListener('click', ( e ) => {
							const 
								target = e.target,
								tag    = target.tagName,
								name   = target.name,
								remove = 'remove';
							switch ( tag ) {
								case 'INPUT': 
									if ( name === 'submit' ) { editSubmit( e ); }
									break;
								case 'BUTTON':
									toggleFormEdit( remove );
									break;
								case 'svg':
									toggleFormEdit( remove );
									break;
								case 'path':
									toggleFormEdit( remove );
									break;					
								case 'polyline':
									toggleFormEdit( remove );
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

	clearSelectOptions = ( e ) => {
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

	constructGroupOptions = () => { 
		// <option value='News'>News</option>
		let fragment = document.createDocumentFragment(),
		    groups   = JSON.parse( sessionStorage.getItem( 'groups' ) ) || [],
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
		if ( formEditContainer ) {
			if ( formEditGroupSelect.hasChildNodes() ) {
		        clearSelectOptions( formEditGroupSelect );
			}
			formEditGroupSelect.appendChild( fragment );
		}
	},

	constructNameOptions = ( sortedList, target ) => { 
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
		if ( formEditContainer ) {
			if ( formEditNameSelect.hasChildNodes() ) {
		        clearSelectOptions( formEditNameSelect );
			}
			if ( formEditBookmarksSelect.hasChildNodes() ) {
		        clearSelectOptions( formEditBookmarksSelect );
			}
			let fragment2 = fragment.cloneNode( true );
			formEditNameSelect.appendChild( fragment );
			formEditBookmarksSelect.appendChild( fragment2 );
			updatePrefill();
		}
	},

	// THIS PREFILLS BOOKMARK DATA TO FACILITATE UPDATING BOOKMARKS
	updatePrefill = () => {
		const bookmarksData = JSON.parse( sessionStorage.getItem( 'bookmarksData' ) );
		if ( bookmarksData ) {
			let group = '',
				name  = formEditUpdateBookmarkSelectText(),
				url   = '',
				id    = formEditUpdateBookmarkSelectValue(),
				findBookmarkDetails = ( item, index ) => {
					if ( item._id === id ) {
						group = item.group;
						url   = item.url;
					}
				};
			bookmarksData.forEach( findBookmarkDetails );
			if ( formEditGroupText ) { formEditGroupText.value = group };
			if ( formEditNameText )  { formEditNameText.value  = name };
			if ( formEditUrlText )   { formEditUrlText.value   = url };
		}		
	},

	actionState = () => {
		const action = formEditActionValue();
		formEditRemoveClasses( 'create', 'delete', 'update' );
		resetFields();
		clearErrorMessage();
		formEditAddClasses( action );
		formEditUpdateButton( action );
		if ( action === 'update' ) { 
			formEditBookmark.checked = 'checked';
			updatePrefill();
		}
	},
	
	elementState = () => {
		const
			element = formEditElementValue(),
			action  = formEditActionValue();
		formEditRemoveClasses( 'bookmark', 'group' );
		clearErrorMessage();
		formEditAddClasses( element );
		if ( action !== 'update' ) { resetFields(); }	
	},
	
	getStates = () => {
		const 
			action  = formEditActionValue(),
		    element = formEditElementValue();
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

	getValues = () => {  
		const 
			state  = getStates(),
			config = {
				'group' : (() => { 
					if ( ( state.isGroup && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) { 
						return formEditGroupValue();
					} else if ( ( state.isGroup && state.isDelete ) || ( state.isBookmark && state.isCreate ) ) {
						return formEditGroupSelectText();
					} else {
						return '';
					}
				})(),
				'id' : (() => { 
					if ( state.isBookmark && state.isDelete ) {
						return formEditTitleSelectValue();
					} else if ( state.isBookmark && state.isUpdate ) {
						return formEditUpdateBookmarkSelectValue();
					} else {
						return '';
					}
				})(),								   
				'name' : (() => {
					if ( state.isBookmark && state.isDelete ) {
						return formEditTitleSelectText();
					} else if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate )  ) {
						return formEditTitleValue();
					} else {
						return '';
					}
				})(),
				'url' : (() => {
					if ( ( ( state.isBookmark || state.isGroup ) && state.isCreate ) || ( state.isBookmark && state.isUpdate ) ) {
						return formEditUrlValue();
					} else {
						return '';
					}
				})()
			};
		return { 
			'action' : state.action, 'element': state.element, 'state': state, 'config': config 
		};
	},

	resetFields = () => {
		if ( formEditGroupText ) { formEditGroupText.value = '' };
		if ( formEditNameText )  { formEditNameText.value  = '' };
		if ( formEditUrlText )   { formEditUrlText.value   = '' };
	},

	// GENERAL ERROR MESSAGE CONTAINER. FIRST REMOVES OLD MESSAGE THEN APPENDS NEW ONE.
	displayErrorMessage = ( ...message ) => {
		if ( formEditErrorMessage ) {
			if ( formEditErrorMessage.value ) { clearErrorMessage() };
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
					formEditErrorMessage.appendChild( fragment );
				} else {
			        let fragment = document.createDocumentFragment(),
			        	textNode = document.createTextNode( message );
			        fragment.appendChild( textNode );
			        formEditErrorMessage.appendChild( fragment );
				}
				formEditErrorMessage.focus();
			}
		}
	},	

	clearErrorMessage = () => {
		formEditErrorMessage.textContent = '';
	},

	// FORM VALIDATION AND MESSAGING. CALLS API WHEN VALID.
	editSubmit = ( e ) => {
		e.preventDefault();
		clearErrorMessage();
		const 
			values     = getValues(),
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
					scheduleApiCall( 'POST', 'bookmarks', params );
				} else {
					displayErrorMessage( validation.group, validation.name, validation.url );
				}
			}
			if ( state.isDelete && state.isBookmark  ) {
				if ( validation.id === valid ) {
					scheduleApiCall( 'DELETE', 'bookmarks/' + values.config.id, params );
				} else {
					displayErrorMessage( validation.id );
				}
			}
			if ( state.isDelete && state.isGroup ) {
				if ( validation.group === valid ) {
					scheduleApiCall( 'DELETE', 'bookmarks/group/' + values.config.id, params );
				} else {
					displayErrorMessage( validation.group );
				}
			}
			if ( state.isUpdate && state.isBookmark ) {
				if ( validation.name === valid && validation.url === valid && validation.group === valid && validation.id === valid ) {
					params = 'name=' + values.config.name + '&url=' + encodeURIComponent( values.config.url ) + '&group=' + values.config.group;
					scheduleApiCall( 'PUT', 'bookmarks/' + values.config.id, params );
				} else {
					displayErrorMessage( validation.group, validation.name, validation.url, validation.id );
				}
			}
		} else {
			displayErrorMessage( validation.action, validation.element );
		}
	};

export { 
	toggleFormEdit, 
	formEditContainer, 
	formEditErrorMessage,
	formEditGroupSelect, 
	formEditUrlText, 
	formEditBookmarksSelect, 
	formEditGroupText,	
	resetFields, 
	updatePrefill,
	displayErrorMessage, 
	clearErrorMessage, 
	constructGroupOptions, 
	constructNameOptions,
	actionState, 
	elementState
};
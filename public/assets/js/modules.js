import { bookmarks }                  from './modules/bookmarks.js';
import { openGroup }                  from './modules/openGroup.js';
import { settings }                   from './modules/settings.js';
import { edit }                       from './modules/edit.js';
import { allowDrop, dragStart, dragEnter, cleanupDragHover, drop, dropEvents, dragEnterEvents } from './modules/dragDrop.js';
import { trapFocus, toggleModalHelp } from './modules/modal.js';
import { api }                        from './modules/api.js';

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

	// GET BOOKMARK GROUP LISTS
	getLists = () => {
		return Array.prototype.slice.call( document.getElementsByClassName('bookmarks') );
	},	
		
	constructBookmarksSection = ( bookmarksData ) => {
		let fragments  = document.createDocumentFragment(),
			sortedList = bookmarks.sortIntoGroups( bookmarksData );
		if ( bmkSection.hasChildNodes() ) { bookmarks.removeChildNodes( bmkSection ); }
		for ( let item in sortedList ) { 
			if ( !item ) { continue; };
			fragments.appendChild( bookmarks.constructList( item, sortedList[ item ] ) );
		}
		bmkSection.appendChild( fragments );
		openGroup.setupEventHandler( bmkSection );
		if ( edit.container ) {
			edit.constructGroupOptions();
			edit.constructNameOptions( sortedList );
			edit.resetFields();
			edit.clearErrorMessage( edit.errorMessage );
		}
		dropEvents( 'add', getLists() );
		dragEnterEvents( 'add', getLists() );
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
				break;
			default:
				if ( !formEdit ) { 
					if ( formSettings ) { formSettings.remove(); }
					edit.toggleEdit( 'add' );
				}
				const 
					a = ( action )  ? document.querySelector( 'input[value=' + action  + ']' ) : '',
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

	// THIS HANDLES ALL API ACTIONS (VERBS): GET, POST, DELETE, PUT.
	makeApiCall = ( verb, url, params = '' ) => {

		let promise = new Promise ( ( resolve, reject ) => {
			api.verbBookmark( resolve, reject, verb, url, params );
		});

		return promise.then( ( data ) => { 
			if ( verb === 'GET' ) {
				if ( data.length > 0 ) {
		   			sessionStorage.setItem( 'bookmarksData', JSON.stringify( data ) );
					constructBookmarksSection( data );
				} else {	
				    actionFromFooter( 'create', 'group' );
	   				toggleModalHelp( 'helpEmptyDatabase' );
	   				bookmarks.removeChildNodes( bmkSection );
   				}	
			} else {
				makeApiCall( 'GET', 'bookmarks' );
				edit.resetFields();
			}
		} ).catch( ( error ) => { 
			edit.displayErrorMessage( error );
		} )

	};

// SETUP AFTER PAGE LOADS	
window.onload = () => {

	// DISPLAY LOADING ICON WHILE BOOKMARKS ARE RETRIEVED.
	bookmarks.toggleBookmarksLoader( 'add' );
	
	// INITIATE GET BOOKMARKS PROMISE
	makeApiCall( 'GET', 'bookmarks' );

	// RESTORE LAST SELECTED FORM STATE OR PREFERENCE FROM LOCAL STORAGE.
	const 
		editState          = ( localStorage.getItem('editState') )          ? localStorage.getItem('editState') : '',
		settingsState      = ( localStorage.getItem('settingsState') )      ? localStorage.getItem('settingsState') : '',
		settingsAppearance = ( localStorage.getItem('settingsAppearance') ) ? localStorage.getItem('settingsAppearance') : '',
		settingsStyle      = ( localStorage.getItem('settingsStyle') )      ? localStorage.getItem('settingsStyle') : '';
	if ( editState === 'open' ) {
		edit.toggleEdit( 'add' );
	}
	if ( settingsState === 'open' ) {
		settings.toggleSettings( 'add' );
	}
	if ( settingsAppearance !== 'default' ) {
		body.classList.add( settingsAppearance + '-mode' );
	}
	if ( settingsStyle === 'tidy' ) {
		bmkSection.classList.add( 'tidy' );
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
				if ( id === 'help' ) { toggleModalHelp(); }
				break;
			default:
				break;
		}
	});

	// EVENT HANDLER FOR 'openForm' PROMPTED BY DRAG & DROP.
	bmkSection.addEventListener( 'openForm', function ( e ) { 
		const 
			action  = ( e.detail.action )  ? e.detail.action  : '',
			id      = ( e.detail.id )      ? e.detail.id      : '',
			href    = ( e.detail.href )    ? e.detail.href    : '',
			groupId = ( e.detail.groupId ) ? e.detail.groupId : '';
		actionFromFooter( action );
		switch ( action ) {
			case 'update': 
				edit.bookmarksSelect.value = id; 
				edit.updatePrefill();
				edit.groupText.value       = groupId; 				
				break;
			case 'create':
				edit.groupSelect.value = groupId; 
				edit.urlText.value     = href;
				break;
			default:
				break;  
		}
		body.scrollTop                     = 0; // SAFARI
		document.documentElement.scrollTop = 0; // ALL OTHERS

	}, false);

	// EVENT HANDLER FOR 'apiCallRequest' USED BY EDIT FORM.
	body.addEventListener( 'apiCallRequest', function ( e ) { 
		const 
			verb   = ( e.detail.verb )   ? e.detail.verb   : '',
			url    = ( e.detail.url )    ? e.detail.url    : '',
			params = ( e.detail.params ) ? e.detail.params : '';
		makeApiCall( verb, url, params );
	}, false);	

	// EVENT HANDLERS FOR DRAG & DROP.
	const groupList = getLists();
	html.addEventListener( 'dragover',  ( event, groupList ) => { allowDrop( event ) } );
	html.addEventListener( 'dragstart', ( event, groupList ) => { dragStart( event ) } );

	// FOOTER COPYRIGHT DATE 
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();

};
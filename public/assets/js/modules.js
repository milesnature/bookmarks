import { bookmarks }                  from './modules/bookmarks.js';
import { openGroup }                  from './modules/openGroup.js';
import { settings }                   from './modules/settings.js';
import { edit }                       from './modules/edit.js';
import { allowDrop, dragStart, dragEnter, cleanupDragHover, drop, dropEvents, dragEnterEvents } from './modules/dragDrop.js';
// import { actionFromFooter }           from './modules/footer.js';
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

	toggleBookmarksLoader = ( action ) => {
		const hasSvg = bmkSection.querySelector('svg#loader');
		switch ( action ) {
			case 'remove':
				if ( hasSvg ) { bookmarks.removeChildNodes( bmkSection ) }
				break;
			case 'add':
				if ( !hasSvg ) {
  					bmkSection.appendChild( templateLoader.content.cloneNode( true ) );
  				}
				break;
			default:
			break;
		}				
	},

	sortIntoGroups = ( bookmarksData ) => {
		let 
			groupsByName = {},
			groups       = [],
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
			};
		bookmarksData.forEach( sortGroup );
		sessionStorage.setItem( 'bookmarksSorted', JSON.stringify( groupsByName ) );
		sessionStorage.setItem( 'groups',          JSON.stringify( groups ) );
		return groupsByName;
	},			
		
	constructBookmarksSection = ( bookmarksData ) => {
		let fragments  = document.createDocumentFragment(),
			sortedList = sortIntoGroups( bookmarksData );
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
				document.querySelector( 'input[name="appearance"]:checked' ).focus();
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
	};

// SETUP AFTER PAGE LOADS	
window.onload = () => {


	// LOAD PAGE ELEMENTS USING DB VALUES.
	toggleBookmarksLoader( 'add' );
	

	// GET BOOKMARKS PROMISE

	const 
		bookmarks = new Promise( ( resolve, reject ) => {
			api.getBookmarks( resolve, reject );
		}),
		getBookmarks = () => {	
			return bookmarks.then( ( data ) => {
				console.log( 'data', data );
		   		if ( data.length > 0 ) {
		   			sessionStorage.setItem( 'bookmarksData', JSON.stringify( data ) );
					constructBookmarksSection( data );
				} else {
					actionFromFooter( 'create', 'group' );
					toggleModalHelp( 'helpEmptyDatabase' );
					bookmarks.remove();
				}		
			} ).catch( ( error ) => {
				console.log( 'error', error );
				edit.displayErrorMessage( error );
			} );
		};

	getBookmarks();	


	// LOCAL STORAGE - MAINTAIN STATES AFTER RELOAD.
	const 
		editState     = localStorage.getItem('edit'),
		settingsState = localStorage.getItem('settings'),
		appearance    = localStorage.getItem('appearance');
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
				if ( id === 'help' ) { toggleModalHelp(); }
				break;
			default:
				break;
		}
	});

	// EVENT HANDLER FOR 'openForm'.
	bmkSection.addEventListener( 'openForm', function ( e ) { 
		const 
			action  = ( e.detail.action )  ? e.detail.action  : '',
			id      = ( e.detail.id )      ? e.detail.id      : '',
			href    = ( e.detail.href )    ? e.detail.href    : '',
			groupId = ( e.detail.groupId ) ? e.detail.groupId : '';
		console.log( 'openForm', e.detail );
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


	// DRAG AND DROP EVENT HANDLERS
	const groupList = getLists();
	html.addEventListener( 'dragover',  ( event, groupList ) => { allowDrop( event ) } );
	html.addEventListener( 'dragstart', ( event, groupList ) => { dragStart( event ) } );

	// FOOTER COPYRIGHT DATE 
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();



	// Listen for the 'apiCall' event.
	body.addEventListener( 'apiCall', function ( e ) { 

		const 
			verb      = ( e.detail.verb )     ? e.detail.verb     : '',
			domainUrl = ( e.detail.domain )   ? e.detail.domain   : '',
			params    = ( e.detail.params )   ? e.detail.params   : '';
		
		console.log( 'apiCall', e.detail );

		api.verbBookmark( 
			verb, 
			domainUrl + 'bookmarks', 
			params
		);

		edit.resetFields();
		getBookmarks();

	}, false);	

};
import { edit }           from './formEdit.js';
import { formController } from './formControl.js';

const
	bmkSection = document.getElementById('bookmarks'),
	urlCheck   = /((http|ftp|https|file):\/\/)/,

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

	dragEnter = ( event, lists ) => {
		let t = event.target,
	  		g = t.closest('ul.bookmarks');
	  	event.preventDefault();
		cleanupDragHover( lists );
		g.classList.add( 'drag-hover' );
	},

	cleanupDragHover = ( lists ) => {
		let removeBackgroundColor = ( item, index ) => { item.classList.remove( 'drag-hover' ); };
		lists.forEach( removeBackgroundColor );
	},

	drop = ( event, lists ) => {
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
		  		formController( 'create' );
				edit.groupSelect.value = groupId; 
				edit.urlText.value     = href;
				
		  	}	  		
	  	}
	  	if ( local ) {
		  	if ( validUrl( href ) ) { 
		  		formController( 'update' ); 
				edit.bookmarksSelect.value = id; 
				edit.updatePrefill();
				edit.groupText.value       = groupId;
				
		  	}	  		
	  	}
	  	cleanupDragHover( lists );
	  	document.body.scrollTop            = 0; // SAFARI
		document.documentElement.scrollTop = 0; // ALL OTHERS
	},

	dropEvents = ( action, lists ) => {
		let 
			addDrop    = ( item, index ) => { item.addEventListener(    'drop', ( event ) => { drop( event, lists ) } ); },
			removeDrop = ( item, index ) => { item.removeEventListener( 'drop', ( event ) => { drop( event, lists ) } ); };
		switch (action) {
			case 'add':		
				lists.forEach( addDrop );
				break;
			case 'remove':
				lists.forEach( removeDrop );
				break;
			default:
				break;
		}
	},

	dragEnterEvents = ( action, lists ) => {
		let
			addDragEnter    = ( item, index ) => { item.addEventListener(    'dragenter', ( event ) => { dragEnter( event, lists ) } ); },
			removeDragEnter = ( item, index ) => { item.removeEventListener( 'dragenter', ( event ) => { dragEnter( event, lists ) } ); };
		switch (action) {
			case 'add':
				lists.forEach( addDragEnter );
				break;
			case 'remove':
				lists.forEach( removeDragEnter );
				break;
		  	default:
				break;
		}
		
	};	

export { allowDrop, dragStart, dropEvents, dragEnterEvents }
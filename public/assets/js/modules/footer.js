import { formController }  from './formControl.js';
import { toggleModalHelp } from './modal.js';

const setupFooter = (() => {

	// EVENT HANDLER FOOTER BUTTONS AND LINKS.
	document.getElementsByTagName('footer')[0].addEventListener('click', ( e ) => {
		const 
			target = e.target,
			tag    = target.tagName,
			id     = target.id,
			name   = target.className;
		switch ( tag ) {
			case 'BUTTON':
				formController( name );  
				document.body.scrollTop = 0; // SAFARI
				document.documentElement.scrollTop = 0; // ALL OTHERS
				break;
			case 'A':
				if ( id === 'help' ) { toggleModalHelp(); }
				break;
			default:
				break;
		}
	});	

	// FOOTER COPYRIGHT DATE.
	const year = new Date();
	document.getElementById('year').innerText = year.getFullYear();

})();

export { setupFooter };
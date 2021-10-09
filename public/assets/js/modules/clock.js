const 
	startClock = () => {

		if ( document.querySelector('.clock') !== null && document.querySelector('.hand-minutes') !== null && document.querySelector('.hand-hours') !== null && document.querySelector('.hand-seconds') !== null ) {

			let i, d, h, m, s,

			timer = ( ) => { 
				d = new Date();
				h = d.getHours();
				m = d.getMinutes();
				s = d.getSeconds();			
				document.querySelector('.hand-minutes').style.transform = "rotate(" + ( m * 6 ) + "deg)";
				document.querySelector('.hand-hours').style.transform = "rotate(" + ( h * 30 ) + "deg)";
				document.querySelector('.hand-seconds').style.transform = "rotate(" + ( s * 6 ) + "deg)";
			},
			
			start = () => { i = setInterval( timer, 1000 ) },				

			stop  = () => {
				clearInterval( i );
			};

			start();	

		}

	}

export { startClock }
window.addEventListener("load", function () {

	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');


	// Section for functions
	function togglePlay () {	// function to toggle play/pause
		if (music.paused) {
			music.play();
		} else 
			music.pause();

		music.classList.toggle('play');
	}


	console.log(music.attributes)

	// Section for handling events
	playButton.addEventListener('click', togglePlay);

	
});
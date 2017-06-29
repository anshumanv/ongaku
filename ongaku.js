window.addEventListener("load", function () {

	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');
	const timeLine = document.querySelector('#timeline');


	// Section for functions
	function togglePlay () {	// function to toggle play/pause
		music[music.paused ? 'play' : 'pause']();
	}

	function updateButton () {
		if(!music.paused){
			playButton.classList.remove('play');
			playButton.classList.add('pause');
		}
		else {
			playButton.classList.remove('pause');
			playButton.classList.add('play');
		}
	}
	
	function handleProgress () {
		const percent = (music.currentTime / music.duration ) * 100;
		if (percent==100) {
			updateButton();
			percent = 0;
		}
		playHead.style.marginLeft = (percent / 100) * 364  + "px";
	}

	function scrub (e) {
		const scrubTime = (e.offsetX / 362) * music.duration;
		music.currentTime = scrubTime;
	}


	// Section for handling events
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updateButton);

	music.addEventListener('timeupdate', handleProgress);
	
	let mousedown = false;
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));

});
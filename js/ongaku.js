window.addEventListener("load", function () {


	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');
	const timeLine = document.querySelector('#timeline');
	const nextButton = document.querySelector('#next');
	const reButton = document.querySelector('#restart');
	const trackName = document.querySelector('#track-name');

	// Function to toggle play / pause
	function togglePlay () {	// function to toggle play/pause
		music[music.paused ? 'play' : 'pause']();
	}

	// Function to handle play/pause icon
	function updateButton () {
		if (!music.paused) {
			playButton.classList.remove('play');
			playButton.classList.add('pause');
		} else {
			playButton.classList.remove('pause');
			playButton.classList.add('play');
		}
	}
	
	// A  function to handle song duration bar
	function handleProgress () {
		var percent = (music.currentTime / music.duration ) * 100;
		if (percent == 100) {
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			play();
		}
		playHead.style.marginLeft = (percent / 100) * 364  + "px";	// Geez -_-
	}

	// function to enable track seek
	function scrub (e) {
		const scrubTime = (e.offsetX / 362) * music.duration;
		music.currentTime = scrubTime;
	}

	// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle (based on SE answer).
	function shuffle (array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle
		while (0 !== currentIndex) {
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	// function to play next track in the playlist
	function nextTrack() {
		order.push(order.shift());
		play();
	}

	// function to replay the current track
	function playAgain() {
		music.currentTime = 0;
		displayTrackName();
	}

	// A function to handle key press on window
	function handleKeyPress(e) {
		if(e.keyCode === 80) {	// p 
			togglePlay();
			updateButton();
		} else if(e.keyCode === 78) {	// n
			nextTrack();
		} else if(e.keyCode === 82) {	// r
			playAgain();
		} else {return;}
	}

// Function to display track name
	function displayTrackName() {
		trackName.innerHTML = order[0].name;
		$('#track-name').stop(true, true);
		$('#track-name').show();
		$('#track-name').fadeOut(10000);
	}


	// function to play tracks
	let order = shuffle(data);
	function play () {
		music.src = order[0].link;
		music.play();
		updateButton();
		displayTrackName();
		document.body.style.backgroundImage = "url('" + order[0].img + "')";
	}
		
	play();

	// Event handlers
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updateButton);

	music.addEventListener('timeupdate', handleProgress);
	
	let mousedown = false;	// variable to keep track of mousedown event
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));
	timeline.addEventListener('click', (e) => scrub(e));

	nextButton.addEventListener('click', nextTrack);	// handling clicks on next button
	reButton.addEventListener('click', playAgain);	// handling clicks on restart button

	window.addEventListener('keyup', (e) => handleKeyPress(e));	// handle key-press on window
});


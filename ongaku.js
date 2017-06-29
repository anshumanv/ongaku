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
	
	function handleProgress () {	// A  function to handle song duration bar
		var percent = (music.currentTime / music.duration ) * 100;
		if (percent==100) {
			updateButton();
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			music.src = order[0];	// Change the source of the audio element
			music.play();
		}
		playHead.style.marginLeft = (percent / 100) * 364  + "px";
	}

	function scrub (e) {
		const scrubTime = (e.offsetX / 362) * music.duration;
		music.currentTime = scrubTime;
	}


	// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle (based on SE answer).
	function shuffle(array) {
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


	// Entry Point !
	let order = shuffle(openings);
	music.src = order[0];
	music.play();
	

	// Section for handling events
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updateButton);

	music.addEventListener('timeupdate', handleProgress);
	
	let mousedown = false;	// variable to keep track mousedown event
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));

});


//===============================================================================================================================================

openings = ["http://lyricmp3skull.org/s363640c/file/death-note-ls-theme/18366160.mp3",
			"https://r6---sn-gwpa-civs.googlevideo.com/videoplayback?dur=89.652&mv=m&mt=1498729062&ms=au&mn=sn-gwpa-civs&source=youtube&clen=6680565&ratebypass=yes&sparams=clen%2Cdur%2Cei%2Cgcr%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&id=o-AN0O-ErM-KU1UEcXYdGnbv-lTA5FNIiZXmjV3J3hDXNW&initcwndbps=410000&ip=47.247.15.86&ei=zMpUWbz_EZubogPbgLnoAw&pl=22&requiressl=yes&gcr=in&gir=yes&expire=1498750764&signature=C5FEC56BB067D773F22C8A220DDA4BD92E978C58.DF3408473318470BDEBCD0EA264C3FF9EEAB9FA5&lmt=1492910207161683&itag=18&key=yt6&mime=video%2Fmp4&mm=31&ipbits=0",
			"http://lyricmp3skull.org/s363640c/file/boku-no-hero-academia-season-2-ed-1/317870688.mp3",
			"http://w20.youtubeinmp3.com/download/get/?id=Q0v3ajXh5S0&r=N31suCidRZYtTdO0vmb4ZMMTVc2pFJYc&t=Tokyo+Ghoul+Unravel+-+Lyrics",
			"http://w29.youtubeinmp3.com/download/get/?id=ddbtDaXAvbA&r=dzieK0ydsMjT4CRCdgHtBbNVSZFy1ocg&t=MagiThe+Kingdom+of+Magic+Ending+1+Lyrics+%28Vostfr%29"
			]
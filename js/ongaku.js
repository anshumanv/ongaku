window.addEventListener("load", function () {


	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');
	const timeLine = document.querySelector('#timeline');
	const nextButton = document.querySelector('#next');
	const previousButton = document.querySelector('#previous');
	const reButton = document.querySelector('#restart');
	const trackName = document.querySelector('#track-name');
	const bufferedBar = document.querySelector('#buffered-bar');
	const fullscreenButton = document.querySelector('#fullscreen-button');

	// Function to toggle play / pause
	function togglePlay () {	// function to toggle play/pause
		music[music.paused ? 'play' : 'pause']();
	}

	// Function to handle play/pause icon
	function updatePlayButton () {
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
		if (percent >= 100) {
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			play();
		}
		playHead.style.marginLeft = (percent / 100) * (timeLine.offsetWidth - playHead.offsetWidth)  + "px";	// Geez -_-
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

	// function to play next track from the playlist
	function nextTrack() {
		order.push(order.shift());
		play();
	}

	// function to play previous track from the playlist
	function previousTrack() {
		order.unshift(order.pop());
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
			updatePlayButton();
		} else if(e.keyCode === 78) {	// n
			nextTrack();
		} else if(e.keyCode === 82) {	// r
			playAgain();
		} else if(e.keyCode === 70) {	// f
			toggleFullscreen();
		} else {return;}
	}

// Function to display track name
	function displayTrackName() {
		trackName.innerHTML = order[0].name;
		$('#track-name').stop(true, true);
		$('#track-name').show();
		$('#track-name').fadeOut(10000);
	}

	function handleBuffer() {
		if(music.currentTime > 0) {
			bufferedBar.style.flexBasis = Math.round((music.buffered.end(0) / music.duration) * 100) + "%";
		}
	}

	$(document).ready(function(){
		// function to toggle popover
    	$("[data-toggle=popover]").popover({
			html: true,
			title: function() {
				return $('#popover-title').html();
			},
			content: function() {
				return $('#popover-body').html();
			}
		});

    	// A function to retain popover checkbox instances
    	$("[data-toggle=popover]").on("shown.bs.popover",function(){
        $(".popover-content input").on("change",function(){
            if(this.checked){
                this.setAttribute("checked","checked");
            }else{
                this.removeAttribute("checked");
            }
            $("#popover-body").html($(".popover-content").html());
        });
    });

	});

	// Function to handle checkbox clicks and changes
	$('body').on('click', '.cb-value', function() {
		var mainParent = $(this).parent('.toggle-btn');
		if($(mainParent).find('input.cb-value').is(':checked')) {
			$(mainParent).addClass('active');
		} else {
			$(mainParent).removeClass('active');
		}
	});	

	// Function to handle preference checkboxes
	$('body').on('change', '.cb-value', function() {
		order = [];
		if($('.cb-op')[1].checked){
			order.push(...openings);
		}
		if($('.cb-ed')[1].checked){
			order.push(...endings);
		}
		if($('.cb-ost')[1].checked) {
			order.push(...osts);
		}
	});	

	// Functions to handle fullscreen
	function isFullscreen() {
		return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
	}
	
	function toggleFullscreen() {
		if (isFullscreen()) {
			if (document.exitFullscreen) document.exitFullscreen();
			else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
			fullscreenButton.querySelector('img').src = ('img/go-fullscreen.png');
		} else {
			const e = document.getElementsByTagName("html")[0];
			if (e.requestFullscreen) e.requestFullscreen();
			else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
			else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
			else if (e.msRequestFullscreen) e.msRequestFullscreen();
			fullscreenButton.querySelector('img').src = ('img/cancel-fullscreen.png');
		}
	}

	// function to play tracks
	var order = shuffle(osts.concat(openings).concat(endings));
	function play () {
		music.src = order[0].link;
		music.play();
		updatePlayButton();
		displayTrackName();
		document.body.style.backgroundImage = "url('" + order[0].img + "')";
	}

	play();

	// Event handlers
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updatePlayButton);

	music.addEventListener('timeupdate', handleProgress);
	window.setInterval(handleBuffer, 100);

	let mousedown = false;	// variable to keep track of mousedown event
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mouseout', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));
	timeline.addEventListener('click', (e) => scrub(e));

	nextButton.addEventListener('click', nextTrack);	// handling clicks on next button
	previousButton.addEventListener('click', previousTrack);	// handling clicks on next button
	reButton.addEventListener('click', playAgain);	// handling clicks on restart button

	fullscreenButton.addEventListener('click', toggleFullscreen);

	window.addEventListener('keyup', (e) => handleKeyPress(e));	// handle key-press on window
});


window.addEventListener("load", function () {


	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');
	const playTime = document.querySelector('#playTime');
	const timeLine = document.querySelector('#timeline');
	const nextButton = document.querySelector('#next');
	const previousButton = document.querySelector('#previous');
	const reButton = document.querySelector('#restart');
	const trackName = document.querySelector('#track-name');
	const bufferedBar = document.querySelector('#buffered-bar');
	const fullscreenButton = document.querySelector('#fullscreen-button');
	const infoButton = document.querySelector('.infoImg');
	const infoBlock = document.querySelector('.top-left');
	const sideBarCollapseButton = document.querySelector('.btn.btn-default.closebtn');
	const sideBarExapndButton = document.querySelector('#expandbtn');
	const searchBarInput = document.querySelector('#searchBar');
	const searchEraseButton = document.querySelector('.btn.btn-default.erasebtn');
	var currentSongNumber = 0;

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
		playHead.style.marginLeft = (percent / 100) * (timeLine.offsetWidth - playHead.offsetWidth)  + "px";
		let currentTimeMin = ("0" + parseInt(music.currentTime / 60)).slice(-2);
		let currentTimeSec = ("0" + parseInt(music.currentTime - (currentTimeMin * 60))).slice(-2);
		let durationMin = ("0" + parseInt(music.duration / 60)).slice(-2);
		let durationSec = ("0" + parseInt(music.duration - (durationMin * 60))).slice(-2);
		playTime.innerHTML = currentTimeMin + ":" + currentTimeSec + " : " + durationMin + ":" + durationSec;
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
		if (currentSongNumber == order.length -1) {
			currentSongNumber = 0;
		}
		else {
			currentSongNumber = currentSongNumber + 1;
		}
		highlightSelectedSong();
		play();
	}

	// function to play previous track from the playlist
	function previousTrack() {
		if (currentSongNumber == 0) {
			currentSongNumber = order.length - 1;
		}
		else {
			currentSongNumber = currentSongNumber -1;
		}
		highlightSelectedSong();
		play();
	}

	// function to replay the current track
	function playAgain() {
		music.currentTime = 0;
		displayTrackName();
	}

	// toggle show by Information button
	function handlingInfoHover() {
		if (infoBlock.style.display === 'none') {
			infoButton.style.visibility = 'hidden';
			infoBlock.style.display = 'block';
		}
		else {
		infoButton.style.visibility = 'visible';
		infoBlock.style.display = 'none';
		}
	}

	// A function to handle key press on window
	function handleKeyUp(e) {
		if(e.keyCode === 32) {	// p 
			togglePlay();
			updatePlayButton();
		} 
		else if(e.keyCode === 78) {	// n
			nextTrack();
		} 
		else if(e.keyCode === 82) {	// r
			playAgain();
		} 
		else if(e.keyCode === 70) {	// f
			toggleFullscreen();
		} 
		else if(e.keyCode === 76) {	// l
			previousTrack();
		} 
		else {
			return;
		}
	}

	function handleKeyDown(e) {
			switch (e.keyCode) {
				case 37: 	// Left Arrow
				timeRewind();
				break;
			case 38: 	// Up Arrow
				volumeUp();
				break;
			case 39: 	// Right Arrow
				timeForward();
				break;
			case 40: 	// Down Arrow
				volumeDown();
				break;
			}
		}

// Function to display track name
	function displayTrackName() {
		trackName.textContent = order[0].name;
		displayAnimation();
	}

	function timeForward() {
		music.currentTime = Math.min(music.duration, music.currentTime + 10);
		displayTimeUpdate(true);
		displayAnimation();
	}

	function timeRewind() {
		music.currentTime = Math.max(0, music.currentTime - 10);
		displayTimeUpdate(false);
		displayAnimation();
	}

	function displayTimeUpdate (status) {
		trackName.innerHTML = `${status ? "<i class='glyphicon glyphicon-forward'></i>" : "<i class='glyphicon glyphicon-backward' style='padding-right: 5px'></i>"} ${Math.floor(music.currentTime / 60) < 10 ? '0' : ''}${Math.floor(music.currentTime / 60)}:${Math.floor(music.currentTime % 60) < 10 ? '0' : ''}${Math.floor(music.currentTime % 60)}`;
	}

	function volumeUp() {
		music.volume = Math.min(1, Math.round((music.volume + 0.1) * 10) / 10);
		trackName.innerHTML = "<i class='glyphicon glyphicon-volume-up'></i>" + "  : " + parseInt(music.volume * 100);
		displayAnimation();
	}

	function volumeDown() {
		music.volume = Math.max(0, Math.round((music.volume - 0.1) * 10) / 10);
		trackName.innerHTML = "<i class='glyphicon glyphicon-volume-down'></i>" + " : " + parseInt(music.volume * 100);
		displayAnimation();
	}

	function displayAnimation() {
		$('#track-name').stop(true, true);	// stop any ongoing animation
		$('#track-name').show();	// display the block
		$('#track-name').fadeOut(10000);	// fade out the block
	}


	// function to handle buffer bar
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
		order = shuffle(order);
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

	function collapsingSideBar() {
		$('#sidebar').css({'width': '0'});
		$('#sidebar').hide();
	}

	function exapndginSideBar() {
		$('#sidebar').css({'width': '25%'});
		$('#sidebar').show();
	}

	function clearSearchText() {
		$('#searchBar').val('');
		searchAndFilterSongs();
	}

	// function to play tracks
	var order = shuffle(osts.concat(openings).concat(endings));
	function play () {
		music.src = order[currentSongNumber].link;
		music.play();
		updatePlayButton();
		displayTrackName();
		document.body.style.backgroundImage = "url('" + order[currentSongNumber].img + "')";
	}

	function loadSongListToSideBar () {
		function channelListElement(songNumber, href, imgSrc, name) {
			return '<div class="channelElementWrapper" id="channelElementWrapper_' + songNumber + '">'
				+'<div class="channelElement" data-songnumber="' + songNumber + '">' 
				+ '<a href="javascript:void(0)" title="' + name + '" data-href="' + href + '">' 
				+ '<img src="' + imgSrc + '" /><span>' 
				+ name + '</span></a></div><hr class="style-two" /><div>';
		} 
		order.forEach(function(element, index) { 
			$('#sidebar #channels').append(channelListElement(index, element.link, element.img, element.name));
		});
		// setting first song as selected
		if ($('.channelElementWrapper').length > 0) {
			$($('.channelElementWrapper')[0]).addClass('selected');
		}
	}

	function searchAndFilterSongs() {
		const channelElementArr = $('#sidebar #channels .channelElementWrapper');
		const searchString = $('#searchBar').val().toUpperCase();

		for (i = 0; i < channelElementArr.length; i++) {
			const elementContent = $($(channelElementArr[i]).find('span')[0]).html();
			if (elementContent.toUpperCase().indexOf(searchString) > -1) {
				$(channelElementArr[i]).show();
			}
			else {
				$(channelElementArr[i]).hide();
			}
		}
	}

	function highlightSelectedSong() {
		const prevSongNumber = $('#channels').attr('data-playingsongnumber');
		$('#channelElementWrapper_' + prevSongNumber).removeClass('selected');
		$('#channels').attr('data-playingsongnumber', currentSongNumber);
		$('#channelElementWrapper_' + currentSongNumber).addClass('selected');
		clearSearchText();
		$('#channels').scrollTop(currentSongNumber * $($('.channelElementWrapper')[0]).height());
	}

	function playSelectedSong(songNumber) {
		currentSongNumber = songNumber;
		highlightSelectedSong();
		play();
		collapsingSideBar();
	}

	play();
	loadSongListToSideBar();

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

	infoButton.addEventListener('mouseenter', handlingInfoHover);
	infoBlock.addEventListener('mouseleave', handlingInfoHover);
	sideBarCollapseButton.addEventListener('click', collapsingSideBar);
	sideBarExapndButton.addEventListener('click', exapndginSideBar);
	searchBarInput.addEventListener('keyup', searchAndFilterSongs);
	searchEraseButton.addEventListener('click', clearSearchText);

	$('.channelElement').each(function() {
		var $this = $(this);
		$this.on("click", function() {
			playSelectedSong($this.data('songnumber'))
		});
	});

	window.addEventListener('keyup', (e) => handleKeyUp(e));	// handle keyup press on window
	window.addEventListener('keydown', (e) => handleKeyDown(e)); //  handle keydown event on window
});

	// Grabbing elements from the page
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playedBar = document.querySelector('#playedBar');
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
	const FavouriteButton = document.querySelector('#starImg');
	const infoBlock = document.querySelector('.top-left');
	const openTrackListButton = document.querySelector('.track-list-img');
	const closeTrackListButton = document.querySelector('.close-track-list');
	const modalWrapper = document.querySelector('#modal-wrapper');
	var mouseIdle, mousePos = {x:0, y:0};

	const songSearchInput = document.querySelector('#song_search');

	//event namespace
	const event_keyup_search_songs = "keyup.song_search";


	// Function to toggle play / pause
	function togglePlay () {	// function to toggle play/pause
		if (!isMusicLoading()) {
			music[music.paused ? 'play' : 'pause']();
		}
	}

	// A  function to handle song duration bar
	function handleProgress () {
		var percent = (music.currentTime / music.duration ) * 100;
		if (percent >= 100) {
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			play(order);
		}
		playHead.style.marginLeft = (percent / 100) * (timeLine.offsetWidth - playHead.offsetWidth)  + "px";
		playedBar.style.width = (percent / 100) * (timeLine.offsetWidth - playHead.offsetWidth)  + "px";
		let currentTimeMin = ("0" + parseInt(music.currentTime / 60)).slice(-2);
		let currentTimeSec = ("0" + parseInt(music.currentTime - (currentTimeMin * 60))).slice(-2);
		let durationMin = ("0" + parseInt(music.duration / 60)).slice(-2);
		let durationSec = ("0" + parseInt(music.duration - (durationMin * 60))).slice(-2);
		playTime.innerHTML = currentTimeMin + ":" + currentTimeSec + " : " + durationMin + ":" + durationSec;
	}

	// function to enable track seek
	function scrub (e) {
		const scrubTime = (e.offsetX / window.innerWidth) * music.duration;
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
		init_track_list(order);
		play(order);
	}

	// function to play previous track from the playlist
	function previousTrack() {
		order.unshift(order.pop());
		init_track_list(order);
		play(order);
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

	//A function to open the track list
	function openTrackList() {
		$('#modal-wrapper').show(5, 'linear', function(){
			$('.track-list').addClass('open-track-list');
			$('#next, #previous, .track-list-img').hide('fast');
		});
	}

	//A function to close the track list
	function closeTrackList() {
		$('.track-list').removeClass('open-track-list');
		setTimeout(function() {$('#modal-wrapper').hide(5, 'linear')}, 400);
		$('#next, #previous, .track-list-img').show('fast');
	}

	// A function to handle key press on window
	function handleKeyUp(e) {
		if(e.keyCode === 32) {	// p
			togglePlay();
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
		// stop any ongoing animation
		// display the block
		// fade out the block
		$('#track-name').stop(true, true).show().fadeOut(10000);
	}


	// function to handle buffer bar
	function handleBuffer() {
		if(music.currentTime > 0) {
			bufferedBar.style.flexBasis = Math.round((music.buffered.end(0) / music.duration) * 100) + "%";
		}
	}

	var order = shuffle(osts.concat(openings).concat(endings));
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
				$('#modal-wrapper').show();
        $(".popover-content input").on("change",function(){
            if(this.checked){
                this.setAttribute("checked","checked");
            }else{
                this.removeAttribute("checked");
            }
            $("#popover-body").html($(".popover-content").html());
        });
		});

		$('[data-toggle="tooltip"]').tooltip();
		init_track_list(order);
		play(order);
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

	// Filters list to only display favourites if checked
	function filteredByFavourites(songList, isChecked) {
		if ( isChecked ) {
			return songList.filter( function(song) {
				return localStorage.getItem(song.name);
			});
		}
		return songList;
	}

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
		
		order = shuffle(filteredByFavourites(order, $('.cb-fav')[1].checked));
		init_track_list(order);
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
		} else {
			const e = document.getElementsByTagName("html")[0];
			if (e.requestFullscreen) e.requestFullscreen();
			else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
			else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
			else if (e.msRequestFullscreen) e.msRequestFullscreen();
		}
	}

	// Function to check if song is a favourite
	function isFavourite() { 
		return localStorage.getItem([order[0].name]);
	}

	// Function to handle Favourites in local storage
	function toggleFavourites() {
		if( isFavourite() ) {
			localStorage.removeItem(order[0].name);
			displayStar();
		} else {
			localStorage.setItem(order[0].name, true);
			displayStar();
		}
	}

	// Determines which star icon to display
	function displayStar() {		
		if( isFavourite() ) {
			FavouriteButton.classList.remove("fa-star-o");			
			FavouriteButton.classList.add("fa-star");
		} else {
			FavouriteButton.classList.remove("fa-star");			
			FavouriteButton.classList.add("fa-star-o");
		}
	}


	// function to play tracks
	function play (order) {
		music.src = order[0].link;
		music.play();
		displayTrackName();
		displayStar();
		document.body.style.backgroundImage = "url('" + order[0].img + "')";
	}

	function init_track_list(order) {
		let track_list = '';
		for(let i = 0; i < order.length; i++) {
			track_list += '<li>'+order[i].name+'</li>';
		}

		document.querySelector('#track-list ul').innerHTML = track_list;
		$('#track-list ul li').on('click', select_track);
	}

	function select_track(e) {
		// clear search input incase during search and select
		$(songSearchInput).val("");

		//finding the selected title
		let selected_index;
		let selected_title = e.target.innerHTML;
		let found_title = $.grep(order, function(track, index) {
			if(track.name === selected_title) {
				selected_index = index;
				return track;
			}
		});

		//moving tracks above selected track to the bottom of the track list
		let removed_tracks = order.slice(0, selected_index);
		order.splice(0, removed_tracks.length);
		order = order.concat(removed_tracks);

		//updating the track list with new track order
		init_track_list(order);

		//updating the player to play the selected track
		music.src = found_title[0].link;
		music.play();

		//displays status of Favourite
		displayStar();

		//displaying the title of the song playing
		trackName.textContent = found_title[0].name;
		displayAnimation();

		//updating the background image to the new tracks image
		document.body.style.backgroundImage = "url('" + found_title[0].img + "')";
	}

	function detectMouseMove(event) {

		// If the mouse move
		if(event.clientX != mousePos.x || event.clientY != mousePos.y) {
			clearTimeout(mouseIdle);

			$('.top-bar, #pButton, .bottom-bar').fadeIn();

			mouseIdle = setTimeout(function () {
				$('.top-bar, #pButton, .bottom-bar').fadeOut();
			}, 3000);

			mousePos = { x:event.clientX, y:event.clientY };
		}
	}

	function searchSongs(event) {
		event.stopPropagation();
		var search = $(songSearchInput).val() || "";
		search = search.toLowerCase();
		if(search) {
			$('#track-list ul li')
				.show()
				.each(function(index, song) {
					var songTitle = $(song).text() || "";
					songTitle = songTitle.toLowerCase();
					if(songTitle.indexOf(search) === -1) {
						$(song).hide();
					}
				});
		} else {
			$('#track-list ul li').show();
		}
	}

	function isMusicLoading () {
		return music.readyState !== music.HAVE_FUTURE_DATA
			&& music.readyState !== music.HAVE_ENOUGH_DATA;
	}

	// Handles showing play/pause/loading based on current state of music
	function updateMusicStateButtons() {
		if (isMusicLoading()) {
			$('#loader').show();
			$('#play, #pause').hide();
			return;
		}

		$('#loader').hide();
		if (!music.paused) {
			$('#play').hide();
			$('#pause').show();
		} else {
			$('#play').show();
			$('#pause').hide();
		}
	}

	// Event handlers
	playButton.addEventListener('click', togglePlay);

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

	FavouriteButton.addEventListener('click', toggleFavourites);

	infoButton.addEventListener('mouseenter', handlingInfoHover);
	infoBlock.addEventListener('mouseleave', handlingInfoHover);

	openTrackListButton.addEventListener('click', openTrackList);
	closeTrackListButton.addEventListener('click', closeTrackList);
	//A function to handle click on window
	modalWrapper.addEventListener('click', function(e) {
		if (e.target.tagName !== 'LI' && e.target.tagName !== 'INPUT') {
			closeTrackList();
			if($('.popover').length > 0) {
				$('[data-toggle="popover"]').popover('hide');
				$('#modal-wrapper').hide();
			}
		}
	});

	$(songSearchInput).on(event_keyup_search_songs, searchSongs);
	$('[data-toggle=popover]').on('click', function() { $(this).popover('toggle'); })

	window.addEventListener('keyup', (e) => handleKeyUp(e));	// attach keyup event on window
	window.addEventListener('keydown', (e) => handleKeyDown(e)); //  attach keydown event on window
  window.addEventListener("mousemove", detectMouseMove); // handle fadeout

	const musicStateEvents = [
		'play',
		'pause',
		'playing',
		'seeking',
		'seeked',
	];
	musicStateEvents.forEach(event => {
		music.addEventListener(event, updateMusicStateButtons);
	});

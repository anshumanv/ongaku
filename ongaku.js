window.addEventListener("load", function () {

	// Grabbing elements from the page =====================================================================
	const music = document.querySelector('#music');
	const player = document.querySelector('#player');
	const playButton = document.querySelector('#pButton');
	const playHead = document.querySelector('#playhead');
	const timeLine = document.querySelector('#timeline');


	// Section for functions =============================================================
	function togglePlay () {	// function to toggle play/pause
		music[music.paused ? 'play' : 'pause']();
	}

	function updateButton () {	// Function to handle play/pause icon
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
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			music.src = order[0].link;	// Change the source of the audio element
			music.play();
			updateButton();
		}
		playHead.style.marginLeft = (percent / 100) * 364  + "px";	// Geez -_-
	}

	function scrub (e) {	// function to enable track seek
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


	// Entry Point ! ===========================================================
	let order = shuffle(data);
	music.src = order[0].link;
	music.play();
	updateButton();
	

	// Section for handling events ===========================================================
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updateButton);

	music.addEventListener('timeupdate', handleProgress);
	
	let mousedown = false;	// variable to keep track mousedown event
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));
	timeline.addEventListener('click', (e) => scrub(e));
});


//===============================================================================================================================================

data = [
			{
				link : "http://lyricmp3skull.org/s363640c/file/death-note-ls-theme/18366160.mp3",
				name : "L's Theme",
				img : "http://www.imgbase.info/images/safe-wallpapers/anime/death_note/3579-anime_death_note_wallpaper.jpg"
			},

			{
				link : "https://r6---sn-gwpa-civs.googlevideo.com/videoplayback?gir=yes&ip=47.247.15.86&mn=sn-gwpa-civs&mm=31&source=youtube&pl=22&mv=m&mt=1498754946&ms=au&ei=3C9VWfHGL8b6ogO2k6m4Bg&id=o-AFwU9Al-SEWLIbgJCuW7oXQmO3I08EvCzlzkYmejIg0H&initcwndbps=325000&key=yt6&sparams=clen%2Cdur%2Cei%2Cgcr%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&lmt=1492364913034196&expire=1498776637&clen=2592338&ipbits=0&signature=93E03F8832C552284985BA8BE7EACD0AB58B6BF6.19F8031330816DC0D39F6F93B78BCC4DFD491652&mime=video%2F3gpp&gcr=in&dur=89.721&requiressl=yes&itag=36",
				name : "Boku no Hero Academia S2 OP-1",
				img : "http://greywolf-graphics.com/images/boku-no-hero-academia-wallpaper/boku-no-hero-academia-wallpaper-6.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/boku-no-hero-academia-season-2-ed-1/317870688.mp3",
				name : "Boku no Hero Academia S2 ED-1",
				img : "https://i.ytimg.com/vi/ldTgrPe6Y4E/maxresdefault.jpg"
			},

			{
				link : "http://w20.youtubeinmp3.com/download/get/?id=Q0v3ajXh5S0&r=N31suCidRZYtTdO0vmb4ZMMTVc2pFJYc&t=Tokyo+Ghoul+Unravel+-+Lyrics",
				name : "Tokyo Ghoul - Unravel",
				img : "https://wallpaperscraft.com/image/tokyo_ghoul_kaneki_ken_man_reflection_100594_1920x1080.jpg"
			},

			{
				link : "http://w29.youtubeinmp3.com/download/get/?id=ddbtDaXAvbA&r=dzieK0ydsMjT4CRCdgHtBbNVSZFy1ocg&t=MagiThe+Kingdom+of+Magic+Ending+1+Lyrics+%28Vostfr%29",
				name : "Magi S2 ED-1",
				img : "https://vignette4.wikia.nocookie.net/magi/images/d/d0/AlaAliMor_S2_ending.png/revision/latest?cb=20140330134404"
			}
]
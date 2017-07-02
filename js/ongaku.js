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
		if (!music.paused) {
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
		if (percent == 100) {
			percent = 0;
			order.push(order.shift());	// Take the completed one and place it at the end of playlist
			play();
		}
		playHead.style.marginLeft = (percent / 100) * 364  + "px";	// Geez -_-
	}

	function scrub (e) {	// function to enable track seek
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


	// Entry Point ! ===========================================================
	let order = shuffle(data);
	function play () {
		music.src = order[0].link;
		music.play();
		updateButton();
		document.body.style.backgroundImage = "url('" + order[0].img + "')";
	}
		
	play();

	// Section for handling events ===========================================================
	playButton.addEventListener('click', togglePlay);
	playButton.addEventListener('click', updateButton);

	music.addEventListener('timeupdate', handleProgress);
	
	let mousedown = false;	// variable to keep track of mousedown event
	timeline.addEventListener('mousedown', ()  => mousedown = true);
	timeline.addEventListener('mouseup', () => mousedown =  false);
	timeline.addEventListener('mousemove', (e) => mousedown && scrub(e));
	timeline.addEventListener('click', (e) => scrub(e));
});


//===============================================================================================================================================

data = [
			/* Skeleton
			{
				link : 
				name : 
				img : 
			}
			*/

			// Store Opening here for now
			{
				link : "http://ostanimemp3.wapka.mobi/music/down/54599472/4162987/YmU1YTJ3OC9QOW9FWXlMKzRqaXBDS3J1K285Y3oySmgxTTd3aTdPK0FicmxPT1g3cGc=/Kenshi+Yonezu-Peace+Sign.mp3",
				name : "Boku no Hero Academia S2 OP-1",
				img : "http://greywolf-graphics.com/images/boku-no-hero-academia-wallpaper/boku-no-hero-academia-wallpaper-6.jpg"
			},

			{
				link : "http://w20.youtubeinmp3.com/download/get/?id=Q0v3ajXh5S0&r=N31suCidRZYtTdO0vmb4ZMMTVc2pFJYc&t=Tokyo+Ghoul+Unravel+-+Lyrics",
				name : "Tokyo Ghoul - Unravel",
				img : "https://wallpaperscraft.com/image/tokyo_ghoul_kaneki_ken_man_reflection_100594_1920x1080.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/boku-dake-ga-inai-machi-erased-op-rip/256820788.mp3",
				name : "Boku dake ha Inai Machi OP",
				img : "https://s-media-cache-ak0.pinimg.com/originals/94/2d/cd/942dcd797700a370636b5a90115a4026.jpg"
			},

			{
				link : "http://w33.youtubeinmp3.com/download/get/?id=5N3BViqaqZo&r=q5pSUDUqeC1tH2IDq6K0VnHiGYRs0uas&t=Boku+no+Hero+Academia+Season+2+opening+1+Full%E3%80%8EKenshi+Yonezu-+Peace+Sign%E3%80%8F&progressType=button",
				name : "Boku no Hero Academia S1 OP-1",
				img : "http://www.ricedigital.co.uk/wp-content/uploads/2017/03/003-1.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/op-3/294904496.mp3",
				name : "Bongou Stray Dogs 2 OP-1",
				img : "https://pbs.twimg.com/media/C-FAE86UQAAdckd.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/danganronpa-anime-op-tv-size/249496430.mp3",
				name : "Danganronpa The Animation OP",
				img : "http://data.freehdw.com/danganronpa-2-goodbye-despair-ps-vita-characters.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/masayume-chasing-fairytail-season-2-op-1/148886932.mp3",
				name : "Fairy Tail OP-15",
				img : "https://s-media-cache-ak0.pinimg.com/originals/a5/25/67/a52567b58c01b41ef84f6ce6715a80a1.jpg"
			},


			// Store endings here for now
			{
				link : "http://lyricmp3skull.org/s363640c/file/boku-no-hero-academia-season-2-ed-1/317870688.mp3",
				name : "Boku no Hero Academia S2 ED-1",
				img : "https://i.ytimg.com/vi/ldTgrPe6Y4E/maxresdefault.jpg"
			},

			{
				link : "https://www.youtubeinmp3.com/fetch/?video=https://www.youtube.com/watch?v=n-or12ftZB8",
				name : "Magi S2 ED-1",
				img : "https://vignette4.wikia.nocookie.net/magi/images/d/d0/AlaAliMor_S2_ending.png/revision/latest?cb=20140330134404"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/rin-sore-wa-chiisana-hikari-no-youna-boku-dake-ga-inai-machi-erased-ending-tv-sized/285358460.mp3",
				name : "Boku dake ga Inai Machi ED",
				img : "https://s-media-cache-ak0.pinimg.com/originals/8b/9a/b0/8b9ab099322ef6e31bf291ceaa17a0a9--manga-art-kenya.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/boku-no-hero-academia-ed-ending-heroes/257300066.mp3",
				name : "Boku no Hero Academia S1 ED",
				img : "http://lostinanime.com/wp-content/uploads/2017/04/Boku-no-Hero-Academia-2-01-34-1280x720.jpg"
			},

			//  Store OSTs here for now
			{
				link : "http://lyricmp3skull.org/s363640c/file/death-note-ls-theme/18366160.mp3",
				name : "L's Theme",
				img : "http://www.imgbase.info/images/safe-wallpapers/anime/death_note/3579-anime_death_note_wallpaper.jpg"
			},

			{
				link : "http://lyricmp3skull.org/s363640c/file/death-note-light-theme/59560598.mp3",
				name : "Death Note Light's Theme",
				img : "https://www.walldevil.com/wallpapers/a91/death-note-yagami.jpg"
			},

			{
				link : "http://youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=gAPGBBo6p_o",
				name : "Death Note Main Theme",
				img : "http://wallpoper.com/images/00/31/67/12/death-note_00316712.jpg"
			}

]
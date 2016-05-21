$.getJSON('js/musicData.json', function(data) {
	var musicData = data.result.tracks;
	var newMusicData = {};
	//console.log(musicData);

	for(var i=0; i<musicData.length; i++) {
		newMusicData[i] = {};
		newMusicData[i].song_src = musicData[i].mp3Url;
		newMusicData[i].song_name = musicData[i].name;
		newMusicData[i].artist_name = musicData[i].artists[0].name;
	}
	console.log(newMusicData)
})
var request = require('request'),
	config = require("./config"),
	Q = require("q"),
	db = require('./db'),
	caches = require('./caches'),
	Song = db.Song,
	Search = db.Search,
	Music = db.Music,
	Singer = db.Singer,
	searchCaches = caches.searchCaches,
	singerCaches = caches.singerCaches,
	songCaches = caches.songCaches,
	rankingCaches = caches.rankingCaches,
	lrcCaches = caches.lrcCaches,
	rankingListCaches = caches.rankingListCaches;

function fetchSong(hash) {
	var deferred = Q.defer();
	request(config("music", {hash: hash}), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(CreateMusicMsg(msg, data));
			var song = new Song(data);
			song.save(function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
	return deferred.promise;
}

function querySong(hash) {
	var deferred = Q.defer();
	Song.findOne({hash: hash}, function (err, result) {
		if (result) {
			deferred.resolve(result);
		} else {
			deferred.reject('song is not in db');
		}
	});
	return deferred.promise;
}

function saveTunes(list) {
	list.forEach(function (music) {
		Music.findOneAndUpdate({hash: music.hash}, music, {upsert: true}, function (err, result) {
			if (err) {
				console.log(err);
			}
		});
	});
}
function saveSingers(list) {
	list.forEach(function (singer) {
		Singer.findOneAndUpdate({singer: singer.singer}, singer, {upsert: true}, function (err, result) {
			if (err) {
				console.log(err);
			}
		});
	});
}


exports.updateSearch = function (keyword) {
	Search.findOneAndUpdate({keyword: keyword}, {$inc: {times: 1}}, function (err, result) {
		if (!result) {
			var search = new Search({
				keyword: keyword,
				times: 1
			});
			search.save(function (err, result) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
};

exports.getSong = function (hash) {
	var deferred = Q.defer();
	querySong(hash).done(function (result) {
		deferred.resolve(result);
	}).fail(function (err) {
		fetchSong(hash).done(function (result) {
			deferred.resolve(result);
		});
	});
	return deferred.promise;
};

exports.fetchSearch = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		searchData;
	searchCaches[key] = searchCaches[key] || {};
	searchData = searchCaches[key];
	request(config("search", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			saveTunes(data.data);
			searchData.response = data;
			searchData.date = Date.now();
		}
	});
	return deferred.promise;
};

exports.fetchTunes = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		songData;
	songCaches[key] = songCaches[key] || {};
	songData = songCaches[key];
	request(config("songs", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			saveTunes(data.data);
			songData.response = data;
			songData.date = Date.now();
		}
	});
	return deferred.promise;
};
exports.fetchRanking = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		rankingData;
	rankingCaches[key] = rankingCaches[key] || {};
	rankingData = rankingCaches[key];
	request(config("ranking", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			saveTunes(data.data);
			rankingData.response = data;
			rankingData.date = new Date().getTime();
		}
	});
};
exports.fetchSingers = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		singerData;
	singerCaches[key] = singerCaches[key] || {};
	singerData = singerCaches[key];
	request(config("singers", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			saveSingers(data.data);
			singerData.response = data;
			singerData.date = Date.now();
		}
	});
	return deferred.promise;
};

exports.fetchLrc = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		lrcData;
	lrcCaches[key] = lrcCaches[key] || {};
	lrcData = lrcCaches[key];
	request(config("lrc", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = body.trim();
			deferred.resolve(data);
			lrcData.response = data;
			lrcData.date = Date.now();
		}
	});
	return deferred.promise;
};
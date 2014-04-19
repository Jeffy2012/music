var request = require('request'),
	config = require("./cdnConfig"),
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
	listCaches = caches.listCaches,
	iconCaches = caches.iconCaches;

function fetchSong(hash) {
	var deferred = Q.defer();
	request(config("song", {hash: hash}), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
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
		['singerid', 'songcount', 'albumcount', 'mvcount'].forEach(function (key) {
			singer[key] = parseInt(singer[key], 10) || 0;
		});
		Singer.findOneAndUpdate({id: singer.id}, singer, {upsert: true}, function (err, result) {
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
	querySong(hash).then(function (result) {
		deferred.resolve(result);
	}, function (err) {
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
			saveTunes(data.data.info);
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
	request(config("tunes", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			saveTunes(data.data.info);
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
			rankingData.date = Date.now();
		}
	});
	return deferred.promise;
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

exports.fetchList = function (query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		listData;
	listCaches[key] = listCaches[key] || {};
	listData = listCaches[key];
	request(config("list", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			listData.response = data;
			listData.date = Date.now();
		}
	});
	return deferred.promise;
};

function fetchIcon(query) {
	var deferred = Q.defer(),
		key = JSON.stringify(query),
		iconData;
	iconCaches[key] = iconCaches[key] || {};
	iconData = iconCaches[key];
	request(config("icon", query), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body.trim());
			deferred.resolve(data);
			iconData.response = data;
			iconData.date = Date.now();
		}
	});
	return deferred.promise;
}
function queryIcon(query) {
	var deferred = Q.defer();
	Singer.findOne({singer: query.singerName}, function (err, result) {
		if (err || !result) {
			deferred.reject('singer is not in db')
		}
		if (result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

exports.getIcon = function (query) {
	var deferred = Q.defer();
	queryIcon(query).then(function (result) {
		deferred.resolve({
			singer: result.singer,
			url: result.imgurl,
			status: 1
		});
	}, function (err) {
		fetchIcon(query).done(function (result) {
			deferred.resolve(result);
		});
	});
	return deferred.promise;
};
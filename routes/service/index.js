var request = require('request'),
	config = require("./config"),
	db = require('../db'),
	Song = db.Song,
	Search = db.Search,
	Music = db.Music,
	Singer = db.Singer,
	caches = require('../caches'),
	searchCaches = caches.searchCaches,
	singerCaches = caches.singerCaches,
	songCache = caches.songCaches,
	rankingCaches = caches.rankingCaches,
	lrcCaches = caches.lrcCaches,
	rankingListCaches = caches.rankingListCaches;

function saveMusic(data) {
	data.forEach(function (music) {
		Music.findOneAndUpdate({hash: music.hash}, music, {upsert: true}, function (err, result) {
			if (err) {
				console.log(err);
			}
		});
	});
}

exports.ranking = function (req, res) {
	var key = JSON.stringify(req.query);
	rankingCaches[key] = rankingCaches[key] || {};
	var rankingData = rankingCaches[key];
	if (rankingData.response) {
		res.json(rankingData.response);
		rankingData.date = new Date().getTime();
	} else {
		request(config("ranking", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				res.end(data);
				saveMusic(data.data);
				rankingData.response = data;
				rankingData.date = new Date().getTime();
			}
		});
	}
};

exports.rankingList = function (req, res) {
	var key = JSON.stringify(req.query);
	rankingListCaches[key] = rankingListCaches[key] || {};
	var rankingListData = rankingListCaches[key];
	if (rankingListData.response) {
		res.json(rankingListData.response);
		rankingListData.date = new Date().getTime();
	} else {
		request(config("rankingList", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				res.json(data);
				rankingListData.response = data;
				rankingListData.date = new Date().getTime();
			}
		});
	}
};

exports.singers = function (req, res) {
	var key = JSON.stringify(req.query);
	singerCaches[key] = singerCaches[key] || {};
	var singerData = singerCaches[key];
	if (singerData.response) {
		res.json(singerData.response);
		singerData.date = new Date().getTime();
	} else {
		request(config("singers", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				res.json(data);
				data.data.forEach(function (singer) {
					Singer.findOneAndUpdate({singer: singer.singer}, singer, {upsert: true}, function (err, result) {
						if (err) {
							console.log(err);
						}
					});
				});
				singerData.response = data;
				singerData.date = new Date().getTime();
			}
		});
	}
};

exports.search = function (req, res) {
	var keyword = req.query.keyword;
	keyword = keyword.trim().replace(/\s{2,}/ig, ' ');
	req.query.keyword = keyword;
	var key = JSON.stringify(req.query);
	searchCaches[key] = searchCaches[key] || {};
	var searchData = searchCaches[key];
	if (searchData.response) {
		res.json(searchData.response);
		searchData.date = new Date().getTime();
	} else {
		request(config("search", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				res.json(data);
				saveMusic(data.data);
				searchData.response = data;
				searchData.date = new Date().getTime();
			}
		});
	}
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

exports.songs = function (req, res) {
	var key = JSON.stringify(req.query);
	songCache[key] = songCache[key] || {};
	var songData = songCache[key];
	if (songData.response) {
		res.json(songData.response);
		songData.date = new Date().getTime();
	} else {
		request(config("songs", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				res.json(data);
				saveMusic(data.data);
				songData.response = data;
				songData.date = new Date().getTime();
			}
		});
	}
};


exports.lrc = function (req, res) {
	var key = JSON.stringify(req.query);
	lrcCaches[key] = lrcCaches[key] || {};
	var lrcData = lrcCaches[key];
	if (lrcData.response) {
		res.end(lrcData.response);
		lrcData.date = new Date().getTime();
	} else {
		request(config("lrc", req.query), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = body.trim();
				res.end(data);
				lrcData.response = data;
				lrcData.date = new Date().getTime();
			}
		});
	}

};

exports.music = function (req, res) {
	var hash = req.query.hash;
	Song.findOne({hash: hash}, function (err, result) {
		if (result) {
			res.json(result);
		} else {
			request(config("music", req.query), function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body.trim());
					res.json(data);
					var song = new Song(data);
					song.save(function (err) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		}
	});
};
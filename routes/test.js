var service = require('./service'),
	getSong = service.getSong,
	fetchSearch = service.fetchSearch,
	fetchLrc = service.fetchLrc,
	fetchTunes = service.fetchTunes,
	updateSearch = service.updateSearch,
	fetchSingers = service.fetchSingers,
	fetchRanking = exports.fetchRanking,
	caches = require('./caches'),
	searchCaches = caches.searchCaches,
	singerCaches = caches.singerCaches,
	songCaches = caches.songCaches,
	rankingCaches = caches.rankingCaches,
	lrcCaches = caches.lrcCaches,
	rankingListCaches = caches.rankingListCaches,
	_ = require('underscore');
exports.song = function (req, res) {
	var hash = req.query.hash;
	getSong(hash).done(function (result) {
		res.json(result);
	});
};
exports.search = function (req, res) {
	var keyword = req.query.keyword;
	keyword = keyword.trim().replace(/\s{2,}/ig, ' ');
	req.query.keyword = keyword;
	var query = _.pick(req.query, ['keyword', 'page']),
		key = JSON.stringify(query),
		searchData, result;
	searchCaches[key] = searchCaches[key] || {};
	searchData = searchCaches[key];
	result = searchData.response;
	if (result) {
		res.json(result);
	} else {
		fetchSearch(query).done(function (resulet) {
			res.json(result);
		});
	}
	updateSearch(query.keyword);
};
exports.lrc = function (req, res) {
	var query = _.pick(req.query, ['keyword', 'timelength']),
		key = JSON.stringify(query),
		lrcData, result;
	lrcCaches[key] = lrcCaches[key] || {};
	lrcData = lrcCaches[key];
	result = lrcData.response;
	if (result) {
		res.end(result);
	} else {
		fetchLrc(query).done(function () {
			res.end(result);
		});
	}
};
exports.tunes = function (req, res) {
	var query = _.pick(req.query, ['singerId', 'page']),
		key = JSON.stringify(query),
		songData, result;
	songCaches[key] = songCaches[key] || {};
	songData = songCaches[key];
	result = songData.response;
	if (result) {
		res.json(result);
	} else {
		fetchTunes(query).done(function () {
			res.json(result);
		});
	}
};

exports.singers = function (req, res) {
	var query = _.pick(req.query, ['classId', 'page']),
		key = JSON.stringify(query),
		singerData, result;
	singerCaches[key] = singerCaches[key] || {};
	singerData = singerCaches[key];
	result = singerData.response;
	if (result) {
		res.json(result);
	} else {
		fetchSingers(query).done(function () {
			res.json(result);
		});
	}
};

exports.ranking = function (req, res) {
	var query = _.pick(req.query, ['cid', 'type', 'page']),
		key = JSON.stringify(query),
		rankingData, result;
	rankingCaches[key] = rankingCaches[key] || {};
	rankingData = rankingCaches[key];
	result = rankingData.response;
	if (result) {
		res.json(result);
	} else {
		fetchRanking(query).done(function () {
			res.json(result);
		});
	}
};
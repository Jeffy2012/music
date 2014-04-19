var service = require('./service'),
	caches = require('./caches'),
	getSong = service.getSong,
	fetchSearch = service.fetchSearch,
	fetchLrc = service.fetchLrc,
	fetchTunes = service.fetchTunes,
	updateSearch = service.updateSearch,
	fetchSingers = service.fetchSingers,
	fetchRanking = service.fetchRanking,
	fetchList = service.fetchList,
	fetchIcon = service.fetchIcon,
	searchCaches = caches.searchCaches,
	singerCaches = caches.singerCaches,
	songCaches = caches.songCaches,
	rankingCaches = caches.rankingCaches,
	lrcCaches = caches.lrcCaches,
	listCaches = caches.listCaches,
	iconCaches = caches.iconCaches,
	_ = require('underscore');
/**
 * 单个歌曲
 * @param req
 * @param res
 */
exports.song = function (req, res) {
	var hash = req.query.hash;
	getSong(hash).done(function (result) {
		if (req.header('X-Requested-With') == 'XMLHttpRequest') {
			res.json(result);
		} else {
			res.render('weixin/song', result);
		}
	});
};
/**
 * 搜索
 * @param req
 * @param res
 */
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
		fetchSearch(query).done(function (result) {
			res.json(result);
		});
	}
	updateSearch(query.keyword);
};
/**
 * 歌词
 * @param req
 * @param res
 */
exports.lrc = function (req, res) {
	var query = _.pick(req.query, ['keyword', 'timelength', 'hash']),
		key = JSON.stringify(query),
		lrcData, result;
	lrcCaches[key] = lrcCaches[key] || {};
	lrcData = lrcCaches[key];
	result = lrcData.response;
	if (result) {
		res.end(result);
	} else {
		fetchLrc(query).done(function (result) {
			res.end(result);
		});
	}
};
/**
 * 歌手的歌曲
 * @param req
 * @param res
 */
exports.tunes = function (req, res) {
	var query = _.pick(req.query, ['singerid', 'page']),
		key = JSON.stringify(query),
		songData, result;
	songCaches[key] = songCaches[key] || {};
	songData = songCaches[key];
	result = songData.response;
	if (result) {
		res.json(result);
	} else {
		fetchTunes(query).done(function (result) {
			res.json(result);
		});
	}
};

/**
 * 歌手列表
 * @param req
 * @param res
 */
exports.singers = function (req, res) {
	var query = _.pick(req.query, ['classid', 'page']),
		key = JSON.stringify(query),
		singerData, result;
	singerCaches[key] = singerCaches[key] || {};
	singerData = singerCaches[key];
	result = singerData.response;
	if (result) {
		res.json(result);
	} else {
		fetchSingers(query).done(function (result) {
			res.json(result);
		});
	}
};
/**
 * 排行榜歌曲
 * @param req
 * @param res
 */
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
		fetchRanking(query).done(function (result) {
			res.json(result);
		});
	}
};
/**
 * 排行榜列表
 * @param req
 * @param res
 */
exports.list = function (req, res) {
	var query = _.pick(req.query, ['page']),
		key = JSON.stringify(query),
		listData, result;
	listCaches[key] = listCaches[key] || {};
	listData = listCaches[key];
	result = listData.response;
	if (result) {
		res.json(result);
	} else {
		fetchList(query).done(function (result) {
			res.json(result);
		});
	}
};
/**
 * 获取头像
 * @param req
 * @param res
 */
exports.icon = function (req, res) {
	var query = _.pick(req.query, ['page']),
		key = JSON.stringify(query),
		iconData, result;
	iconCaches[key] = iconCaches[key] || {};
	iconData = iconCaches[key];
	result = iconData.response;
	if (result) {
		res.json(result);
	} else {
		fetchIcon(query).done(function (result) {
			res.json(result);
		});
	}
};
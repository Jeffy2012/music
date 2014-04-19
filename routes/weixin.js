var parseString = require('xml2js').parseString,
	service = require('./service'),
	caches = require('./caches'),
	searchCaches = caches.searchCaches,
	Q = require('q'),
	getSong = service.getSong,
	fetchSearch = service.fetchSearch,
	getIcon = service.getIcon,
	_ = require('underscore');

exports.get = function (req, res) {
	res.end(req.query.echostr);
};
exports.post = function (req, res) {
	parseReq(req).done(function (msg) {
		if (msg.MsgType == 'text') {
			textMsg(msg, res);
		} else {
			res.end('');
		}
	});
};

function textMsg(msg, res) {
	var keyword = msg.Content;
	keyword = keyword.trim().replace(/\s{2,}/ig, ' ');
	var key = JSON.stringify({keyword: keyword}),
		searchData, result;
	searchCaches[key] = searchCaches[key] || {};
	searchData = searchCaches[key];
	result = searchData.response;
	if (result) {
		dealData(res, msg, result);
	} else {
		fetchSearch({keyword: keyword}).done(function (result) {
			dealData(res, msg, result);
		});
	}
}
function dealData(res, msg, result) {
	var keyword = msg.Content,
		first = result.data.info[0];
	if (/.*-.*/.test(keyword)) {
		getSong(first.hash).done(function (result) {
			res.render('weixin/music', {
				toUser: msg.FromUserName,
				fromUser: msg.ToUserName,
				timestamp: Math.floor(Date.now() / 1000),
				title: first.filename,
				musicUrl: result.url,
				HQMusicUrl: result.url
			});
		});
	} else {
		if (/(.*)-.*/.test(first.filename)) {
			getIcon({singerName: RegExp.$1.split("、")[0]}).done(function (icon) {
				first.icon = icon.url.replace('softhead/', 'softhead/200/');
				res.render('weixin/list', {
					toUser: msg.FromUserName,
					fromUser: msg.ToUserName,
					timestamp: Math.floor(Date.now() / 1000),
					list: result.data.info.slice(0, 8),
					keyword: msg.Content
				});
			});
		} else {
			res.render('weixin/list', {
				toUser: msg.FromUserName,
				fromUser: msg.ToUserName,
				timestamp: Math.floor(Date.now() / 1000),
				list: result.data.info.slice(0, 8),
				keyword: msg.Content
			});
		}
	}
}
function parseReq(req) {
	var deferred = Q.defer();
	var xml = '';
	req.on('data', function (chunk) {
		xml += chunk;
	}).on('end', function () {
		parseString(xml, function (err, result) {
			result = result.xml;
			for (var key in result) {
				result[key] = result[key][0]
			}
			deferred.resolve(result);
		});
	});
	return deferred.promise;
}
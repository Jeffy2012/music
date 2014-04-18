var parseString = require('xml2js').parseString;
var Q = require("q");
var service = require('./service'),
	querySong = service.querySong,
	fetchSong = service.fetchSong;
var config = require("./service/config");
var request = require("request");
var caches = require('./caches'),
	searchCaches = caches.searchCaches,
	db = require('./db'),
	Search = db.Search,
	Music = db.Music,
	Song = db.Song;

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
	var key = JSON.stringify({keyword: keyword});
	searchCaches[key] = searchCaches[key] || {};
	var searchData = searchCaches[key];
	if (searchData.response) {
		findSong(searchData.response.data[0].hash, msg).done(function (result) {
			res.send(result);
		});
		searchData.date = new Date().getTime();
	} else {
		request(config("search", {keyword: keyword}), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body.trim());
				findSong(data.data[0].hash, msg).done(function (result) {
					res.send(result);
				});
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

function findSong(hash, msg) {
	var deferred = Q.defer();
	Song.findOne({hash: hash}, function (err, result) {
		if (result) {
			deferred.resolve(CreateMusicMsg(msg, result));
		} else {
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
		}
	});
	return deferred.promise;
}

function CreateMusicMsg(msg, result) {
	var time = Math.round(new Date().getTime() / 1000);

	var funcFlag = msg.funcFlag ? msg.funcFlag : '';

	var output = "" +
		"<xml>" +
		"<ToUserName><![CDATA[" + msg.FromUserName + "]]></ToUserName>" +
		"<FromUserName><![CDATA[" + msg.ToUserName + "]]></FromUserName>" +
		"<CreateTime>" + time + "</CreateTime>" +
		"<MsgType><![CDATA[music]]></MsgType>" +
		"<Music>" +
		"<Title><![CDATA[" + result.fileName + "]]></Title>" +
		"<Description><![CDATA[" + result.fileName + "DESCRIPTION]]></Description>" +
		"<MusicUrl><![CDATA[" + result.url + "]]></MusicUrl>" +
		"<HQMusicUrl><![CDATA[" + result.url + "]]></HQMusicUrl>" +
		"</Music>" +
		"<FuncFlag>" + funcFlag + "</FuncFlag>" +
		"</xml>";

	return output;
}
function saveMusic(data) {
	data.forEach(function (music) {
		Music.findOneAndUpdate({hash: music.hash}, music, {upsert: true}, function (err, result) {
			if (err) {
				console.log(err);
			}
		});
	});
}
var weixin = require("./media");
var parseString = require("xml2js").parseString;
var Q = require("q");
var service = require("./service");
var request = require("request");
var weixinApi = require('weixin-api');
weixinApi.textMsg(function (msg) {
    var returnMsg = {};
    returnMsg.toUserName = msg.fromUserName;
    returnMsg.fromUserName = msg.toUserName;
    returnMsg.msgType = "music";
    returnMsg.time = Math.round(new Date().getTime() / 1000);
    request(service("search", {keyword: msg.content}), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var message = JSON.parse(body.trim());
            var list = message.data;
            returnMsg.title = list[0].filename;
            returnMsg.description = list[0].filename;
            musicData(list[0].hash).then(function (data) {
                returnMsg.musicUrl = data.url;
                returnMsg.hQMusicUrl = data.url;
                weixinApi.sendMsg(returnMsg);
            });
        }
    });
});
function musicData(hash) {
    var deferred = Q.defer();
    request(service("music", {hash: hash}), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body.trim()));
        }
    });
    return deferred.promise;
}
exports.get = function (req, res) {
    res.end(req.query.echostr);
};
exports.post = function (req, res) {
    weixinApi.loop(req, res);
};
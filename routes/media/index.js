var request = require("request");
var Q = require("q");
var cache = {};
var access = {};
function checkMedia(url) {
    return new Date().getTime() - cache[url].created_at >= 3 * 24 * 60 * 60 * 1000;
}
function checkAccess() {
    return new Date().getTime() - access.ctime >= access.expires_in * 1000;
}
function getAccess() {
    var deferred = Q.defer();
    request.get("https://api.weixin.qq.com/cgi-bin/token", {
        qs: {
            grant_type: "client_credential",
            appid: "APPID",
            secret: "APPSECRET"
        }
    }, function (err, response, body) {
        if (err) {
            deferred.reject(err)
        }
        var data = JSON.parse(body);
        access = data;
        access.ctime = new Date().getTime();
        deferred.resolve(data);
    });
    return deferred.promise;
}
function upload(url) {
    var deferred = Q.defer();
    var r = request.post("http://file.api.weixin.qq.com/cgi-bin/media/upload", {
        qs: {
            access_token: "yuanjiefeng",
            type: type || "image"
        }
    }, function (err, response, body) {
        if (err) {
            deferred.reject(err)
        }
        var data = JSON.parse(body);
        cache[url] = data;
        deferred.resolve(data);
    });
    var form = r.form();
    form.append("media", request(url));
    return deferred.promise;
}
exports.upload = upload;
exports.getAccess = getAccess;
exports.cache = cache;
exports.access = access;
exports.checkAccess = checkAccess;
exports.checkMedia = checkMedia;
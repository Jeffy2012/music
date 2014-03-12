var request = require('request');
var service = require("./service");
exports.ranking = function (req, res) {
    request(service("ranking", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};
exports.rankingList = function (req, res) {
    request(service("rankingList", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};
exports.singers = function (req, res) {
    request(service("singers", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};
exports.search = function (req, res) {
    request(service("search", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};

exports.songs = function (req, res) {
    request(service("songs", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};

exports.music = function (req, res) {
    request(service("music", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};

exports.m4a = function (req, res) {
    var x = request(req.query.url);
    try {
        x.pipe(res);
    } catch (e) {
        res.end("")
    }
};

exports.lrc = function (req, res) {
    request(service("lrc", req.query), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.end(body.trim());
        }
    });
};
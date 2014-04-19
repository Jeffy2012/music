/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require("fs");
var site = require('./routes/site');
var weixin = require("./routes/weixin");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
	if (req.url != "/") {
		res.redirect("/#" + req.url);
	} else {
		next();
	}
});
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.get("/", function (req, res) {
	fs.createReadStream("./public/index.html").pipe(res);
});
app.get("/search", site.search);
app.get("/singers", site.singers);
app.get("/tunes", site.tunes);
app.get("/song", site.song);
app.get("/lrc", site.lrc);
app.get("/list", site.list);
app.get("/ranking", site.ranking);
app.get("/weixin", weixin.get);
app.post("/weixin", weixin.post);
http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

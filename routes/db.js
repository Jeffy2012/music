var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	// yay!
});
var searchSchema = Schema({
	keyword: String,
	times: Number
});

var userSchema = Schema({
	Email: String,
	telephoneNumber: String,
	password: String,
	activated: Boolean,
	createTime: Date,
	activationTime: Date
});
var songSchema = Schema({
	hash: String,
	bitRate: Number,
	extName: String,
	fileName: String,
	fileSize: Number,
	singerHead: String,
	status: Number,
	timeLength: Number,
	url: String
});

var musicSchema = Schema({
	filename: String,
	size: Number,
	hash: String,
	owner: Number,
	bitrate: Number,
	extname: String,
	timelength: Number,
	mvhash: String,
	m4ahash: String,
	m4asize: Number,
	"320hash": String,
	"320size": Number,
	sqhash: String,
	sqsize: Number,
	feetype: Number,
	isnew: Number
});
var singerSchema = Schema({
	singer: String,
	src: String
});

exports.searchSchema = searchSchema;
exports.userSchema = userSchema;
exports.songSchema = songSchema;
exports.musicSchema = musicSchema;
exports.singerSchema = singerSchema;

exports.Song = mongoose.model('Song', songSchema);
exports.Search = mongoose.model('Search', searchSchema);
exports.User = mongoose.model('User', userSchema);
exports.Music = mongoose.model('Music', musicSchema);
exports.Singer = mongoose.model('Singer', singerSchema);
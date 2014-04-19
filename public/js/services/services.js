"use strict";
app.factory("playlist", function () {
	var listObject = store.getAll() || {};
	var hash = listObject.hash;
	var mode = listObject.mode || "LOOP";
	var show = listObject.show || "FREQUENCY";
	delete listObject.hash;
	delete listObject.mode;
	delete listObject.show;
	var listArray = _.values(listObject);
	listArray = _.sortBy(listArray, function (song) {
		return song.timestamp;
	});
	var hashes = _.map(listArray, function (item) {
		return item.hash;
	});
	var song = null;
	if (hash) {
		song = listObject[hash];
		if (!song) {
			song = listObject[hashes[0]];
		}
	}
	return {
		listObject: listObject,
		listArray: listArray,
		hashes: hashes,
		hash: hash,
		mode: mode,
		show: show,//Frequency  timeDomain
		song: song,
		add: function (song) {
			if (this.listObject[song.hash]) return song;
			store.set(song.hash, song);
			this.listObject[song.hash] = song;
			this.upgrade();
			return song;
		},
		delete: function (song) {
			store.remove(song.hash);
			delete this.listObject[song.hash];
			this.upgrade();
			return song;
		},
		upgrade: function () {
			var listArray = _.values(this.listObject);
			listArray = _.sortBy(listArray, function (song) {
				return song.timestamp;
			});
			this.hashes = _.map(listArray, function (item) {
				return item.hash;
			});
			this.listArray = listArray;
		},
		index: function (hash) {
			hash = hash || this.hash;
			return this.hashes.indexOf(hash);
		},
		next: function () {
			var l = this.hashes.length;
			var index = this.index();
			var hash;

			if (this.mode == "RANDOM") {
				var i = Math.floor(Math.random() * l);
				if (i == index) {
					i = (l + index + 1) % l
				}
				hash = this.hashes[i];
			} else {
				hash = this.hashes[(l + index + 1) % l];
			}
			this.hash = hash;
			return this.listObject[hash];
		},
		prev: function () {
			var index = this.index();
			var l = this.hashes.length;
			var hash;
			if (this.mode == "RANDOM") {
				var i = Math.floor(Math.random() * l);
				if (i == index) {
					i = (l + index + 1) % l
				}
				hash = this.hashes[i];

			} else {
				hash = this.hashes[(l + index - 1) % l];
			}
			this.hash = hash;
			return this.listObject[hash];
		}
	}
});
app.factory("LRC", ["$http", "$q", function ($http, $q) {
	return {
		get: function (song) {
			var self = this;
			var deferred = $q.defer();
			$http
				.get(server + "/lrc", {
					params: {
						keyword: encodeURIComponent(song.filename),
						timelength: parseInt(song.data.timeLength) * 1000,
						hash: song.hash
					},
					cache: true
				})
				.success(function (data) {
					deferred.resolve(self.parseLrc(data));
				}).error(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		},
		getLine: function (lrcStr) {
			var patter = /((?:\[\d+:\d+\.\d+\])+)(.*)/igm;
			var result;
			var data = {};
			while ((result = patter.exec(lrcStr)) != null) {
				data[result[1]] = result[2];
			}
			return data;
		},

		split: function (obj) {
			var patter = /\[(\d+:\d+\.\d+)\]/ig;
			var result;
			var data = {};
			for (var key in obj) {
				while ((result = patter.exec(key)) != null) {
					data[result[1]] = obj[key];
				}
			}
			return data;
		},

		parseLrc: function (lrcStr) {
			var obj = this.split(this.getLine(lrcStr));
			var patter = /(\d+):(\d+\.\d+)/;
			var timePoint;
			var lrcData = {};
			var timeLine = [];
			for (var key in obj) {
				if (patter.test(key)) {
					timePoint = parseInt(RegExp.$1, 10) * 60 + parseFloat(RegExp.$2);
					lrcData[timePoint] = obj[key];
					timeLine.push(timePoint);

				}
			}
			timeLine.sort(function (value1, value2) {
				if (value1 > value2) {
					return 1;
				} else if (value1 == value2) {
					return 0;
				} else {
					return -1;
				}
			});
			return {
				lrcData: lrcData,
				timeLine: timeLine
			}
		}};
}]);

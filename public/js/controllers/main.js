'use strict';
var server = "";
app.controller("singerCategoryCtrl", ["$scope", function ($scope) {
	$scope.categories = [
		"华语男歌手", "华语女歌手", "华语组合",
		"日韩男歌手", "日韩女歌手", "日韩组合",
		"欧美男歌手", "欧美女歌手", "欧美组合",
		"其他"
	]
}]);

app.controller("singersCtrl", ["$scope", "$http", "$routeParams", "$q",
	function ($scope, $http, $routerParams, $q) {
		var classID = $routerParams.classID;
		$scope.currentPage = 1;
		$scope.disabled = false;
		function query(page) {
			var deferred = $q.defer();
			$http
				.get(server + "/singers", {
					params: {
						classID: classID,
						page: page
					},
					cache: true
				})
				.success(function (data) {
					$scope.disabled = data.data.length < 10;
					deferred.resolve(data);
				}).error(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}

		query($scope.currentPage).then(function (data) {
			$scope.singers = data.data;
		});
		$scope.next = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				$scope.singers = data.data;
				$scope.currentPage++;
			});
		};
		$scope.prev = function () {
			var page = $scope.currentPage - 1;
			query(page).then(function (data) {
				$scope.singers = data.data;
				$scope.currentPage--;
			});
		};
		$scope.more = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				Array.prototype.push.apply($scope.singers, data.data);
				$scope.currentPage++;
			});
		};
	}]);

app.controller("rankingListCtrl", ["$scope", "$http", "$q",
	function ($scope, $http, $q) {
		$scope.currentPage = 1;
		$scope.disabled = false;
		function query(page) {
			var deferred = $q.defer();
			$http
				.get(server + "/ranking-list", {
					params: {
						page: page
					},
					cache: true
				})
				.success(function (data) {
					$scope.disabled = data.data.length < 10;
					deferred.resolve(data);
				}).error(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}

		query($scope.currentPage).then(function (data) {
			$scope.rankingList = data.data;

		});
		$scope.next = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				$scope.rankingList = data.data;
				$scope.currentPage++;
			});
		};
		$scope.prev = function () {
			var page = $scope.currentPage - 1;
			query(page).then(function (data) {
				$scope.rankingList = data.data;
				$scope.currentPage--;
			});
		};
		$scope.more = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				Array.prototype.push.apply($scope.rankingList, data.data);
				$scope.currentPage++;
			});
		};
	}]);
app.controller("songsCtrl", ["$scope", "$http", "$routeParams", "$q", "playlist",
	function ($scope, $http, $routerParams, $q, playlist) {
		var singerID = $routerParams.singerID;
		var keyword = $routerParams.keyword;
		var cid = $routerParams.cid;
		var type = $routerParams.type;
		$scope.currentPage = 1;
		$scope.playlist = playlist;
		function query(page) {
			var deferred = $q.defer();
			var url;
			if (cid) {
				url = "/ranking";
			} else if (keyword) {
				url = "/search";
			} else if (singerID) {
				url = "/songs";
			}
			$http
				.get(server + url, {
					params: {
						singerID: singerID,
						page: page,
						keyword: keyword,
						cid: cid,
						type: cid
					},
					cache: true
				})
				.success(function (data) {
					deferred.resolve(data);
				}).error(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}

		function getMusicData(hash) {
			var deferred = $q.defer();
			$http
				.get(server + "/music", {
					params: {
						hash: hash
					},
					cache: true
				})
				.success(function (data) {
					deferred.resolve(data);
				}).error(function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}

		query($scope.currentPage).then(function (data) {
			$scope.songs = data.data;
			$scope.totalPage = Math.ceil(data.recordcount / 20);
		});
		$scope.next = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				$scope.songs = data.data;
				$scope.currentPage++;
			});
		};
		$scope.prev = function () {
			var page = $scope.currentPage - 1;
			query(page).then(function (data) {
				$scope.songs = data.data;
				$scope.currentPage--;
			});
		};
		$scope.more = function () {
			var page = $scope.currentPage + 1;
			query(page).then(function (data) {
				Array.prototype.push.apply($scope.songs, data.data);
				$scope.currentPage++;
			});
		};
		$scope.addToPlaylist = function (song) {
			getMusicData(song.hash).then(function (data) {
				song.data = data;
				delete song.$$hashKey;
				song.timestamp = new Date().getTime();
				$scope.playlist.add(song);
			});
		}
	}]);
app.controller("searchCtrl", ["$scope", "$location",
	function ($scope, $location) {
		$scope.keyword = "";
		$scope.search = function (keyword) {
			$location.path("/search/" + keyword);
		};
	}]);
app.controller("appCtrl", ["$scope", "playlist", "LRC", "$timeout",
	function ($scope, playlist, LRC, $timeout) {
		var audio = new Audio();
		var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		var context = new AudioContext();
		var source = context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();
		var canvas = document.querySelector("#canvas");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "green";
		ctx.strokeStyle = "green";
		var HEIGHT = canvas.height;
		var WIDTH = canvas.width;
		var barWidth = 10;
		var barGap = 5;
		var total = Math.floor(WIDTH / (barWidth + barGap));
		source.connect(analyser);
		analyser.connect(context.destination);

		$scope.playlist = playlist;

		function loop() {
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			var size = analyser.frequencyBinCount;
			if ($scope.playlist.show == "FREQUENCY") {
				var frequency = new Uint8Array(size);
				analyser.getByteFrequencyData(frequency);
				for (var i = 0; i < total; i++) {
					var value = frequency[i * Math.floor(size / total)];
					var percent = value / 256;
					var height = HEIGHT * percent;
					var offset = HEIGHT - height;
					ctx.fillRect(i * (barWidth + barGap), offset, barWidth, height);
				}
			} else if ($scope.playlist.show == "TIMEDOMAIN") {
				var timeDomain = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteTimeDomainData(timeDomain);
				var rate = size / WIDTH;
				ctx.beginPath();
				for (var i = 0; i < WIDTH; i++) {
					if (i == 0) {
						ctx.moveTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
					} else {
						ctx.lineTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
					}
					if (typeof window.heightest == 'undefined') {
						window.heightest = timeDomain[Math.floor(i * rate)]
					} else {
						window.heightest = Math.min(window.heightest, timeDomain[Math.floor(i * rate)])
					}
				}
				ctx.stroke();
			}
			requestAnimationFrame(loop);
		}

		loop();
		$scope.paused = true;
		$scope.currentTime = 0;
		$scope.duration = 0;
		$scope.delete = function (song) {
			$scope.playlist.delete(song);
		};
		$scope.play = function (song) {
			audio.src = song.data.url;
			LRC.get(song).then(function (lrc) {
				$scope.lrc = lrc;
			});
			$scope.playlist.hash = song.hash;
			$scope.paused = false;
			store.set("hash", song.hash);
			audio.play();
		};
		$scope.toggle = function () {
			if (audio.paused) {
				audio.play();
				$scope.paused = false;
			} else {
				audio.pause();
				$scope.paused = true;
			}
		};
		$scope.replay = function () {
			audio.currentTime = 0;
		};
		$scope.next = function () {
			$scope.play($scope.playlist.next());
		};
		$scope.prev = function () {
			$scope.play($scope.playlist.prev());
		};
		audio.addEventListener("ended", function () {
			if ($scope.playlist.mode == "REPEAT") {
				$scope.play($scope.playlist.song);
			} else {
				$scope.next();
			}
		});
		audio.addEventListener("canplay", function () {
			$scope.duration = audio.duration;
		});
		$scope.setCurrentTime = function (ev) {
			var offsetX = ev.offsetX;
			var width = ev.currentTarget.clientWidth;
			audio.currentTime = (audio.duration || 0) * offsetX / width;
			$scope.currentTime = audio.currentTime;
		};
		$scope.changeMode = function (mode) {

			$scope.playlist.model = mode;
		};
		var update = function () {
			var currentTime = audio.currentTime;
			$scope.currentTime = currentTime;
			if ($scope.lrc) {
				var timeLine = $scope.lrc.timeLine;
				for (var i = 0, l = timeLine.length; i < l; i++) {
					var time = timeLine[i];
					if (currentTime < time) {
						$scope.lineIndex = i - 1;
						break;
					}
				}
			}
			$timeout(function () {
				update();
			}, 200);
		};
		update();
		if ($scope.playlist.song) {
			$scope.play($scope.playlist.song);
		}
		$scope.$watch("playlist.mode", function (mode) {
			store.set("mode", mode);
		});
		$scope.$watch("playlist.show", function (show) {
			store.set("show", show);
		});
	}]);
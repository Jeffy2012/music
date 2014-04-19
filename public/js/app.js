'use strict';
var app = angular.module('musicApp', [ 'ngSanitize', 'ngRoute' ]);
app.config(["$routeProvider", "$sceProvider", "$locationProvider", "$httpProvider",
	function ($routeProvider, $sceProvider, $locationProvider, $httpProvider) {
		$sceProvider.enabled(false);
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		$locationProvider.html5Mode(true);
		$routeProvider
			.when("/category", {
				controller: "categoryCtrl",
				templateUrl: "/views/category.html"
			})
			.when("/list", {
				controller: "listCtrl",
				templateUrl: "/views/list.html"
			})
			.when("/ranking/:cid", {
				controller: "tunesCtrl",
				templateUrl: "/views/tunes.html"
			})
			.when("/singers/:classID", {
				controller: "singersCtrl",
				templateUrl: "/views/singers.html"
			})
			.when("/tunes/:singerID", {
				controller: "tunesCtrl",
				templateUrl: "/views/tunes.html"
			})
			.when("/search/:keyword", {
				controller: "tunesCtrl",
				templateUrl: "/views/tunes.html"
			});
	}]);

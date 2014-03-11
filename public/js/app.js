'use strict';
var app = angular.module('musicApp', [ 'ngSanitize', 'ngRoute' ]);
app.config(["$routeProvider", "$sceProvider", "$locationProvider", "$httpProvider",
    function ($routeProvider, $sceProvider, $locationProvider, $httpProvider) {
        $sceProvider.enabled(false);
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/singer-category", {
                controller: "singerCategoryCtrl",
                templateUrl: "/views/singer-category.html"
            })
            .when("/ranking-list", {
                controller: "rankingListCtrl",
                templateUrl: "/views/ranking-list.html"
            })
            .when("/ranking/:cid", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            })
            .when("/singers/:classID", {
                controller: "singersCtrl",
                templateUrl: "/views/singers.html"
            })
            .when("/songs/:singerID", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            })
            .when("/search/:keyword", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            });
    }]);

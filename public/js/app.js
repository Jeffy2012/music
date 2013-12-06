'use strict';
var app = angular.module('musicApp', [ 'ngSanitize', 'ngRoute' ]);
app.config(["$routeProvider", "$sceProvider",
    function ($routeProvider, $sceProvider) {
        $sceProvider.enabled(false);
        $routeProvider
            .when("/singer-category", {
                controller: "singerCategoryCtrl",
                templateUrl: "/views/singer-category.html"
            })
            .when("/ranking-list", {
                controller: "rankingListCtrl",
                templateUrl: "/views/ranking-list.html"
            })
            .when("/ranking", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            })
            .when("/singers", {
                controller: "singersCtrl",
                templateUrl: "/views/singers.html"
            })
            .when("/songs", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            })
            .when("/search/:keyword", {
                controller: "songsCtrl",
                templateUrl: "/views/songs.html"
            });
    }]);

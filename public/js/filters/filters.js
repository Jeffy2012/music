'use strict';
app.filter("time", function () {
    return function (text) {
        var seconds = parseInt(text);
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return m + ":" + s;
    }
});
app.filter('orderObjectBy', function(){
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for(var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function(a, b){
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});
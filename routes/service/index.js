var url = require('url'),
    _ = require("underscore"),
    configs = {
        //http://m.kugou.com/app/i/krc.php?cmd=100&keyword=%25E5%2591%25A8%25E6%259D%25B0%25E4%25BC%25A6%2520-%2520%25E8%25AF%25B4%25E5%25A5%25BD%25E7%259A%2584%25E5%25B9%25B8%25E7%25A6%258F%25E5%2591%25A2&timelength=256000&d=1386058477417
        lrc: {
            protocol: "http:",
            host: "m.kugou.com",
            pathname: "/app/i/krc.php",
            query: {
                cmd: 100,
                keyword: "",
                timelength: 256000,
                d: 1386140570176
            }
        },
        //http://mobilecdn.kugou.com/new/app/i/yueku.php?cmd=100&cid=21&type=21&page=1&pagesize=10&outputtype=jsonp&callback=returnLists
        rankingList: {
            protocol: "http:",
            host: "mobilecdn.kugou.com",
            pathname: "/new/app/i/yueku.php",
            query: {
                cmd: 100,
                cid: 21,
                type: 21,
                pagesize: 10,
                page: 1
            }
        },
        //http://mobilecdn.kugou.com/new/app/i/yueku.php?cmd=101&cid=6187&type=6187&page=1&pagesize=20&outputtype=jsonp&callback=returnSongs
        ranking: {
            protocol: "http:",
            host: "mobilecdn.kugou.com",
            pathname: "/new/app/i/yueku.php",
            query: {
                cmd: 101,
                cid: 28,
                type: 28,
                page: 1,
                pagesize: 20
            }
        },
        //http://m.kugou.com/app/i/singer_new.php?classID=1&page=1
        singers: {
            protocol: "http:",
            host: "m.kugou.com",
            pathname: "/app/i/singer_new.php",
            query: {
                classID: 1,
                page: 1
            }
        },
        //http://m.kugou.com/app/i/singerSong_new.php?singerID=%25E5%2591%25A8%25E6%259D%25B0%25E4%25BC%25A6&page=1
        songs: {
            protocol: "http:",
            host: "m.kugou.com",
            pathname: "/app/i/singerSong_new.php",
            query: {
                singerID: "",
                page: 1
            }
        },
        //http://m.kugou.com/app/i/getSongInfo.php?hash=dc8b5ecec96436d5c5d8c38240720e81&cmd=playInfo
        music: {
            protocol: "http:",
            host: "m.kugou.com",
            pathname: "/app/i/getSongInfo.php",
            query: {
                cmd: "playInfo",
                hash: "dc8b5ecec96436d5c5d8c38240720e81"
            }
        },
        //http://mobilecdn.kugou.com/new/app/i/search.php?cmd=300&keyword=test&page=1&pagesize=20&outputtype=jsonp&callback=returnSearchData
        search: {
            protocol: "http:",
            host: "mobilecdn.kugou.com",
            pathname: "/new/app/i/search.php",
            query: {
                cmd: 300,
                pagesize: 20,
                keyword: "JEFFY",
                page: 1
            }
        }
    };
module.exports = function (key, query) {
    var urlData = configs[key];
    urlData.query = urlData.query || {};
    _.extend(urlData.query, query);
    return url.format(urlData);
};
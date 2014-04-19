var url = require('url'),
	_ = require("underscore"),
	configs = {
		//http://mobilecdn.kugou.com/new/app/i/search.php?cmd=300&keyword=test&page=1&pagesize=20&outputtype=jsonp&callback=returnSearchData
		//http://mobilecdn.kugou.com/api/v3/search/song?format=jsonp&keyword=%E5%91%A8%E6%9D%B0%E4%BC%A6&page=1&pagesize=10&showtype=1&callback=jsonp4
		search: {
			protocol: "http:",
			host: "mobilecdn.kugou.com",
			pathname: "/api/v3/search/song",
			query: {
				pagesize: 20,
				keyword: "",
				page: 1,
				showtype: 1
			}
		},
		//http://mobilecdn.kugou.com/new/app/i/yueku.php?outputtype=jsonp&cmd=100&cid=21&type=21&page=1&pagesize=1000&callback=jsonp5
		list: {
			protocol: "http:",
			host: "mobilecdn.kugou.com",
			pathname: "/new/app/i/yueku.php",
			query: {
				cmd: 100,
				cid: 21,
				type: 21,
				pagesize: 1000,
				page: 1
			}
		},
		//http://mobilecdn.kugou.com/new/app/i/yueku.php?cmd=101&outputtype=jsonp&cid=-26666&type=-26666&page=1&pagesize=20&callback=jsonp6
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
		//http://mobilecdn.kugou.com/new/app/i/singer.php?cmd=101&outputtype=jsonp&classid=12&page=1&pagesize=10&callback=jsonp7
		singers: {
			protocol: "http:",
			host: "mobilecdn.kugou.com",
			pathname: "/new/app/i/singer.php",
			query: {
				cmd: 101,
				classid: 1,
				page: 1
			}
		},
		//http://mobilecdn.kugou.com/api/v3/singer/song?format=jsonp&singerid=6808&page=1&pagesize=20&callback=jsonp9
		tunes: {
			protocol: "http:",
			host: "mobilecdn.kugou.com",
			pathname: "/api/v3/singer/song",
			query: {
				singerid: "",
				page: 1,
				pagesize: 20
			}
		},
		//http://m.kugou.com/app/i/getSongInfo.php?hash=de5728a56a17bfe5430d1e3746a961c8&cmd=playInfo
		song: {
			protocol: "http:",
			host: "m.kugou.com",
			pathname: "/app/i/getSongInfo.php",
			query: {
				cmd: "playInfo",
				hash: "dc8b5ecec96436d5c5d8c38240720e81"
			}
		},
		//http://m.kugou.com/app/i/krc.php?keyword=%E8%A2%81%E5%A7%97%E5%A7%97+-+%E7%88%B1%E6%88%91&timelength=227&hash=beab322d1dee621667851214879c9069&cmd=100
		lrc: {
			protocol: "http:",
			host: "m.kugou.com",
			pathname: "/app/i/krc.php",
			query: {
				cmd: 100,
				keyword: "",
				timelength: 256000,
				hash: ""
			}
		},
		//http://m.kugou.com/app/i/getSingerHead_new.php?singerName=%E5%BC%A0%E9%9D%93%E9%A2%96
		icon: {
			protocol: "http:",
			host: "m.kugou.com",
			pathname: "/app/i/getSingerHead_new.php",
			query: {
				singerName: "jeffy"
			}
		}
		//http://mobilecdn.kugou.com/api/v3/singer/info?format=jsonp&singerid=3520&callback=jsonp10
	};
module.exports = function (key, query) {
	var urlData = configs[key];
	urlData.query = urlData.query || {};
	_.extend(urlData.query, query);
	return url.format(urlData);
};
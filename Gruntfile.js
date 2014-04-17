"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: ["Gruntfile.js", "public/**/*.js"]
        },
        compass: {
            dist: {
                options: {
                    config: "config.rb"
                }
            }
        },
        clean: {
            build:{
                src:["public/.sass-cache"]
            }
        },
	    watch: {
		    options: {
			    livereload: 35729
		    },
		    files: {
			    files: ['../v3/scr/css/**/*.less', '../v3/scr/js/**/*.js', './htmls/**/*.html']
		    }
	    },
	    connect: {
		    options: {
			    port: 8000,
			    hostname: '*',
			    protocol: 'http',
			    keepalive: true,
			    livereload: true
		    },
		    server: {
			    options: {
				    base: './',
				    open: 'http://127.0.0.1:8000/examples/home/index.html'
			    }
		    },
		    doc: {
			    options: {
				    base: './',
				    open: 'http://127.0.0.1:8000/doc/index.html'
			    }
		    }
	    }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compass");
};
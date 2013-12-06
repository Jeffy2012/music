"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: ["Gruntfile.js", "public/**/*.js"]
        },
        compass: {
            dist: {
                options: {
                    config: "./config.rb"
                }
            }
        },
        clean: {
            build:{
                src:["public/.sass-cache"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compass");
};
module.exports = function (grunt) {
    grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    jasmine_node: {
        options: {
          forceExit: true,
          match: '.',
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec',
          jUnit: {
            report: true,
            savePath : "./build/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
          }
        },
        all: ['*/spec/']
    },
    jasmine: {
      pivotal: {
        src: 'js/*.js',
        options: {
          specs: 'test/spec/*Spec.js',
          helpers: 'js/lib/jquery-1.11.1.js',
          junit: {
            path: 'junit'
          }
        }
      }
    },

    // define source files and their destinations
    uglify: {
        files: { 
            src: 'build/js/*.js',  // source files mask
            dest: '',    // destination folder
            expand: true,    // allow dynamic building
            flatten: false,   // remove all unnecessary nesting
            ext: '.min.js'   // replace .js to .min.js
        }
    },
    watch: {
        js:  { files: 'build/js/*.js', tasks: [ 'uglify' ] }
    },
    concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['js/lib/jquery-1.11.1.js', 'js/Timer.js', 'js/Sudoku.js', 'js/app.js'],
          dest: 'build/js/main.js',
        }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css'],
        dest: 'build/css/',
        ext: '.min.css'
      }
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: 'ischool.berkeley.edu',
          port: 22,
          authKey: 'key1'
        },
        src: 'build',
        dest: '/home/derek/public_html/sudoku',
        exclusions: []
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['*.html'], dest: 'build/', filter: 'isFile'},
        ]
      }
    },
    jshint: {
        all: ['Gruntfile.js', 'js/*.js', 'test/spec/*.js']
    }

});

// load plugins
grunt.loadNpmTasks('grunt-jasmine-node');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jasmine');
grunt.loadNpmTasks('grunt-ftp-deploy');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jshint');


// register at least this one task
grunt.registerTask('test_node', ['jasmine_node']);
grunt.registerTask('default', ['jasmine', 'concat', 'uglify', 'cssmin', 'copy' ]);

};

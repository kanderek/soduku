module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: { 
            src: 'build/js/*.js',  // source files mask
            dest: 'build/js',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.min.js'   // replace .js to .min.js
        }
    },
    watch: {
        js:  { files: 'build/js/*.js', tasks: [ 'uglify' ] },
    },
    concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['js/lib/jquery-1.11.1.js', 'js/Timer.js', 'js/Sudoku.js', 'js/app.js'],
          dest: 'build/js/main.js',
        },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');

// register at least this one task
grunt.registerTask('default', [ 'concat', 'uglify' ]);


};
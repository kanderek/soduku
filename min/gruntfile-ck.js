module.exports=function(s){s.initConfig({pkg:s.file.readJSON("package.json"),jasmine_node:{options:{forceExit:!0,match:".",matchall:!1,extensions:"js",specNameMatcher:"spec",jUnit:{report:!0,savePath:"./build/reports/jasmine/",useDotNotation:!0,consolidate:!0}},all:["*/spec/"]},jasmine:{pivotal:{src:"js/*.js",options:{specs:"test/spec/*Spec.js",helpers:"js/lib/jquery-1.11.1.js",junit:{path:"junit"}}}},uglify:{files:{src:"build/js/*.js",dest:"build/js",expand:!0,flatten:!0,ext:".min.js"}},watch:{js:{files:"build/js/*.js",tasks:["uglify"]}},concat:{options:{separator:";"},dist:{src:["js/lib/jquery-1.11.1.js","js/Timer.js","js/Sudoku.js","js/app.js"],dest:"build/js/main.js"}},cssmin:{minify:{expand:!0,cwd:"css/",src:["*.css"],dest:"build/css/",ext:".min.css"}},"ftp-deploy":{build:{auth:{host:"ischool.berkeley.edu",port:22,authKey:"key1"},src:"build",dest:"/home/derek/public_html/sudoku",exclusions:[]}},copy:{main:{files:[{expand:!0,src:["*.html"],dest:"build/",filter:"isFile"}]}}}),s.loadNpmTasks("grunt-jasmine-node"),s.loadNpmTasks("grunt-contrib-watch"),s.loadNpmTasks("grunt-contrib-uglify"),s.loadNpmTasks("grunt-contrib-concat"),s.loadNpmTasks("grunt-contrib-cssmin"),s.loadNpmTasks("grunt-contrib-jasmine"),s.loadNpmTasks("grunt-ftp-deploy"),s.loadNpmTasks("grunt-contrib-copy"),s.registerTask("test_node",["jasmine_node"]),s.registerTask("default",["jasmine","concat","uglify","cssmin","copy","ftp-deploy"])};
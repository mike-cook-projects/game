// Gulp Plugins
var gulp        = require('gulp');
var clean       = require('gulp-clean');        // deleting files
var rimraf      = require('gulp-rimraf');       // deleting folders
var using       = require('gulp-using');        // dev tool, console log what files gulp is reading
var inject      = require("gulp-inject");       // insert content into a file
var rename      = require("gulp-rename");       // rename a file
var html2js     = require('gulp-html2js');      // compile templates for ng template cache
var ngHtml2Js   = require("gulp-ng-html2js");
var order       = require("gulp-order");        // makes sure files are loaded in correct order
var concat      = require('gulp-concat');       // concatinates files
var ngmin       = require('gulp-ngmin');        // converts function injection names to array syntax
var uglify      = require('gulp-uglify');      // minifies

// Other node moduals
var runSequence = require('run-sequence');      // makes sure functions run in order, by default, gulp is async
var files       = require('./gulp.config.js');  // holds lots of file paths
var child_proc  = require('child_process');     // needed for local server
var spawn       = child_proc.spawn;
var node;

// Task to run during development
gulp.task('dev', function(callback) {
   runSequence(
    'default',
    'server',
    'watch',
    callback);
});

// task that runs when gulp is run with no arguments
gulp.task('default', function(callback) {
  runSequence('cleanAndBuild',
    'karmaconfig',
    callback);
});

// copies everything over to build directory. deletes previous build directory
gulp.task('cleanAndBuild', function(callback) {
  runSequence('clean',
    'copy-build',
    'copy-vendor-js',
    'copy-css',
    'html2js',
    'index',
    'karmaconfig',
    'production-dev',
    'production-min',
    callback);
});

gulp.task('clean', function() {
  return gulp.src('./build', {
    read: false
  })
    .pipe(rimraf({
      force: true
    }));
});

gulp.task('copy-build', ['copy-css', 'copy-app-js', 'copy-vendor-js'/*, 'copy-dapper-test'*/]);

gulp.task('copy-css', function() {
  return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-app-js', function() {
  return gulp.src(files.app_files.js)
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-vendor-js', function() {
  return gulp.src(files.vendor_files.js, {
    cwd: 'vendor/**'
  })
  //.pipe(order(files.vendor_files.js))
  .pipe(gulp.dest('./build/vendor'));
});

// assembles angular templates into a template cache
gulp.task('html2js', function() {
  return gulp.src(files.app_files.atpl)
    .pipe(ngHtml2Js({
      moduleName: "templates",
      rename: function(url) {
        return url.replace('.tpl.html', '.html');
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest("./build/app"));
});

gulp.task('index', function(){
  gulp.src(['./src/index_top.html',
            './src/app/*.html',
            './src/index_bottom.html'])
  .pipe(concat('index.html'))
  .pipe(inject(gulp.src(files.app_files.tpl_src, {
      read: false
    }), {
      ignorePath: '/build/'
    }))
  .pipe(gulp.dest("./build"));

});

gulp.task('karmaconfig', function() {
  return gulp.src('./karma/karma-unit.tpl.js')
    .pipe(inject(gulp.src(['./build/vendor/**/*.js', './build/app/**/*.js'], {
      read: false
    }), {
      starttag: '//inject',
      endtag: '//endinject',
      addRootSlash: false,
      transform: function(filepath, file, i, length) {
        return "'" + filepath + "',";
      }
    }))
    .pipe(rename('karma-unit.js'))
    .pipe(gulp.dest('./build'));

});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(files.vendor_files.js, ['cleanAndBuild']);
  gulp.watch(files.app_files.js, ['cleanAndBuild']);
  gulp.watch('./src/**/*.html', ['cleanAndBuild']);
  gulp.watch('./src/**/*.css', ['cleanAndBuild']);
});

// used for running the app node server
gulp.task('server', function() {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['./server/server.js'], {
    stdio: 'inherit'
  });
  node.on('close', function(code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('production-dev', function(){
  return gulp.src('./build/app/**/*.js')
    .pipe(concat('game.dev.js'))
    .pipe(gulp.dest("./build/"))
    .pipe(gulp.dest("./"))
    ;
});

gulp.task('production-min', function(){
  return gulp.src('./game.dev.js')
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(rename('game.min.js'))
    .pipe(gulp.dest("./build/"))
    .pipe(gulp.dest("./"))
    ;
});

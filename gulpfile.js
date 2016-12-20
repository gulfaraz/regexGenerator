var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var config = {
    "bower" : "bower_components",
    "src" : "public/src",
    "dest" : "public/dist",
    "debug" : !(process.env.APPLICATION_ENVIRONMENT === 'production')
};

gulp.task('bower', function (cb) {
    require('child_process').exec('bower-installer', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('lint', function() {
    return gulp.src([
        config.src + '/sandbox/**/*.js',
        './routes/**/*.js'
        ])
    .pipe(plugin.jshint())
    .pipe(plugin.jshint.reporter('default'));
});

gulp.task('sass', function() {
    return gulp.src([config.src + '/**/*.scss', '!' + config.src + '/sandbox/common/variables.scss', '!' + config.src + '/sandbox/common/mixins.scss'])
    .pipe(plugin.if(config.debug, plugin.sourcemaps.init()))
    .pipe(plugin.sass())
    .pipe(plugin.autoprefixer({
        'browsers' : ['last 2 versions'],
        'cascade' : false
    }))
    .pipe(plugin.cleanCss())
    .pipe(plugin.rename('main.css'))
    .pipe(plugin.if(config.debug, plugin.sourcemaps.write()))
    .pipe(gulp.dest(config.dest + '/css'))
    .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task('markup', function() {
    return gulp.src(['./public/index.html', config.src + '/**/*.html'])
    .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task('scripts', function() {
  return gulp.src([
        config.src + '/lib/angular/angular.js',
        config.bower + "/ace-builds/src-min-noconflict/ace.js",
        config.src + '/lib/**/*.js',
        config.src + '/sandbox/*.js',
        config.src + '/sandbox/**/*.js'
        ])
    .pipe(plugin.if(config.debug, plugin.sourcemaps.init()))
    .pipe(plugin.concat('main.js'))
    .pipe(plugin.uglify())
    .pipe(plugin.if(config.debug, plugin.sourcemaps.write()))
    .pipe(gulp.dest(config.dest + '/js'))
    .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task('watch', ['express'], function () {
    plugin.livereload.listen();
    gulp.watch(config.src + '/**/*.js', ['lint', 'scripts']);
    gulp.watch(config.src + '/**/*.scss', ['sass']);
    gulp.watch(['./public/index.html', config.src + '/**/*.html'], ['markup']);
});

gulp.task('express', ['lint', 'sass', 'scripts'], function () {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname + '/public/dist'), require('./routes/routes')(express));
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
    app.listen(8080);
});

gulp.task('default', function () {
    return (config.debug) ? ['watch'] : ['express'];
}());

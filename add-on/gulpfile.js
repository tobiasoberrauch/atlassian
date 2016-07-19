var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('buffer');
var uglify = require('gulp-uglify');

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
    var properties = {
        entries: ['./public/js/' + file],
        debug: true,
        sourceType: 'module',
        transform: [babelify]
    };
    var bundler = watch ? watchify(browserify(properties)) : browserify(properties);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', handleErrors)
            .pipe(source(file))
            .pipe(gulp.dest('./build/'));
    }

    bundler.on('update', function () {
        rebundle();

        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}

gulp.task('scripts', function () {
    return buildScript('application.js', false);
});

gulp.task('dist', function () {
    browserify({
        entries: ['public/src/js/application.js'],
        extensions: ['.js'],
        debug: true
    })
        .transform(babelify, {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('watchify', function () {
    var args = watchify.args;
    args.debug = true;
    var bundler = watchify(browserify('public/src/js/application.js', args))
        .transform(babelify, {
            presets: ['es2015']
        });
    bundle_js(bundler);

    bundler.on('update', function () {
        bundle_js(bundler)
    })
});

function bundle_js(bundler) {
    return bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('public/src/js/application.js'))
        // .pipe(buffer())
        .pipe(gulp.dest('public/dist/js'))
        // .pipe(sourcemaps.init({
        //     loadMaps: true
        // }))
        .pipe(uglify())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/js'))
}

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['scripts'], function () {
    return buildScript('application.js', true);
});
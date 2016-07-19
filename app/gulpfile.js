
var gulp = require('gulp');
var inject = require('gulp-inject');
var getBowerAssets = require('main-bower-files');
var getMainAssets = function  () {
    return [
        'module/**/src/**/*.js'
    ];
};

gulp.task('default', function () {
    var target = gulp.src('index.html');
    var sources = gulp.src(getBowerAssets(), {read: false});

    return target
        .pipe(inject(sources, {
            name: 'bower',
            addRootSlash: false
        }))
        // .pipe(inject(gulp.src(assets), {
        //     addRootSlash: false
        // }))
        .pipe(gulp.dest('.'));
});
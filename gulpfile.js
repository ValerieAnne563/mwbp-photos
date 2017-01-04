var gulp = require('gulp');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');
const logger = require('log4js').getLogger();

gulp.task('bundle', function() {
    return browserify({
        entries: './server/server.js',
        debug: true
    }, function(){
        logger.info("done...")
    });
});

gulp.task('default', ['bundle'], function() {
    logger.info('Server started...');
});

gulp.task('watch', ['default'], function() {
    return nodemon({
        script: './server/server.js',
        watch: ['server/']
    });
});
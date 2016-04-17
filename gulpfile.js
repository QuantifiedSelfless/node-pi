var gulp = require('gulp');

gulp.task('build', function () {
    gulp.src('src/html/index.html')
        .pipe(gulp.dest('./'));
    gulp.src('src/css/login.css')
        .pipe(gulp.dest('static/css'));
});

gulp.task('default', ['build']);

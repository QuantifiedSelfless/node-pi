var gulp = require('gulp');

gulp.task('build', function () {
    gulp.src('src/html/index.html')
        .pipe(gulp.dest('./'));
    gulp.src('src/css/login.css')
        .pipe(gulp.dest('static/css'));
});

gulp.task('build-romance', function () {
    gulp.src('src/html/romance/index.html')
        .pipe(gulp.dest('./'));
    gulp.src('src/css/romance/login.css')
        .pipe(gulp.dest('static/css'));
    gulp.src('src/js/romance/login.js')
        .pipe(gulp.dest('static/js'));
});

gulp.task('build-tracked', function () {
    gulp.src('src/js/tracked/login.js')
        .pipe(gulp.dest('static/js'));
});

gulp.task('default', ['build']);

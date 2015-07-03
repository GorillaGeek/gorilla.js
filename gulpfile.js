// Include gulp
var gulp = require("gulp"); 

// Include Our Plugins
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var sourcemaps = require("gulp-sourcemaps");

var jsFiles = [
    "lib/foolproof/jquery.validate.unobtrusive.foolproof.js",
    "src/*.js"
];

gulp.task("clean", function() {
    return gulp.src(["dist/gorilla.utilities.min.js"], {read: false})
        .pipe(clean({force: true}));
});

gulp.task("lint", function() {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("minify", ["lint"], function() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("gorilla.utilities.min.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
    gulp.watch(jsFiles, ["minify"]);
});

// Default Task
gulp.task("default", ["minify"]);

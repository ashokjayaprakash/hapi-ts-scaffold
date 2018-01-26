const gulp = require('gulp');
const lab = require('gulp-lab');
const rimraf = require('gulp-rimraf');
const nodemon = require("gulp-nodemon");
const gulpNSP = require('gulp-nsp');
const npmcheck = require('gulp-npm-check');
const tslint = require("gulp-tslint");
const gulpEnv = require("gulp-env");
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');

//This set the environment variable for testing
gulp.task('set-env', function() {
    gulpEnv({
        vars: {
            "DEPLOY_MODE": "development",
            "PORT": "3000",
            "LOCATION_HOST": "",
            "APP_LOG_PATH": "/var/opt/logs/"
        }
    })
});

// This runs lint through the code.
gulp.task('lint', function () {
    return gulp.src('app/**/*.ts', {base: '.'})
        .pipe(tslint({
            configuration: 'tslint.json'
        }))
        .pipe(tslint.report({
            allowWarnings: true
        }))
});

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
    return gulp.src("build", { read: false })
        .pipe(rimraf());
});

// Compile ts to js
gulp.task('compile', function () {
    let tsResult= gulp.src("app/**/*.ts") // or tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('build'));
});

// Build project
gulp.task('build', ["check-dependencies-are-upto-date", "check-for-vulnerabilities-in-libs", "clean", "compile"], function () {
    return gulp.src(["app/**/*.json", "src/**/*.html"])
        .pipe(gulp.dest("build"));
});

// Checks if the dependencies are outdated.
gulp.task('check-dependencies-are-upto-date', function (cb) {
    return npmcheck({throw: false}, cb);
});

//Unit testing with code coverage
gulp.task('test',['set-env', 'compile'], (cb) => {
    return gulp.src(['build/test/**/*.js'])
    .pipe(lab('-v -c -S --coverage-exclude build/test'))
    .pipe(lab('-r html -o reports/coverage.html -r lcov -o reports/lcov.dat'))
    .once('error', (error) => {
        process.exit(1);
    })
    .once('end', () => {
        process.exit();
    });
});

// Checks if any security voilations are there.
gulp.task('check-for-vulnerabilities-in-libs', function (cb) {
    return gulpNSP({package: __dirname + '/package.json', stopOnError: true, output: 'summary'}, cb);
});

// To watch the ts changes
gulp.task('watch',['compile'], function() {
    gulp.watch('app/**/*.ts', ['compile']);
})

// This is to be used only for local
gulp.task("serve", ["set-env", "watch"], () => {
    nodemon({
        script: "build/server.js"
    }).on("restart", () => {
        console.log("restarted");
    })
});
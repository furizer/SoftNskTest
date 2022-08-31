const

    fs = require('fs'),

    del = require('del'),

    uniqid = require('uniqid'),

    async = require('async'),

    gulp = require('gulp'),

    sass = require('gulp-sass')(require('sass')),

    pug = require('gulp-pug'),

    coffee = require('gulp-coffee'),

    autoprefixer = require('gulp-autoprefixer'),

    concatCss = require('gulp-concat-css'),

    minifyCss = require('gulp-clean-css'),

    concatJs = require('gulp-concat'),

    minifyJs = require('gulp-minify');


const build = {

    ext: {
        shema: '.pug',
        style: '.scss',
        style2: '.css',
        script: '.coffee',
        script2: '.js'
    },

    paths: {
        dev: {
            path: './src',
            folders: {
                images: '/images/',
                fonts: '/fonts/',
                shema: '/pug/',
                style: '/sass/',
                style2: '/css/',
                script: '/coffee/',
                script2: '/js/'
            }
        },
        prod: {
            path: './dist',
            files: {
                style: 'project.css',
                script: 'project.js'
            },
            folders: {
                images: '/images/',
                fonts: '/fonts/',
                shema: '/html/',
                style: '/css/',
                script: '/js/'
            }
        },

    },

    error: (error) => {

        console.error(error);

    },
    shema: (prod = false) => {

        if (prod == false) {

            gulp
                .src(build.paths.dev.path + '/**/*' + build.ext.shema)
                .pipe(pug().on('error', build.error))
                .pipe(gulp.dest(build.paths.prod.path + build.paths.prod.folders.shema))
        }

        return (gulp
            .src(build.paths.dev.path + '/*' + build.ext.shema)
            .pipe(pug().on('error', build.error))
            .pipe(gulp.dest(build.paths.prod.path))
        )

    },
    style: (prod = false) => {

        let tmp_path = './tmp_style/'

        let style2_files = build.paths.dev.path + build.paths.dev.folders.style2 + '/*' + build.ext.style2,
            style_files = build.paths.dev.path + build.paths.dev.folders.style + '/*' + build.ext.style

        let tmp_style2_name = uniqid() + build.ext.style2,
            tmp_style_name = uniqid() + build.ext.style2

        return async.series([
            (next) => {

                gulp
                    .src(style2_files, { "allowEmpty": true })
                    .pipe(concatCss(tmp_style2_name))
                    .pipe(gulp.dest(tmp_path))
                    .on('end', next)

            }, (next) => {

                gulp.src(style_files, { "allowEmpty": true })
                    .pipe(sass().on('error', build.error))
                    .pipe(concatCss(tmp_style_name))
                    .pipe(gulp.dest(tmp_path))
                    .on('end', next)

            }, () => {

                gulp.src([tmp_path + tmp_style2_name, tmp_path + tmp_style_name], { "allowEmpty": true })
                    .pipe(autoprefixer('last 100 versions'))
                    .pipe(concatCss(build.paths.prod.files.style))
                    .pipe(gulp.dest(build.paths.prod.path))
                    .on('end', function() {
                        del(tmp_path, { force: true })
                    })

            }
        ])

    },
    script: (prod = false) => {

        let tmp_path = './tmp_script/'

        let script2_files = build.paths.dev.path + build.paths.dev.folders.script2 + '/*' + build.ext.script2,
            script_files = build.paths.dev.path + build.paths.dev.folders.script + '/*' + build.ext.script

        let tmp_script2_name = uniqid() + build.ext.script2,
            tmp_script_name = uniqid() + build.ext.script2

        return async.series([
            (next) => {

                gulp
                    .src(script2_files, { "allowEmpty": true })
                    .pipe(concatJs(tmp_script2_name))
                    .pipe(gulp.dest(tmp_path))
                    .on('end', next)

            }, (next) => {

                gulp
                    .src(script_files, { "allowEmpty": true })
                    .pipe(coffee().on('error', build.error))
                    .pipe(concatJs(tmp_script_name))
                    .pipe(gulp.dest(tmp_path))
                    .on('end', next)

            }, () => {

                gulp
                    .src([tmp_path + tmp_script2_name, tmp_path + tmp_script_name], { "allowEmpty": true })
                    .pipe(concatJs(build.paths.prod.files.script))
                    .pipe(gulp.dest(build.paths.prod.path))
                    .on('end', function() {
                        del(tmp_path, { force: true })
                    })

            }
        ])


    },
    images: (prod = false) => {

        return (

            gulp.src(build.paths.dev.path + build.paths.dev.folders.images + '*')

            .pipe(gulp.dest(build.paths.prod.path + build.paths.prod.folders.images))

        )

    },
    fonts: (prod = false) => {

        return (

            gulp.src(build.paths.dev.path + build.paths.dev.folders.fonts + '/*')

            .pipe(gulp.dest(build.paths.prod.path + build.paths.prod.folders.fonts))

        )

    },

    init: (cb) => {

        if (build.paths.dev.path != undefined) {

            let path = build.paths.dev.path

            fs.mkdir(path, {}, (error) => {

                if (!error) {

                    if (build.paths.dev.folders != undefined) {

                        let folders = build.paths.dev.folders

                        for (let index in folders) {

                            let path_folder = path + folders[index]

                            fs.mkdir(path_folder, {}, (error) => {

                                if (!error) {
                                    if (build.ext[index] != undefined) {

                                        let ext = build.ext[index],
                                            ext_folders = ['includes', 'libs'],
                                            ext_files = ['index', 'config'];

                                        if (index == 'style2' || index == 'script2') {

                                            delete ext_folders[0]

                                            delete ext_folders[1]

                                            delete ext_files[1]

                                        }

                                        if (ext_folders.length > 0) {

                                            ext_folders.forEach((value) => {

                                                fs.mkdir(path_folder + value, {}, (error) => {

                                                    if (error)
                                                        build.error(error)

                                                })

                                            })

                                        }

                                        if (ext_files.length > 0) {

                                            ext_files.forEach((value) => {

                                                if (index == 'shema' && value == 'index') {

                                                    fs.open(path + '/' + value + ext, 'w', (error) => {

                                                        if (error)
                                                            build.error(error)

                                                    })

                                                } else {

                                                    fs.open(path_folder + value + ext, 'w', (error) => {

                                                        if (error)
                                                            build.error(error)

                                                    })

                                                }

                                            })

                                        }

                                    }

                                } else build.error(error)

                            })

                        }

                    }

                } else build.error(error)

            })

        }

        cb()

    },
    build: (cb) => {

        if (process.title != undefined) {

            let watch = process.title.indexOf('watch') + 1,
                dev = process.title.indexOf('dev') + 1,
                prod = process.title.indexOf('prod') + 1

            if (prod != 0) prod = true
            else prod = false

            if (dev != 0 || prod != 0)
                del(build.paths.prod.path + '/**', { force: true })

            build.shema(prod)

            build.style(prod)

            build.script(prod)

            build.fonts(prod)

            build.images(prod)

            if (watch == 0)
                cb()

        } else build.error('process.title undefined')

    },
    watch: () => {

        gulp.watch(build.paths.dev.path + '/**/*', {}, (cb) => {

            build.build()

            cb()

        });

    }
}

exports.init = build.init

exports.watch = build.watch

exports.dev = build.build

exports.prod = build.build

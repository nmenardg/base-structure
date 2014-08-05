module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(
        grunt.loadNpmTasks
    );

    var config = {
        basePath: 'app',
        jsSrc: 'app/assets/js/src',
        jsDest: 'app/assets/js/dest',
        cssSrc: 'app/assets/css/src',
        cssDest: 'app/assets/css/dest',
        htmlFileExtension: 'html',
        cacheBreaker: '<%= ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString()) %>',
        banner: '<%= pkg.name %> - <%= pkg.version %>\n' +
                '<%= pkg.author.name %> - <%= pkg.author.url %>\n' +
                'Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %>'
    };

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        banner: '<%= config.banner %>',
        autoprefixer: {
            files: {
                options: {
                    browsers: [
                        'last 2 version',
                        'safari 6',
                        'ie 9',
                        'opera 12.1',
                        'ios 6',
                        'android 4',
                        'Firefox ESR'
                    ]
                },
                expand: true,
                flatten: true,
                src: '<%= config.cssDest %>/*.css',
                dest: '<%= config.cssDest %>'
            }
        },
        csswring: {
            min: {
                options: {
                    map: true,
                    preserveHacks: true,
                    banner: '<%= config.banner %>'
                },
                expand: true,
                flatten: true,
                src: '<%= config.cssDest %>/*.css',
                dest: '<%= config.cssDest %>/'
            }
        },
        jshint: {
            files: ['<%= config.jsSrc %>/**/*.js'],
            options: {
                force: true
            }
        },
        replace: {
            cache_break: {
                src: ['<%= config.basePath %>/*.<%= config.htmlFileExtension %>'],
                overwrite: true,
                replacements: [
                    {
                        from: /cacheBreak: \".*\"/g,
                        to: 'cacheBreak: "<%= config.cacheBreaker %>"'
                    },
                    {
                        from: /\.css.*/g,
                        to: '.css?v=<%= config.cacheBreaker %>"/>'
                    },
                    {
                        from: /\.js.*?"/g,
                        to: '.js?v=<%= config.cacheBreaker %>"'
                    }
                ]
            },
            'scss_import_path': {
                src: ['<%= config.cssDest %>/*.scss'],
                overwrite: true,
                replacements: [
                    {
                        from: /\\/g,
                        to: '/'
                    }
                ]
            }
        },
        sass: {
            options: {
                sourceComments: 'map',
                sourceMap: 'sass'
            },
            dist: {
                files: {
                    '<%= config.cssDest %>/main.css': '<%= config.cssDest %>/main.scss'
                }
            }
        },
        sass_imports: {
            imports: {
                src: ['<%= config.cssSrc %>/helpers/vars.scss', '<%= config.cssSrc %>/helpers/*.scss', '<%= config.cssSrc %>/**/*.scss'],
                dest: '<%= config.cssDest %>/main.scss'
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.jsSrc %>',
                    src: '**/*.js',
                    dest: '<%= config.jsDest %>'
                }]
            }
        },
        watch: {
            js: {
                files: ['<%= config.jsSrc %>/**/*.js'],
                tasks: ['build:js']
            },
            sass: {
                files: ["<%= config.cssSrc %>/**/*.scss"],
                tasks: ['build:css']
            },
            options: {
                spawn: true
            }
        }
    });

    grunt.registerTask('default', ['build:js', 'build:css', 'replace:cache_break', 'watch']);
    grunt.registerTask('deploy', ['build:js', 'build:css', 'replace:cache_break']);

    grunt.registerTask('build:css', ['sass_imports', 'replace:scss_import_path', 'sass', 'autoprefixer', 'csswring']);
    grunt.registerTask('build:js', ['jshint', 'uglify']);
};
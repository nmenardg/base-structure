module.exports = function(grunt) {
	var config = {
		jsSrc: 'app/assets/js/src',
		jsDest: 'app/assets/js/dest',
		cssSrc: 'app/assets/css/src',
		cssDest: 'app/assets/css/dest'
	};

	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.name %> - <%= pkg.version %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author.name %> - <%= pkg.author.url %> */\n\n',
		autoprefixer: {
			single_file: {
				options: {
					browsers: ['last 3 version', '> 1%', 'ie 8']
				},
				src: '<%= config.cssDest %>/main.css',
				dest: '<%= config.cssDest %>/main.css'
			}
		},
		cssmin: {
			options: {
				banner: '<%= banner %>'
			},
			files: {
				src: '<%= config.cssDest %>/main.css',
				dest: '<%= config.cssDest %>/main.css'
			}
		},
		jshint: {
			files: ['<%= config.jsSrc %>/**/*.js'],
			options: {
				force: true
			}
		},
		sass: {
			dist: {
				files: [{
					src: '<%= config.cssSrc %>/main.scss',
					dest: '<%= config.cssDest %>/main.css'
				}]
			}
		},
		watch: {
			js: {
				files: ['<%= config.jsSrc %>/**/*.js'],
				tasks: ['jshint']
			},
			sass: {
				files: ["<%= config.cssSrc %>/**/*.scss"],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'sass', 'autoprefixer', 'cssmin', 'watch']);
};
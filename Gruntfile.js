
module.exports = function(grunt) {
	'use_strict';
	
	grunt.initConfig({
		
		// Plugin name
		pluginName: 'AsfAnimation',
		
		// js file name
		jsSrcFileName: 'jquery-<%= pluginName %>.js';
		jsMinFileName: 'jquery-<%= pluginName %>.min.js';
	
		// css file name
		cssSrcFileName: 'jquery-<%= pluginName %>.css';
		cssMinFileName: 'jquery-<%= pluginName %>.min.css';
	
		// Path to the output directory where files are created
		distPath: 'dist',
		
		// Path to the jquery-asfPreload.less file
		LessFile: 'less/jquery-<%= pluginName %>.less',
		
		// Load package.json file in config
		pkg: grunt.file.readJSON('package.json'),
		
		// Files banner model
		banner: '/*!\n' +
            ' * Artscore Studio <%= pluginName %> jQuery Plugin v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
            ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
            ' */\n',
            
       // Code insert at the top of generated js files when necessary
       jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("<%= pluginName %> requires jQuery") }\n\n',
       
        // grunt-contrib-clean delete all files defined in the configuration below 
        clean: {
        	options: {
        		force: false, // Because my dist directory is outside the current working dir. If yours not, set to false. !! Use with caution !!
        	},
        	dist: ['<%= distPath %>/*'] // Here grun-contrib-clean remove dist folder
        },
        	
		// grunt-contrib-concat concatenate all files defined in the configuration below
		concat: {
			options: {
				// Add banner according to the general model and jqueryCheck command defined at the top of this file.
				banner: '<%= banner %>\n<%= jqueryCheck %>',
				
				// Strip javascript banner comments from source files
				stripBanners: false
			},
			// Creating jquery-asfPreload.js file
			asfPlugin: {
				src: [
				  jsSrcFileName
				],
				dest: '<%= distPath %>/js/<%= jsSrcFileName %>'
			}
		},
		
		// grunt-contrib-uglify minify all files defined in the configuration below.
		uglify: {
			// jquery-asfPreload.min.js file
			asfpreload: {
				options: {
					// Add banner according to the general model defined at the top of this file.
					banner: '<%= banner %>\n',
					
					// Choice false: report nothing / min: report minify process / gzip : report gzip process 
					report: 'min'
				},
				src: ['<%= concat.asfPlugin.dest %>'],
				dest: '<%= distPath %>/js/<%= jsMinFileName %>'
			}
		},
		
		// grunt-contrib-less compile all less files to CSS files defined in the configuration below
		less: {
			// jquery-asfPreload.css file
			compileCore: {
				options: {
					strictMath: true
				},
				// output file : source file
				files: {
					'<%= distPath %>/css/<%= cssSrcFileName %>' : '<%= LessFile %>'
				}
			},
			// Minify all files listed above
			minify: {
				options: {
					cleancss: true, // Use grunt-contrib-cssmin for minifying CSS files
					report: 'min'
				},
				files: {
					'<%= distPath %>/css/<%= cssMinFileName %>' : '<%= distPath %>/css/<%= cssSrcFileName %>'
				}
			}
		},
		
		// grunt-banner adds a simple banner to a file. Here we use this for add banner to CSS files
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [
					    '<%= distPath %>/css/<%= cssSrcFileName %>',
					    '<%= distPath %>/css/<%= cssMinFileName %>',
					]
				}
			},
		},
		
		// grunt-csscomb sort CSS properties in specific order
		csscomb: {
			sort: {
				options: {
					config: 'less/.csscomb.json' // Path to the file containing csscomb options
				},
				files: {
					'<%= distPath %>/css/<%= cssSrcFileName %>': ['<%= distPath %>/css/<%= cssSrcFileName %>'],
				}
			}
		},
		
		// grunt-contrib-watch run predefined tasks whenever watched file patterns are added, changed or deleted.
		watch: {
			less: {
				files: '<%= less/*.less %>',
				tasks: ['dist-css']
			},
			js: {
				files: '<%= js/*.js %>',
				tasks: ['dist-js']
			}
		}
	});
	
	// Load plugins
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
	
	// This tasks is for customize LESS files used in LESS compilation
	grunt.registerTask('check-less-paths', 'Check custom configuration for less files paths', function(){
		if (grunt.file.exists('custom-less-paths.json')) {
			customLessPaths = grunt.file.readJSON('custom-less-paths.json');
			grunt.config('LessFile', customLessPaths.LessFile);
		}
	});
	
	// JS distribution task
	grunt.registerTask('dist-js', ['concat', 'uglify']);
	
	// CSS distribution task
	grunt.registerTask('dist-css', ['check-less-paths', 'less', 'csscomb', 'usebanner']);
	
	// Full distribution task
	grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);
	
	// Default task
	grunt.registerTask('default', ['dist']);
	
	// Travis Task
	//grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('test', ['jshint']);
};
/* jshint node: true */
module.exports = function(grunt) {

    grunt.initConfig({

        npmPackage: grunt.file.readJSON('package.json'),
        bowerPackage: grunt.file.readJSON('bower.json'),

        eslint: {
            options: {
                configFile: '.eslintrc.js'
            },
            target: ['src/**/*.js', 'Gruntfile.js']
        },

        uglify: {
            min: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist',
                    ext: '.min.js'
                }],
                options: {

                }
            }
        },

        copy: {
            jsFiles: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        },

        sass: {
            min: {
                files: {
                    'dist/simpleLightbox.min.css': 'src/simpleLightbox.scss'
                },
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    precision: 5
                }
            },
            expanded: {
                files: {
                    'dist/simpleLightbox.css': 'src/simpleLightbox.scss'
                },
                options: {
                    outputStyle: 'expanded',
                    sourceMap: false,
                    precision: 5
                }
            }
        },

        includereplace: {
            dist: {
                options: {
                    globals: {
                        repositoryUrl: '<%= npmPackage.repository.url %>',
                        npmRepositoryName: '<%= npmPackage.name %>',
                        bowerRepositoryName: '<%= bowerPackage.name %>'
                    },
                    prefix: '{{ ',
                    suffix: ' }}'
                },
                src: 'demo/index.html',
                dest: 'index.html'
            }
        },

        bump: {
            options: {
                files: ['package.json', 'package-lock.json'],
                commitFiles: ['package.json', 'package-lock.json'],
                tagName: '%VERSION%',
                push: false
            }
        },

        watch: {
            jsFiles: {
                expand: true,
                files: ['src/**/*.js', 'Gruntfile.js'],
                tasks: ['eslint', 'copy', 'uglify'],
                options: {
                    spawn: false
                }
            },
            cssFiles: {
                expand: true,
                files: ['src/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            demoFiles: {
                expand: true,
                files: ['demo/**/*.html'],
                tasks: ['includereplace'],
                options: {
                    spawn: false
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['eslint', 'uglify', 'copy', 'sass', 'includereplace']);

};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint : {
            files: ['Gruntfile.js', 'powernode.js'],
            options: {
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        nodeunit: {
            all: ['test/*.js'],
            options: {
                reporter: 'junit',
                reporterOptions: {
                    output: 'outputdir'
                }
            }
        },

        clean: {
            hooks: ['.git/hooks/pre-commit']
        },
        shell: {
            hooks: {
                command: 'cp git-hooks/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    // Custom tasks
    grunt.registerTask('say-start', 'Task that prints a nice message to the console after tests.', function() {
        grunt.log.writeLn('Linting and unit-testing code...');
    });
    grunt.registerTask('say-end', 'Task that prints a nice message to the console before tests.', function() {
        grunt.log.writeLn('Code looks all good! Committing...');
    });

    // Command line tasks
    grunt.registerTask('default', []);
    grunt.registerTask('test', ['say-start', 'jshint', 'nodeunit', 'say-end']);
    grunt.registerTask('setup', ['clean:hooks', 'shell:hooks']);
};

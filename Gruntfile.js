module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    source_files: ['src/init.js', 'src/models.js', 'src/collections.js', 'src/views.js', 'src/main.js'],
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: '<%= source_files %>',
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/<%= pkg.name %>-<%= pkg.version %>-min.js': '<%= source_files %>',
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['concat']);

  grunt.registerTask('dist', ['uglify']);

};

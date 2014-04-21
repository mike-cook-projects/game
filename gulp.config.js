module.exports = {

  build_dir: 'build',
  compile_dir: 'bin',
  bundle: this.build_dir + '/bundle.js',

  app_files: {
    // source, but NO specs
    js: ['src/**/*.js', '!src/**/*.spec.js', '!src/modules/**/*.js'],
    modules: ['src/modules/**/*.js'],
    jsunit: ['src/**/*.spec.js'],
    // our partial templates
    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],
    tpl_src: ["./build/vendor/**/*.js", "./build/app/**/*.js", "./build/css/**/*.css"],
    // the index.html
    html: ['src/index.html'],
    less: 'src/less/main.less',
    styles: ['src/less/**/*.less'],
    //assets
    assets: ['./src/assets/**/*']

  },

  test_files: {
    js: [
      'vendor/jquery/jquery.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/jasmine-jquery/lib/jasmine-jquery.js'
    ]
  },

  vendor_files: {
    // the vendor/ needs to be prefixed by the task
    js: [
      'lodash/dist/lodash.underscore.js',
      'moment/moment.js',
      'angular/angular.js',
      'angular-cookies/angular-cookies.js',
      'angular-sanitize/angular-sanitize.js',
      'angular-moment/angular-moment.js',
      'angular-ui-router/release/angular-ui-router.js',
      'mixin/object-mixin.js'
    ],
    css: [

    ],
    assets: [
      'vendor/strobe/**/*'
    ]
  }
};
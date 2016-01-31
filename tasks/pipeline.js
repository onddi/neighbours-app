/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/**/*.css',
  'fonts/MaterialIcons.css',
  'styles/app.css',
  'styles/materialize.min.css',
  'styles/easycal.css',
  'styles/angucomplete-alt.css',
  /*'css/app.css',
  'css/materialize.min.css',
  'css/easycal.css',
  'css/angucomplete-alt.css',*/
  //'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Dependencies like jQuery, or Angular are brought in here
  'js/dependencies/jquery.js',
  'js/dependencies/angular.js',
  'js/dependencies/angular-resource.min.js',
  'js/dependencies/angular-route.js',
  'js/dependencies/angular-toastr.js',
  'js/dependencies/sails.io.js',
  'js/dependencies/materialize.min.js',
  'js/dependencies/angular-materialize.js',
  'js/dependencies/moment.min.js',
  'js/dependencies/less.min.js',
  'js/dependencies/compareTo.module.js',
  'js/dependencies/underscore-min.js',
  'js/dependencies/easycal.js',
  'js/dependencies/angucomplete-alt.min.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/public/signup/SignupModule.js',
  'js/public/landingpage/LandingpageModule.js',
  'app.js',
  'js/private/view1/view1.js',
  'js/private/view2/view2.js',
  'js/private/view3/view3.js',
  'js/private/view4/view4.js',
  'js/private/view5/view5.js',
  'js/private/view6/view6.js',
  'js/shared/backend.js',
  'js/shared/userservice.js',
  'js/shared/guidgenerator.js',
  'js/shared/saunaservice.js',
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});

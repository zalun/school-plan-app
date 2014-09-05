module.exports = function(config){
  config.set({
    basePath: '.',

    files : [
      'bower_components/platform/platform.js',
      'test/browser.js',
      {pattern: 'src/*', watched: true, included: false, served: true}
    ],

    autoWatch : true,

    frameworks: ['mocha', 'chai'],

    browsers : ['Firefox'],

    plugins : [
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-chai',
    ],
  });
};

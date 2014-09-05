module.exports = function(config){
  config.set({
    basePath: '.',

    files : [
      'bower_components/platform/platform.js',
      'test/browser.js',
      {pattern: 'dist/**/*', watched: true, included: false, served: true}
    ],

    autoWatch : true,

    frameworks: ['mocha', 'chai'],

    browsers : ['Chrome', 'Firefox'],

    plugins : [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-chai',
    ],
  });
};

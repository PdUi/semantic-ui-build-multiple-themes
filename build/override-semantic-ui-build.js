var
  gulp         = require('gulp-help')(require('gulp')),
  runSequence  = require('run-sequence'),
  print        = require('gulp-print'),
  config       = require('./config/user'),
  install      = require('./config/project/install'),
  tasks        = []
;

if(config.rtl) {
  require('./collections/rtl')(gulp);
}
require('./collections/build')(gulp);

const themes = require('../../../build/themes.json').themes;
module.exports = function(callback) {
    tasks.push('build-javascript');
    tasks.push('build-assets');
  for(var i = 0; i < themes.length; i ++) {
    console.info('Building Semantic');
    const theme = themes[i];

    gulp.task(`copy theme ${theme}`, function() {
      return gulp.src(`./src/themes/${theme}/theme.config`)
                 .pipe(gulp.dest('./src/'));
    });

    gulp.task(`build css ${theme}`, [`build-css`]);

    gulp.task(`copy output ${theme}`, [`build css ${theme}`], function() {
      return gulp.src(`./dist/**/*.css`)
                 .pipe(gulp.dest(`../dist/${theme}`));
    });

    if( !install.isSetup() ) {
      console.error('Cannot find semantic.json. Run "gulp install" to set-up Semantic');
      return 1;
    }
    tasks.push(`copy theme ${theme}`);
    tasks.push(`build css ${theme}`);
    tasks.push(`copy output ${theme}`);
  };

  runSequence(...tasks, callback);
};

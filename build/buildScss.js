const fs = require('fs');
const mkdirp = require('mkdirp');
const themes = require('./themes.json').themes;
const sass = require('node-sass');
const isProductionBuild = process.argv.find(arg => arg === 'production' || arg === 'prod' || arg === '-P' || arg === '--prod');

themes.forEach(theme => {
    const outputDir = `./styles/dist/${theme}`;

    mkdirp(outputDir, (err) => {
        if (err) return console.error(err);

        const inputDirRoot = `./styles/site`;
        const inputFilePath = `${inputDirRoot}/${theme}.scss`;
        const cssOutputFilePath = `${outputDir}/${theme}.min.css`
        const cssMapOutputFilePath = `${outputDir}/${theme}.css.map`

        sass.render({
            file: inputFilePath,
            outFile: cssOutputFilePath,
            outputStyle: isProductionBuild ? 'compressed' : 'expanded',
            sourceMap: true
        }, function (err, result) {
            if (err) return console.error(err);

            fs.writeFile(cssOutputFilePath, result.css, function(err) {
                if (err) return console.error(err);
            });

            fs.writeFile(cssMapOutputFilePath, result.map, function(err) {
                if (err) return console.error(err);
            });
        });
    });
});


const themeName = process.argv[2];
const themePrimaryColor = process.argv[3] || 'white:#fff';
const themeSecondaryColor = process.argv[4] || 'black:#000';

if (!themeName) return console.error('An theme\'s name must be passed to setup a new theme.');

const fs = require('fs');
const mkdirp = require('mkdirp');
const themesJSON = require('./themes.json');

const primaryColor = validateColorArgument(themePrimaryColor);
const secondaryColor = validateColorArgument(themeSecondaryColor);
const semanticThemesRootDirectory = `./styles/semantic/src/themes/${themeName}`;

updateJsonFile();
createMainScssFile();
createThemeConfigFile();
createSiteVariablesFile();

function updateJsonFile() {
    themesJSON.themes.push(themeName);

    fs.writeFile('./build/themes.json', JSON.stringify(themesJSON, null, 4), err => {
        if (err) return console.error(err);
    });
}

function createMainScssFile() {
    const themeMainScssTemplateInputFilePath = './build/templates/theme.scss.template';
    const themeMainScssTemplateOutputFilePath = `./styles/${themeName}.scss`;

    fs.readFile(themeMainScssTemplateInputFilePath, 'utf8', (err, themeMainScssTemplateInputContents) => {
        if (err) return console.log(err);

        const themeMainScssTemplateOutputContents = themeMainScssTemplateInputContents.replace(/\/\*PRIMARY_COLOR\*\//g, primaryColor.color)
                                                                                      .replace(/\/\*SECONDARY_COLOR\*\//g, secondaryColor.color);
        fs.writeFile(themeMainScssTemplateOutputFilePath, themeMainScssTemplateOutputContents, 'utf8', err => {
            if (err) return console.log(err);
        });
    });
}

function createThemeConfigFile() {
    mkdirp(semanticThemesRootDirectory, (err) => {
        if (err) return console.error(err);

        const themeConfigTemplateInputFilePath = './build/templates/theme.config.template';
        const themeConfigTemplateOutputFilePath = `${semanticThemesRootDirectory}/theme.config`;

        fs.readFile(themeConfigTemplateInputFilePath, 'utf8', (err, themeConfigTemplateInputContents) => {
            if (err) return console.log(err);

            const themeConfigTemplateOutputContents = themeConfigTemplateInputContents.replace(/\/\*THEME_NAME\*\//g, themeName);
            fs.writeFile(themeConfigTemplateOutputFilePath, themeConfigTemplateOutputContents, 'utf8', err => {
                if (err) return console.log(err);
            });
        });
    });
}

function createSiteVariablesFile() {
    const themeGlobalDirectory = `${semanticThemesRootDirectory}/globals`;

    mkdirp(themeGlobalDirectory, (err) => {
        if (err) return console.error(err);

        const themeSiteVariablesTemplateInputFilePath = './build/templates/site.variables.template';
        const themeSiteVariablesTemplateOutputFilePath = `${themeGlobalDirectory}/site.variables`;
        fs.readFile(themeSiteVariablesTemplateInputFilePath, 'utf8', (err, themeSiteVariablesTemplateFileInputContents) => {
            if (err) return console.log(err);

            const themeSiteVariablesTemplateFileOutputContents = themeSiteVariablesTemplateFileInputContents.replace(/\/\*PRIMARY_COLOR_DESCRIPTION\*\//g, primaryColor.description)
                                                                                                            .replace(/\/\*SECONDARY_COLOR_DESCRIPTION\*\//g, secondaryColor.description)
                                                                                                            .replace(/\/\*PRIMARY_COLOR\*\//g, primaryColor.color)
                                                                                                            .replace(/\/\*SECONDARY_COLOR\*\//g, secondaryColor.color);
            fs.writeFile(themeSiteVariablesTemplateOutputFilePath, themeSiteVariablesTemplateFileOutputContents, 'utf8', err => {
                if (err) return console.log(err);
            });
        });
    });
}

function validateColorArgument(colorArgument) {
    if (!colorArgument.includes(':')) return console.error(`Color argument must be in the following format COLOR_DESCRIPTION:COLOR. ${colorArgument} doesn't contain the separating ':'.`);
    const color = parseColorArgument(colorArgument);
    const validColorDescriptions = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black', 'lightRed', 'lightOrange', 'lightYellow', 'lightOlive', 'lightGreen', 'lightTeal', 'lightBlue', 'lightViolet', 'lightPurple', 'lightPink', 'lightBrown', 'lightGrey', 'lightBlack', 'fullBlack', 'offWhite', 'darkWhite', 'midWhite', 'white'];
    if (validColorDescriptions.indexOf(color.description) === -1) return console.error(`Color description must be valid. Color description passed: ${color.description}. Valid options are ${validColorDescriptions}.`);
    return color;
}

function parseColorArgument(colorArgument) {
    const colorArgumentParts = colorArgument.split(':');
    return {
        description: colorArgumentParts[0],
        color: colorArgumentParts[1]
    };
}

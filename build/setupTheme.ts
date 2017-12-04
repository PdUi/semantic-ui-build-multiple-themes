import { readFile, writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import { argv } from 'process';
import { handleError } from './handleError';
/* tslint:disable-next-line */
const value: IThemeJson = require('./themes.json');

let parametersAreValid: boolean = true;
const themeNameArgIndex: number = 2;
const themePrimaryColorArgIndex: number = 3;
const themeSecondaryColorArgIndex: number = 4;
const themeNameArg: string = argv[themeNameArgIndex];
const themePrimaryColorArg: string = argv[themePrimaryColorArgIndex] || 'white:#fff';
const themeSecondaryColorArg: string = argv[themeSecondaryColorArgIndex] || 'black:#000';
const encoding: string = 'utf8';

if (!themeNameArg) {
    console.error('An theme\'s name must be passed to setup a new theme.');
    parametersAreValid = false;
}

const parseColorArgument: (colorArgument: string) => IColor = (colorArgument: string): IColor => {
    const colorArgumentParts: string[] = colorArgument.split(':');

    return {
        color: colorArgumentParts[1],
        description: colorArgumentParts[0]
    };
};

const validateColorArgument: (colorArgument: string) => boolean = (colorArgument: string): boolean => {
    if (!colorArgument.includes(':')) {
        console.error(`Color argument must be in the following format COLOR_DESCRIPTION:COLOR. ${colorArgument} doesn't contain the separating ':'.`);

        return false;
    }

    const color: IColor = parseColorArgument(colorArgument);
    const validColorDescriptions: string[] = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black', 'lightRed', 'lightOrange', 'lightYellow', 'lightOlive', 'lightGreen', 'lightTeal', 'lightBlue', 'lightViolet', 'lightPurple', 'lightPink', 'lightBrown', 'lightGrey', 'lightBlack', 'fullBlack', 'offWhite', 'darkWhite', 'midWhite', 'white'];
    if (validColorDescriptions.indexOf(color.description) === -1) {
        console.error(`Color description must be valid. Color description passed: ${color.description}. Valid options are ${validColorDescriptions}.`);

        return false;
    }

    if (color.color.startsWith('#') && !color.color.match(/#[0-9a-fA-F]{3,6}\b/g)) {
        console.error('Color provided is an invalid hex value.');

        return false;
    }

    return true;
};

let primaryColor: IColor;
let secondaryColor: IColor;
if (validateColorArgument(themePrimaryColorArg)) {
    primaryColor = parseColorArgument(themePrimaryColorArg);
} else {
    parametersAreValid = false;
}

if (validateColorArgument(themeSecondaryColorArg)) {
    secondaryColor = parseColorArgument(themeSecondaryColorArg);
} else {
    parametersAreValid = false;
}

const updateJsonFile: (themeName: string) => void = (themeName: string): void => {
    value.themes.push(themeName);
    const indentSize: number = 4;
    writeFile('./build/themes.json', JSON.stringify(value, undefined, indentSize), handleError);
};

const createMainScssFile: (theme: ITheme) => void = (theme: ITheme): void => {
    const themeMainScssTemplateInputFilePath: string = './build/templates/theme.scss.template';
    const themeMainScssTemplateOutputFilePath: string = `./styles/site/${theme.name}.scss`;

    readFile(themeMainScssTemplateInputFilePath, encoding, (err: NodeJS.ErrnoException, themeMainScssTemplateInputContents: string) => {
        handleError(err);

        const themeMainScssTemplateOutputContents: string = themeMainScssTemplateInputContents.replace(/\/\*PRIMARY_COLOR\*\//g, theme.primaryColor.color)
                                                                                              .replace(/\/\*SECONDARY_COLOR\*\//g, theme.secondaryColor.color);
        writeFile(themeMainScssTemplateOutputFilePath, themeMainScssTemplateOutputContents, { encoding }, handleError);
    });
};

const createThemeConfigFile: (semanticThemesRootDirectory: string, themeName: string) => void = (semanticThemesRootDirectory: string, themeName: string): void => {
    mkdirp(semanticThemesRootDirectory, (error: Error) => {
        handleError(error);

        const themeConfigTemplateInputFilePath: string = './build/templates/theme.config.template';
        const themeConfigTemplateOutputFilePath: string = `${semanticThemesRootDirectory}/theme.config`;

        readFile(themeConfigTemplateInputFilePath, encoding, (fsError: NodeJS.ErrnoException, themeConfigTemplateInputContents: string) => {
            handleError(fsError);

            const themeConfigTemplateOutputContents: string = themeConfigTemplateInputContents.replace(/\/\*THEME_NAME\*\//g, themeName);
            writeFile(themeConfigTemplateOutputFilePath, themeConfigTemplateOutputContents, { encoding }, handleError);
        });
    });
};

const createSiteVariablesFile: (semanticThemesRootDirectory: string, theme: ITheme) => void = (semanticThemesRootDirectory: string, theme: ITheme): void => {
    const themeGlobalDirectory: string = `${semanticThemesRootDirectory}/globals`;

    mkdirp(themeGlobalDirectory, (error: Error) => {
        handleError(error);

        const themeSiteVariablesTemplateInputFilePath: string = './build/templates/site.variables.template';
        const themeSiteVariablesTemplateOutputFilePath: string = `${themeGlobalDirectory}/site.variables`;
        readFile(themeSiteVariablesTemplateInputFilePath, encoding, (fsError: NodeJS.ErrnoException, themeSiteVariablesTemplateFileInputContents: string) => {
            handleError(fsError);

            const themeSiteVariablesTemplateFileOutputContents: string = themeSiteVariablesTemplateFileInputContents.replace(/\/\*PRIMARY_COLOR_DESCRIPTION\*\//g, theme.primaryColor.description)
                                                                                                                    .replace(/\/\*SECONDARY_COLOR_DESCRIPTION\*\//g, theme.secondaryColor.description)
                                                                                                                    .replace(/\/\*PRIMARY_COLOR\*\//g, theme.primaryColor.color)
                                                                                                                    .replace(/\/\*SECONDARY_COLOR\*\//g, theme.secondaryColor.color);
            writeFile(themeSiteVariablesTemplateOutputFilePath, themeSiteVariablesTemplateFileOutputContents, { encoding }, handleError);
        });
    });
};

if (parametersAreValid) {
    const theme: ITheme = {
        name: themeNameArg,
        primaryColor,
        secondaryColor
    };
    const semanticThemesRootDirectory: string = `./styles/semantic/src/themes/${themeNameArg}`;

    updateJsonFile(theme.name);
    createMainScssFile(theme);
    createThemeConfigFile(semanticThemesRootDirectory, theme.name);
    createSiteVariablesFile(semanticThemesRootDirectory, theme);
}

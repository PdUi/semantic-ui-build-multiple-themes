import * as mkdirp from 'mkdirp';
import { ncp } from 'ncp';
import { handleError } from './handleError';

/* tslint:disable-next-line */
const value: IThemeJson = require('./themes.json');
const outputDir: string = `../Server/wwwroot`;

value.themes.forEach((theme: string) => {
    mkdirp(`${outputDir}/styles`, (error: Error): void => {
        handleError(error);

        ncp(
            `./styles/dist/${theme}/internal`,
            `${outputDir}/styles/${theme}`,
            handleError
        );
    });
});

mkdirp(`${outputDir}/assets/themes`, (error: Error): void => {
    handleError(error);

    ncp(
        './styles/semantic/dist/themes',
        `${outputDir}/assets/themes`,
        handleError
    );
});

import { writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import { render, Result, SassError } from 'node-sass';
import { argv } from 'process';
import { addHash } from './cacheBuster';
import { handleError } from './handleError';

/* tslint:disable-next-line */
const value: IThemeJson = require('./themes.json');
const isProductionBuild: boolean = !!argv.find((arg: string) => arg === 'production' || arg === 'prod' || arg === '-P' || arg === '--prod');

value.themes.forEach((theme: string) => {
    const outputDir: string = `./styles/dist/${theme}/internal`;

    mkdirp(outputDir, (error: Error): void => {
        handleError(error);

        const inputDirRoot: string = `./styles`;
        const inputFilePath: string = `${inputDirRoot}/site/${theme}.scss`;
        const cssOutputFilePath: string = `${outputDir}/${theme}.min.css`;

        render({
                file: inputFilePath,
                outFile: cssOutputFilePath,
                outputStyle: isProductionBuild ? 'compressed' : 'expanded',
                sourceMap: !isProductionBuild
               },
               (sassError: SassError, result: Result): void => {
                   handleError(sassError);

                   writeFile(cssOutputFilePath, result.css, handleError);

                   addHash(cssOutputFilePath);
               });
    });
});

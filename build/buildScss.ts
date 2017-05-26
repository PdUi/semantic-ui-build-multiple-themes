import { writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import { render, Result, SassError } from 'node-sass';
import { argv } from 'process';
import { handleError } from './handleError';
/* tslint:disable-next-line */
const value: IThemeJson = require('./themes.json');
const isProductionBuild: boolean = !!argv.find((arg: string) => arg === 'production' || arg === 'prod' || arg === '-P' || arg === '--prod');

value.themes.forEach((theme: string) => {
    const outputDir: string = `./styles/dist/${theme}`;

// TODO: Add File Hashing
    mkdirp(outputDir, (error: Error): void => {
        handleError(error);

        const inputDirRoot: string = `./styles`;
        const inputFilePath: string = `${inputDirRoot}/${theme}.scss`;
        const cssOutputFilePath: string = `${outputDir}/${theme}.min.css`;
        const cssMapOutputFilePath: string = `${outputDir}/${theme}.css.map`;

        render({
                file: inputFilePath,
                outFile: cssOutputFilePath,
                outputStyle: isProductionBuild ? 'compressed' : 'expanded',
                sourceMap: !isProductionBuild
               },
               (sassError: SassError, result: Result): void => {
                   handleError(sassError);

                   writeFile(cssOutputFilePath, result.css, handleError);
                   if (!isProductionBuild) {
                       writeFile(cssMapOutputFilePath, result.map, handleError);
                   }
               });
    });
});

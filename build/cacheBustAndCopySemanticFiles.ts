import { readFile, writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import { addHash } from './cacheBuster';
import { handleError } from './handleError';

/* tslint:disable-next-line */
const value: IThemeJson = require('./themes.json');

const encoding: string = 'utf8';
value.themes.forEach((theme: string) => {
    const outputDir: string = `./styles/dist/${theme}/internal/`;

    mkdirp(outputDir, (error: Error): void => {
        handleError(error);

        readFile(
            `./styles/dist/${theme}/semantic.min.css`,
            encoding,
            (readErr: NodeJS.ErrnoException, inFileContents: string) => {
                handleError(readErr);

                const outPath: string = `${outputDir}/semantic.min.css`;
                const outFileContents: string = inFileContents.replace(/themes\/default\/assets\/fonts\//g, '../../themes/default/assets/fonts/');

                writeFile(
                    outPath,
                    outFileContents,
                    { encoding },
                    (writeErr: NodeJS.ErrnoException) => {
                        handleError(writeErr);
                        addHash(outPath);
                    }
                );
            }
        );
    });
});

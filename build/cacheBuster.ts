import { rename } from 'fs';
import { fromFile, HashaOptions } from 'hasha';
import { basename, dirname, join } from 'path';
import { handleError } from './handleError';

export const addHash: (filePath: string) => void = (filePath: string): void => {
    const minCssExtension: string = '.min.css';
    const fileName: string = basename(filePath, minCssExtension);
    const hashaOptions: HashaOptions<'base64'> = { algorithm: 'md5' };

    /* tslint:disable:no-floating-promises */
    fromFile(filePath, hashaOptions)
        .then((hash: string | null) => {
            const hashFileNameLength: number = 20;
            const hashedFileName: string = `${fileName}.${hash.substr(0, hashFileNameLength)}${minCssExtension}`;
            const directoryPath: string = dirname(filePath);

            rename(
                filePath,
                join(directoryPath, hashedFileName),
                handleError
            );
        });
};

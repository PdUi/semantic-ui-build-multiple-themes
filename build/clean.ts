import * as rimraf from 'rimraf';
import { handleError } from './handleError';

rimraf('styles/dist', handleError);
rimraf('../Server/wwwroot/**/*.js', handleError);
rimraf('../Server/wwwroot/**/*.js.map', handleError);
rimraf('../Server/wwwroot/**/*.css', handleError);
rimraf('../Server/wwwroot/**/*.css.map', handleError);

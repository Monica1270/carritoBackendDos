import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);  

export { __dirname };

export const generateError=(message, statusCode=400, module=undefined, details=undefined)=>{
    let error = new Error(message);
    error.statusCode=statusCode;
    error.detail=details;
    error.module=module;
    return error;
}
// there's a bug in the Node.d.ts file
interface Error {
    captureStackTrace: any;
}

/**
 * Use when a crash is due to the data for the state store not loading
 * @param {string} file      file the error occurred in
 * @param {string} fn        containing function
 * @param {string} msg       More detailed description of the error
 * @param {string} urls      URLs data request(s) was / were being sent to
 * @param {Object} appState  Full data store of the app at time of error.
 * @return {Object extends Error} new extended error object
 */
export const StoreLoadError = (() => {
    function StoreLoadError(file: string, fn: string, msg: string, urls: string[], appState) {
        Error.captureStackTrace(this);
        this.file = file;
        this.fn = fn;
        this.msg = msg;
        this.urls = urls;
        this.appState = appState;
        console.error('file:', this.file);
        console.error('fn:', this.fn);
        console.error('msg:', this.msg);
        console.error('url(s) receiving requests:', this.urls);
        console.error('stack:', this.stack);
    }

    StoreLoadError.prototype = Object.create(Error.prototype);
    return StoreLoadError;
})();

/**
 * Use when a crash is clearly due to the React UI not rendering
 * @param {string} file      file the error occurred in
 * @param {string} fn        containing function
 * @param {string} msg   More detailed description of the error
 * @param {Object} appState  Full data store of the app at time of error.
 * @return {Object extends Error} new extended error object
 */
export const BuildReactUIError = (() => {
    function BuildReactUIError(file: string, fn: string, msg: string, appState) {
        Error.captureStackTrace(this);
        this.file = file;
        this.fn = fn;
        this.msg = msg;
        this.appState = appState;
        console.error('Error occurred somewhere in the ReactUI build');
        console.error('file:', this.file);
        console.error('fn:', this.fn);
        console.error('msg:', this.msg);
        console.error('stack:', this.stack);
    }

    BuildReactUIError.prototype = Object.create(Error.prototype);
    return BuildReactUIError;
})();

/**
 * Throw on attempts to run functionality-damaging dev code in production (e.g. returning
 * mock replacements for actual data).
 * @param {string} file      file the error occurred in
 * @param {string} fn        containing function
 * @param {string} msg       More detailed description of the error
 * @param {string} route     Route original server request went to
 * @param {Object} mock      If returning mock data was involved, pass this the mock data.
 * @return {Object extends Error} new extended error object
 */
export const DevCodeOnProdServerError = (() => {
    function DevCodeOnProdServerError(file: string, fn: string,
            msg: string, route?: string, mock?: any) {
        Error.captureStackTrace(this);

        this.file = file;
        this.fn = fn;
        this.msg = msg;
        this.route = route;
        this.mock = mock;

        console.error('Attempted to run development code on production');
        console.error('file:', this.file);
        console.error('fn:', this.fn);
        console.error('msg:', this.msg);
        console.error('route:', (route) ? (route) : ('no route provided'));
        if (mock) {
            console.error('mock:', this.mock);
        }

        console.error('stack:', this.stack);
    }

    DevCodeOnProdServerError.prototype = Object.create(Error.prototype);
    return DevCodeOnProdServerError;
})();

/**
 * Use when a crash is due to an unknown language being provided to a language-aware API
 *
 * @param {string} file      file the error occurred in
 * @param {string} fn        containing function
 * @param {string} msg   More detailed description of the error
 * @param {Object} appState  Full data store of the app at time of error.
 * @return {Object extends Error} new extended error object
 */
export const UnknownLanguageError = (() => {
    function UnknownLanguageError(file: string, fn: string, lang: string,
                                  msg: string,  appState,   targetEl?) {
        Error.captureStackTrace(this);
        this.file = file;
        this.fn = fn;
        this.lang = lang;
        this.msg = msg;
        this.appState = appState;

        console.error('Unknown language was provided:', lang);
        console.error('file:', this.file);
        console.error('fn:', this.fn);
        console.error('lang:', this.lang);
        console.error('msg:', this.msg);
        console.error('appState:', this.appState);
        console.error('stack:', this.stack);
    }

    UnknownLanguageError.prototype = Object.create(Error.prototype);
    return UnknownLanguageError;
})();

/**
 * Use when an attempt to hash a string, Buffer, number, etc. fails.
 * 
 * @param {string} message        - error message
 * @param {string} fileName       - file the error occurred in
 * @param {string} strBeingHashed - string the hashing was attempted on
 * @param {string} algorithm      - hash algorithm used
 * @param {string} salt           - salt used in the generation attempt
 */
export const HashGenerationError = (() => {
    function HashGenerationError(message: string, fileName: string, strBeingHashed: string,
                                 algorithm: string, salt: string | Buffer) {
        Error.captureStackTrace(this);
        this.message = message;
        this.name = `HashGenerationError`;
        this.fileName = fileName;
        this.strBeingHashed = strBeingHashed;
        this.algorithm = algorithm;
        this.salt = salt.toString();

        console.error(`${this.name}: Failed to generate hash of string: ${this.strBeingHashed}`);
        console.error(`    Occurred in file:`, this.fileName);
        console.error(`    Algorithm attempted:`, this.algorithm);
        console.error(`    Salt used in generation attempt:`, this.salt);
        console.error(`    stack:`, this.stack);
    }

    HashGenerationError.prototype = Object.create(Error.prototype);
    return HashGenerationError;
})();

export interface ILoginError {
    (message: string, fileName: string, username?: string): void;
    summary: string;
    username: string;
    fileName: string;
    name: 'LoginError';
    message: string;
}

/**
 * Use when an attempt to hash a string, Buffer, number, etc. fails.
 * 
 * @param {string} message        - error message
 * @param {string} fileName       - file the error occurred in
 */
export class LoginError extends Error {
    public name = 'LoginError';
    public summary: string;

    constructor(public message: string, public fileName: string, public username: string = '') {
        super();
        Error.captureStackTrace(this);
        this.summary = `[ERROR] In ${fileName}:: LoginError: Failed to authenticate user${
                       (username) ? ': ' + username : ''}  --  ${message}`;
    }
}

const er = new LoginError('boo', 'error-objects.ts', 'me');
console.log(er);
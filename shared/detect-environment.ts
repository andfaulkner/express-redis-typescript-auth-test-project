/// <reference path="../typings/custom/project-typings.d.ts" />

/*************************************************************************************************
 *
 *            Detect Node vs browser
 *
 */

enum Env {
    Node = <any>"Node",
    Browser = <any>"Browser",
    Other = <any>"Other"
}

const isBrowser = new Function(
    `try {
        return this===window;
    } catch(e) {
        return false;
    }`
);

const isNode = new Function(
    `try {
        return (this === global);
    } catch (e) {
        return false;
    }`
);

export const detectEnvironment = (): Env => {
    if (!isNode() && isBrowser()) {
        console.log('\n* DETECTED ENVIRONMENT: browser');
        return Env.Browser;
    } else if (isNode() && !isBrowser()) {
        console.log('\n* DETECTED ENVIRONMENT: node');
        return Env.Node;
    }
};

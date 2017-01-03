/// <reference path="../typings/custom/project-typings.d.ts" />
"use strict";
/*************************************************************************************************
 *
 *            Detect Node vs browser
 *
 */
var Env;
(function (Env) {
    Env[Env["Node"] = "Node"] = "Node";
    Env[Env["Browser"] = "Browser"] = "Browser";
    Env[Env["Other"] = "Other"] = "Other";
})(Env || (Env = {}));
const isBrowser = new Function(`try {
        return this===window;
    } catch(e) {
        return false;
    }`);
const isNode = new Function(`try {
        return (this === global);
    } catch (e) {
        return false;
    }`);
exports.detectEnvironment = () => {
    if (!isNode() && isBrowser()) {
        console.log('\n* DETECTED ENVIRONMENT: browser');
        return Env.Browser;
    }
    else if (isNode() && !isBrowser()) {
        console.log('\n* DETECTED ENVIRONMENT: node');
        return Env.Node;
    }
};
//# sourceMappingURL=detect-environment.js.map
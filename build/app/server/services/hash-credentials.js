"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const argon2 = require("argon2");
const error_objects_1 = require("../../../shared/error-objects");
const salt = new Buffer('somesalt');
exports.hashString = (str) => __awaiter(this, void 0, void 0, function* () {
    try {
        const salt = yield argon2.generateSalt(32);
        const hash = yield argon2.hash(str, salt, {
            argon2d: true
        });
    }
    catch (e) {
        const err = new error_objects_1.HashGenerationError('Failed to generate hash. ${e.name} :: ${e.message}', 'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
});
//# sourceMappingURL=hash-credentials.js.map
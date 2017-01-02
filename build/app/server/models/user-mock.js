"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
//************************************* THIRD-PARTY MODULES ***************************************/
const lodash_mixins_1 = require("../../../shared/lodash-mixins");
const error_objects_1 = require("../../../shared/error-objects");
//*************************************** PROJECT MODULES *****************************************/
const hash_credentials_1 = require("../services/hash-credentials");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('user-mock.ts', colors.bgBlue.white);
const users = [];
/****************************************** CREATE USER *******************************************/
class UserMock {
    constructor(opts) {
        //
        // TODO hashing here
        //
        this.comparePassword = (password) => new Promise((resolve, reject) => {
            return ((password === this.password)
                ? resolve(password)
                : reject(new error_objects_1.LoginFailedError(`${TAG} Incorrect password`, 'user-mock.ts', this.username)));
        });
        this.hashGen = (opts) => __awaiter(this, void 0, void 0, function* () {
            const { hash, salt } = yield hash_credentials_1.generateHash(opts.password);
            this.id = hash;
            this.salt = salt;
        });
        this.username = opts.username;
        this.password = opts.password;
        this.hashGen(opts);
        users.push(this);
    }
    // TODO remove this. it's insecure. Use only findById in future.
    static findOne(params) {
        return new Promise((resolve, reject) => {
            console.log(`${TAG} UserMock.findOne:: params: `, params, `\n${TAG} users: (below)\n`, users);
            const user = lodash_mixins_1._.find(users, (user) => (user.username === params.username) &&
                (!params.id || (user.id === params.id)));
            if (user && user.username && user.password && lodash_mixins_1._.isString(user.username)) {
                console.log(`${TAG} UserMock.findOne:: found user ${user.username}`);
                return resolve(user);
            }
            console.log(`${TAG} UserMock.findOne:: Failed to find user. Rejecting...`);
            return reject(new error_objects_1.LoginFailedError(`${TAG} UsersMock.Users array doesn't contain user`, 'user-mock.ts', params.username || ''));
        });
    }
    static findById(id, next) {
        const user = lodash_mixins_1._.find(users, (user) => user.id === id);
        return next(null, user);
    }
}
exports.UserMock = UserMock;
/******************************************* USER MOCK ********************************************/
new UserMock({ username: 'meeka', password: 'test123' });
new UserMock({ username: 'callie', password: 'yaybone' });
new UserMock({ username: 'kyra', password: 'i_hate_everyone' });
//# sourceMappingURL=user-mock.js.map
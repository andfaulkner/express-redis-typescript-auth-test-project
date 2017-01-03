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
        /**
         * Perform actual hashing here
         * @param {string} password - submitted password - will be compared against the hash
         */
        this.comparePassword = (password) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield hash_credentials_1.verifyPassVsHash(password, this.pHash, true);
            console.log(`${TAG} comparePassword: isMatch: ${isMatch}`);
            return (isMatch
                ? resolve(true)
                : reject(new error_objects_1.LoginFailedError(`${TAG} Incorrect password`, __filename, this.username)));
        }));
        this.save = () => {
            console.log('MOCK - user saved to database!');
            console.log(`username: ${this.username}`);
            console.log(`pHash: ${this.pHash}`);
        };
        this.username = opts.username;
        (() => __awaiter(this, void 0, void 0, function* () {
            const { hash, salt } = yield hash_credentials_1.generateHash(opts.password);
            this.pHash = hash;
            this.salt = salt;
            users.push(this);
        }))();
    }
    // TODO remove this. it's insecure. Use only findById in future.
    static findOne(args) {
        return new Promise((resolve, reject) => {
            console.log(`${TAG} UserMock.findOne:: args: `, args, `\n${TAG} users: (below)\n`, users);
            const user = lodash_mixins_1._.find(users, (user) => (user.username === args.username) &&
                (!args.pHash || (user.pHash === args.pHash)));
            if (user && user.username && lodash_mixins_1._.isString(user.username)) {
                console.log(`${TAG} UserMock.findOne:: found user ${user.username}`);
                return resolve(user);
            }
            console.log(`${TAG} UserMock.findOne:: Failed to find user. Rejecting...`);
            return reject(new error_objects_1.LoginFailedError(`${TAG} UsersMock.Users array doesn't contain user`, 'user-mock.ts', args.username || ''));
        });
    }
}
exports.UserMock = UserMock;
/******************************************* USER MOCK ********************************************/
new UserMock({ username: 'meeka', password: 'test123' });
new UserMock({ username: 'callie', password: 'yaybone' });
new UserMock({ username: 'kyra', password: 'i_hate_everyone' });
//# sourceMappingURL=user-mock.js.map
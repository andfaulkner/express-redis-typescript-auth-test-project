//************************************* THIRD-PARTY MODULES ***************************************/
import { _ } from '../../../shared/lodash-mixins';
import { LoginError } from '../../../shared/error-objects';

//*************************************** PROJECT MODULES *****************************************/
import { generateHash, verifyPassVsHash } from '../services/hash-credentials';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';

const TAG = buildFileTag('user-model.ts', colors.bgBlue.white);

//*************************************** TYPE DEFINITIONS ****************************************/
type ErrorOrNull = Error | null;
type CompareCb = (ErrorOrNull, Boolean) => any;
type FindUserCb = (ErrorOrNull, UserModel) => void;

const users: UserModel[] = [];

/****************************************** CREATE USER *******************************************/
export class UserModel {
    public username: string;
    public pHash: string;
    public salt: string;

    // TODO remove this. it's insecure. Use only findById in future.
    static findOne(args: { username: string, pHash?: string }): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            console.log(`${TAG} UserModel.findOne:: args: `, args,
                      `\n${TAG} users: (below)\n`, users);

            const user = _.find(users, (user) => (user.username === args.username) &&
                                                 (!args.pHash || (user.pHash === args.pHash)));
 
            if (user && user.username && _.isString(user.username)) {
                console.log(`${TAG} UserModel.findOne:: found user ${user.username}`);
                return resolve(user);
            }
 
            console.log(`${TAG} UserModel.findOne:: Failed to find user. Rejecting...`);
            return reject(new LoginError(`${TAG} UsersMock.Users array doesn't contain user`,
                                                'user-model.ts', args.username || ''));
        });
    }

    constructor(opts: { username: string, password: string }) {
        this.username = opts.username;
        (async () => {
            const { hash, salt } = await generateHash(opts.password);
            this.pHash = hash;
            this.salt = salt;
            users.push(this)
        })();
    }

    /**
     * Perform actual hashing here
     * @param {string} password - submitted password - will be compared against the hash
     */
    comparePassword = (password: string): Promise<CompareCb> =>
        new Promise(async (resolve, reject) => {
            const isMatch = await verifyPassVsHash(password, this.pHash, true);
            console.log(`${TAG} comparePassword: isMatch: ${isMatch}`);

            return (isMatch 
                ? resolve(true)
                : reject(new LoginError(`${TAG} Incorrect password`,
                                              __filename, this.username)));
        });
    save = () => {
        console.log('MOCK - user saved to database!');
        console.log(`username: ${this.username}`);
        console.log(`pHash: ${this.pHash}`);
    }
}

/******************************************* USER MOCK ********************************************/
new UserModel({ username: 'meeka', password: 'test123' });
new UserModel({ username: 'callie', password: 'yaybone' });
new UserModel({ username: 'kyra', password: 'i_hate_everyone' });

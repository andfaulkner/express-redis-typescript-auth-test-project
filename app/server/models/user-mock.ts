//************************************* THIRD-PARTY MODULES ***************************************/
import { _ } from '../../../shared/lodash-mixins';
import { LoginFailedError } from '../../../shared/error-objects';

//*************************************** PROJECT MODULES *****************************************/
import { generateHash, verifyPassVsHash } from '../services/hash-credentials';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';

const TAG = buildFileTag('user-mock.ts', colors.bgBlue.white);

//*************************************** TYPE DEFINITIONS ****************************************/
type ErrorOrNull = Error | null;
type CompareCb = (ErrorOrNull, Boolean) => any;
type FindUserCb = (ErrorOrNull, UserMock) => void;

const users: UserMock[] = [];

/****************************************** CREATE USER *******************************************/
export class UserMock {
    public username: string;
    public pHash: string;
    public salt: string;

    // TODO remove this. it's insecure. Use only findById in future.
    static findOne(args: { username: string, pHash?: string }): Promise<UserMock> {
        return new Promise((resolve, reject) => {
            console.log(`${TAG} UserMock.findOne:: args: `, args,
                      `\n${TAG} users: (below)\n`, users);

            const user = _.find(users, (user) => (user.username === args.username) &&
                                                 (!args.pHash || (user.pHash === args.pHash)));
 
            if (user && user.username && _.isString(user.username)) {
                console.log(`${TAG} UserMock.findOne:: found user ${user.username}`);
                return resolve(user);
            }
 
            console.log(`${TAG} UserMock.findOne:: Failed to find user. Rejecting...`);
            return reject(new LoginFailedError(`${TAG} UsersMock.Users array doesn't contain user`,
                                                'user-mock.ts', args.username || ''));
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
                : reject(new LoginFailedError(`${TAG} Incorrect password`,
                                              __filename, this.username)));
        });
    save = () => {
        console.log('MOCK - user saved to database!');
        console.log(`username: ${this.username}`);
        console.log(`pHash: ${this.pHash}`);
    }
}

/******************************************* USER MOCK ********************************************/
new UserMock({ username: 'meeka', password: 'test123' });
new UserMock({ username: 'callie', password: 'yaybone' });
new UserMock({ username: 'kyra', password: 'i_hate_everyone' });

//************************************* THIRD-PARTY MODULES ***************************************/
import { _ } from '../../../shared/lodash-mixins';
import { LoginFailedError } from '../../../shared/error-objects';

//*************************************** PROJECT MODULES *****************************************/
import { generateHash } from '../services/hash-credentials';

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
    public password: string;
    public id: string;
    public salt: string;

    // TODO remove this. it's insecure. Use only findById in future.
    static findOne(params: { username: string, id?: string }): Promise<UserMock> {
        return new Promise((resolve, reject) => {
            console.log(`${TAG} UserMock.findOne:: params: `, params,
                      `\n${TAG} users: (below)\n`, users);
            const user = _.find(users, (user) => (user.username === params.username) &&
                                                 (!params.id || (user.id === params.id)));
 
            if (user && user.username && user.password && _.isString(user.username)) {
                console.log(`${TAG} UserMock.findOne:: found user ${user.username}`);
                return resolve(user);
            }
 
            console.log(`${TAG} UserMock.findOne:: Failed to find user. Rejecting...`);
            return reject(new LoginFailedError(`${TAG} UsersMock.Users array doesn't contain user`,
                                                'user-mock.ts', params.username || ''));
        });
    }

    static findById(id, next) {
        const user = _.find(users, (user) => user.id === id);
        return next(null, user);
    }

    constructor(opts: { username: string, password: string }) {
        this.username = opts.username;
        this.password = opts.password;
        this.hashGen(opts);
        users.push(this);
    }

    //
    // TODO hashing here
    //
    comparePassword = (password: string): Promise<CompareCb> =>
        new Promise((resolve, reject) => {
            return ((password === this.password) 
                ? resolve(password)
                : reject(
                    new LoginFailedError(`${TAG} Incorrect password`, 'user-mock.ts', this.username
                )));
        });

    private hashGen = async (opts) => {
        const { hash, salt } = await generateHash(opts.password);
        this.id = hash;
        this.salt = salt;
    }
}

/******************************************* USER MOCK ********************************************/
new UserMock({ username: 'meeka', password: 'test123' });
new UserMock({ username: 'callie', password: 'yaybone' });
new UserMock({ username: 'kyra', password: 'i_hate_everyone' });

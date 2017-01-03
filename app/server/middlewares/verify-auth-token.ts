//************************************** THIRD-PARTY MODULES **************************************/
import * as express from 'express';
import * as moment from 'moment';
import * as util from 'util';
import * as _ from 'lodash';
import * as jsonwebtoken from 'jsonwebtoken';

//**************************************** PROJECT MODULES ****************************************/
import { config } from '../../../config/config';
import { expressRequestExtended } from '../express-typedef';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';
const TAG = buildFileTag('verify-auth-token.ts', colors.blue.bgWhite);

//******************************************* HELPERS *********************************************/
/**
 * Searches all the likely places on the express request object for tokens
 */
const findToken = (req) => {
    return req.body.token || req.query.token || req.headers['x-access-token'];
};

/**
 * Promisification of jwt.verify
 */
const verifyAsync = (token: string, secret: string): Promise<{}> => {
  return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, secret, function(error, decoded) {
          if (error) reject(error);
          resolve(decoded);
      });
  });
};

/******************************************* MIDDLEWARE *******************************************/
const verifyAuthToken = async function verifyAuthToken(req: expressRequestExtended,
                                                       res: express.Response, next: Function) {
    const token = findToken(req);
    console.log(`${TAG} verifyAuthToken: token: ${token}`);
    if (token) {
        const decoded = await verifyAsync(token, config.auth.token.secret);
        req.decoded = decoded;
        console.log(decoded);
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
};

export { verifyAuthToken }

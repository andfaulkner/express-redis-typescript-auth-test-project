/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import * as deepFreeze from 'deep-freeze-strict';

//*************************************** TYPE DEFINITIONS ****************************************/
type ExtractOneFromColl = (coll: any[]) => any;

interface lodashExtended extends _.LoDashStatic{
    puts: (...varargs: any[]) => any;

    randomAlphanumerics: (num: number) => string;
    randomAlphanumeric: () => string;

    assignClone: AssignClone;
    reduceReducers: ReduceReducers;

    flattenObjectOnce: (obj: {}) => {};
    hasOverlap: (coll1: any[], coll2: any[]) => boolean;

    insertAt: (coll: any[] | string, idx: number, item: any | string) => any[] | string;
    extractChar: (str: string, extractPosition: number) => string;

    secondLast: ExtractOneFromColl;
    thirdLast:  ExtractOneFromColl;
    fourthLast: ExtractOneFromColl;
    fifthLast:  ExtractOneFromColl;
    second:     ExtractOneFromColl;
    third:      ExtractOneFromColl;
    fourth:     ExtractOneFromColl;
    fifth:      ExtractOneFromColl;
}

interface AssignClone {
  (obj1: {}, obj2?: {}, obj3?: {}, obj4?: {}, obj5?: {}, obj6?: {}): {};
}

interface ReduceReducers {
  (...reducers: any[]): any; // TODO typings
}

//******************************************* METHODS *********************************************/
/**
 * Combine multiple reducers. Each reducer's output is the input of the next
 */
const reduceReducers = function reduceReducers(...reducers) {
  return (previous: Function, current: Function) =>
    reducers.reduce(
      (p: Function, r: Function) => r(p, current),
      previous
    );
};

/**
 * For an object containing a nested object, transfer all key-value pairs of the
 * nested object to the top-level object. Non-recursive: only flattens by 1 level
 */
const flattenObjectOnce = (obj: {}) => {
  return _.reduce(obj, (acc, val, key, index) => {
    if (!_.isArray && _.isObject(val)) {
      _.each(val, (val2Deep, key2Deep) => {
        acc[key2Deep] = val2Deep;
      });
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
};

//******************************************** EXPORT *********************************************/
const mixins = _.mixin(_, {

    /**
     * Return a deep-frozen clone of a group of objects. Completely safe.
     */
    assignClone: (obj1 = {}, obj2 = {}, obj3 = {}, obj4 = {}, obj5 = {}, obj6 = {}): {} => {
        return deepFreeze(Object.assign({}, obj1, obj2, obj3, obj4, obj5, obj6));
    },

    reduceReducers,
    flattenObjectOnce,

    // pass-through logger
    puts: (...varargs: any[]): any => {
        if (Array.isArray(varargs)) {
          console.log(...varargs);
        }
        console.log(...varargs);
        return varargs;
    },

    // Sugar for accessing elements at the start and end of a collection
    secondLast: (coll: string | any[]) => (coll.length > 1) ? coll[coll.length - 2] : null,
    thirdLast:  (coll: string | any[]) => (coll.length > 2) ? coll[coll.length - 3] : null,
    fourthLast: (coll: string | any[]) => (coll.length > 3) ? coll[coll.length - 4] : null,
    fifthLast:  (coll: string | any[]) => (coll.length > 4) ? coll[coll.length - 5] : null,
    second:     (coll: string | any[]) => (coll.length > 1) ? coll[1] : null,
    third:      (coll: string | any[]) => (coll.length > 2) ? coll[2] : null,
    fourth:     (coll: string | any[]) => (coll.length > 3) ? coll[3] : null,
    fifth:      (coll: string | any[]) => (coll.length > 4) ? coll[4] : null,

    // True if any element in the 1st collection is the same as any element in the 2nd
    hasOverlap: (coll1: any[], coll2: any[]) => _.some(coll1, (item) => _.includes(coll2, item)),

    // Insert item into array (coll) at given index (idx)
    insertAt: (coll: any[] | string, idx: number, item: any | string): any[] | string => {
        let preppedArr = (typeof coll === 'string') ? coll.split('') : coll;
        preppedArr.splice(idx, 0, item);
        return (typeof coll === 'string') ? preppedArr.join('') : preppedArr;
    },

    extractChar: (str: string, extractPosition: number): string => {
        const strArr = str.split('');
        strArr.splice(extractPosition, 1);
        return strArr.join('');
    },

    randomAlphanumerics: (numAlphanumToCreate: number = 1): string => {
        return _.times(
            numAlphanumToCreate,
            () => _.sample(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                            'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
                            'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3',
                            '4', '5', '6', '7', '8', '9'
            ])).join('')
    },

    randomAlphanumeric: (): string => {
        return (_ as lodashExtended).randomAlphanumerics(1);
    },

  }) as lodashExtended;

export { mixins as _ }

/// <reference path="../typings/index.d.ts" />
"use strict";
const _ = require("lodash");
const deep_freeze_strict_1 = require("deep-freeze-strict");
//******************************************* METHODS *********************************************/
/**
 * Combine multiple reducers. Each reducer's output is the input of the next
 */
const reduceReducers = function reduceReducers(...reducers) {
    return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
};
/**
 * For an object containing a nested object, transfer all key-value pairs of the
 * nested object to the top-level object. Non-recursive: only flattens by 1 level
 */
const flattenObjectOnce = (obj) => {
    return _.reduce(obj, (acc, val, key, index) => {
        if (!_.isArray && _.isObject(val)) {
            _.each(val, (val2Deep, key2Deep) => {
                acc[key2Deep] = val2Deep;
            });
        }
        else {
            acc[key] = val;
        }
        return acc;
    }, {});
};
/**
 * Return a deep-frozen clone of a group of objects. Completely safe.
 */
const assignClone = (obj1 = {}, obj2 = {}, obj3 = {}, obj4 = {}, obj5 = {}, obj6 = {}) => {
    return deep_freeze_strict_1.default(Object.assign({}, obj1, obj2, obj3, obj4, obj5, obj6));
};
//******************************************** EXPORT *********************************************/
const mixins = _.mixin(_, {
    assignClone,
    reduceReducers,
    flattenObjectOnce,
    // pass-through logger
    puts: (...varargs) => {
        if (Array.isArray(varargs)) {
            console.log(...varargs);
        }
        console.log(...varargs);
        return varargs;
    },
    // Sugar for accessing elements at the start and end of a collection
    secondLast: (coll) => coll[coll.length - 2],
    thirdLast: (coll) => coll[coll.length - 3],
    fourthLast: (coll) => coll[coll.length - 4],
    fifthLast: (coll) => coll[coll.length - 5],
    second: (coll) => coll[1],
    third: (coll) => coll[2],
    fourth: (coll) => coll[3],
    fifth: (coll) => coll[4],
    // True if any element in the 1st collection is the same as any element in the 2nd
    hasOverlap: (coll1, coll2) => _.some(coll1, (item) => _.includes(coll2, item)),
    // Insert item into array (coll) at given index (idx)
    insertAt: (coll, idx, item) => {
        let preppedArr = (typeof coll === 'string') ? coll.split('') : coll;
        preppedArr.splice(idx, 0, item);
        return (typeof coll === 'string') ? preppedArr.join('') : preppedArr;
    },
    randomAlphanumerics: (numAlphanumToCreate = 1) => {
        return _.times(numAlphanumToCreate, () => _.sample(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
            'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9'
        ])).join('');
    },
    randomAlphanumeric: () => {
        return _.randomAlphanumerics(1);
    },
});
exports._ = mixins;
//# sourceMappingURL=lodash-mixins.js.map
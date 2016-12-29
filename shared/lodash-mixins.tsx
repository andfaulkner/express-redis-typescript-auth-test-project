/// <reference path="../typings/index.d.ts" />

import * as _ from 'lodash';
import deepFreeze from 'deep-freeze-strict';

//*************************************** TYPE DEFINITIONS ****************************************/
interface lodashExtended extends _.LoDashStatic{
  assignClone: AssignClone;
  reduceReducers: ReduceReducers;
  flattenObjectOnce: (obj: {}) => {};
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

/**
 * Return a deep-frozen clone of a group of objects. Completely safe.
 */
const assignClone = (obj1 = {}, obj2 = {}, obj3 = {}, obj4 = {}, obj5 = {}, obj6 = {}) => {
  return deepFreeze(Object.assign({}, obj1, obj2, obj3, obj4, obj5, obj6));
};


//******************************************** EXPORT *********************************************/
const mixins = _.mixin(_, {
    assignClone,
    reduceReducers,
    flattenObjectOnce
  }) as lodashExtended;

export { mixins as _ }

import * as _ from 'lodash';

/**
 * Definition for a decorator that logs method calls.
 * Shows parameters and return values.
 * Preserves 'this' binding.
 *
 * Example use:
 * class SomeClass
 *   ...
 *   @log()
 *   onModalClose() {
 *     ...
 *   }
 * }
 *
 * TODO set it up to also log classes, params, etc.. AOP FTW!
 * 
 */
export function log() {

  return function(target, name) {
    target[`__${name}_orig`] = target[`__${name}_orig`] || target[name];

    target[name] = function(...args) {
      const wrapCallHeaderStyle = 'font-weight: bolder; text-decoration: underline overline;';
      console.log('%c' + _.repeat('>', 150), wrapCallHeaderStyle);
      console.log(`%c>> FUNCTION ${name} CALLED${(target.name) ? ('on ' + target.name) : ''} >>`,
                  wrapCallHeaderStyle);
      if (args.length > 0) {
        console.log(`%c>>>>>>>>>>>> PARAMETERS:`, wrapCallHeaderStyle);
        _.each(args, (arg, index) => console.log(arg));
        console.log(`%c(>>> END PARAMETERS >>>>  `, wrapCallHeaderStyle);
      } else {
        console.log(`%c>>>>>>> PARAMETERS`, wrapCallHeaderStyle, ': [none]');
      }
      const result = target[`__${name}_orig`].apply(this, args);
      const outputHeader = `>>>>>>>>>>>> FUNCTION ${name} OUTPUT >>>>>>>>>>>>`;
      console.log('%c' + outputHeader, wrapCallHeaderStyle);
      console.log(result);
      console.log('%c' + _.pad(` END FUNCTION ${name} OUTPUT `, outputHeader.length, '>'),
                  wrapCallHeaderStyle);
      console.log('%c' + _.repeat('<', 150), wrapCallHeaderStyle);
      return result;
    }

    console.log('target:', target, '; name: ', name);
    return target;
  }
}


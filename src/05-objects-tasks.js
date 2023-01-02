/* eslint-disable no-shadow */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = JSON.parse(json);
  Object.setPrototypeOf(result, proto);
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// const cssSelectorBuilder = {
//   element(/* value */) {
//     throw new Error('Not implemented');
//   },

//   id(/* value */) {
//     throw new Error('Not implemented');
//   },

//   class(/* value */) {
//     throw new Error('Not implemented');
//   },

//   attr(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoClass(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoElement(/* value */) {
//     throw new Error('Not implemented');
//   },

//   combine(/* selector1, combinator, selector2 */) {
//     throw new Error('Not implemented');
//   },
// };
// eslint-disable-next-line func-names
class CssBuilder {
  constructor(value, context, selector1 = '', selector2 = '') {
    this.obj = {
      element: 0,
      id: 1,
      class: 2,
      attr: 3,
      pseudoClass: 4,
      pseudoElement: 5,
    };
    this.arr = [];
    this.cont = context;
    this.selector1 = selector1;
    this.selector2 = selector2;
    this.val = value;
    this.string = '';
    this.countEl = 0;
    this.countId = 0;
    this.countPsEl = 0;
    switch (this.cont) {
      case 'element':
        this.element(this.val);
        break;
      case 'id':
        this.id(this.val);
        break;
      case 'class':
        this.class(this.val);
        break;
      case 'attr':
        this.attr(this.val);
        break;
      case 'pseudoClass':
        this.pseudoClass(this.val);
        break;
      case 'pseudoElement':
        this.pseudoElement(this.val);
        break;
      case 'combine':
        this.combine(this.selector1, this.val, this.selector2);
        break;
      default:
    }
  }

  element(value) {
    this.countEl += 1;
    this.cont = 'element';
    this.errorMessage();
    this.errorFollow();
    this.string = `${this.string}${value}`;
    return this;
  }

  id(value) {
    this.countId += 1;
    this.cont = 'id';
    this.errorMessage();
    this.errorFollow();
    this.string = `${this.string}#${value}`;
    return this;
  }

  class(value) {
    this.cont = 'class';
    this.errorFollow();
    this.string = `${this.string}.${value}`;
    return this;
  }

  attr(value) {
    this.cont = 'attr';
    this.errorFollow();
    this.string = `${this.string}[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.cont = 'pseudoClass';
    this.errorFollow();
    this.string = `${this.string}:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.cont = 'pseudoElement';
    this.countPsEl += 1;
    this.errorMessage();
    this.errorFollow();
    this.string = `${this.string}::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    const comb1 = selector1.string;
    const comb2 = selector2.string;
    this.string = `${this.string}${comb1} ${combinator} ${comb2}`;
    return this;
  }

  errorMessage() {
    if (this.countEl > 1 || this.countId > 1 || this.countPsEl > 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selectorl');
    }
  }

  errorFollow() {
    this.arr.push(this.obj[this.cont]);
    if (this.arr.length > 1) {
      this.arr.forEach((item, indx) => {
        if (item > this.arr[indx + 1]) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
      });
    }
  }

  stringify() {
    return this.string;
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new CssBuilder(value, 'element');
  },

  id(value) {
    return new CssBuilder(value, 'id');
  },

  class(value) {
    return new CssBuilder(value, 'class');
  },

  attr(value) {
    return new CssBuilder(value, 'attr');
  },

  pseudoClass(value) {
    return new CssBuilder(value, 'pseudoClass');
  },

  pseudoElement(value) {
    return new CssBuilder(value, 'pseudoElement');
  },

  combine(selector1, combinator, selector2) {
    return new CssBuilder(combinator, 'combine', selector1, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};

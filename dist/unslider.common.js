/*!
 * unsliderjs - v0.2.0
 * A very simple JS slider.
 * https://nzbin.github.io/unsliderjs/
 *
 * Copyright 2023-present nzbin
 * Released under MIT License
 */

'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

// Class D
var D = function (selector, context) {
  return new D.fn.init(selector, context);
};

var document$1 = window.document,
  emptyArray = [],
  concat = emptyArray.concat,
  filter$1 = emptyArray.filter,
  slice = emptyArray.slice,
  classCache = {},
  cssNumber = {
    'column-count': 1,
    'columns': 1,
    'font-weight': 1,
    'line-height': 1,
    'opacity': 1,
    'z-index': 1,
    'zoom': 1
  },
  fragmentRE = /^\s*<(\w+|!)[^>]*>/,
  singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
  tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
  rootNodeRE = /^(?:body|html)$/i,
  // special attributes that should be get/set via method calls
  methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

  table = document$1.createElement('table'),
  tableRow = document$1.createElement('tr'),
  containers = {
    'tr': document$1.createElement('tbody'),
    'tbody': table,
    'thead': table,
    'tfoot': table,
    'td': tableRow,
    'th': tableRow,
    '*': document$1.createElement('div')
  },
  simpleSelectorRE = /^[\w-]*$/,
  class2type = {},
  toString = class2type.toString,
  tempParent = document$1.createElement('div'),
  isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  },
  contains = document$1.documentElement.contains
    ? function (parent, node) {
      return parent !== node && parent.contains(node);
    }
    : function (parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true;
      return false;
    };

function type(obj) {
  return obj == null
    ? String(obj)
    : class2type[toString.call(obj)] || 'object';
}

function isString(obj) {
  return typeof obj == 'string';
}

function isFunction(value) {
  return type(value) == 'function';
}

function isWindow(obj) {
  return obj != null && obj == obj.window;
}

function isDocument(obj) {
  return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
}

function isObject(obj) {
  return type(obj) == 'object';
}

function isPlainObject(obj) {
  return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function likeArray(obj) {
  var length = !!obj && 'length' in obj && obj.length,
    typeRes = type(obj);

  return 'function' != typeRes && !isWindow(obj) && (
    'array' == typeRes || length === 0 ||
    (typeof length == 'number' && length > 0 && (length - 1) in obj)
  );
}

function compact(array) {
  return filter$1.call(array, function (item) {
    return item != null;
  });
}

function dasherize$1(str) {
  return str.replace(/::/g, '/')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function maybeAddPx(name, value) {
  return (typeof value == 'number' && !cssNumber[dasherize$1(name)]) ? value + 'px' : value;
}

function uniq(array) {
  return filter$1.call(array, function (item, idx) {
    return array.indexOf(item) == idx;
  });
}

function camelize(str) {
  return str.replace(/-+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : '';
  });
}

function classRE(name) {
  return name in classCache ?
    classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
}

function flatten(array) {
  return array.length > 0 ? D.fn.concat.apply([], array) : array;
}

function getChildren(element) {
  return 'children' in element ?
    slice.call(element.children) :
    D.map(element.childNodes, function (node) {
      if (node.nodeType == 1) return node;
    });
}

function isD(object) {
  return object instanceof D;
}

function filtered(nodes, selector) {
  return selector == null ? D(nodes) : D(nodes).filter(selector);
}

function funcArg(context, arg, idx, payload) {
  return isFunction(arg) ? arg.call(context, idx, payload) : arg;
}

function setAttribute(node, name, value) {
  value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
}

// access className property while respecting SVGAnimatedString
function className(node, value) {
  var klass = node.className || '',
    svg = klass && klass.baseVal !== undefined;

  if (value === undefined) return svg ? klass.baseVal : klass;
  svg ? (klass.baseVal = value) : (node.className = value);
}

function nodeName(elem, name) {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}

D.fn = D.prototype = {
  constuctor: D,
  length: 0,
  // Because a collection acts like an array
  // copy over these useful array functions.
  forEach: emptyArray.forEach,
  reduce: emptyArray.reduce,
  push: emptyArray.push,
  sort: emptyArray.sort,
  splice: emptyArray.splice,
  indexOf: emptyArray.indexOf,
  // D's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  init: function (selector, context) {
    var dom;
    // If nothing given, return an empty D collection
    if (!selector) {
      return this;
    }
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim();
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector)) {
        dom = D.fragment(selector, RegExp.$1, context);
        selector = null;
      }
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) {
        return D(context).find(selector);
      }
      // If it's a CSS selector, use it to select nodes.
      else {
        dom = D.qsa(document$1, selector);
      }
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) {
      return D(document$1).ready(selector);
    }
    // If a D collection is given, just return it
    else if (isD(selector)) {
      return selector;
    }
    // normalize array if an array of nodes is given
    else if (isArray(selector)) {
      dom = compact(selector);
    }
    // Wrap DOM nodes.
    else if (isObject(selector)) {
      dom = [selector], selector = null;
    }
    // If there's a context, create a collection on that context first, and select
    // nodes from there
    else if (context !== undefined) {
      return D(context).find(selector);
    }
    // And last but no least, if it's a CSS selector, use it to select nodes.
    else {
      dom = D.qsa(document$1, selector);
    }
    // create a new D collection from the nodes found
    return D.makeArray(dom, selector, this);
  },
  // Modify the collection by adding elements to it
  concat: function () {
    var i, value, args = [];
    for (i = 0; i < arguments.length; i++) {
      value = arguments[i];
      args[i] = isD(value) ? value.toArray() : value;
    }
    return concat.apply(isD(this) ? this.toArray() : this, args);
  },
  // `pluck` is borrowed from Prototype.js
  pluck: function (property) {
    return D.map(this, function (el) { return el[property]; });
  },
  toArray: function () {
    return this.get();
  },
  get: function (idx) {
    return idx === undefined
      ? slice.call(this)
      : this[idx >= 0 ? idx : idx + this.length];
  },
  size: function () {
    return this.length;
  },
  each: function (callback) {
    emptyArray.every.call(this, function (el, idx) {
      return callback.call(el, idx, el) !== false;
    });
    return this;
  },
  map: function (fn) {
    return D(D.map(this, function (el, i) { return fn.call(el, i, el); }));
  },
  slice: function () {
    return D(slice.apply(this, arguments));
  },
  first: function () {
    var el = this[0];
    return el && !isObject(el) ? el : D(el);
  },
  last: function () {
    var el = this[this.length - 1];
    return el && !isObject(el) ? el : D(el);
  },
  eq: function (idx) {
    return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
  }
};

D.extend = D.fn.extend = function () {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }
  // Extend D itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }
  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];
        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }
        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          // Never move original objects, clone them
          target[name] = D.extend(deep, clone, copy);
          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  // Return the modified object
  return target;
};

D.extend({
  // Make DOM Array
  makeArray: function (dom, selector, me) {
    var i, len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) me[i] = dom[i];
    me.length = len;
    me.selector = selector || '';
    return me;
  },
  merge: function (first, second) {
    var len = +second.length,
      j = 0,
      i = first.length;
    for (; j < len; j++) first[i++] = second[j];
    first.length = i;
    return first;
  },
  // D's CSS selector
  qsa: function (element, selector) {
    var found,
      maybeID = selector[0] == '#',
      maybeClass = !maybeID && selector[0] == '.',
      // Ensure that a 1 char tag name still gets checked
      nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
      isSimple = simpleSelectorRE.test(nameOnly);
    return (
      // Safari DocumentFragment doesn't have getElementById
      element.getElementById && isSimple && maybeID)
      // eslint-disable-next-line no-cond-assign
      ? (found = element.getElementById(nameOnly))
        ? [found]
        : []
      : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11
        ? []
        : slice.call(
          // DocumentFragment doesn't have getElementsByClassName/TagName
          isSimple && !maybeID && element.getElementsByClassName
            ? maybeClass
              // If it's simple, it could be a class
              ? element.getElementsByClassName(nameOnly)
              // Or a tag
              : element.getElementsByTagName(selector)
            // Or it's not simple, and we need to query all
            : element.querySelectorAll(selector)
        );
  },
  // Html -> Node
  fragment: function (html, name, properties) {
    var dom, nodes, container;

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = D(document$1.createElement(RegExp.$1));

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, '<$1></$2>');
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
      if (!(name in containers)) name = '*';

      container = containers[name];
      container.innerHTML = '' + html;
      dom = D.each(slice.call(container.childNodes), function () {
        container.removeChild(this);
      });
    }

    if (isPlainObject(properties)) {
      nodes = D(dom);
      D.each(properties, function (key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value);
        else nodes.attr(key, value);
      });
    }

    return dom;
  },
  matches: function (element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false;
    var matchesSelector = element.matches || element.webkitMatchesSelector ||
      element.mozMatchesSelector || element.oMatchesSelector ||
      element.matchesSelector;
    if (matchesSelector) return matchesSelector.call(element, selector);
    // fall back to performing a selector:
    var match, parent = element.parentNode,
      temp = !parent;
    if (temp) (parent = tempParent).appendChild(element);
    match = ~D.qsa(parent, selector).indexOf(element);
    temp && tempParent.removeChild(element);
    return match;
  },
  each: function (elements, callback) {
    var i, key;
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements;
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements;
    }
    return elements;
  },
  map: function (elements, callback) {
    var value, values = [],
      i, key;
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i);
        if (value != null) values.push(value);
      }
    else
      for (key in elements) {
        value = callback(elements[key], key);
        if (value != null) values.push(value);
      }
    return flatten(values);
  }
});

// Populate the class2type map
D.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

D.fn.init.prototype = D.fn;

function css(property, value) {
  if (arguments.length < 2) {
    var element = this[0];
    if (typeof property == 'string') {
      if (!element) return;
      return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
    } else if (isArray(property)) {
      if (!element) return;
      var props = {};
      var computedStyle = getComputedStyle(element, '');
      D.each(property, function (_, prop) {
        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));
      });
      return props;
    }
  }

  var css = '';
  if (type(property) == 'string') {
    if (!value && value !== 0) {
      this.each(function () {
        this.style.removeProperty(dasherize$1(property));
      });
    } else {
      css = dasherize$1(property) + ':' + maybeAddPx(property, value);
    }
  } else {
    for (var key in property) {
      if (!property[key] && property[key] !== 0) {
        this.each(function () { this.style.removeProperty(dasherize$1(key)); });
      } else {
        css += dasherize$1(key) + ':' + maybeAddPx(key, property[key]) + ';';
      }
    }
  }

  return this.each(function () { this.style.cssText += ';' + css; });
}

function hasClass(name) {
  if (!name) return false;
  return emptyArray.some.call(this, function (el) {
    return this.test(className(el));
  }, classRE(name));
}

function addClass(name) {
  var classList = [];
  if (!name) return this;
  return this.each(function (idx) {
    if (!('className' in this)) return;
    classList = [];
    var cls = className(this),
      newName = funcArg(this, name, idx, cls);
    newName.split(/\s+/g).forEach(function (klass) {
      if (!D(this).hasClass(klass)) classList.push(klass);
    }, this);
    classList.length && className(this, cls + (cls ? ' ' : '') + classList.join(' '));
  });
}

function removeClass(name) {
  var classList = [];
  return this.each(function (idx) {
    if (!('className' in this)) return;
    if (name === undefined) return className(this, '');
    classList = className(this);
    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
      classList = classList.replace(classRE(klass), ' ');
    });
    className(this, classList.trim());
  });
}

function position() {
  if (!this.length) return;

  var elem = this[0], offset,
    // Get *real* offset parent
    offsetParent = this.offsetParent(),
    parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

  // `position: fixed` elements are offset from the viewport, which itself always has zero offset
  if (D(elem).css('position') === 'fixed') {
    // Assume `position: fixed` implies availability of getBoundingClientRect
    offset = elem.getBoundingClientRect();
  } else {
    offset = this.offset();

    // Incorporate borders into its offset, since they are outside its content origin
    parentOffset.top += parseFloat(D(offsetParent[0]).css('border-top-width')) || 0;
    parentOffset.left += parseFloat(D(offsetParent[0]).css('border-left-width')) || 0;
  }

  // Subtract parent offsets and element margins
  // note: when an element has `margin: auto` the offsetLeft and marginLeft
  // are the same in Safari causing `offset.left` to incorrectly be 0
  return {
    top: offset.top - parentOffset.top - parseFloat(D(elem).css('margin-top')) || 0,
    left: offset.left - parentOffset.left - parseFloat(D(elem).css('margin-left')) || 0
  };
}

function attr(name, value) {
  var result;
  return (typeof name == 'string' && !(1 in arguments))
    ? (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null
      ? result
      : undefined)
    : this.each(function (idx) {
      if (this.nodeType !== 1) return;
      if (isObject(name))
        for (var key in name) setAttribute(this, key, name[key]);
      else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
    });
}

function removeAttr(name) {
  return this.each(function () {
    this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
      setAttribute(this, attribute);
    }, this);
  });
}

function wrap(structure) {
  var func = isFunction(structure);
  if (this[0] && !func)
    var dom = D(structure).get(0),
      clone = dom.parentNode || this.length > 1;

  return this.each(function (index) {
    D(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
  });
}

function wrapAll(structure) {
  if (this[0]) {
    D(this[0]).before(structure = D(structure));
    var children;
    // drill down to the inmost element
    while ((children = structure.children()).length) structure = children.first();
    D(structure).append(this);
  }
  return this;
}

function find(selector) {
  var result, $this = this;
  if (!selector) result = D();
  else if (typeof selector == 'object')
    result = D(selector).filter(function () {
      var node = this;
      return emptyArray.some.call($this, function (parent) {
        return contains(parent, node);
      });
    });
  else if (this.length == 1) result = D(D.qsa(this[0], selector));
  else result = this.map(function () { return D.qsa(this, selector); });
  return result;
}

function filter(selector) {
  if (isFunction(selector)) return this.not(this.not(selector));
  return D(filter$1.call(this, function (element) {
    return D.matches(element, selector);
  }));
}

function not(selector) {
  var nodes = [];
  if (isFunction(selector) && selector.call !== undefined)
    this.each(function (idx) {
      if (!selector.call(this, idx)) nodes.push(this);
    });
  else {
    var excludes = typeof selector == 'string' ? this.filter(selector) :
      (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : D(selector);
    this.forEach(function (el) {
      if (excludes.indexOf(el) < 0) nodes.push(el);
    });
  }
  return D(nodes);
}

function parent(selector) {
  return filtered(uniq(this.pluck('parentNode')), selector);
}

function children(selector) {
  return filtered(this.map(function () { return getChildren(this); }), selector);
}

function siblings(selector) {
  return filtered(this.map(function (i, el) {
    return filter$1.call(getChildren(el.parentNode), function (child) { return child !== el; });
  }), selector);
}

function isIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  return msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
}

function subtract(el, dimen) {
  var offsetMap = {
    width: ['padding-left', 'padding-right', 'border-left-width', 'border-right-width'],
    height: ['padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width']
  };
  return el.css('box-sizing') === 'border-box' && !isIE()
    ? parseFloat(el.css(dimen))
      - parseFloat(el.css(offsetMap[dimen][0]))
      - parseFloat(el.css(offsetMap[dimen][1]))
      - parseFloat(el.css(offsetMap[dimen][2]))
      - parseFloat(el.css(offsetMap[dimen][3]))
    : parseFloat(el.css(dimen));
}

function calc(dimension, value) {
  var dimensionProperty = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
  var el = this[0];
  if (value === undefined) return isWindow(el)
    ? el.document.documentElement['client' + dimensionProperty]
    : isDocument(el)
      ? el.documentElement['scroll' + dimensionProperty]
      : subtract(this, dimension);
  else return this.each(function (idx) {
    el = D(this);
    el.css(dimension, funcArg(this, value, idx, el[dimension]()));
  });
}

// Export

function width(value) {
  return calc.call(this, 'width', value);
}

function height(value) {
  return calc.call(this, 'height', value);
}

var _zid = 1,
  handlers = {},
  focusinSupported = 'onfocusin' in window,
  focus$1 = { focus: 'focusin', blur: 'focusout' },
  hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
  ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
  returnTrue = function () { return true; },
  returnFalse = function () { return false; },
  eventMethods = {
    preventDefault: 'isDefaultPrevented',
    stopImmediatePropagation: 'isImmediatePropagationStopped',
    stopPropagation: 'isPropagationStopped'
  };

function zid(element) {
  return element._zid || (element._zid = _zid++);
}

function compatible(event, source) {
  if (source || !event.isDefaultPrevented) {
    source || (source = event);

    D.each(eventMethods, function (name, predicate) {
      var sourceMethod = source[name];
      event[name] = function () {
        this[predicate] = returnTrue;
        return sourceMethod && sourceMethod.apply(source, arguments);
      };
      event[predicate] = returnFalse;
    });

    try {
      event.timeStamp || (event.timeStamp = Date.now());
    } catch (ignored) {
      console.warn(ignored);
    }

    if (source.defaultPrevented !== undefined ? source.defaultPrevented :
      'returnValue' in source ? source.returnValue === false :
        source.getPreventDefault && source.getPreventDefault())
      event.isDefaultPrevented = returnTrue;
  }
  return event;
}

function parse(event) {
  var parts = ('' + event).split('.');
  return { e: parts[0], ns: parts.slice(1).sort().join(' ') };
}

function matcherFor(ns) {
  return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
}

function findHandlers(element, event, fn, selector) {
  event = parse(event);
  if (event.ns) var matcher = matcherFor(event.ns);
  return (handlers[zid(element)] || []).filter(function (handler) {
    return handler
      && (!event.e || handler.e == event.e)
      && (!event.ns || matcher.test(handler.ns))
      && (!fn || zid(handler.fn) === zid(fn))
      && (!selector || handler.sel == selector);
  });
}

function eventCapture(handler, captureSetting) {
  return handler.del &&
    (!focusinSupported && (handler.e in focus$1)) ||
    !!captureSetting;
}

function realEvent(type) {
  return hover[type] || (focusinSupported && focus$1[type]) || type;
}

function addEvent(element, events, fn, data, selector, delegator, capture) {
  var id = zid(element), set = (handlers[id] || (handlers[id] = []));
  events.split(/\s/).forEach(function (event) {
    if (event == 'ready') return D(document$1).ready(fn);
    var handler = parse(event);
    handler.fn = fn;
    handler.sel = selector;
    // emulate mouseenter, mouseleave
    if (handler.e in hover) fn = function (e) {
      var related = e.relatedTarget;
      if (!related || (related !== this && !contains(this, related)))
        return handler.fn.apply(this, arguments);
    };
    handler.del = delegator;
    var callback = delegator || fn;
    handler.proxy = function (e) {
      e = compatible(e);
      if (e.isImmediatePropagationStopped()) return;
      e.data = data;
      var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
      if (result === false) e.preventDefault(), e.stopPropagation();
      return result;
    };
    handler.i = set.length;
    set.push(handler);
    if ('addEventListener' in element)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
  });
}

function removeEvent(element, events, fn, selector, capture) {
  var id = zid(element);
  (events || '').split(/\s/).forEach(function (event) {
    findHandlers(element, event, fn, selector).forEach(function (handler) {
      delete handlers[id][handler.i];
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
    });
  });
}

function createProxy(event) {
  var key, proxy = { originalEvent: event };
  for (key in event)
    if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];

  return compatible(proxy, event);
}

function traverseNode(node, fn) {
  fn(node);
  for (var i = 0, len = node.childNodes.length; i < len; i++)
    traverseNode(node.childNodes[i], fn);
}

// inside => append, prepend
function domMani(elem, args, fn, inside) {
  // arguments can be nodes, arrays of nodes, D objects and HTML strings
  var argType,
    nodes = D.map(args, function (arg) {
      var arr = [];
      argType = type(arg);
      if (argType == 'array') {
        arg.forEach(function (el) {
          if (el.nodeType !== undefined) return arr.push(el);
          else if (isD(el)) return arr = arr.concat(el.get());
          arr = arr.concat(D.fragment(el));
        });
        return arr;
      }
      return argType == 'object' || arg == null ? arg : D.fragment(arg);
    }),
    parent,
    copyByClone = elem.length > 1;

  if (nodes.length < 1) return elem;

  return elem.each(function (_, target) {
    parent = inside ? target : target.parentNode;
    var parentInDocument = contains(document$1.documentElement, parent);

    nodes.forEach(function (node) {
      if (copyByClone) node = node.cloneNode(true);
      else if (!parent) return D(node).remove();

      fn.call(target, node);

      if (parentInDocument) {
        traverseNode(node, function (el) {
          if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
            (!el.type || el.type === 'text/javascript') && !el.src) {
            var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
            target['eval'].call(target, el.innerHTML);
          }
        });
      }
    });
  });
}

function getAll(context, tag) {
  var ret;
  if (typeof context.getElementsByTagName !== 'undefined') {
    ret = context.getElementsByTagName(tag || '*');
  } else if (typeof context.querySelectorAll !== 'undefined') {
    ret = context.querySelectorAll(tag || '*');
  } else {
    ret = [];
  }
  if (tag === undefined || tag && nodeName(context, tag)) {
    return D.merge([context], ret);
  }
  return ret;
}

function cleanData(elems) {
  var events, elem,
    i = 0;
  for (; (elem = elems[i]) !== undefined; i++) {
    if (elem._zid && (events = handlers[elem._zid])) {
      events.forEach(evt => {
        const type = evt.e + '.' + evt.ns.split(' ').join('.');
        removeEvent(elem, type, evt.fn, evt.sel);
      });
    }
  }
}

// Export

function remove() {
  return this.each(function () {
    if (this.nodeType === 1) {
      // Prevent memory leaks
      cleanData(getAll(this));
    }

    if (this.parentNode != null)
      this.parentNode.removeChild(this);
  });
}

function clone() {
  return this.map(function () {
    return this.cloneNode(true);
  });
}

function append() {
  return domMani(this, arguments, function (elem) {
    this.insertBefore(elem, null);
  }, true);
}

function after() {
  return domMani(this, arguments, function (elem) {
    this.parentNode.insertBefore(elem, this.nextSibling);
  }, false);
}

function before() {
  return domMani(this, arguments, function (elem) {
    this.parentNode.insertBefore(elem, this);
  }, false);
}

function insertAfter(html) {
  D(html)['after'](this);
  return this;
}

function insertBefore(html) {
  D(html)['before'](this);
  return this;
}

function on(event, selector, data, callback, one) {
  var autoRemove, delegator, $this = this;
  if (event && !isString(event)) {
    D.each(event, function (type, fn) {
      $this.on(type, selector, data, fn, one);
    });
    return $this;
  }

  if (!isString(selector) && !isFunction(callback) && callback !== false)
    callback = data, data = selector, selector = undefined;
  if (callback === undefined || data === false)
    callback = data, data = undefined;

  if (callback === false) callback = returnFalse;

  return $this.each(function (_, element) {
    if (one) autoRemove = function (e) {
      removeEvent(element, e.type, callback);
      return callback.apply(this, arguments);
    };

    if (selector) delegator = function (e) {
      var evt, match = D(e.target).closest(selector, element).get(0);
      if (match && match !== element) {
        evt = D.extend(createProxy(e), { currentTarget: match, liveFired: element });
        return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
      }
    };

    addEvent(element, event, callback, data, selector, delegator || autoRemove);
  });
}

function off(event, selector, callback) {
  var $this = this;
  if (event && !isString(event)) {
    D.each(event, function (type, fn) {
      $this.off(type, selector, fn);
    });
    return $this;
  }

  if (!isString(selector) && !isFunction(callback) && callback !== false)
    callback = selector, selector = undefined;

  if (callback === false) callback = returnFalse;

  return $this.each(function () {
    removeEvent(this, event, callback, selector);
  });
}

function trigger(event, args) {
  event = (isString(event) || isPlainObject(event)) ? D.Event(event) : compatible(event);
  event._args = args;
  return this.each(function () {
    // handle `focus()`, `blur()` by calling them directly
    if (event.type in focus && typeof this[event.type] == 'function') this[event.type]();
    // items in the collection might not be DOM elements
    else if ('dispatchEvent' in this) this.dispatchEvent(event);
    else D(this).triggerHandler(event, args);
  });
}

// Event
var specialEvents = {
  click: 'MouseEvents',
  mousedown: 'MouseEvents',
  mouseup: 'MouseEvents',
  mousemove: 'MouseEvents',
};

function Event(type, props) {
  if (!isString(type)) props = type, type = props.type;
  var event = document$1.createEvent(specialEvents[type] || 'Events'), bubbles = true;
  if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
  event.initEvent(type, bubbles, true);
  return compatible(event);
}

var prefix = '',
  eventPrefix,
  vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
  testEl = document$1.createElement('div'),
  testTransitionProperty = testEl.style.transitionProperty;

if (testEl.style.transform === undefined) D.each(vendors, function (vendor, event) {
  if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
    prefix = '-' + vendor.toLowerCase() + '-';
    eventPrefix = event;
    return false;
  }
});

testEl = null;

// fx cannot seperate
function normalizeEvent(name) {
  return eventPrefix ? eventPrefix + name : name.toLowerCase();
}

D.fx = {
  off: (eventPrefix === undefined && testTransitionProperty === undefined),
  speeds: { _default: 400, fast: 200, slow: 600 },
  cssPrefix: prefix,
  transitionEnd: normalizeEvent('TransitionEnd'),
  animationEnd: normalizeEvent('AnimationEnd')
};

var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
  transform,
  transitionProperty, transitionDuration, transitionTiming, transitionDelay,
  animationName, animationDuration, animationTiming, animationDelay,
  cssReset = {};

function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase(); }

transform = prefix + 'transform';
cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay = prefix + 'transition-delay'] =
  cssReset[transitionTiming = prefix + 'transition-timing-function'] =
  cssReset[animationName = prefix + 'animation-name'] =
  cssReset[animationDuration = prefix + 'animation-duration'] =
  cssReset[animationDelay = prefix + 'animation-delay'] =
  cssReset[animationTiming = prefix + 'animation-timing-function'] = '';

function anim(properties, duration, ease, callback, delay) {
  var key, cssValues = {}, cssProperties, transforms = '',
    that = this, wrappedCallback, endEvent = D.fx.transitionEnd,
    fired = false;

  if (duration === undefined) duration = D.fx.speeds._default / 1000;
  if (delay === undefined) delay = 0;
  if (D.fx.off) duration = 0;

  if (typeof properties == 'string') {
    // keyframe animation
    cssValues[animationName] = properties;
    cssValues[animationDuration] = duration + 's';
    cssValues[animationDelay] = delay + 's';
    cssValues[animationTiming] = (ease || 'linear');
    endEvent = D.fx.animationEnd;
  } else {
    cssProperties = [];
    // CSS transitions
    for (key in properties)
      if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') ';
      else cssValues[key] = properties[key], cssProperties.push(dasherize(key));

    if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
    if (duration > 0 && typeof properties === 'object') {
      cssValues[transitionProperty] = cssProperties.join(', ');
      cssValues[transitionDuration] = duration + 's';
      cssValues[transitionDelay] = delay + 's';
      cssValues[transitionTiming] = (ease || 'linear');
    }
  }

  wrappedCallback = function (event) {
    if (typeof event !== 'undefined') {
      if (event.target !== event.currentTarget) return; // makes sure the event didn't bubble from "below"
      D(event.target).off(endEvent, wrappedCallback);
    } else
      D(this).off(endEvent, wrappedCallback); // triggered by setTimeout

    fired = true;
    D(this).css(cssReset);
    callback && callback.call(this);
  };
  if (duration > 0) {
    this.on(endEvent, wrappedCallback);
    // transitionEnd is not always firing on older Android phones
    // so make sure it gets fired
    setTimeout(function () {
      if (fired) return;
      wrappedCallback.call(that);
    }, ((duration + delay) * 1000) + 25);
  }

  // trigger page reflow so new elements can animate
  this.size() && this.get(0).clientLeft;

  this.css(cssValues);

  if (duration <= 0) setTimeout(function () {
    that.each(function () { wrappedCallback.call(this); });
  }, 0);

  return this;
}

function animate(properties, duration, ease, callback, delay) {
  if (isFunction(duration))
    callback = duration, ease = undefined, duration = undefined;
  if (isFunction(ease))
    callback = ease, ease = undefined;
  if (isPlainObject(duration))
    ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration;
  if (duration) duration = (typeof duration == 'number' ? duration :
    (D.fx.speeds[duration] || D.fx.speeds._default)) / 1000;
  if (delay) delay = parseFloat(delay) / 1000;
  return this.anim(properties, duration, ease, callback, delay);
}

var methods = {
  isFunction: isFunction,
  Event: Event
};
var fnMethods = {
  attr: attr,
  removeAttr: removeAttr,
  css: css,
  find: find,
  filter: filter,
  not: not,
  children: children,
  parent: parent,
  siblings: siblings,
  wrap: wrap,
  wrapAll: wrapAll,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  clone: clone,
  before: before,
  after: after,
  insertAfter: insertAfter,
  insertBefore: insertBefore,
  append: append,
  remove: remove,
  width: width,
  height: height,
  position: position,
  on: on,
  off: off,
  trigger: trigger,
  anim: anim,
  animate: animate
};
D.extend(methods);
D.fn.extend(fnMethods);

function supportTouch() {
  return !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
}
var TOUCH_START_EVENT = supportTouch() ? 'touchstart' : 'mousedown';
var TOUCH_MOVE_EVENT = supportTouch() ? 'touchmove' : 'mousemove';
var TOUCH_END_EVENT = supportTouch() ? 'touchend' : 'mouseup';
var uid = 1;
var Unslider = /*#__PURE__*/function () {
  function Unslider(el, options) {
    var _this = this;
    _classCallCheck(this, Unslider);
    // Create an Unslider reference we can use everywhere
    _defineProperty(this, "_", Unslider.namespace);
    // Store our default options in here
    _defineProperty(this, "defaults", {
      // Whether to enable infinite loop
      infinite: false,
      // Should the slider move on its own or only when you interact with the nav/arrows?
      // Only accepts boolean true/false.
      autoplay: false,
      // The time delay between slides moving, pass as a number in milliseconds.
      delay: 3000,
      // Animation speed in millseconds
      speed: 750,
      // An easing string to use.
      easing: 'swing',
      // [.42, 0, .58, 1],

      // Does it support keyboard arrows?
      // Can pass either true or false - or an object with the keycodes, like so:
      // {
      //   prev: 37,
      //   next: 39
      // }
      // You can call any internal method name before the keycode and it'll be called.
      keys: {
        prev: 37,
        next: 39
      },
      // Do you want to generate clickable navigation to skip to each slide?
      // Accepts boolean true/false or a callback function per item to generate.
      nav: true,
      // Should there be left/right arrows to go back/forth?
      // -> This isn't keyboard support.
      // Either set true/false, or an object with the HTML
      // elements for each arrow like below:
      arrows: {
        prev: '<a class="' + this._ + '-arrow prev">Prev</a>',
        next: '<a class="' + this._ + '-arrow next">Next</a>'
      },
      // How should Unslider animate?
      // It can do one of the following types:
      //  "fade": each slide fades in to each other
      //  "horizontal": each slide moves from left to right
      //  "vertical": each slide moves from top to bottom
      animation: 'horizontal',
      // If you don't want to use a list to display your slides, you can change it here.
      // Not recommended and you'll need to adjust the CSS accordingly.
      selectors: {
        container: 'ul',
        slides: 'li'
      },
      // Do you want to animate the heights of each slide as it moves
      animateHeight: false,
      // Active class for the nav
      activeClass: this._ + '-active',
      // Have swipe support?
      // You can set this here with a boolean and always use initSwipe/destroySwipe later on.
      swipe: true,
      // Ratio to trigger swipe to next/previous slide during long swipes.
      swipeThreshold: 0.2,
      // Whether set "grab" cursor when hover on the slider
      grabCursor: true
    });
    // Store original DOM
    _defineProperty(this, "$el", null);
    // Set defaults
    _defineProperty(this, "$context", null);
    _defineProperty(this, "options", {});
    // Leave our elements blank for now
    // Since they get changed by the options, we'll need to set them in the init method.
    _defineProperty(this, "$parent", null);
    _defineProperty(this, "$container", null);
    _defineProperty(this, "$slides", null);
    _defineProperty(this, "$nav", null);
    _defineProperty(this, "$arrows", []);
    // Set our indexes and totals
    _defineProperty(this, "total", 0);
    _defineProperty(this, "current", 0);
    // Generate a specific random ID so we don't dupe events
    _defineProperty(this, "prefix", this._ + '-');
    _defineProperty(this, "eventSuffix", '.' + this.prefix + ~~(Math.random() * 2e3));
    // In case we're going to use the autoplay
    _defineProperty(this, "interval", null);
    // Add RTL support, slide the slider the other way if the site is right-to-left
    _defineProperty(this, "rtl", false);
    // The key of slider instance in store
    _defineProperty(this, "uid", null);
    // Shortcuts for animating if we don't know what the current index is (i.e back/forward)
    // For moving forward we need to make sure we don't overshoot.
    _defineProperty(this, "next", function () {
      var target = _this.current + 1;

      // If we're at the end, we need to move back to the start
      if (target >= _this.total) {
        target = 0;
      }
      return _this.animate(target, 'next');
    });
    // Previous is a bit simpler, we can just decrease the index
    // by one and check if it's over 0.
    _defineProperty(this, "prev", function () {
      return _this.animate(_this.current - 1, 'prev');
    });
    this.$el = D(el).clone().removeAttr('data-' + this._);
    this.$context = D(el);
    this.init(options);
  }

  // Get everything set up innit
  _createClass(Unslider, [{
    key: "init",
    value: function init(options) {
      var _this2 = this;
      this.uid = this.$context.attr('data-' + this._);
      this.rtl = this.$context.attr('dir') === 'rtl';

      // Set up our options inside here so we can re-init at any time
      this.options = D.extend({}, this.defaults, options);

      // Our elements
      this.$container = this.$context.find(this.options.selectors.container).first().addClass(this.prefix + 'wrap');
      this.$slides = this.$container.children(this.options.selectors.slides);

      // We'll manually init the container
      this.setup();

      // We want to keep this script as small as possible
      // so we'll optimise some checks
      D.each(['nav', 'arrows', 'keys', 'infinite'], function (index, module) {
        _this2.options[module] && _this2['init' + D._ucfirst(module)]();
      });

      // Add swipe support
      if (this.options.swipe) {
        this.initSwipe();
      }

      // If autoplay is set to true, call `this.start()` to start calling our timeouts
      this.options.autoplay && this.start();

      // We should be able to recalculate slides at will
      this.calculateSlides();

      // Listen to a ready event
      this.$context.trigger(this._ + ':ready');

      // Everyday I'm chainin'
      return this.animate(this.options.index || this.current, 'init');
    }
  }, {
    key: "setup",
    value: function setup() {
      // Add a CSS hook to the main element
      this.$context.addClass(this.prefix + this.options.animation).wrap('<div class="' + this._ + '" />');
      this.$parent = this.$context.parent('.' + this._);

      // We need to manually check if the container is absolutely
      // or relatively positioned
      var position = this.$context.css('position');

      // If we don't already have a position set, we'll
      // automatically set it ourselves
      if (position === 'static') {
        this.$context.css('position', 'relative');
      }
      this.$context.css('overflow', 'hidden');
    }

    // Set up the slide widths to animate with
    // so the box doesn't float over
  }, {
    key: "calculateSlides",
    value: function calculateSlides() {
      // update slides before recalculating the total
      this.$slides = this.$container.children(this.options.selectors.slides);
      this.total = this.$slides.length;

      // Set the total width
      if (this.options.animation !== 'fade') {
        var prop = 'width';
        if (this.options.animation === 'vertical') {
          prop = 'height';
        }
        this.$container.css(prop, this.total * 100 + '%').addClass(this.prefix + 'carousel');
        this.$slides.css(prop, 100 / this.total + '%');
      }
    }

    // Start our autoplay
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;
      this.interval = setTimeout(function () {
        // Move on to the next slide
        _this3.next();

        // If we've got autoplay set up
        // we don't need to keep starting
        // the slider from within our timeout
        // as .animate() calls it for us
      }, this.options.delay);
      return this;
    }

    // And pause our timeouts and force stop the slider if needed
  }, {
    key: "stop",
    value: function stop() {
      clearTimeout(this.interval);
      this.interval = null;
      return this;
    }

    // Set up our navigation
  }, {
    key: "initNav",
    value: function initNav() {
      var _this4 = this;
      var $nav = D('<nav class="' + this.prefix + 'nav"><ol /></nav>');

      // Build our click navigation item-by-item
      this.$slides.each(function (key, slide) {
        // If we've already set a label, let's use that
        // instead of generating one
        var label = slide.getAttribute('data-nav') || key + 1;

        // Listen to any callback functions
        if (D.isFunction(_this4.options.nav)) {
          label = _this4.options.nav.call(_this4.$slides.eq(key), key, label);
        }

        // And add it to our navigation item
        $nav.children('ol').append('<li data-slide="' + key + '">' + label + '</li>');
      });

      // Keep a copy of the nav everywhere so we can use it
      this.$nav = $nav.insertAfter(this.$context);

      // Now our nav is built, let's add it to the slider and bind
      // for any click events on the generated links
      this.$nav.find('li').on('click' + this.eventSuffix, function (e) {
        // Cache our link and set it to be active
        var $me = D(e.currentTarget).addClass(_this4.options.activeClass);

        // Set the right active class, remove any other ones
        $me.siblings().removeClass(_this4.options.activeClass);

        // Move the slide
        _this4.animate($me.attr('data-slide'));
      });
    }

    // Set up our left-right arrow navigation (Not keyboard arrows, prev/next buttons)
  }, {
    key: "initArrows",
    value: function initArrows() {
      var _this5 = this;
      if (this.options.arrows === true) {
        this.options.arrows = this.defaults.arrows;
      }

      // Loop our options object and bind our events
      D.each(this.options.arrows, function (key, val) {
        // Add our arrow HTML and bind it
        _this5.$arrows.push(D(val).insertAfter(_this5.$context).on('click' + _this5.eventSuffix, _this5[key]));
      });
    }

    // Set up our keyboad navigation
    // Allow binding to multiple keycodes
  }, {
    key: "initKeys",
    value: function initKeys() {
      var _this6 = this;
      if (this.options.keys === true) {
        this.options.keys = this.defaults.keys;
      }
      D(document).on('keyup' + this.eventSuffix, function (e) {
        D.each(_this6.options.keys, function (key, val) {
          if (e.which === val) {
            D.isFunction(_this6[key]) && _this6[key].call(_this6);
          }
        });
      });
    }
  }, {
    key: "initSwipe",
    value: function initSwipe() {
      var _this7 = this;
      // We don't want to have a tactile swipe in the slider
      // in the fade animation, as it can cause some problems
      // with layout, so we'll just disable it.
      if (this.options.animation !== 'fade') {
        this.options.grabCursor && this.$context.css('cursor', 'grab');
        var isHorizontal = this.options.animation === 'horizontal';
        var direction = isHorizontal ? this.rtl ? 'right' : 'left' : 'top';
        var width = 0;
        var height = 0;
        var startX = 0;
        var startY = 0;
        var distX = 0;
        var distY = 0;
        var moveStart = function moveStart(e) {
          e.preventDefault();
          e.stopPropagation();
          width = _this7.$context.width();
          height = _this7.$context.height();
          distX = 0;
          distY = 0;
          startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
          startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
          _this7.options.grabCursor && _this7.$context.css('cursor', 'grabbing');
          D(document).on(TOUCH_MOVE_EVENT, move).on(TOUCH_END_EVENT, moveEnd);
        };
        var move = function move(e) {
          e.stopPropagation();
          var endX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
          var endY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
          distX = endX - startX;
          distY = endY - startY;
          var dist = isHorizontal ? distX * (_this7.rtl ? -1 : 1) : distY;
          var size = isHorizontal ? width : height;
          _this7.$container.css(direction, -(100 * _this7.current) + 100 * dist / size + '%');
        };
        var moveEnd = function moveEnd() {
          var dist = isHorizontal ? distX * (_this7.rtl ? -1 : 1) : distY;
          var size = isHorizontal ? width : height;
          if (Math.abs(dist) / size > _this7.options.swipeThreshold) {
            _this7[dist < 0 ? 'next' : 'prev']();
          } else {
            _this7.$container.animate(_defineProperty({}, direction, -(100 * _this7.current) + '%'), _this7.options.speed / 2);
          }
          _this7.options.grabCursor && _this7.$context.css('cursor', 'grab');
          D(document).off(TOUCH_MOVE_EVENT, move).off(TOUCH_END_EVENT, moveEnd);
        };
        this.$container.on(TOUCH_START_EVENT, moveStart);
      }
    }

    // Infinite scrolling is a massive pain in the arse
    // so we need to create a whole bloody function to set it up. Argh.
  }, {
    key: "initInfinite",
    value: function initInfinite() {
      var _this8 = this;
      var pos = ['first', 'last'];
      D.each(pos, function (index, item) {
        _this8.$slides.push.apply(_this8.$slides,
        // Exclude all cloned slides and call .first() or .last()
        // depending on what `item` is.
        _this8.$slides.not('.' + _this8._ + '-clone')[item]()

        // Make a copy of it and identify it as a clone
        .clone().addClass(_this8._ + '-clone')

        // Either insert before or after depending on whether we're
        // the first or last clone
        // eslint-disable-next-line no-unexpected-multiline
        ['insert' + (index === 0 ? 'After' : 'Before')](
        // Return the other element in the position array
        // if item = first, return "last"
        _this8.$slides[pos[~~!index]]()));
      });
    }

    // Remove the slider and revert the original DOM
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.$el) {
        this.$parent.after(this.$el);
        this.$parent.remove();
        this.destroyKeys();
        if (this.interval != null) {
          this.stop();
        }
        if (this.uid != null) {
          delete Unslider.store[this.uid];
        }
        this.$el = null;
      }
    }

    // Remove any trace of arrows
    // It'll unbind any event handlers for us
  }, {
    key: "destroyArrows",
    value: function destroyArrows() {
      D.each(this.$arrows, function (i, $arrow) {
        $arrow.remove();
      });
    }

    // Remove any swipe events and reset the position
  }, {
    key: "destroySwipe",
    value: function destroySwipe() {
      this.$container.off(TOUCH_START_EVENT);
    }

    // Unset the keyboard navigation
  }, {
    key: "destroyKeys",
    value: function destroyKeys() {
      // Remove the event handler
      D(document).off('keyup' + this.eventSuffix);
    }
  }, {
    key: "setIndex",
    value: function setIndex(to) {
      if (to < 0) {
        to = this.total - 1;
      }
      this.current = Math.min(Math.max(0, to), this.total - 1);
      if (this.options.nav) {
        this.$nav.find('[data-slide="' + this.current + '"]')._active(this.options.activeClass);
      }
      this.$slides.eq(this.current)._active(this.options.activeClass);
      return this;
    }

    // Despite the name, this doesn't do any animation - since there's
    // now three different types of animation, we let this method delegate
    // to the right type, keeping the name for backwards compat.
  }, {
    key: "animate",
    value: function animate(to, dir) {
      // Animation shortcuts
      // Instead of passing a number index, we can now use
      // `slider.animate('last')` to go to the very last slide
      if (to === 'first') to = 0;
      if (to === 'last') to = this.total;

      // Don't animate if it's not a valid index
      if (isNaN(to)) {
        return this;
      }
      if (this.options.autoplay) {
        this.stop().start();
      }
      this.setIndex(to);

      // Add a callback method to do stuff with
      this.$context.trigger(this._ + ':change', [to, this.$slides.eq(to)]);

      // Delegate the right method - everything's named consistently
      // so we can assume it'll be called "animate" +
      var fn = 'animate' + D._ucfirst(this.options.animation);

      // Make sure it's a valid animation method, otherwise we'll get
      // a load of bug reports that'll be really hard to report
      if (D.isFunction(this[fn])) {
        this[fn](this.current, dir);
      }
      return this;
    }
  }, {
    key: "animateHorizontal",
    value:
    // Our default animation method, the old-school left-to-right horizontal animation
    function animateHorizontal(to) {
      var prop = this.rtl ? 'right' : 'left';
      if (this.options.infinite) {
        // So then we need to hide the first slide
        this.$container.css('margin-' + prop, '-100%');
      }
      return this.slide(prop, to);
    }

    // The same animation methods, but vertical support
    // RTL doesn't affect the vertical direction so we can just call as is
  }, {
    key: "animateVertical",
    value: function animateVertical(to) {
      this.options.animateHeight = true;

      // Normal infinite CSS fix doesn't work for vertical animation
      // so we need to manually set it with pixels. Ah well.
      if (this.options.infinite) {
        this.$container.css('margin-top', -this.$slides.get(0).offsetHeight);
      }
      return this.slide('top', to);
    }

    // Actually move the slide now
    // We have to pass a property to animate as there's
    // a few different directions it can now move, but it's
    // otherwise unchanged from before.
  }, {
    key: "slide",
    value: function slide(prop, to) {
      var _this9 = this;
      // If we want to change the height of the slider
      // to match the current slide, you can set
      // { animateHeight: true }
      this.animateHeight(to);

      // For infinite sliding we add a dummy slide at the end and start
      // of each slider to give the appearance of being infinite
      if (this.options.infinite) {
        var dummy;

        // Going backwards to last slide
        if (to === this.total - 1) {
          // We're setting a dummy position and an actual one
          // the dummy is what the index looks like
          // (and what we'll silently update to afterwards),
          // and the actual is what makes it not go backwards
          dummy = this.total - 3;
          to = -1;
        }

        // Going forwards to first slide
        if (to === this.total - 2) {
          dummy = 0;
          to = this.total - 2;
        }

        // If it's a number we can safely set it
        if (typeof dummy === 'number') {
          this.setIndex(dummy);

          // Listen for when the slide's finished transitioning so
          // we can silently move it into the right place and clear
          // this whole mess up.
          this.$context.on(this._ + ':moved', function () {
            if (_this9.current === dummy) {
              _this9.$container.css(prop, -(100 * dummy) + '%').off(_this9._ + ':moved');
            }
          });
        }
      }

      // We need to create an object to store our property in
      // since we don't know what it'll be.
      var obj = {};

      // Manually create it here
      obj[prop] = -(100 * to) + '%';

      // And animate using our newly-created object
      return this._move(this.$container, obj);
    }

    // Fade between slides rather than, uh, sliding it
  }, {
    key: "animateFade",
    value: function animateFade(to) {
      // If we want to change the height of the slider
      // to match the current slide, you can set
      // { animateHeight: true }
      this.animateHeight(to);
      var $active = this.$slides.eq(to).addClass(this.options.activeClass);

      // Toggle our classes
      this._move($active.siblings().removeClass(this.options.activeClass), {
        opacity: 0
      });
      this._move($active, {
        opacity: 1
      }, false);
    }

    // Animate height of slider
  }, {
    key: "animateHeight",
    value: function animateHeight(to) {
      // If we want to change the height of the slider
      // to match the current slide, you can set
      // { animateHeight: true }
      if (this.options.animateHeight) {
        this._move(this.$context, {
          height: this.$slides.eq(to).get(0).offsetHeight
        }, false);
      }
    }
  }, {
    key: "_move",
    value: function _move($el, obj, callback, speed) {
      var _this10 = this;
      if (callback !== false) {
        callback = function callback() {
          _this10.$context.trigger(_this10._ + ':moved');
        };
      }
      return $el.animate(obj, speed || this.options.speed, this.options.easing, callback);
    }
  }], [{
    key: "create",
    value:
    // Make sure the Unslider can only be initialized once
    function create(el, options) {
      var id = D(el).attr('data-' + Unslider.namespace);
      if (id != null) {
        return Unslider.store[id];
      }
      D(el).attr('data-' + Unslider.namespace, uid);
      var slider = Unslider.store[uid] = new Unslider(el, options);
      uid++;
      return slider;
    }

    // Store Unslider instances
  }]);
  return Unslider;
}(); // They're both just helpful types of shorthand for
// anything that might take too long to write out or
// something that might be used more than once.
_defineProperty(Unslider, "namespace", 'unslider');
_defineProperty(Unslider, "store", Object.create(null));
D.fn._active = function (className) {
  return this.addClass(className).siblings().removeClass(className);
};

// The equivalent to PHP's ucfirst(). Take the first
// character of a string and make it uppercase.
// Simples.
D._ucfirst = function (str) {
  // Take our variable, run a regex on the first letter
  return (str + '').toLowerCase().replace(/^./, function (match) {
    // And uppercase it. Simples.
    return match.toUpperCase();
  });
};

module.exports = Unslider;

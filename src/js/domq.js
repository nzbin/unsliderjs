import {
  D as $,
  Event,
  addClass,
  after,
  anim,
  animate,
  append,
  attr,
  before,
  children,
  clone,
  css,
  filter,
  find,
  hasClass,
  height,
  insertAfter,
  insertBefore,
  isFunction,
  not,
  off,
  on,
  parent,
  position,
  remove,
  removeClass,
  siblings,
  trigger,
  width,
  wrap,
  wrapAll,
} from 'domq.js/src/domq.modular';

const methods = {
  isFunction,
  Event,
};

const fnMethods = {
  attr,
  css,
  find,
  filter,
  not,
  children,
  parent,
  siblings,
  wrap,
  wrapAll,
  addClass,
  removeClass,
  hasClass,
  clone,
  before,
  after,
  insertAfter,
  insertBefore,
  append,
  remove,
  width,
  height,
  position,
  on,
  off,
  trigger,
  anim,
  animate,
};

$.extend(methods);
$.fn.extend(fnMethods);

export default $;
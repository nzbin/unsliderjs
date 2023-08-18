import {
  D,
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

const $ = D;

const methods = {
  isFunction,
  Event,
};

const fnMethods = {
  find,
  not,
  css,
  clone,
  filter,
  children,
  wrap,
  wrapAll,
  addClass,
  removeClass,
  hasClass,
  attr,
  before,
  after,
  insertAfter,
  insertBefore,
  append,
  remove,
  parent,
  siblings,
  width,
  height,
  position,
  on,
  off,
  anim,
  animate,
  trigger
};

$.extend(methods);
$.fn.extend(fnMethods);

export default $;

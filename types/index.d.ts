declare namespace Unslider {
  export interface Options {
    /**
     * Should the slider move on its own or only when you interact with the nav/arrows?
     *
     * @defaultValue false
     */
    autoplay: boolean;
    /**
     * 3 second delay between slides moving, pass as a number in milliseconds.
     *
     * @defaultValue 3000
     */
    delay: number;
    /**
     * Animation speed in millseconds.
     *
     * @defaultValue 750
     */
    speed: number;
    /**
     * An easing string to use.
     *
     * @defaultValue 'swing'
     */
    easing: string;
    /**
     * Does it support keyboard arrows? Can pass either true or false -
     * or an object with the keycodes, like so:
     *
     * ```js
     * {
     *   prev: 37,
     *   next: 39
     * }
     * ```
     * You can call any internal method name before the keycode and it'll be called.
     *
     * @defaultValue
     *
     * ```js
     * {
     *   prev: 37,
     *   next: 39
     * }
     * ```
     */
    keys: boolean | Record<string, number>;
    /**
     * Do you want to generate clickable navigation to skip to each slide?
     * Accepts boolean true/false or a callback function per item to generate.
     *
     * @defaultValue true
     */
    nav: boolean | ((index: number, label: string) => number | string);
    /**
     * Should there be left/right arrows to go back/forth?
     * Either set true/false, or an object with the HTML elements for each arrow like below:
     *
     * ```js
     * {
     *  prev: '<a class="unslider-arrow prev">Prev</a>',
     *  next: '<a class="unslider-arrow next">Next</a>'
     * }
     * ```
     *
     * @defaultValue
     *
     * ```js
     * {
     *  prev: '<a class="unslider-arrow prev">Prev</a>',
     *  next: '<a class="unslider-arrow next">Next</a>'
     * }
     * ```
     */
    arrows: Record<string, string>;
    /**
     * How should Unslider animate? It can do one of the following types:
     * - "fade": each slide fades in to each other
     * - "horizontal": each slide moves from left to right
     * - "vertical": each slide moves from top to bottom
     *
     * @defaultValue 'horizontal'
     */
    animation: 'horizontal' | 'vertical' | 'fade';
    /**
     * If you don't want to use a list to display your slides, you can change it here.
     * Not recommended and you'll need to adjust the CSS accordingly.
     *
     * @defaultValue
     *
     * ```js
     * {
     *   container: 'ul',
     *   slides: 'li'
     * }
     * ```
     */
    selectors: Record<string, string>;
    /**
     * Do you want to animate the heights of each slide as it moves
     *
     * @defaultValue false
     */
    animateHeight: boolean;
    /**
     * Active class for the nav
     *
     * @defaultValue 'unslider-active'
     */
    activeClass: string;
    /**
     * Have swipe support?
     * You can set this here with a boolean and always use initSwipe/destroySwipe later on.
     *
     * @defaultValue true
     */
    swipe: boolean;
    /**
     * Swipe threshold - lower float for enabling short swipe
     *
     * @defaultValue 0.2
     */
    swipeThreshold: number;
    /**
     * Whether set "grab" cursor when hover on the slider
     *
     * @defaultValue true
     */
    grabCursor: boolean;
  }
}

declare class Unslider {
  static create(el: string | Node, options: Unslider.Options): Unslider;

  constructor(el: string | Node, options: Unslider.Options);

  init(options: Unslider.Options): Unslider;
  calculateSlides(): void;
  start(): Unslider;
  stop(): Unslider;
  destroy(): void;
  initKeys(): void;
  destroyKeys(): void;
  initSwipe(): void;
  destroySwipe(): void;
  setIndex(to: 'first' | 'last' | number): Unslider;
  animate(to: 'first' | 'last' | number, dir: 'prev' | 'next'): Unslider;
  next(): Unslider;
  prev(): Unslider;
}

declare module 'unslider' {
  export default Unslider;
}

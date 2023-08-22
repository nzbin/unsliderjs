import $ from './domq.js';

let uid = 1;

class Unslider {
  // Make sure the Unslider can only be initialized once
  static create(el, options) {
    const sid = $(el).attr('data-unslider');
    if (sid != null) {
      return Unslider.store[sid];
    }
    $(el).attr('data-unslider', uid);
    Unslider.store[uid] = new Unslider(el, options);
    uid++;
    return Unslider.store[uid];
  }

  // Store Unslider instances
  static store = Object.create(null);

  // Create an Unslider reference we can use everywhere
  _ = 'unslider';

  // Store our default options in here
  // Everything will be overwritten by the jQuery plugin though
  defaults = {
    // Should the slider move on its own or only when
    // you interact with the nav/arrows?
    // Only accepts boolean true/false.
    autoplay: false,

    // 3 second delay between slides moving, pass
    // as a number in milliseconds.
    delay: 3000,

    // Animation speed in millseconds
    speed: 750,

    // An easing string to use.
    easing: 'swing', // [.42, 0, .58, 1],

    // Does it support keyboard arrows?
    // Can pass either true or false -
    // or an object with the keycodes, like so:
    // {
    //   prev: 37,
    //   next: 39
    // }
    // You can call any internal method name
    // before the keycode and it'll be called.
    keys: {
      prev: 37,
      next: 39
    },

    // Do you want to generate clickable navigation
    // to skip to each slide? Accepts boolean true/false or
    // a callback function per item to generate.
    nav: true,

    // Should there be left/right arrows to go back/forth?
    //  -> This isn't keyboard support.
    // Either set true/false, or an object with the HTML
    // elements for each arrow like below:
    arrows: {
      prev: '<a class="' + this._ + '-arrow prev">Prev</a>',
      next: '<a class="' + this._ + '-arrow next">Next</a>'
    },

    // How should Unslider animate?
    // It can do one of the following types:
    // "fade": each slide fades in to each other
    // "horizontal": each slide moves from left to right
    // "vertical": each slide moves from top to bottom
    animation: 'horizontal',

    // If you don't want to use a list to display your slides,
    // you can change it here. Not recommended and you'll need
    // to adjust the CSS accordingly.
    selectors: {
      container: 'ul',
      slides: 'li'
    },

    // Do you want to animate the heights of each slide as
    // it moves
    animateHeight: false,

    // Active class for the nav
    activeClass: this._ + '-active',

    // Have swipe support?
    // You can set this here with a boolean and always use
    // initSwipe/destroySwipe later on.
    swipe: true,
    // Swipe threshold -
    // lower float for enabling short swipe
    swipeThreshold: 0.2,
  };

  // Set defaults
  $context = null;
  options = {};

  // Leave our elements blank for now
  // Since they get changed by the options, we'll need to
  // set them in the init method.
  $parent = null;
  $container = null;
  $slides = null;
  $nav = null;
  $arrows = [];

  // Set our indexes and totals
  total = 0;
  current = 0;

  // Generate a specific random ID so we don't dupe events
  prefix = this._ + '-';
  eventSuffix = '.' + this.prefix + ~~(Math.random() * 2e3);

  // In case we're going to use the autoplay
  interval = null;

  constructor(el, options) {
    this.$context = $(el);

    this.init(options);
  }

  // Get everything set up innit
  init(options) {
    // Set up our options inside here so we can re-init at
    // any time
    this.options = $.extend({}, this.defaults, options);

    // Our elements
    this.$container = this.$context.find(this.options.selectors.container).first().addClass(this.prefix + 'wrap');
    this.$slides = this.$container.children(this.options.selectors.slides);

    // We'll manually init the container
    this.setup();

    // We want to keep this script as small as possible
    // so we'll optimise some checks
    $.each(['nav', 'arrows', 'keys', 'infinite'], (index, module) => {
      this.options[module] && this['init' + this._ucfirst(module)]();
    });

    // TODO: Add swipe support
    // if (jQuery.event.special.swipe && this.options.swipe) {
    //  this.initSwipe();
    // }

    // If autoplay is set to true, call this.start()
    // to start calling our timeouts
    this.options.autoplay && this.start();

    // We should be able to recalculate slides at will
    this.calculateSlides();

    // Listen to a ready event
    this.$context.trigger(this._ + ':ready');

    // Everyday I'm chainin'
    return this.animate(this.options.index || this.current, 'init');
  }

  setup() {
    // Add a CSS hook to the main element
    this.$context.addClass(this.prefix + this.options.animation).wrap('<div class="' + this._ + '" />');
    this.$parent = this.$context.parent('.' + this._);

    // We need to manually check if the container is absolutely
    // or relatively positioned
    const position = this.$context.css('position');

    // If we don't already have a position set, we'll
    // automatically set it ourselves
    if (position === 'static') {
      this.$context.css('position', 'relative');
    }

    this.$context.css('overflow', 'hidden');
  }

  // Set up the slide widths to animate with
  // so the box doesn't float over
  calculateSlides() {
    // update slides before recalculating the total
    this.$slides = this.$container.children(this.options.selectors.slides);

    this.total = this.$slides.length;

    // Set the total width
    if (this.options.animation !== 'fade') {
      let prop = 'width';

      if (this.options.animation === 'vertical') {
        prop = 'height';
      }

      this.$container.css(prop, (this.total * 100) + '%').addClass(this.prefix + 'carousel');
      this.$slides.css(prop, (100 / this.total) + '%');
    }
  }

  // Start our autoplay
  start() {
    this.interval = setTimeout(() => {
      // Move on to the next slide
      this.next();

      // If we've got autoplay set up
      // we don't need to keep starting
      // the slider from within our timeout
      // as .animate() calls it for us
    }, this.options.delay);

    return this;
  }

  // And pause our timeouts
  // and force stop the slider if needed
  stop() {
    clearTimeout(this.interval);

    return this;
  }

  // Set up our navigation
  initNav() {
    const $nav = $('<nav class="' + this.prefix + 'nav"><ol /></nav>');

    // Build our click navigation item-by-item
    this.$slides.each((key, slide) => {
      // If we've already set a label, let's use that
      // instead of generating one
      let label = slide.getAttribute('data-nav') || key + 1;

      // Listen to any callback functions
      if ($.isFunction(this.options.nav)) {
        label = this.options.nav.call(this.$slides.eq(key), key, label);
      }

      // And add it to our navigation item
      $nav.children('ol').append('<li data-slide="' + key + '">' + label + '</li>');
    });

    // Keep a copy of the nav everywhere so we can use it
    this.$nav = $nav.insertAfter(this.$context);

    // Now our nav is built, let's add it to the slider and bind
    // for any click events on the generated links
    this.$nav.find('li').on('click' + this.eventSuffix, (e) => {
      // Cache our link and set it to be active
      const $me = $(e.currentTarget).addClass(this.options.activeClass);

      // Set the right active class, remove any other ones
      $me.siblings().removeClass(this.options.activeClass);

      // Move the slide
      this.animate($me.attr('data-slide'));
    });
  }

  // Set up our left-right arrow navigation
  // (Not keyboard arrows, prev/next buttons)
  initArrows() {
    if (this.options.arrows === true) {
      this.options.arrows = this.defaults.arrows;
    }

    // Loop our options object and bind our events
    $.each(this.options.arrows, (key, val) => {
      // Add our arrow HTML and bind it
      this.$arrows.push(
        $(val).insertAfter(this.$context).on('click' + this.eventSuffix, this[key])
      );
    });
  }

  // Set up our keyboad navigation
  // Allow binding to multiple keycodes
  initKeys() {
    if (this.options.keys === true) {
      this.options.keys = this.defaults.keys;
    }

    $(document).on('keyup' + this.eventSuffix, (e) => {
      $.each(this.options.keys, (key, val) => {
        if (e.which === val) {
          $.isFunction(this[key]) && this[key].call(this);
        }
      });
    });
  }

  // Requires jQuery.event.swipe
  // -> stephband.info/jquery.event.swipe
  initSwipe() {
    const width = this.$slides.width();

    // We don't want to have a tactile swipe in the slider
    // in the fade animation, as it can cause some problems
    // with layout, so we'll just disable it.
    if (this.options.animation !== 'fade') {
      this.$container.on({
        movestart: (e) => {
          // If the movestart heads off in a upwards or downwards
          // direction, prevent it so that the browser scrolls normally.
          if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
            return !!e.preventDefault();
          }

          this.$container.css('position', 'relative');
        },
        move: (e) => {
          this.$container.css('left', -(100 * this.current) + (100 * e.distX / width) + '%');
        },
        moveend: (e) => {
          // Check if swiped distance is greater than threshold.
          // If yes slide to next/prev slide. If not animate to
          // starting point.

          if ((Math.abs(e.distX) / width) > this.options.swipeThreshold) {
            this[e.distX < 0 ? 'next' : 'prev']();
          }
          else {
            this.$container.animate({ left: -(100 * this.current) + '%' }, this.options.speed / 2);
          }
        }
      });
    }
  }

  // Infinite scrolling is a massive pain in the arse
  // so we need to create a whole bloody function to set
  // it up. Argh.
  initInfinite() {
    const pos = ['first', 'last'];

    $.each(pos, (index, item) => {

      this.$slides.push.apply(
        this.$slides,

        // Exclude all cloned slides and call .first() or .last()
        // depending on what `item` is.
        this.$slides.not('.' + this._ + '-clone')[item]()

          // Make a copy of it and identify it as a clone
          .clone().addClass(this._ + '-clone')

        // Either insert before or after depending on whether we're
        // the first or last clone
        // eslint-disable-next-line no-unexpected-multiline
        ['insert' + (index === 0 ? 'After' : 'Before')](
          // Return the other element in the position array
          // if item = first, return "last"
          this.$slides[pos[~~!index]]()
        )
      );
    });
  }

  // Remove any trace of arrows
  // It'll unbind any event handlers for us
  destroyArrows() {
    $.each(this.$arrows, (i, $arrow) => {
      $arrow.remove();
    });
  }

  // Remove any swipe events and reset the position
  destroySwipe() {
    // We bind to 4 events, so we'll unbind those
    this.$container.off('movestart move moveend');
  }

  // Unset the keyboard navigation
  // Remove the handler
  destroyKeys() {
    // Remove the event handler
    $(document).off('keyup' + this.eventSuffix);
  }

  setIndex(to) {
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
  animate(to, dir) {
    // Animation shortcuts
    // Instead of passing a number index, we can now
    // use .data('unslider').animate('last');
    // or .unslider('animate:last')
    // to go to the very last slide
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
    const fn = 'animate' + this._ucfirst(this.options.animation);

    // Make sure it's a valid animation method, otherwise we'll get
    // a load of bug reports that'll be really hard to report
    if ($.isFunction(this[fn])) {
      this[fn](this.current, dir);
    }

    return this;
  }

  // Shortcuts for animating if we don't know what the current
  // index is (i.e back/forward)
  // For moving forward we need to make sure we don't overshoot.
  next = () => {
    let target = this.current + 1;

    // If we're at the end, we need to move back to the start
    if (target >= this.total) {
      target = 0;
    }

    return this.animate(target, 'next');
  };

  // Previous is a bit simpler, we can just decrease the index
  // by one and check if it's over 0.
  prev = () => {
    return this.animate(this.current - 1, 'prev');
  };

  // Our default animation method, the old-school left-to-right
  // horizontal animation
  animateHorizontal(to) {
    let prop = 'left';

    // Add RTL support, slide the slider
    // the other way if the site is right-to-left
    if (this.$context.attr('dir') === 'rtl') {
      prop = 'right';
    }

    if (this.options.infinite) {
      // So then we need to hide the first slide
      this.$container.css('margin-' + prop, '-100%');
    }

    return this.slide(prop, to);
  }

  // The same animation methods, but vertical support
  // RTL doesn't affect the vertical direction so we
  // can just call as is
  animateVertical(to) {
    this.options.animateHeight = true;

    // Normal infinite CSS fix doesn't work for
    // vertical animation so we need to manually set it
    // with pixels. Ah well.
    if (this.options.infinite) {
      this.$container.css('margin-top', -this.$slides.get(0).offsetHeight);
    }

    return this.slide('top', to);
  }

  // Actually move the slide now
  // We have to pass a property to animate as there's
  // a few different directions it can now move, but it's
  // otherwise unchanged from before.
  slide(prop, to) {
    // If we want to change the height of the slider
    // to match the current slide, you can set
    // {animateHeight: true}
    this.animateHeight(to);

    // For infinite sliding we add a dummy slide at the end and start
    // of each slider to give the appearance of being infinite
    if (this.options.infinite) {
      let dummy;

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
        this.$context.on(this._ + ':moved', () => {
          if (this.current === dummy) {
            this.$container.css(prop, -(100 * dummy) + '%').off(this._ + ':moved');
          }
        });
      }
    }

    // We need to create an object to store our property in
    // since we don't know what it'll be.
    const obj = {};

    // Manually create it here
    obj[prop] = -(100 * to) + '%';

    // And animate using our newly-created object
    return this._move(this.$container, obj);
  }

  // Fade between slides rather than, uh, sliding it
  animateFade(to) {
    // If we want to change the height of the slider
    // to match the current slide, you can set
    // {animateHeight: true}
    this.animateHeight(to);

    const $active = this.$slides.eq(to).addClass(this.options.activeClass);

    // Toggle our classes
    this._move($active.siblings().removeClass(this.options.activeClass), { opacity: 0 });
    this._move($active, { opacity: 1 }, false);
  }

  // Animate height of slider
  animateHeight(to) {
    // If we want to change the height of the slider
    // to match the current slide, you can set
    // {animateHeight: true}
    if (this.options.animateHeight) {
      this._move(this.$context, { height: this.$slides.eq(to).get(0).offsetHeight }, false);
    }
  }

  _move($el, obj, callback, speed) {
    if (callback !== false) {
      callback = () => {
        this.$context.trigger(this._ + ':moved');
      };
    }

    return $el._move(obj, speed || this.options.speed, this.options.easing, callback);
  }

  // The equivalent to PHP's ucfirst(). Take the first
  // character of a string and make it uppercase.
  // Simples.
  _ucfirst(str) {
    // Take our variable, run a regex on the first letter
    return (str + '').toLowerCase().replace(/^./, function (match) {
      // And uppercase it. Simples.
      return match.toUpperCase();
    });
  }
}

// They're both just helpful types of shorthand for
// anything that might take too long to write out or
// something that might be used more than once.
$.fn._active = function (className) {
  return this.addClass(className).siblings().removeClass(className);
};

$.fn._move = function () {
  // this.stop(true, true);
  return $.fn[$.fn.velocity ? 'velocity' : 'animate'].apply(this, arguments);
};

export default Unslider;

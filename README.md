# Unsliderjs

[![npm](https://img.shields.io/npm/v/unsliderjs.svg)](https://www.npmjs.com/package/unsliderjs)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/nzbin/unsliderjs/blob/main/LICENSE)

Unsliderjs is an ultra-simple JS slider for your website.

## Features

- Vanilla JS
- Lightweight
- Responsive
- Adjusts for height
- Keyboard support
- RTL support

## Installation

You can install the plugin via npm.

```bash
$ npm install unsliderjs --save
```

## Usage

```js
// You can pass either CSS selector or HTML element for the first parameter
new Unslider(selector_or_element, options);
```

### Include files

```scss
// Import SCSS file
@use "unsliderjs";
```

```js
// Import JS file
import Unslider from "unsliderjs";
```

### Set up HTML

```html
<div class="my-slider">
  <ul>
    <li>My slide</li>
    <li>Another slide</li>
    <li>My last slide</li>
  </ul>
</div>
```

### Call the plugin

```js
var unslider = new Unslider(".my-slider");
```

## Options

- **autoplay** `false`

  Should the slider move by itself or only be triggered manually?

- **speed** `750`

  How fast (in milliseconds) Unslider should animate between slides.

- **delay** `3000`

  If `autoplay` is set to true, how many milliseconds should pass between moving the slides?

- **index** `'first'`

  If this is set to an integer, `'first'` or `'last'`, it'll set the default slide to that position rather than the first slide.

- **keys** `true`

  Do you want to add keyboard shortcut support to Unslider? This can be set to either `true`, `false`, or an options/keycode object, like so:

  ```js
  keys: {
    prev: 37,
    next: 39,
    stop: 27 // Example: pause when the Esc key is hit
  }
  ```

- **nav** `true`

  Do you want to generate an automatic clickable navigation for each slide in your slider?

  You can over-ride what appears in each link by adding a `data-nav="nav title"` parameter to each slide element (replacing 'nav title' with whatever you'd like the title to be).

- **arrows** `true`

  Do you want to add left/right arrows to your slider? You can style these in your CSS by writing rules for `.unslider-arrow` (or alternatively you can change the HTML string to whatever you like and style that).

  This can be set to either `true`, `false`, or an options object. If you set an options object, the default behaviour will be overwritten. The default object looks like this:

  ```js
  arrows: {
    // Unslider default behaviour
    prev: '<a class="unslider-arrow prev">Previous slide</a>',
    next: '<a class="unslider-arrow next">Next slide</a>',

    // Example: generate buttons to start/stop the slider autoplaying
    stop: '<a class="unslider-pause">Pause</a>',
    start: '<a class="unslider-play">Play</a>'
  }
  ```

- **animation** `'horizontal'`

  How should Unslider animate each slide? Right now, there's three different animation types:

  - 'horizontal': which moves the slides from left-to-right
  - 'vertical': which moves the slides from top-to-bottom
  - 'fade': which crossfades slides

- **selectors**

  If you're not using an unordered list to display your slider, you'll need to add a `selectors` object referencing what elements Unslider should look for. The container should be the "conveyor belt" that gets moved, and the **slides** are - well - the slides.

  ```js
  selectors: {
    container: 'ul',
    slides: 'li'
  }
  ```

  Note: you'll probably also need to update/write custom CSS in order for Unslider to work. Check the source files for `unslider.scss` to get a better idea of what needs styling.

- **animateHeight** `false`

  Should Unslider animate the height of the container to match the current slide's height? If so, set to `true`.

- **activeClass** `'unslider-active'`

  What class should Unslider set to the active slides and navigation items? Use this if you want to match your CSS.

## Methods

```js
// Assuming we've got a variable set like this...
var slider = new Unslider(".my-demo-slider");

slider.methodName();
slider.methodName("arguments", "go", "here");
```

- **init(options)**

  Set everything up with the slider. This is called automatically when you set up `Unslider()` for the first time, but if there's layout problems or you want to re-initiate the slider for some reason, you can call it here.

- **calculateSlides()**

  If a slide gets added or removed, you should call this otherwise things'll probably break.

- **start()**

  Make the slider move itself between slides. Will use the options object to determine the delay between slides.

- **stop()**

  Stop the slider moving itself between slides. Will stop any auto-playing.

- **initKeys()**

  Manually add keyboard shortcut support. Can be used after `destroyKeys` to restore keyboard shortcut support, or with `{keys: false}` in the options object to add support later on.

- **destroyKeys()**

  Remove any keyboard shortcut handlers for the slider.

- **setIndex(to)**

  Set the current index and navigation for Unslider. **This doesn't move the slider!** You can get some goofy results doing this - if you want to move the slider to a specific slide, I'd recommend you use `animate()` instead.

  The argument `to` can be an integer with the index of the slide you want to set (remember: indexes start at zero!), or the strings `'first'` or `'last'` if you don't know how many slides there are.

- **animte(to, dir)**

  Move the slider to a specific slide, update any navigation and fire a `unslider:change` event. Use like so:

  ```js
  // Our trusty slider!
  var slider = new Unslider(".slider");

  // Move to the first slide
  slider.animate("first");

  // Move to the third slide
  // Remember, slides are zero-indexed so 0 is first slide, 1 is second, etc.
  slider.animate(2);

  // Move to the last slide
  slider.animate("last");

  // Move to the last slide and add a direction
  slider.animate("last", "prev");
  ```

- **next()**

  Manually move to the next slide (or the first slide if you reach the last slide).

- **prev()**

  Same thing as `next()` but in the other direction. Moves the slider backwards manually or to the last slide if there's no more behind it.

## Events

```js
// Set up our slider to automatically move every second so we can see what's happening
var slider = new Unslider(".slider", { autoplay: true, delay: 1000 });

// Listen to slide changes
slider.$context.on("unslider:change", function (event, index, slide) {
  alert("Slide has been changed to " + index);
});

// Listen to slide moved
slider.$context.on("unslider:moved", function (event, index, slide) {
  alert("Slide has been moved to " + index);
});
```

## License

MIT License

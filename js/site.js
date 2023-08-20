var GoSquared = {
  acct: 'GSN-728806-M'
};

$(function () {
  //  This is specific to THIS WEBSITE ONLY.
  //  Don't copy this, it won't do anything and might break things!
  var slider = new Unslider('main', { arrows: false, keys: false });

  //  Click handler to automatically animate to a specific
  //  panel based on ID
  $('a[href^="#"]').click(function (e) {
    e.preventDefault();

    var $me = $(this), href = $me.attr('href');
    var $target = $('.unslider-wrap ' + href);

    if ($target.length) {
      slider.animate($target.index());
    }
  });

  if (location.hash) {
    $('a[href^="' + location.hash + '"]').trigger('click');
  }

  //  If we're using Google Fonts as a fallback
  //  make sure it scales properly, since font-size-adjust
  //  has crappy support.
  var $body = $('body');

  if ($body.detectFont() === 'Alegreya Sans') {
    $body.addClass('uses-google-fonts');
  }


  //  Add our super-cool scroll effect
  $('.spaced').on('scroll', function () {
    var $me = $(this);
    $me[($me.scrollTop() ? 'add' : 'remove') + 'Class']('scrolled');
  });


  //  Auto-add our JS examples
  $('.demo').each(function () {
    var $me = $(this);
    var $script = $me.find('script');
    var src = $script.html();

    var $output = $('<pre class="demo-usage" />');

    src = src.trim().split(/\s*[\r\n]+\s*/g);

    if (src[1]) {
      src.forEach(function (line, num) {
        if (num === 1 || line.indexOf('/**/') === 0) {
          src[num] = '<span class="hilite">' + line.replace('/**/', '');
        }

        if (line === '});' || line.indexOf('/*e*/') === 0) {
          src[num] = '</span>' + line.replace('/*e*/', '');
        }
      });

      src[src.length - 1] = '</span>' + src[src.length - 1];
    }

    src = src.join('\n');

    $script.after($output.html(src));
  });
});

$.fn.detectFont = function () {
  var d = $(this).css('font-family');
  var e = d.split(',');
  if (e.length == 1) return $.trim(e[0]).replace(/['"]/g, '');
  var f = $(this); var g = null;
  var h = '<span>wwwwwwwwwwwwwwwlllllllliiiiii</span>';
  var i = { 'font-size': '70px', 'display': 'inline', 'visibility': 'hidden' };
  e.forEach(function (a) {
    var b = $(h).css('font-family', d).css(i).appendTo('body');
    var c = $(h).css('font-family', a).css(i).appendTo('body');
    if (b.width() == c.width()) g = a; b.remove(); c.remove()
  });
  return $.trim(g).replace(/['"]/g, '')
};

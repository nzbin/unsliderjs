const pkg = require('./package.json');

const banner = String.raw`/*!
 * ${pkg.name} - v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 *
 * Copyright 2023-present ${pkg.author}
 * Released under ${pkg.license} License
 */
`;

module.exports = ctx => ({
  // map: ctx.options.map,
  plugins: {
    'postcss-header': {
      header: banner
    },
    autoprefixer: {
      cascade: false
    },
    cssnano: ctx.env === 'production' ? {} : false
  }
});

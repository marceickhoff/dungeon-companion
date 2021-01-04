// Laravel Mix
const mix = require('laravel-mix');

// Laravel Mix extensions
require('laravel-mix-clean-css');
require('laravel-mix-modernizr');

// Public path
mix.setPublicPath('public');

// Files
mix.sass('src/scss/app.scss', 'css/app.css');
mix.js([
	'src/js/app.js',
	'node_modules/@fortawesome/fontawesome-pro/js/solid.js',
	'node_modules/@fortawesome/fontawesome-pro/js/fontawesome.js'
], 'js/app.js').vue().extract();

// Additional PostCSS plugins
mix.options({
	postCss: [
		require('mqpacker')({ sort: true })
	]
});

// clean-css
mix.cleanCss({
	level: {
		2: {
			all: true
		}
	},
	format: {
		breaks: {
			afterAtRule: true,
			afterBlockBegins: true,
			afterBlockEnds: true,
			afterComment: true,
			afterProperty: true,
			afterRuleBegins: true,
			afterRuleEnds: true,
			beforeBlockEnds: true,
			betweenSelectors: true
		},
		indentBy: 1,
		indentWith: 'tab', // The only proper way, fight me irl
		spaces: {
			aroundSelectorRelation: true,
			beforeBlockBegins: true,
			beforeValue: true
		},
		semicolonAfterLastProperty: true
	}
});

// Modernizr
mix.modernizr();

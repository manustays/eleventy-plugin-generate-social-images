const fs = require('fs');
const path = require('path');

const genSocialImage = require('./utils/generateSocialImage.js');

// Example use for the plugin:
// {% GenerateSocialImage 'Page title...', 'Website name' %}

// Defaults plugin config
const defaults = {
	outputDir: './_site/img/preview',
	urlPath: '/img/preview',
	titleColor: '#FFF',
	hideTerminal: false,
	bgColor: '',
	bgGradient: ['#647DEE', '#7F53AC'],
	terminalBgColor: '#404040',
	customSVG: '',
	customFontFilename: '',
	lineBreakAt: 35
};

module.exports = (eleventyConfig, options) => {

	// Combine defaults with user defined options
	const { outputDir, urlPath, titleColor, siteName, promoImage, hideTerminal, bgColor, bgGradient, terminalBgColor, customSVG, customFontFilename, lineBreakAt } = { ...defaults, ...options };

	// Generate outputDir if it does not exist...
	const sep = path.sep;
	const targetDir = path.normalize(outputDir);
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(parentDir, childDir);
		if (!fs.existsSync(curDir)) {
			fs.mkdirSync(curDir);
		}
		return curDir;
	}, initDir);

	// Generate SVG Gradient...
	let bgGradientDef = '';
	if (bgGradient && bgGradient.length > 1) {
		let colStops = ``;
		let stopGap = Math.floor(100 / (bgGradient.length - 1));
		for (let i = 0; i < bgGradient.length; i++ ) {
			colStops += `<stop offset="${i * stopGap}%" stop-color="${bgGradient[i]}" />`;
		}

		bgGradientDef = `<linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">${colStops}</linearGradient>`;
	}

	eleventyConfig.addAsyncShortcode("GenerateSocialImage", async (title) => {
		if (!title) return '';

		return await genSocialImage(
			eleventyConfig.javascriptFunctions.slug(title),		// file-name
			title,												// title
			siteName,											// site-name
			promoImage,											// promo-image
			{													// options
				targetDir,
				urlPath,
				titleColor,
				hideTerminal,
				bgColor,
				bgGradientDef,
				terminalBgColor,
				customSVG,
				customFontFilename,
				lineBreakAt
			}
		);
	});

};

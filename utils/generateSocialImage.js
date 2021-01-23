const fs = require('fs');
const path = require('path');
const sharp = require("sharp");

const defaultOptions = {
	outputDir: './_site/img/preview',
	urlPath: '/img/preview'
};

async function generateSocialImage(filename, title, siteName, authorImage, options = {}) {
	const { outputDir, urlPath } = { ...defaultOptions, ...options };

	if (!(title && outputDir && urlPath)) {
		console.error("eleventy-plugin-generate-social-images Error: Missing values");
		return;
	}

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


	// Generate multi-line SVG text for the Title...
	const line_length = 35, start_x = 100, start_y = 220, line_height = 60, font_size = 38;
	let title_rows = [];
	words = title.split(/[ \r\n\t]+/);
	let _row = '';
	words.forEach((wrd) => {
		if (_row.length + wrd.length >= line_length) {
			title_rows.push(_row);
			_row = '';
		}
		_row += (_row && ' ') + wrd;
	});
	if (_row) {
		title_rows.push(_row);
	}

	// Limit rows...
	if (title_rows.length > 4) {
		title_rows.length = 4;
	}

	const svgTitle = title_rows.reduce((p, c, i) => {
		return p + `<text x="${start_x}" y="${start_y + (i * line_height)}" fill="#fedb8b" font-size="${font_size}px" font-weight="700">${c}</text>`;
	}, '');

	let template = `<svg width="1200" height="628" viewbox="0 0 1200 628" xmlns="http://www.w3.org/2000/svg">

		<defs>
			<linearGradient id="the-gradient" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stop-color="#000" />
				<stop offset="100%" stop-color="#102538" />
			</linearGradient>
		</defs>

		<rect x="0" y="0" width="1200" height="628" rx="0" ry="0" fill="url(#the-gradient)" />

		<g style="font-family:sans-serif">
			${svgTitle}
			<text x="100" y="500" fill="#fff" font-size="30px" font-weight="700">${siteName}</text>
		</g>

		<circle cx="1025" cy="453" r="126" stroke="#fedb8b" stroke-width="30" fill="none" />
	</svg>`;

	const svgBuffer = Buffer.from(template);

	const imgInset = await sharp(authorImage)
		.resize({
			width: 250,
			height: 250,
			fit: "contain"
		})
		.toBuffer();

	await sharp(svgBuffer)
		.resize(1200, 628)
		.composite([{ input: imgInset, top: 328, left: 900 }])
		.png()
		.toFile(`${targetDir}/${filename}.png`);

	return `${urlPath}/${filename}.png`;
}

module.exports = generateSocialImage;

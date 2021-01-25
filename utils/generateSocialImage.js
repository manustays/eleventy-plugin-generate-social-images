const fs = require('fs');
const path = require('path');
const sharp = require("sharp");

async function generateSocialImage(filename, title, siteName, authorImage, options = {}) {
	const { outputDir, urlPath, titleColor } = options;

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
	const line_length = 35;
	const max_lines = 4;
	const start_x = 150;
	const start_y = 210;
	const line_height = 60;
	const font_size = 38;

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
	if (title_rows.length > max_lines) {
		title_rows.length = max_lines;
	}

	const svgTitle = title_rows.reduce((p, c, i) => {
		return p + `<text x="${start_x}" y="${start_y + (i * line_height)}" fill="${titleColor}" font-size="${font_size}px" font-weight="700">${c}</text>`;
	}, '');

	const terminalWindow = `<rect x="100" y="64" width="1000" height="500" rx="16" ry="16" fill="#404040" stroke-width="1" stroke="#aaa" />
		<circle cx="135" cy="100" r="12" fill="#FD5454" />
		<circle cx="170" cy="100" r="12" fill="#F6B23C" />
		<circle cx="205" cy="100" r="12" fill="#22C036" />`;


	let template = `<svg width="1200" height="628" viewbox="0 0 1200 628" xmlns="http://www.w3.org/2000/svg">

		<defs>
			<linearGradient id="the-gradient" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stop-color="#970069" />
				<stop offset="100%" stop-color="#4D7cac" />
			</linearGradient>
		</defs>

		<rect x="0" y="0" width="1200" height="628" rx="0" ry="0" fill="url(#the-gradient)" />

		${terminalWindow}

		<g style="font-family:sans-serif">
			${svgTitle}
			<text x="265" y="500" fill="#fff" font-size="30px" font-weight="700">${siteName}</text>
		</g>

		<!-- circle cx="1025" cy="453" r="126" stroke="#fedb8b" stroke-width="30" fill="none" / -->
	</svg>`;

	try {
		const svgBuffer = Buffer.from(template);

		const imgInset = await sharp(authorImage)
			.resize({
				width: 100,
				height: 100,
				fit: "contain"
			})
			.toBuffer();

		await sharp(svgBuffer)
			.resize(1200, 628)
			.composite([{ input: imgInset, top: 440, left: 150 }])
			.png()
			.toFile(`${targetDir}/${filename}.png`);
	} catch (err) {
		console.error("eleventy-plugin-generate-social-images Error: ", err);
		return '';
	}

	return `${urlPath}/${filename}.png`;
}

module.exports = generateSocialImage;

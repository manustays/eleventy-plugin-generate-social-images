# Eleventy Plugin: Generate Social Images (using SVG)

Dynamically generate social media images for your Eleventy blog pages. Unlike other similar plugins, this one uses SVG & does not depend on Puppeteer!

<a href="https://github.com/manustays/eleventy-plugin-generate-social-images/issues">![GitHub issues](https://img.shields.io/github/issues/manustays/eleventy-plugin-generate-social-images)</a>
<a href="https://www.npmjs.com/package/@manustays/eleventy-plugin-generate-social-images" target="_blank">![npm (scoped)](https://img.shields.io/npm/v/@manustays/eleventy-plugin-generate-social-images)</a>
<a href="https://abhi.page" target="_blank">![About Abhishek](https://img.shields.io/badge/about-me-blue)</a>
<a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fmanustays%2Feleventy-plugin-generate-social-images" target="_blank"><img alt="Twitter" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fmanustays%2Feleventy-plugin-generate-social-images"></a>
<a href="https://twitter.com/intent/follow?screen_name=abhiweb" target="_blank">![Twitter Follow](https://img.shields.io/twitter/follow/abhiweb?label=Follow&style=social)</a>

---

1. [Introduction](#introduction)
2. [Why another social-image generator?](#why-another-social-image-generator)
3. [How does it work?](#how-does-it-work)
4. [Installation and Usage](#installation-and-usage)
5. [Config Options](#config-options)
6. [Custom Fonts](#custom-fonts)
7. [Todo](#todo)
8. [Credits](#credits)


## Introduction
This plugin provides an 11ty ShortCode that can be used to automatically generate social images in your Eleventy website or blog.

For example:
```
{% GenerateSocialImage "How to load third-party Javascript on demand" %}
```
will generate the following social image _(website-name and author-image are set during configuration)_:
[![](https://abhi.page/img/preview/how-to-load-third-party-javascript-on-demand.png)](https://abhi.page/notes/load-third-party-javascript-on-demand/)

The social image is first created as SVG and then converted to PNG using [Sharp](https://github.com/lovell/sharp).

## Why another social-image generator?
There is already a very good plugin [eleventy-plugin-social-images](https://github.com/5t3ph/eleventy-plugin-social-images) by [Stephanie Eckles
](https://dev.to/5t3ph) who has written a [very good article about her approach](https://dev.to/5t3ph/automated-social-sharing-images-with-puppeteer-11ty-and-netlify-22ln). The plugin is very customizable and can serve most people very well.

I created a new plugin because the above mentioned plugin...
* uses Puppeteer to generate the image from a webpage.
  * I faced some issues running Puppeteer on WSL2, so decided to get rid of the dependency.
* uses a separate build process to generate the images.
  * While it is totally fine (even better, as it can be used with any other SSG), I wanted the workflow within the Eleventy build process, i.e, by using an Eleventy ShortCode.

## How does it work?
* Generates the image using SVG and then converts it into PNG using [Sharp](https://github.com/lovell/sharp).
* Custom logic to wrap the title line in SVG (as Sharp does not support SVG foreignObject).
* Adds an author/promo image using Sharp composite (as Sharp does not support external image in SVG).

## Installation and Usage

### STEP 1: Install the package:
```bash
npm install @manustays/eleventy-plugin-generate-social-images
```

### STEP 2: Include it in your `.eleventy.js` config file:

```js
const generateSocialImages = require("@manustays/eleventy-plugin-generate-social-images");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(generateSocialImages, {
    promoImage: "./src/img/my_profile_pic.jpg",
    outputDir: "./_site/img/preview",
    urlPath: "/img/preview",
	siteName: "abhi.page/",
	titleColor: "#fedb8b"
  });
};
```

### Step 3: Use in your template
For example, in your `base.njk` template file, use it in the `<head>` for generating social image meta tags:
```html
<meta property="og:image" content="{% GenerateSocialImage title %}" />
<meta name="twitter:image" content="{% GenerateSocialImage title %}" />
```

> **Note:** For a complete implementation example, [checkout my website on Github](https://github.com/manustays/abhi.page.11ty).


## Config Options

| Option      | Type   | Default       | Description |
| ----------- | ------ | ------------- |-------------|
| promoImage  | string |               | Path to a promo Image (ideally, circular) that will be embedded in the social-images |
| outputDir   | string | "./\_site/img/preview" | Project-relative path to the output directory where images will be generated |
| urlPath     | string | "/img/preview" | A path-prefix-esque directory for the &lt;img src&gt; attribute. e.g. `/img/` for `<img src="/img/MY_IMAGE.jpeg">` |
| siteName    | string |               | The website name to show on the social-image |
| titleColor  | string | "white"       | The color of the page-title |
| bgColor     | string |               | Optional background color. Otherwise, shows the gradient pattern |
| terminalBgColor| string | "#404040"  | Background color of the terminal window design |
| hideTerminal  | boolean | false      | If true, hides the terminal window design behind the title |
| customSVG     | string  |            | Custom SVG code to be added to the image. Use this to add your own design or text anywhere on the image |
| customFontFilename | string |        | Filename of custom local font used for title ([see **Custom Fonts**](#custom-fonts)) |
| lineBreakAt  | number | 35           | Maximum row length for wrapping the title. Required because SVG does not have auto-wrapping text. Should depends on the font used |


## Custom Fonts
The [Sharp library](https://github.com/lovell/sharp) uses librsvg that uses [fontconfig](https://www.freedesktop.org/software/fontconfig/fontconfig-user) to load external fonts. Therefore, the following steps are required:
1. Download your font file in project sub-folder. Eg: `./fonts/sans.ttf`
2. Create a file `fonts.conf` with the following content:
   ```xml
	<?xml version="1.0"?>
	<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
	<fontconfig>
		<dir prefix="default">fonts</dir>
	</fontconfig>
	```
3. Setup the following environment variable on your build server (eg: Netlify):
   ```bash
   FONTCONFIG_PATH=.
   ```


## TODO
- [ ] Cache result to avoid regenerating same image
- [x] Better text-wrap logic for the page-title in SVG
- [x] Custom SVG
- [x] Custom font
- [ ] More customization options!


## Credits

* Original idea from [eleventy-plugin-social-images](https://github.com/5t3ph/eleventy-plugin-social-images)
* I created my own to avoid the Puppeteer dependency.

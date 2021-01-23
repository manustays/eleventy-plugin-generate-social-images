# Eleventy Plugin: Generate Social Images [WIP]

Dynamically generate social media images for your Eleventy blog pages.


## Usage

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
    urlPath: "/img/preview"
  });
};
```

### Step 3: Use in your template
For example, in your `base.njk` template file, use it in the `<head>` for generating social image meta tags:
```html
<meta property="og:image" content="{% GenerateSocialImage title, meta.website_name %}" />
<meta name="twitter:image" content="{% GenerateSocialImage title, meta.website_name %}" />
```

## Config Options

| Option      | Type   | Default       | Description |
| ----------- | ------ | ------------- |-------------|
| promoImage  | string |               | Path to a promo Image (ideally, circular) that will be embedded in the social-images |
| outputDir   | string | "./\_site/img/preview" | Project-relative path to the output directory where images will be generated |
| urlPath     | string | "/img/preview" | A path-prefix-esque directory for the &lt;img src&gt; attribute. e.g. `/img/` for `<img src="/img/MY_IMAGE.jpeg">` |


## Credits

* Original idea from [eleventy-plugin-social-images](https://github.com/5t3ph/eleventy-plugin-social-images)
* I created my own version to avoid the Puppeteer dependency.

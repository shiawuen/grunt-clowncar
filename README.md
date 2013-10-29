# grunt-clowncar

> Generate responsive images with clown car technique

## Getting Started
This plugin requires Grunt `~0.4.1` and [GraphicsMagick](http://www.graphicsmagick.org/) to be installed.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

Install GraphicsMagick on OSX:

```shell
brew install graphicsmagick
```

```shell
npm install grunt-clowncar --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-clowncar');
```

## The "clowncar" task

### Overview
In your project's Gruntfile, add a section named `clowncar` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  clowncar: {
    options: {
      size: [1000, 800, 600, 400]
    , quality: 75
    },
    your_target: {
      files: {
        "dist/images/content/grunt.svg": 'images/content/grunt.jpg'
      }
    },
  },
})
```

### Options

#### options.sizes
Type: `Array`
Default value: `[600, 400]`

Images with width as specified in the array to be generated.
Widths can also be specified as percentage: `['75%', '50%', '30%']`

#### options.quality
Type: `Number`
Default value: `90`

Quality of the image to be generated

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-10-29  v0.0.2 Added options to set width as percentages, Thanks [Pedro Figueiredo](https://github.com/pfig)!
* 2013-08-05  v0.0.1 Inital release

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
      sizes: [1000, 800, 600, 400]
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

> Note that each produced SVG file are provided with a specific class name in their `<svg>` tag. The class name consists of a namespace `clowncar` and the name of the file minus its extension and separated with a -. For instance, if you clown a file named `photo001.jpg`, the tag is going to be `<svg class="clowncar-photo001" ... >`. This prevents CSS class to collide with your development or with your imported frameworks.

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

## Cookbook
### Preparing the circus
First thing first, we import the necessary tooling.

> This cookbook has been created using OSX. But there's no hassle doing it with your operating system of choice.

With your favorite terminal, hop into an empty directory and create a `package.json` file for your project, if it's not already done.
```shell
npm init
```

We are using the following directory structure::
```
.
├── Gruntfile.coffee
├── dist
├── package.json
├── src
│   ├── img
│   │   └── photo001.jpg
│   └── index.jade
└── tmp
```

With :

* `Gruntfile.coffee` : Our Grunt file in coffee.
* `dist` : A directory for our generated web files.
* `tmp` : A directory for temporary files (unminified stuff, for instance).
* `src`: A directory containing all our source files that need treatment.
* `src/index.jade` : The main jade file that generates our `index.html` file.
* `src/img` : A directory containing all the image that we are about to **clown**.

> Note that the folder strucure is easily adapted in the grunt file provided
  hereafter.

Now, we import our grunt plugins and a some other neat stuff:
```shell
npm install --save-dev grunt grunt-clowncar \
  grunt-contrib-jade grunt-svgmin grunt-contrib-clean \
  grunt-contrib-watch grunt-express grunt-contrib-copy \
  grunt-open matchdep
```

And, if you haven't done it already, install GraphicsMagick system wide. Here's the command on OSX for convenience:
```shell
brew install graphicsmagick
```

OK. Now, we can proceed with the 1st recipe.

### Embedded SVG in HTML code
So, we start with our Grunt file `Gruntfile.coffee` which should look something like:
```coffeescript
# Grunt tasks
module.exports = (grunt) ->
  # Load all plugings from our package.json files
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)
  # Project configuration
  grunt.initConfig
    # CLOWNCAR
    # Here comes the fun part. Your image are going to be clowned!
    # Every image stored in 'src/img' produces an SVG file and all
    #  the resolution required by responsive image depending on the
    #  screens that you are targeting.
    # Hereafter, the sizes matches the ones from the default
    #  Twitter's Bootstrap CSS framework.
    # Feel free to adapt them to the screens that you are targeting.
    # All our produced stuff go in the 'tmp' dir as some additional
    #  and optimizing steps are required for our beloved mobile users.
    clowncar:
      options:
        sizes: [1280, 992, 768, 400]
      all:
        files: [{
            expand: true
            cwd: 'src/img/'
            src: ['*.jpg']
            dest: 'tmp/'
            ext: '.svg'
          }
        ]
    # Minify the produced SVG (our clown cars).
    svgmin:
      options:
        datauri: 'base64'
      clowned:
        files: [{
          expand: true
          cwd: 'tmp/'
          src: ['*.svg']
          dest: 'tmp/minified/'
          ext: '.min.svg'
        }]
    # Copy our multi-resolution images (the clowns under the car)
    #  to our production dir 'dist'.
    copy:
      clowned:
        expand: true
        cwd: 'tmp/'
        src: ['*-*.jpg']
        dest: 'dist/'
    # Use jade to produce HTML.
    jade:
      compile:
        options:
          # Minify our produced HTML file automatically.
          pretty: false
        files:
          'dist/index.html': ['src/index.jade']
    # Remove everything created so far.
    clean: [ 'dist', 'tmp' ]
    # Create a custom Express server on the fly.
    express:
      all:
        options:
          port: 9000
          hostname: '0.0.0.0'
          bases: ['dist/']
          livereload: true
    # Open a browser when site is ready.
    open:
      all:
        path: 'http://localhost:<%= express.all.options.port %>'
    # Watch every changes in the 'src' dir and fire up the buuild task.
    watch:
      options:
        # Note: Livereload is not set in this task as it's already provided
        #  by the express server (the grunt task).
        livereload: false
      all:
        files: 'src/**'
        tasks: ['build']
  # Build tasks.
  grunt.registerTask 'build', ['clowncar', 'svgmin', 'copy', 'jade']
  # Default task.
  grunt.registerTask 'default', [
      'clean', 'copy', 'build', 'express', 'open', 'watch'
    ]
```

Pfeww, that was long. But, we've provided you with a real world example with comments. Comments that should be worth reading.

> Note that there's no need in minifying our produced image with `grunt-contrib-imagemin`. `grunt-clowncar` does it for you. It uses GraphicsMagick's 'convert & thumbnail' feature that does the job pretty well.

So, the produced SVG (the clown car) are in the `tmp/minified` dir. On the other hand, the responsive images (the clowns or the reduced JPEGs) are directly provided in `dist`, the production dir. Let's target these with a neat HTML file written in Jade:
```jade
- var pageTitle = 'Check the clowns'
!!!5
html
  head
    title= pageTitle
  body
    h1= pageTitle
    include ../tmp/minified/photo001.min.svg
```

That's it! A oneliner for every included image.

Now, just hit the `grunt` command and watch your image being clowned:
```shell
grunt
```

> Check the dev tools to see the image downloaded from the server while redimensioning your browser.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Acknowledgements
* Estelle Weyl: [A smashing article on 'Smashing magazine'](http://coding.smashingmagazine.com/2013/06/02/clown-car-technique-solving-for-adaptive-images-in-responsive-web-design/)

## Release History
* 2013-11-27  v0.0.4 Namespaced class in SVG's style for avoiding style collision.
* 2013-11-23  v0.0.3 Fixed broken build on v0.0.2, Sorry! Added fixed for thumbnail generation based on smallest image to the original image, thanks to [Pierre-Eric Marchandet](https://github.com/PEM--)
* 2013-10-29  v0.0.2 Added options to set width as percentages, Thanks [Pedro Figueiredo](https://github.com/pfig)!
* 2013-08-05  v0.0.1 Inital release

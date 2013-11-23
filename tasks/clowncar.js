/*
 * grunt-clowncar
 * https://github.com/shiawuen/grunt-clowncar
 *
 * Copyright (c) 2013 Tan Shiaw Uen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var gm = require('gm')
    , fs = require('fs');

  var mapping = {
    jpeg: '.jpg'
  , jpg: '.jpg'
  , png: '.png'
  , gif: '.gif'
  };

  grunt.registerMultiTask('clowncar', 'Generating clown car SVG images', function() {
    var svgtmpl = '<?xml version="1.0" standalone="no"?>\n'
      + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n'
      + '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
      + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size}">\n'
      + '<style>\n'
      + 'svg { background-size: 100% 100%; background-repeat: no-repeat; }\n'
      + '{mediaqueries}\n'
      + '</style>\n'
      + '</svg>';

    var options = this.options({
      quality: 90
    , sizes: [600, 400]
    });

    options.sizes.sort(function(a, b){ return a > b; });

    // Iterate over all specified file groups.
    grunt.util.async.forEach(this.files, function(f, next) {
      var g = gm(f.src.shift());

      g.identify(function(err, identify){

        if (err) {
          grunt.log.error(err);
          return next(err);
        }

        var mediaqueries = []
          , format = identify.format.toLowerCase()
          , filename = pathToNameExt(f.dest).name
          , size = identify.size
          , ext = mapping[format]
          , destDir = pathToDir(f.dest)
          , l = options.sizes.length;

        if (! fs.existsSync(destDir)) {
          grunt.file.mkdir(destDir);
        }
        
        // Store original source filename
        var srcFile = g.data.path
        
        grunt.util.async.map(options.sizes, createThumb, createMediaQueries);

        function createThumb(width, callback){
          width = normalise(width);
          if (isNaN(width)) {
            return NaN;
          }
          var name = filename + '-' + width + ext;
          var newHeight = width / size.width * size.height;

          // Reload source file as GraphicsMagick misbehave when used in async
          g = gm(srcFile);
          
          g.thumb(width, newHeight, destDir + '/' + name, options.quality, function(err){
            if (err) { return callback(err); }
            callback(null, width);
          });
        }

        function createMediaQueries(err, results){
          if (err) { return next(err); }

          grunt.util.async.reduce(
            options.sizes
          , options.sizes[0]
          , function(prev, curr, callback){
              var idx = options.sizes.indexOf(curr);
              var currAsNumber = results[idx];
              var prevAsNumber = normalise(prev);
              var name = filename + '-' + currAsNumber + ext;
              var minmax = {};
              if (idx === l - 1) {
                minmax.min = prevAsNumber + 1;
              } else if (idx) {
                minmax.min = prevAsNumber + 1;
                minmax.max = currAsNumber;
              } else {
                minmax.max = prevAsNumber;
              }
              mediaqueries.push(mq(name, minmax));
              callback(null, curr);
            }
          , save);
        }

        function save(){
          var svg = svgtmpl
            .replace('{size}', size.width +' ' + size.height)
            .replace('{mediaqueries}', mediaqueries.join('\n'));

          grunt.file.write(f.dest, svg);

          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" created.');
          next();
        }

        function normalise(width){
          return typeof width === 'number'?
            width
          : Math.floor(size.width * Number(width.replace('%', '')) / 100);
        }

      });

    }, this.async());

    function pathToDir(path){
      var chunk = path.split('/');
      chunk.pop();
      return chunk.join('/');
    }

    function pathToNameExt(path){
      var name_arr = path.split('/').pop().split('.');
      var ext = name_arr.reverse().shift();
      var name = name_arr.reverse().join('.');
      return { name:name, ext:ext };
    }

    function mq(url, mm){
      var query = '';
      if (mm.min) { query += '(min-width: ' + mm.min + 'px)'; }
      if (mm.min && mm.max) { query += ' and '; }
      if (mm.max) { query += '(max-width: ' + mm.max + 'px)'; }
      return '@media screen and ' + query + ' {\n'
        + '  svg { background-image: url("'+ url +'"); }\n'
        + '}';
    }
  });

};

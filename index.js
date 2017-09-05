var through = require('through2');
var gutil = require('gulp-util');
var crypto = require('crypto');
var fs = require('fs');

const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(path) {
  var html = fs.readFileSync(path).toString();
  var r = /(<script\ssrc=['|"])(.*?)(['|"]>)/;
  var version = crypto.createHash('md5')
        .update(fs.readFileSync("./index.js","utf8"))
        .digest('hex');
  html = html.replace(r,(all,left,mid,right)=>{
    return `${left}${mid}?v_${version}${right}`;
  });
  var stream = through();
  stream.write(html);
  return stream;
}

function gulpPrefixer() {

    var stream = through.obj(function(file, enc, cb) {
    
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }
    if (file.isStream()) {
      var streamer = prefixStream(file.path);
      streamer.on('error', this.emit.bind(this, 'error'));
      file.contents = streamer;
    }
    this.push(file);
    cb();
  });
  return stream;
}

module.exports = gulpPrefixer;

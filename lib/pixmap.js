var util = require('util');
var weak = require('weak-napi');

var Drawable = require('./drawable.js');

module.exports = Pixmap;

function Pixmap(app, args) {
  this.app = app;
  Drawable.call(this);
  var X = app.X;

  var parentId;
  if (!args.parent) parentId = app.display.screen[0].root;
  else {
    parentId = args.parent.id;
  }

  this.depth = args.depth || 24;

  if (!args.id) {
    this.id = X.AllocID();
    X.CreatePixmap(this.id, parentId, this.depth, args.width, args.height);
    var id = this.id;
    var ref = weak(this, function(obj) {
      X.FreePixmap(id);
      X.ReleaseID(id);
    });
    this.width = args.width;
    this.height = args.height;
  } else {
    this.id = args.id;
  }

  this.X = X;
  var display = app.display;
  this.display = display;
}
util.inherits(Pixmap, Drawable);

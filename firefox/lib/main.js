var data = require("sdk/self").data;
var widgets = require("sdk/widget");
var pageMod = require("sdk/page-mod");

var panel = require("sdk/panel").Panel({
    width: 300,
    height: 400,
    contentURL: data.url("ReboardUI.html"),
    contentScriptFile: data.url("ReboardUI.js")
});

var widget = widgets.Widget({
  id: "Reboard-UI",
  label: "Reboard UI",
  content: "@",
  panel: panel
});

pageMod.PageMod({
    include: "http://rudradevbasak.github.io/16384_hex/",
    contentScriptFile: data.url("Reboard.js")
});

panel.show();

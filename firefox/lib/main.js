var data = require("sdk/self").data;
var widgets = require("sdk/widget"); //widgets is deprecated as of Firefox 29
var pageMod = require("sdk/page-mod");

var reboardUIPanel = require("sdk/panel").Panel({
    width: 300,
    height: 400,
    contentURL: data.url("ReboardUI.html"),
    contentScriptFile: data.url("ReboardUI.js")
});

var widget = widgets.Widget({
  id: "Reboard-UI",
  label: "Reboard UI",
  content: "@",
  panel: reboardUIPanel
});

pageMod.PageMod({
    include: "*",
    contentScriptFile: data.url("Reboard.js")
});

reboardUIPanel.show();

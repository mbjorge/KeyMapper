var data = require("sdk/self").data;
var widgets = require("sdk/widget"); //widgets is deprecated as of Firefox 29
var pageMod = require("sdk/page-mod");
var { Hotkey } = require("sdk/hotkeys");

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

var showUIHotKey = Hotkey({
	combo: "accel-m",
	onPress: function () {reboardUIPanel.show();}
});

reboardUIPanel.show();

reboardUIPanel.port.on("ready", function () {

	reboardUIPanel.port.emit("create", {
		physicalKey: "G",
		mappedKey: "B"
	});
	
	reboardUIPanel.port.emit("create", {
		physicalKey: "Z",
		mappedKey: "X"
	});
	
	reboardUIPanel.port.emit("delete", {
		physicalKey: "S",
		mappedKey: "J"
	});
});

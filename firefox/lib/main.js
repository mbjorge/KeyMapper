var data = require("sdk/self").data;
var widgets = require("sdk/widget"); //widgets is deprecated as of Firefox 29
var pageMod = require("sdk/page-mod");
var { Hotkey } = require("sdk/hotkeys");
var array = require('sdk/util/array');

var workers = [];

var reboardUIPanel = require("sdk/panel").Panel({
    width: 300,
    height: 400,
    contentURL: data.url("ReboardUI.html"),
    contentScriptFile: [data.url("KeyCodeMappings.js"), data.url("ReboardUI.js")]
});

var widget = widgets.Widget({
  id: "Reboard-UI",
  label: "Reboard UI",
  content: "@",
  panel: reboardUIPanel
});

pageMod.PageMod({
    include: "*",
    contentScriptFile: data.url("Reboard.js"),
    onAttach: function (worker) {
    	workers.push(worker);
        worker.on("detach", function () {
        	array.remove(workers, worker);
        });
        worker.on("pageshow", function () {
        	array.add(workers, worker);	
        });
        worker.on("pagehide", function () {
        	array.remove(workers, worker);
        });
    }
});

var showUIHotKey = Hotkey({
	combo: "accel-m",
	onPress: function () {
		reboardUIPanel.show();
	}
});

reboardUIPanel.show();

reboardUIPanel.port.on("ready", function () {

});

reboardUIPanel.port.on("create", function(keyMapping) {
	console.log("create event");
	console.log(keyMapping);
	workers.forEach(function (worker, index) {
		worker.port.emit("add", keyMapping);
	});
});

reboardUIPanel.port.on("delete", function(keyMapping) {
	console.log("delete event");
	console.log(keyMapping);
	workers.forEach(function (worker, index) {
		worker.port.emit("delete", keyMapping);		
	});
});

reboardUIPanel.port.on("reset", function() {
	console.log("reset event");
	workers.forEach(function (worker, index) {
		worker.port.emit("reset");
	});
});

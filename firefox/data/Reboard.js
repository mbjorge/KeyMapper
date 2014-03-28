var Reboard = {};

self.port.on("add", function(keyMapping) {
	console.log("add event");
	console.log(keyMapping);
	Reboard.addKeyMapping(keyMapping.physicalKeyCode, keyMapping.mappedKeyCode);
});

self.port.on("delete", function(keyMapping) {
	
});

self.port.on("reset", function() {
	
});

Reboard.addKeyMapping = function (physicalKeyCode, mappedKeyCode) {
	if (typeof physicalKeyCode === "undefined" || physicalKeyCode === null) {
		throw new TypeError("physicalKeyCode is null");
	}
	
	if (typeof mappedKeyCode === "undefined" || mappedKeyCode === null) {
		throw new TypeError("mappedKeyCode is null");
	}
	
	var keyEvents = ["keyup", "keydown", "keypress"];
	
	keyEvents.forEach(function(keyEvent) {
		unsafeWindow.addEventListener(keyEvent, function (event) {
			console.log(keyEvent + " detected");
			console.log("physicalKeyCode: " + physicalKeyCode);
			console.log("event.keyCode:" + event.keyCode);
			if (event.keyCode === physicalKeyCode || event.which === physicalKeyCode) {
				Reboard.triggerKeyEvent(unsafeWindow, keyEvent, mappedKeyCode);
			}
		});
	});
};

/**
 * Based on http://jsbin.com/nalefohu/1/edit
 * Found from: http://stackoverflow.com/a/14468563/1148792
 * @param element element to trigger the event on (usually the document object)
 * @param keyEvent keydown, keyup, or keypress
 */
Reboard.triggerKeyEvent = function(element, keyEvent, keyCode){
	if (typeof element === "undefined" || element === null) {
		throw new TypeError("element is null");
	}
	
	if (typeof keyEvent === "undefined" || keyEvent === null) {
		throw new TypeError("keyEvent is null");
	}
	
	keyEvent = keyEvent.toLowerCase();	
	if (keyEvent !== "keydown" && keyEvent !== "keyup" && keyEvent !== "keypress") {
		throw new TypeError("keyEvent needs to be one of 'keydown', 'keyup', or 'keypress'");
	}
	
	if (typeof keyCode === "undefined" || keyCode === null) {
		throw new TypeError("keyCode is null");
	}	
	
	var keyboardEvent = document.createEvent("KeyboardEvent");

	var initMethod = (typeof keyboardEvent.initKeyboardEvent !== 'undefined') ? "initKeyboardEvent" : "initKeyEvent";

	var bubbles = true;
	var cancelable = true;
	var view = null; //could also be set to unsafeWindow, but that might not be supported in the future.
	var ctrlKeyPressed = false;
	var altKeyPressed = false;
	var shiftKeyPressed = false;
	var metaKeyPressed = false;
	var charCode = 0; //this value is not important for Reboard's use
	
	keyboardEvent[initMethod](
			keyEvent,
			bubbles,
			cancelable, 
			view,
			ctrlKeyPressed,
			altKeyPressed,
			shiftKeyPressed,
			metaKeyPressed,
			keyCode,  
			charCode   
	);

	element.dispatchEvent(keyboardEvent); 
	
	console.log(keyCode + " was pressed");
};
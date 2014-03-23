var Reboard = {};

window.addEventListener("load", function() {
	Reboard.addKeyMapping(KeyEvent.DOM_VK_W, KeyEvent.DOM_VK_UP);
	Reboard.addKeyMapping(KeyEvent.DOM_VK_A, KeyEvent.DOM_VK_LEFT);
	Reboard.addKeyMapping(KeyEvent.DOM_VK_S, KeyEvent.DOM_VK_DOWN);
	Reboard.addKeyMapping(KeyEvent.DOM_VK_D, KeyEvent.DOM_VK_RIGHT);
});


Reboard.addKeyMapping(phsyicalKeyCode, mappedKeyCode) {
	if (typeof physicalKeyCode === "undefined" || physicalKeyCode === null) {
		throw new TypeError("physicalKeyCode is null");
	}
	
	if (typeof mappedKeyCode === "undefined" || mappedKeyCode === null) {
		throw new TypeError("mappedKeyCode is null");
	}
	
	var keyEvents = ["keyup", "keydown", "keypress"];
	
	keyEvents.forEach(function(keyEvent) {
		document.addEventListener(keyEvent, function (event) {
			if (event.keyCode === physicalKeyCode || event.which === physicalKeyCode) {
				Reboard.triggerKeyEvent(document, keyEvent, mappedKeyCode);
			}
		});
	});
}

/**
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
};
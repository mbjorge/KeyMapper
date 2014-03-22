var Reboard = {};

document.addEventListener("keydown", function (event) {
	if (event.which == 72) {
		triggerKeyboardEvent(document, 65);
	} else if (event.which == 75) {
		triggerKeyboardEvent(document, 68);
	}
});


function triggerKeyboardEvent(el, keyCode){
	var keyboardEvent = document.createEvent("KeyboardEvent");

	var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 

			"initKeyboardEvent" : "initKeyEvent";


	keyboardEvent[initMethod](
			"keydown",
			true,      // bubbles oOooOOo0
			true,      // cancelable   
			unsafeWindow,    // view
			false,     // ctrlKeyArg
			false,     // altKeyArg
			false,     // shiftKeyArg
			false,     // metaKeyArg
			keyCode,  
			0          // charCode   
	);

	el.dispatchEvent(keyboardEvent); 
}
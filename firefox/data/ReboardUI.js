var Reboard = {};

window.addEventListener("load", function () {
    var table = document.getElementById("assignments");
    
    Reboard.createNewEntryRow(table);
    Reboard.createKeyMapRow(table, "&#8592", "H");
    Reboard.createKeyMapRow(table, "S", "J");
    Reboard.createKeyMapRow(table, "D", "K");
    Reboard.createKeyMapRow(table, "Q", "U");

    var resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function (event) {
    	Reboard.clearKeyMapRows(table);
    	self.port.emit("reset");
    });
    
    self.port.on("create", function (keyMapping) {
    	Reboard.createKeyMapRow(table, keyMapping.physicalKey, keyMapping.mappedKey);
    });
    
    self.port.on("delete", function (keyMapping) {
    	Reboard.removeKeyMapRow(table, keyMapping.physicalKey, keyMapping.mappedKey);
    });
    
    self.port.on("reset", function() {
    	Reboard.clearKeyMapRows(table);
    });
    
    self.port.emit("ready");
});

/**
 * rowIndex can be omitted, in which case the row is appended at the end of the table.
 * Returns the created row element.
 */
Reboard.createNewEntryRow = function(table, physicalKey, mappedKey, rowIndex) {
	
	if (table === null || typeof table === "undefined") {
		throw new Error("table is null");
	}
	
	if (physicalKey === null || typeof physicalKey === "undefined") {
		physicalKey = "";
	}
	
	if (mappedKey === null || typeof mappedKey === "undefined") {
		mappedKey = "";
	}
	
	if (rowIndex === null || typeof rowIndex === "undefined") {
		rowIndex = -1; //default to appending to the end
	}


    var row = table.insertRow(rowIndex);
    var physicalKeyCell = row.insertCell(-1);
    var mappedKeyCell = row.insertCell(-1);
    var createButtonCell = row.insertCell(-1);

    physicalKeyCell.appendChild(Reboard.createKeyInput("key", physicalKey));
    mappedKeyCell.appendChild(Reboard.createKeyInput("value", mappedKey));
    createButtonCell.appendChild(Reboard.createAddButton(row));
       
    return row;    
};

/**
 * @param name Must be specified
 * @param value optional default value
 * @returns The created <input> element
 */
Reboard.createKeyInput = function (name, value) {
	if (name === "" || name === null || typeof name === "undefined") {
		throw new Error("name is empty or null");
	}
	
	if (value === null || typeof value === "undefined") {
		value = "";
	}
	
	var keyInput = document.createElement("input");
	keyInput.type = "text";
	keyInput.name = name;
	keyInput.size = '1';
	keyInput.value = value;
	keyInput.addEventListener("change", function (event) {
		event.target.value = event.target.value.toUpperCase();
	});
	keyInput.addEventListener("keyup", function (event) {
		event.target.value = event.target.value.toUpperCase();
	});
	
	return keyInput;
};

Reboard.createAddButton = function(row) {
	
	if (row === null || typeof row === "undefined") {
		throw new Error("row is null");
	}
	
    var addButton = document.createElement("button");
    addButton.type = "button";
    addButton.name = "add";
    addButton.className = "add";
    addButton.innerHTML = "+";
    addButton.style.visibility = "hidden";   
    addButton.addEventListener("click", function (event) {
    	var physicalKeyCell = row.cells[0];
    	var mappedKeyCell = row.cells[1];
    	
    	var physicalKey = physicalKeyCell.childNodes[0].value;
    	var mappedKey = mappedKeyCell.childNodes[0].value;
    	
    	Reboard.createKeyMapRow(row.parentNode, physicalKey, mappedKey);
    	
    	self.port.emit("create", {
    		physicalKey: physicalKey,
    		mappedKey: mappedKey
    	});
    	
    	physicalKeyCell.childNodes[0].value = "";
    	mappedKeyCell.childNodes[0].value = "";
    });
    
    Reboard.addButtonVisibilityModifier(row, addButton);
    
    return addButton; 
};

/**
 * rowIndex can be omitted, in which case the row is inserted directly before the current last row (as the last row is presumed to be a row for user input) 
 * rowIndex of -1 will append the row to the actual end of the table.
 * Returns the created row.
 */
Reboard.createKeyMapRow = function(table, physicalKey, mappedKey, rowIndex) {
	if (table === null || typeof table === "undefined") {
		throw new Error("table is null");
	} else if (physicalKey === null || typeof physicalKey === "undefined") {
		throw new Error("physicalKey is null");
	} else if (mappedKey === null || typeof mappedKey === "undefined") {
		throw new Error("mappedKey is null");
	}
	
	if (typeof rowIndex === "undefined" || rowIndex === null) {
    	rowIndex = Math.max(table.rows.length - 1, 1); //default to 1 before the last row, unless that would be the header row
	}

    var row = table.insertRow(rowIndex);
    var physicalKeyCell = row.insertCell(0);
    var mappedKeyCell = row.insertCell(1);
    var deleteButtonCell = row.insertCell(2);

    physicalKeyCell.innerHTML = physicalKey;
    mappedKeyCell.innerHTML = mappedKey;
    deleteButtonCell.appendChild(Reboard.createDeleteButton(row));

    return row;
};

Reboard.createDeleteButton = function(row) {
	
	if (row === null || typeof row === "undefined") {
		throw new Error("row is null");
	}
	
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.name = "delete";
    deleteButton.className = "delete";
    deleteButton.innerHTML = "X";
    deleteButton.style.visibility = "hidden";   
    deleteButton.addEventListener("click", function (event) {
    	var physicalKeyCell = row.cells[0];
    	var mappedKeyCell = row.cells[1];
    	
    	var physicalKey = physicalKeyCell.innerHTML;
    	var mappedKey = mappedKeyCell.innerHTML;
    	
    	self.port.emit("delete", {
    		physicalKey: physicalKey,
    		mappedKey: mappedKey
    	});
    	
    	var table = row.parentNode;
        table.deleteRow(row.rowIndex);
    });
    
    Reboard.addButtonVisibilityModifier(row, deleteButton);
    
    return deleteButton;       
};

Reboard.addButtonVisibilityModifier = function(row, button) {
	
	if (row === null || typeof row === "undefined") {
		throw new Error("row is null");
	}
	
    row.addEventListener("mouseenter", function(event) {
        button.style.visibility = "visible";
    }); 

    row.addEventListener("mouseleave", function(event) {
        button.style.visibility = "hidden";
    });
};

/**
 * Removes a single row in table that has a mapping from physicalKey -> mappedKey
 */
Reboard.removeKeyMapRow = function(table, physicalKey, mappedKey) {
	
	if (typeof table === "undefined" || table === null) {
		throw new TypeError("table is null");
	}
	
	if (typeof physicalKey === "undefined" || physicalKey === null) {
		throw new TypeError("physicalKey is null");
	}
	
	if (typeof mappedKey === "undefined" || mappedKey === null) {
		throw new TypeError("mappedKey is null");
	}
	
	for(var i = 0; i < table.rows.length; i++) {
		var physicalKeyCell = table.rows[i].cells[0];
		var mappedKeyCell = table.rows[i].cells[1];
		
		if (physicalKeyCell.innerHTML === physicalKey && mappedKeyCell.innerHTML === mappedKey) {
			table.deleteRow(i);
			return;
		}
	}
};

Reboard.clearKeyMapRows = function(table) {
	for (var i = 0; i < table.rows.length; ) {
		if (Reboard.isKeyMapRow(table.rows[i])) {
			table.deleteRow(i); //Note that this will change table.rows.length
		} else {
			i++;
		}
	}
};

Reboard.isKeyMapRow = function(row) {
	if (typeof row === "undefined" || row === null) {
		return false;
	}
	
	if (row.cells.length < 3) {
		return false;
	}
	
	//Check for the characteristic text of the delete button, which only KeyMap rows have.
	if (row.cells[2].childNodes[0].innerHTML === "X") {
		return true;
	}
	
	return false;
}
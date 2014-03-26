var Reboard = {};

window.addEventListener("load", function () {
    var table = document.getElementById("assignments");
    
    Reboard.createNewEntryRow(table);
    Reboard.createKeyMapRow(table, "&#8592", "H");
    Reboard.createKeyMapRow(table, "S", "J");
    Reboard.createKeyMapRow(table, "D", "K");
    Reboard.createEditRow(table, "Z", "N", 4);
    Reboard.createKeyMapRow(table, "Q", "U");
    Reboard.createKeyMapRow(table, "W", "I");

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

    physicalKeyCell.appendChild(Reboard.createKeyInput("key", physicalKey));
    mappedKeyCell.appendChild(Reboard.createKeyInput("value", mappedKey));

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

    Reboard.addButtonVisibilityModifier(row);
    
    row.addEventListener("click", function (event) {
    	var targetCell = event.target;
    	var cellIndex = targetCell.cellIndex;
    	
    	var editRow = Reboard.convertFromKeyMapToEditRow(row);
    	var inputBox = editRow.cells[cellIndex].childNodes[0];
    	inputBox.focus();
    });

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
    	var table = row.parentNode;
        table.deleteRow(row.rowIndex);
    });
    return deleteButton;       
};

Reboard.addButtonVisibilityModifier = function(row) {
	
	if (row === null || typeof row === "undefined") {
		throw new Error("row is null");
	}
	
    row.addEventListener("mouseenter", function(event) {
        var cell = event.target.cells[2];
        var deleteButton = cell.childNodes[0];
        deleteButton.style.visibility = "visible";
    }); 

    row.addEventListener("mouseleave", function(event) {
        var cell = event.target.cells[2];
        var deleteButton = cell.childNodes[0];
        deleteButton.style.visibility = "hidden";
    });
};

/**
 * @returns the user input row
 */
Reboard.convertFromKeyMapToEditRow = function (row) {
	if (row === null || typeof row === "undefined") {
		throw new Error("row is null");
	}
	
	if (row.cells.length < 2) {
		throw new Error("row has less than 2 cells");
	}
	
	var physicalKeyCell = row.cells[0];
	var mappedKeyCell = row.cells[1];
	
	var physicalKey = physicalKeyCell.innerHTML;
	var mappedKey = mappedKeyCell.innerHTML;
	
	var rowIndex = row.rowIndex;
	
	var table = row.parentNode;
    table.deleteRow(rowIndex);
    
    return Reboard.createEditRow(table, physicalKey, mappedKey, rowIndex);	
};

/**
 * @param table required
 * @param physicalKey optional
 * @param mappedKey optional
 * @param rowIndex required
 */
Reboard.createEditRow = function(table, physicalKey, mappedKey, rowIndex) {
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
		throw new Error("rowIndex is null");
	}


    var row = table.insertRow(rowIndex);
    row.tabindex = "0"; //makes the row focusable
    var physicalKeyCell = row.insertCell(-1);
    var mappedKeyCell = row.insertCell(-1);
    var deleteButtonCell = row.insertCell(-1);

    var physicalKeyInput = Reboard.createKeyInput("key", physicalKey);
    var mappedKeyInput = Reboard.createKeyInput("value", mappedKey);
    
    physicalKeyInput.addEventListener("blur", function (event) {
    	if (document.activeElement !== mappedKeyInput) {
        	Reboard.convertFromEditToKeyMapRow(row);   		
    	}
    });    

    mappedKeyInput.addEventListener("blur", function (event) {
    	if (document.activeElement !== physicalKeyInput) {
    		Reboard.convertFromEditToKeyMapRow(row);
    	}
    });
    
    physicalKeyCell.appendChild(physicalKeyInput);
    mappedKeyCell.appendChild(mappedKeyInput);
    deleteButtonCell.appendChild(Reboard.createDeleteButton(row));

    Reboard.addButtonVisibilityModifier(row);
    
    row.addEventListener("focusout", function (event) {
    	Reboard.convertFromEditToKeyMapRow(row);
    });
    
    return row;  	
};

Reboard.convertFromEditToKeyMapRow = function (row) {
	if (typeof row === "undefined" || row === null) {
		throw new Error("row is null");
	}
	
	if (row.cells.length < 2) {
		throw new Error("row has less than 2 cells");
	}
	
	var physicalKeyCell = row.cells[0];
	var mappedKeyCell = row.cells[1];
	
	var physicalKey = physicalKeyCell.childNodes[0].value;
	var mappedKey = mappedKeyCell.childNodes[0].value;
	
	var rowIndex = row.rowIndex;
	
	var table = row.parentNode;
    table.deleteRow(rowIndex);
    
    return Reboard.createKeyMapRow(table, physicalKey, mappedKey, rowIndex);	
};

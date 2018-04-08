// Setting a debug constant to allow console printing
const DEBUG = false;

// Setting min and max values for grid
const GRIDMIN = 9;
const GRIDMAX = 64;

// Debugger function
function debugMsg(msg){
    if (DEBUG) {
	console.log("DEBUG: " + msg);
    }
}

// Defining a pixelMaker object to contain page elements
// and pass them around easily
let PixelMaker = {
    // Using the mouseDragging value to detect that the mouse had been
    // clicked and dragged into a new cell allowing smooth drawing!
    mouseDragging: false,
    leftMouse: false,
    lastWidth: 0,
    lastHeight: 0
};
debugMsg("pixelMaker object declared");

// resetGrid removes all the painted pixels 
function resetGrid() {
    $(".col").each(function (index) {
	$(this).css("background-color", "");
    });
    debugMsg("canvas reset");
}

// makeGrid generates a new, clean grid.
function makeGrid(col, row) {
    debugMsg("makeGrid(" + col.toString() + "," +
	  row.toString() + ") invoked");
    
    // First, clear the canvas!
    PixelMaker.canvas.empty();
    debugMsg("canvas cleared");
    
    // Next, draw the new grid for the canvas using arguments passed
    // to the function parameters col & row!
    // Normally I would have done this with two for loops, one outer
    // and one inner.. However the instructions asked to use a while
    // AND a for, so I shall obey.
    let y = 0;
    while (y < row)
    {
	PixelMaker.canvas.append("<tr class='row'></tr>");
	let curRow = PixelMaker.canvas.find(".row").last();
	
	for (let x = 0; x < col; x++) {
	    curRow.append("<td class='col'></td>");
	}
	y++;
    }
    debugMsg(col.toString() + "x" + row.toString() + " grid drawn");

    // Define function to fill an element's bg color
    let fillColor = function (element) {
	let color = "";

	// Only use the color if the left mouse button is clicked
	if (PixelMaker.leftMouse) {
	    color = PixelMaker.colorPicker.val();
	}
	
	element.css("background-color", color);
    };
    
    // Finally, add listeners to the canvas to "draw" the pixel!
    PixelMaker.canvas.on("mousedown", ".col", function (event) {
	// Detect if the left mouse button was pressed or not
	if (event.which === 1) {
	    PixelMaker.leftMouse = true;
	} else {
	    PixelMaker.leftMouse = false;
	}
	
	fillColor($(this));
	PixelMaker.mouseDragging = true;
	debugMsg("canvas mousedown listener invoked");
    });
    debugMsg("canvas mousedown listener created");

    // Resetting drawing mode if mouse is up
    PixelMaker.canvas.on("mouseup", ".col", function (event) {
	PixelMaker.mouseDragging = false;
	PixelMaker.leftMouse = false;
	debugMsg("canvas mouseup listener invoked");
    });
    debugMsg("canvas mouseup listener created");

    // Continue drawing once mouse is pressed and enters new col.
    // This makes the drawing seem silky smooth :)
    PixelMaker.canvas.on("mouseenter", ".col", function (event) {
	if (PixelMaker.mouseDragging) {
	    fillColor($(this));
	}
    });
    debugMsg("canvas mouseenter listener created");

    // Over-riding some events that were causing issues..
    PixelMaker.canvas.contextmenu(function (event) {
	return false;
    });

    PixelMaker.canvas.scroll(function (event) {
	return false;
    });
}

$(function () {
    debugMsg("document onload function successful");
    
    // Assigning pixel maker elements now the doc is loaded..
    // I know, there are so many! :o
    PixelMaker.inputHeight = $("#inputHeight");
    PixelMaker.inputWidth = $("#inputWidth");
    PixelMaker.colorPicker = $("#colorPicker");
    PixelMaker.canvas = $("#pixelCanvas");
    PixelMaker.about = $("#about");
    PixelMaker.settings = $("#settings");
    PixelMaker.modalAbout = $("#modalAbout");
    PixelMaker.modalSettings = $("#modalSettings");
    PixelMaker.closeAbout = $("#closeAbout");
    PixelMaker.closeSettings = $("#closeSettings");
    PixelMaker.save = $("#save");
    PixelMaker.clear = $("#clear");
    debugMsg("PixelMaker properties defined");

    // Make initial grid with default values
    let x = PixelMaker.inputWidth.val();
    let y = PixelMaker.inputHeight.val();

    // Track the last known value of x and y
    PixelMaker.lastWidth = x;
    PixelMaker.lastHeight = y;

    // Fire up the grid!
    makeGrid(x, y);
    
    // About click listener
    PixelMaker.about.click(function (event) {
	debugMsg("about icon click event invoked");
	PixelMaker.modalAbout.css("display", "block");
    });

    // About close button listener
    PixelMaker.closeAbout.click(function (event) {
	debugMsg("about close button clicked");
	PixelMaker.modalAbout.css("display", "none");
    });

    // Settings click listener
    PixelMaker.settings.click(function (event) {
	debugMsg("settings icon click event invoked");
	PixelMaker.modalSettings.css("display", "block");
    });

    // Settings close button listener
    PixelMaker.closeSettings.click(function (event) {
	debugMsg("settings close button clicked");
	PixelMaker.modalSettings.css("display", "none");
    });

    PixelMaker.save.click(function (event) {
	event.preventDefault();
	debugMsg("save button clicked");

	let inputWidth = PixelMaker.inputWidth;
	let inputHeight = PixelMaker.inputHeight;
	let x = inputWidth.val();
	let y = inputHeight.val();

	// Error handling: Make sure values are within defined min and max!
	if (x < GRIDMIN) {
	    alert("ERROR: Grid Width cannot be less than " + GRIDMIN.toString());
	    inputWidth.val(GRIDMIN);
	    inputWidth.select();
	    return false;
	}

	if (x > GRIDMAX) {
	    alert("ERROR: Grid Width cannot be greater than " + GRIDMAX.toString());
	    inputWidth.val(GRIDMAX);
	    inputWidth.select();
	    return false;
	}

	if (y < GRIDMIN) {
	    alert("ERROR: Grid Height cannot be less than " + GRIDMIN.toString());
	    inputHeight.val(GRIDMIN);
	    inputHeight.select();
	    return false;
	}

	if (y > GRIDMAX) {
	    alert("ERROR: Grid Height cannot be greater than " + GRIDMAX.toString());
	    inputHeight.val(GRIDMAX);
	    inputHeight.select();
	    return false;
	}
	
	// Set variables to the values from input boxes
	debugMsg("variables x: " + x.toString() +
	      " y: " + y.toString() + " defined");

	// Close settings dialog box
	PixelMaker.modalSettings.css("display", "none");

	debugMsg("lastWidth: " + PixelMaker.lastWidth.toString());
	debugMsg("lastHeight: " + PixelMaker.lastHeight.toString());
	
	// Draw grid with width and height provided from input boxes..
	// If values don't match previous ones!
	if (x !== PixelMaker.lastWidth || y !== PixelMaker.lastHeight) {
	    makeGrid(x, y);
	    PixelMaker.lastWidth = x;
	    PixelMaker.lastHeight = y;
	}
    });

    PixelMaker.clear.click(function (event) {
	event.preventDefault();
	debugMsg("clear button clicked");

	// Close settings dialog box
	PixelMaker.modalSettings.css("display", "none");
	
	// Reset the grid color
	resetGrid();
    });

    // Fixing a drawing bug
    PixelMaker.canvas.mouseenter(function (event) {
	PixelMaker.mouseDragging = false;
	PixelMaker.leftMouse = false;
    });
    
    PixelMaker.canvas.mouseleave(function (event) {
	PixelMaker.mouseDragging = false;
	PixelMaker.leftMouse = false;
    });
    
    debugMsg("listeners registered and document ready!");
});

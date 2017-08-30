var leveleditor = {
    enabled     : false,
    tileindex   : 0,
    tileswitch  : false,
    
    keys: function(){
        if (this.enabled) {
            // Get mouse viewport location and tile indices
            var mx = viewport.mousex;
            var my = viewport.mousey;
            var mi = yv2i(my);
            var mj = xv2j(mx);
            
            // Get tiletype at mouse and selected by editor
            var tid = level.data[mi][mj];
            var edtid = this.tileindex;
            
            // Show tile info at mouse position
            if(tid!==undefined){
                gamelog.textmark('Editor: ' + edtid + ' ' + tileset[edtid].name, mx, my+40, true);  // tiletype
                gamelog.textmark('Current: ' + tid + ' ' + tileset[tid].name, mx, my+60, true);  // tiletype
            }
            
            // Replace tile
            if (viewport.mousedown) {
                level.data[mi][mj] = edtid;
            }
            
            // Z - Previous tile type
            if (!this.tileswitch && keydown.z) {
                // Previous tile
                this.tileindex--;
                if (this.tileindex < 0) {   // Jump to last
                    this.tileindex = tileset.length-1;
                }
                
                this.tileswitch = true;     // Stop switching until no key is pressed
                
            // X - Next tile type
            } else if (!this.tileswitch && keydown.x) {
                // Next tile
                this.tileindex++;
                if (this.tileindex > tileset.length-1) {
                    this.tileindex = 0;     // Jump to first
                }
                
                this.tileswitch = true;     // Stop switching until no key is pressed
                
            // C - Copy tile type from mouse
            } else if (!this.tileswitch && keydown.c) {
                this.tileindex = tid;       // Copy tiletype from under mouse
                this.tileswitch = true;     // Stop switching until no key is pressed
            
            // F - Save level data
            } else if (!this.tileswitch && keydown.f) {
                
                
                //--- Generate level code ---//
                var lvlcode = `
// Level Name
level.name = "` + level.name + `";

// Tile size
level.tilewidth = ` + level.tilewidth + `;
level.tileheight = ` + level.tileheight + `;

// Tileset
level.tileset = "` + level.tileset + `";

// Level Data
level.data=[\n[`;
                
                // Loop over tiles for saving
                var ni = level.data.length;
                for (var i = 0; i < ni; i++) {          // Loop over i
                    var nj = level.data[i].length;
                    
                    for (var j = 0; j < nj; j++) {      // Loop over j
                        var tid = level.data[i][j];     // Get tile type
                        lvlcode += tid;
                        
                        // Insert appropriate delimiter
                        if (j == nj-1) {
                            if (i == ni-1) {            // Last col last row
                                lvlcode += ']];';
                            } else {                    // Just last col
                                lvlcode += '],\n[';
                            }
                        } else {
                            lvlcode += ',';             // Not at end of row
                        }
                    }
                }
                //--- Code generation done ---//
                
                // Open data as textfile and initiate download
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:attachment/text,' + encodeURI(lvlcode);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'lvl.js';
                hiddenElement.click();
                
                this.tileswitch = true;     // Stop switching until no key is pressed
                
            // Block further actions until all keys are released
        } else if (!(keydown.x || keydown.z || keydown.c || keydown.f)) {
                this.tileswitch = false;
            }
        }
    }
}

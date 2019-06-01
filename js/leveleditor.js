var leveleditor = {
    enabled     : false,
    tileindex   : 0,
    entindex    : 0,
    keyswitch   : false,
    mode        : 'tile',
    
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
            
            
            
            //--- Tile editor ---//
            if (this.mode == 'tile') {
                // Show tile info at mouse position
                if(tid!==undefined){
                    gamelog.textmark('Mode: ' + this.mode, mx, my+40, true);  // Current mode
                    gamelog.textmark('Selected: ' + edtid + ' ' + tileset[edtid].name, mx, my+60, true);  // tiletype
                    gamelog.textmark('Current: ' + tid + ' ' + tileset[tid].name, mx, my+80, true);  // tiletype
                    gamelog.textmark('Height: ' + level.tileprops[mi][mj].height.toPrecision(3), mx, my+100, true);  // (Water) height
                }
                
                // Tile editor controls
                // Mouseclick - Replace tile
                if (viewport.mousedown) {
                    level.data[mi][mj] = edtid;
                }
            
                // Z - Previous tile type
                if (!this.keyswitch && keydown.z) {
                    // Previous tile
                    this.tileindex--;
                    if (this.tileindex < 0) {   // Jump to last
                        this.tileindex = tileset.length-1;
                    }
                    
                    this.keyswitch = true;      // Stop switching until no key is pressed
                    
                // X - Next tile type
                } else if (!this.keyswitch && keydown.x) {
                    // Next tile
                    this.tileindex++;
                    if (this.tileindex > tileset.length-1) {
                        this.tileindex = 0;     // Jump to first
                    }
                    
                    this.keyswitch = true;      // Stop switching until no key is pressed
                    
                // C - Copy tile type from mouse
                } else if (!this.keyswitch && keydown.c) {
                    this.tileindex = tid;       // Copy tiletype from under mouse
                    this.keyswitch = true;      // Stop switching until no key is pressed
                }
                
                
            //--- Entity Editor ---//
            } else if (this.mode == 'entity') {
                // Show tile info at mouse position
                if(tid!==undefined){
                    gamelog.textmark('Mode: ' + this.mode, mx, my+40, true);  // Current mode
                    gamelog.textmark('Selected: ' + this.entindex + ' ' + entitynames[this.entindex], mx, my+60, true);  // tiletype
                }
                
                // Tile editor controls
                // Mouseclick - Replace tile
                if (viewport.mousedown) {
                    spawn(entitynames[this.entindex],xv2xl(mx),yv2yl(my));
                }
            
                // Z - Previous entity type
                if (!this.keyswitch && keydown.z) {
                    // Previous entity type
                    this.entindex--;
                    if (this.entindex < 0) {   // Jump to last
                        this.entindex = entitynames.length-1;
                    }
                    
                    this.keyswitch = true;     // Stop switching until no key is pressed
                    
                // X - Next entity type
                } else if (!this.keyswitch && keydown.x) {
                    // Next tile type
                    this.entindex++;
                    if (this.entindex > entitynames.length-1) {
                        this.entindex = 0;     // Jump to first
                    }
                    this.keyswitch = true;     // Stop switching until no key is pressed
                    
                // C - Copy entity from mouse
                } else if (!this.keyswitch && keydown.c) {
                    // Determine closest entity
                    mindist = level.width;
                    entity = undefined;
                    var nents = entities.length;
                    
                    // Loop over entities
                    for (var i = 0; i < nents; i++) {
                        var p = [];
                        p[0] = entities[i].x - xv2xl(mx);
                        p[1] = entities[i].y - xv2xl(my);
                        var dist = mag(p);              // Distance mouse <-> entity
                        
                        if (mindist > dist) {           // Found smaller distance
                            mindist = dist;
                            entity = entities[i];
                        }
                    }
                    
                    // Set current entity
                    if (entity !== undefined) {         // If a closest entity was found
                        var entindex = entitynames.indexOf(entity.type);
                        if (entindex !== -1) {          // Check if index was found
                            this.entindex = entindex;   // Set entity index
                        }
                    }
                    
                    this.keyswitch = true;     // Stop switching until no key is pressed
                }
            }
            
            
            // General Controls
            // M - Switch edit mode
            if (!this.keyswitch && keydown.m) {
                if (this.mode == 'tile') {
                    this.mode = 'entity';   // Switch to entity mode
                } else if (this.mode == 'entity') {
                    this.mode = 'tile';     // Switch to tile mode
                }
                
                this.keyswitch = true;      // Stop switching until no key is pressed
                
                
            // F - Save level data
            } else if (!this.keyswitch && keydown.f) {
                
                
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
                
                this.keyswitch = true;     // Stop switching until no key is pressed
                
                
            // Block further actions until all keys are released
        } else if (!(keydown.x || keydown.z || keydown.c || keydown.f || keydown.m)) {
                this.keyswitch = false;
            }
        }
    }
}

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
                
            // Block further actions until all keys are released
        } else if (!(keydown.x || keydown.z || keydown.c)) {
                this.tileswitch = false;
            }
        }
    }
}

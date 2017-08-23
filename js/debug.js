function debug() {
    
    var nents = entities.length;
    
    // Show entity properties above them
    for(var i=nents-1;i>-1;i--){
        gamelog.textmark(i+', hp:'+Math.round(entities[i].hp),entities[i].xview,entities[i].yview);
    }

    // Show histogram of entity hp
    gamelog.hist[0]={
        oblist: entities,
        prop: 'hp',
        min: -2,
        max: 32
    };

    // Graphs
    gamelog.updateGraph(0,gamelog.fps,'fps',30,100); ///// Gamelog!
    gamelog.updateGraph(1,entities.length,'number of entities',0,300);
    if(liquid.drops.length){
        gamelog.updateGraph(2,liquid.drops[0].vtvy[0],'vy droplet',-10,10);
        gamelog.num[3] = liquid.drops[0].vtvy[0];
    }

    // Player cooldown
    gamelog.num[1] = player.cooldown;

    // Mouse info
    var mx = viewport.mousex;
    var my = viewport.mousey;

    var mi = yv2i(my);
    var mj = xv2j(mx);
    var tid = level.data[mi][mj];

    if(tid!==undefined){
        gamelog.textmark('i:'+mi+', j:'+mj, mx, my+40, true);               // tile indices
        gamelog.textmark(tid + ': ' + tileset[tid].name, mx, my+60, true);  // tiletype
        gamelog.textmark(tileset[tid].color, mx, my+80, true);              // tile color
        
        // Show water properties
        if(tid==4){
            gamelog.textmark("height: " + level.tileprops[mi][mj].height.toPrecision(3),mx,my+100,true);
        }
    }
}

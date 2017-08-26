function debug() {
    
    var nents = entities.length;
    
    // Show entity properties above them
    var angry = 0;
    var friendly = 0;
    for(var i = nents-1; i > 0 ; i--){
        var ent = entities[i];
        gamelog.textmark('hp:' + Math.round(ent.hp) + ', ' + ent.ai.mode, ent.xview, ent.yview - 20);
        gamelog.mark[i] = [ent.x, ent.y];
        gamelog.markcolor[i] = 'black';
        
        // Count dangos
        if (ent.type == 'angrydango') {angry++;}
        if (ent.type == 'dango') {friendly++;}
    }

    // Show histogram of entity hp
    // gamelog.hist[0]={
    //     oblist: entities,
    //     prop: 'vy',
    //     min: -2,
    //     max: 32
    // };

    // Graphs
    gamelog.updateGraph(0,gamelog.fps,'fps',40,100); ///// Gamelog!
    gamelog.updateGraph(1,entities.length,'number of entities',0,50);
    if(liquid.drops.length){
        gamelog.updateGraph(2,liquid.drops[0].vtvy[0],'vy droplet',-10,10);
        gamelog.num[3] = liquid.drops[0].vtvy[0];
    }

    // Player cooldown
    gamelog.num[0] = player.cooldown;
    gamelog.numstr[0] = 'Cooldown: ';
    
    // Player hp
    gamelog.num[1] = player.hp;
    gamelog.numstr[1] = 'hp: '
    
    
    //---- Mini Game: Dango Defender! ----////////
    // Protect the friendly dango's!
    
    //// Friendly Dango's left
    gamelog.num[2] = friendly;
    gamelog.numstr[2] = "Friendly Dango's left: ";
    
    //// Angry Dango's left
    gamelog.num[3] = angry;
    gamelog.numstr[3] = "Angry Dango's left: ";
    
    if (player.hp <= 0) {           ///// temporary death message
        ctx.font = '48px Trebuchet MS, sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('You dieded!',viewport.width/2,viewport.height/2);
    } else if (angry == 0) {        ///// Winning condition
        ctx.font = '48px Trebuchet MS, sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText("Friendly Dango's rescued!",viewport.width/2,viewport.height/2);
    }
    ///// title
    ctx.font = '40px Trebuchet MS, sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText("Dango Defender!", viewport.width/2, 50);
    //-----------------------------------///////
    

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

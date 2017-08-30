function debug() {
    
    var nents = entities.length;
    
    // Show entity properties above them
    var angry = 0;
    var friendly = 0;
    for(var i = nents-1; i > 0 ; i--){
        var ent = entities[i];
        gamelog.textmark('hp:' + Math.round(ent.hp) + ', ' + ent.ai.mode, ent.xview, ent.yview - 20);
        
        // Count dangos
        if (ent.type == 'angrydango' || ent.type == 'batdango' || ent.type == 'nodeppodango') {angry++;}
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
    gamelog.circ[0] = viewport.mousedown;       // Show if mouse is down
}

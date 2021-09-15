var roleBuilder = {
    run: function (creep) {
        if (!creep.memory.hasOwnProperty('building'))
            creep.memory.building = false;
        if (creep.memory.building && creep.store.getUsedCapacity() == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);//在当前房间寻找建筑点
            if (targets.length) {
                let it = 0;
                for (let i = 0; i < targets.length; i++) {
                    it = creep.pos.getRangeTo(targets[i].pos) < creep.pos.getRangeTo(targets[it].pos) ? i : it;
                }
                if (creep.build(targets[it]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[it].pos);
                }
            } else {//在其他房间寻找建筑点，没有则返回休息区
                let needStruct = false;
                for(let roomName in Game.rooms){
                    let targets = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
                    if (targets.length) {
                        needStruct = true;
                        if(targets[0].room.roomName != creep.room.name){//不在同一房间
                            creep.goTo(targets[0].pos);
                        }
                    }
                }
                if(!needStruct) {
                    creep.moveTo(Game.flags['BuilderPos'].pos);//TODO:这里需要改成房间寻路
                }
            }
        } else {
            if(creep.room.controller && creep.room.controller.my)//主房间从储存罐取能量，外矿到处取能量
                creep.fetchEnergy();
            else
                creep.fetchEnergy(4);
        }
    }
}

module.exports = roleBuilder;
var roleRepairer = {
    needRepair: function (structure) {
        switch(structure.structureType){
            case STRUCTURE_EXTENSION:
            case STRUCTURE_SPAWN:
            case STRUCTURE_CONTROLLER:
                return structure.hits < structure.hitsMax;
            case STRUCTURE_CONTAINER:
                return structure.hits < structure.hitsMax*0.9;
            case STRUCTURE_ROAD:
                return structure.hits < structure.hitsMax*0.7;

        }
        return false;
    },

    run: function (creep) {
        if(!creep.memory.hasOwnProperty('repairing'))
            creep.memory.repairing = false;
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0){
            creep.memory.repairing = true;
        }
        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => this.needRepair(i)
            });
            if(!Game.flags['RepairSet'].memory.hasOwnProperty('repairSet'))
                Game.flags['RepairSet'].memory.repairSet = new Set();
            for(let i=0; i<targets.length; i++){
                Game.flags['RepairSet'].memory.repairSet[targets[i].id] = {'type':targets[i].structureType, 'pos':targets[i].pos}
            }
            creep.say(Object.keys(Game.flags['RepairSet'].memory.repairSet).length)
            if(Object.keys(Game.flags['RepairSet'].memory.repairSet).length) {
                let it = 0;

                for(let id in Game.flags['RepairSet'].memory.repairSet){
                    let structure = Game.getObjectById(id);
                    if(!structure || structure.hits == structure.hitsMax){//建筑不存在或已被摧毁,执行重建
                        creep.room.createConstructionSite(Game.flags['RepairSet'].memory.repairSet[id].pos,Game.flags['RepairSet'].memory.repairSet[id].type);
                        delete Game.flags['RepairSet'].memory.repairSet[id];
                        continue;
                    }
                    if(!it || creep.pos.getRangeTo(structure.pos) < creep.pos.getRangeTo(it.pos)){
                        it = Game.getObjectById(id);
                    }
                }
                if(Object.keys(Game.flags['RepairSet'].memory.repairSet).length && creep.repair(it) == ERR_NOT_IN_RANGE) {//元素删除后，set可能为空
                    creep.moveTo(it.pos);
                }
            }
            else {
                creep.moveTo(Game.flags['RepairerPos'].pos);
            }
        }
        else {
            var saveTarget = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE ) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            for(let i = 0;i<saveTarget.length;i++){
                if(saveTarget[i].pos.getRangeTo(creep.pos) < saveTarget[it].pos.getRangeTo(creep.pos)){
                    it = i;
                }
            }

            if(creep.withdraw(saveTarget[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(saveTarget[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleRepairer;
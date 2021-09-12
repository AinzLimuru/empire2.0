var roleBuilder = {
    run: function (creep) {
        if(!creep.memory.hasOwnProperty('building'))
            creep.memory.building = false;
        if(creep.memory.building && creep.store.getUsedCapacity() == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0){
            creep.memory.building = true;
        }
        if(creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                let it = 0;
                for(let i=0;i<targets.length;i++){
                    it = creep.pos.getRangeTo(targets[i].pos) < creep.pos.getRangeTo(targets[it].pos) ? i : it;
                }
                if(creep.build(targets[it]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[it].pos);
                }
            }
            else {
                creep.moveTo(Game.flags['BuilderPos'].pos);
            }
        }
        else {
            let saveTarget = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE ) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            if(saveTarget.length > 0) {//有存储罐
                for (let i = 0; i < saveTarget.length; i++) {
                    if (saveTarget[i].pos.getRangeTo(creep.pos) < saveTarget[it].pos.getRangeTo(creep.pos)) {
                        it = i;
                    }
                }
                if(creep.withdraw(saveTarget[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(saveTarget[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if(Game.spawns['Spawn1'].getAvailableEnergy() == Game.spawns['Spawn1'].getTotalCapacity()){//没有存储罐,但extension和Spawn已满
                let extensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(extensions.length) {
                    for(let i=0;i<extensions.length;i++){//选择最短地点
                        it = creep.pos.getRangeTo(extensions[i].pos) < creep.pos.getRangeTo(extensions[it].pos) ? i : it;
                    }
                }
                if(creep.withdraw(extensions[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensions[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
}

module.exports = roleBuilder;
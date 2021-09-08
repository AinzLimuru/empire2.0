var roleRepairer = {
    run: function (creep) {
        var repairList = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hits*0.7;
            }
        })
        Memory.repairCount = repairList.length;
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0){
            creep.memory.repairing = true;
        }
        if(creep.memory.repairing) {
            if(repairList.length) {
                it = it >= repairList ? 0 : it;
                if(creep.build(repairList[it]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairList[it], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                it++;
            }
            else {
                if(!creep.position.inRangeTo(Memory.repairerPos.x,Memory.repairerPos.y,4)){//能量补充完毕，返回休息区待命(当builder数量过多时，在数量控制处进行角色转换）
                    creep.moveTo(Memory.repairerPos.x,Memory.repairerPos.y);

                }
            }
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            if(creep.memory.hasOwnProperty('harvestTarget') == false){
                creep.memory['harvestTarget'] = 1 - this.it%2;
                this.it++;
            }
            if(creep.harvest(sources[creep.memory.harvestTarget]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.harvestTarget], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleRepairer;
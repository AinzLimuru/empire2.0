var roleUpgrader = {

    /** @param {Creep} creep **/

    it:0,
    run: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {//能量耗尽时采集
            creep.memory.upgrading = false;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {//能量采集满时进入upgrade状态
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            for(let i = 0;i<containers.length;i++){
                if(containers[i].position.getRangeTo(creep.position) < containers[it].position.getRangeTo(creep.position)){
                    it = i;
                }
            }
            if(!countainers.length||creep.harvest(countainers[it]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[it], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;
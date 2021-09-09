var roleUpgrader = {

    /** @param {Creep} creep **/

    it:0,
    run: function(creep) {
        //creep.say('upgrader');
        if(!creep.memory.hasOwnProperty('upgrading'))
            creep.upgrading = false;
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
            for(let i = 0;i<containers.length;i++){//找到最近的非空储存罐
                if(containers[i].pos.getRangeTo(creep.pos) < containers[it].pos.getRangeTo(creep.pos)){
                    it = i;
                }
            }
            //creep.say(creep.withdraw(containers[it], RESOURCE_ENERGY));
            if(containers.length > 0 && creep.withdraw(containers[it], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;
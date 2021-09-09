var roleBUilder = {
    run: function (creep) {
        if(!creep.memory.hasOwnProperty('building'))
            creep.memory.building = false;
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0){
            creep.memory.building = true;
        }
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                if(!creep.position.inRangeTo(Memory.builderPos.x,Memory.builderPos.y,4)){//能量补充完毕，返回休息区待命(当builder数量过多时，在数量控制处进行角色转换）
                    creep.moveTo(Memory.builderPos.x,Memory.builderPos.y);

                }
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

module.exports = roleBUilder;
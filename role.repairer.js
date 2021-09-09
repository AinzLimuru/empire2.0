var roleRepairer = {
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
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.hits < i.hitsMax
            });
            if(targets.length) {
                let it = 0;
                for(let i=0;i<targets.length;i++){
                    it = creep.pos.getRangeTo(targets[it].pos) < creep.pos.getRangeTo(targets[it].pos) ? i : it;
                }
                if(creep.repair(targets[it]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[it].pos);
                }
            }
            // else {
            //     if(!creep.position.inRangeTo(Memory.builderPos.x,Memory.builderPos.y,4)){//能量补充完毕，返回休息区待命(当builder数量过多时，在数量控制处进行角色转换）
            //         creep.moveTo(Memory.builderPos.x,Memory.builderPos.y);
            //
            //     }
            // }
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            for(let i = 0;i<containers.length;i++){
                if(containers[i].pos.getRangeTo(creep.pos) < containers[it].pos.getRangeTo(creep.pos)){
                    it = i;
                }
            }

            if(creep.withdraw(containers[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleRepairer;
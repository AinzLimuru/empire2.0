var roleDistributor = {
    run: function (creep) {
        if(!creep.memory.hasOwnProperty('distributing'))
            creep.memory.distributing = false;
        if(creep.memory.distributing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.distributing = false;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.distributing && creep.store.getFreeCapacity() == 0){
            creep.memory.distributing = true;
            creep.say('distibuting')
        }
        if(creep.memory.distributing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length) {
                let it = 0;
                for(let i=0;i<targets.length;i++){//选择最短地点
                    it = creep.pos.getRangeTo(targets[i].pos) < creep.pos.getRangeTo(targets[it].pos) ? i : it;
                }
                if(creep.transfer(targets[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[it].pos);
                }
            }
            else {
                creep.moveTo(Game.flags['DistributorPos'].pos);
            }
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            for(let i = 0;i<containers.length;i++){//选择最近存储罐
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

module.exports = roleDistributor;
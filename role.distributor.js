var roleDistributor = {
    run: function (creep) {
        if(!creep.memory.hasOwnProperty('distributing'))
            creep.memory.distributing = false;
        if(creep.memory.distributing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.distributing = false;
            creep.say('π withdraw');
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
                for(let i=0;i<targets.length;i++){//ιζ©ζη­ε°ηΉ
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
            var saveTarget = creep.room.find(FIND_STRUCTURES, {//ζΎε°ζζιη©Ίε¨ε­η½
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE )&&
                    i.store[RESOURCE_ENERGY] > 0
            });
            let it = 0;
            for(let i = 0;i<saveTarget.length;i++){//ιζ©ζθΏε­ε¨η½
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

module.exports = roleDistributor;
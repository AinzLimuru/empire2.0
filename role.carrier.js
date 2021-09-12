var roleCarrier = {
    run: function (creep) {

        if(!creep.memory.hasOwnProperty('sending')){
            creep.memory.sending = false;
        }

        if(creep.memory.sending && creep.store.getUsedCapacity() == 0){
            creep.memory.sending = false;
            creep.say('getting');
        }

        if(!creep.memory.sending && creep.store.getFreeCapacity() == 0){
            creep.memory.sending = true;
            creep.say('sending');
        }
        if(creep.memory.sending){
            let saveTarget = null;
            if(Game.flags[creep.memory.storage] && Game.flags[creep.memory.storage].memory.storage && Game.getObjectById(Game.flags[creep.memory.storage].memory.storage)){
                saveTarget = Game.getObjectById(Game.flags[creep.memory.storage].memory.storage);
            }
            else if(Game.flags[creep.memory.container] && Game.flags[creep.memory.container].memory.container && Game.getObjectById(Game.flags[creep.memory.container].memory.container)){
                saveTarget = Game.getObjectById(Game.flags[creep.memory.container].memory.container);
            }
            if(saveTarget){//如果Container/Storage存在则向存储罐中运输
                if(saveTarget.store.getFreeCapacity() == 0){//存储罐满后，在CarrierPos处待命
                    creep.moveTo(Game.flags['CarrierPos'].pos);
                } else if (creep.transfer(saveTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(saveTarget.pos);
                }
            }
            else {//如果Container/Storage不存在则向最近的非空Extension和Spawn运输
                let extensions = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(extensions.length) {
                    let it = 0;
                    for(let i=0;i<extensions.length;i++){//选择最短地点
                        it = creep.pos.getRangeTo(extensions[i].pos) < creep.pos.getRangeTo(extensions[it].pos) ? i : it;
                    }
                    if(creep.transfer(extensions[it],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extensions[it].pos);
                    }
                }
                else{
                    creep.moveTo(Game.flags['CarrierPos'].pos);
                }
            }
        }
        else if(creep.memory.target){
            let flag = Game.flags[creep.memory.target];
            let it = 0;//存储当前遇到的creep中，能量最多的
            let pos;
            for(name in flag.memory.harvester){
                if(!Game.creeps[name]){
                    delete flag.memory.harvester[name];
                }else{
                    if(creep.pos.getRangeTo(Game.creeps[name].pos) <= 1 && Game.creeps[name].store.getUsedCapacity() > 0) {
                        if(!Game.creeps[name].memory.carrier || Game.getObjectById(Game.creeps[name].memory.carrier).store.getUsedCapacity()<creep.store.getUsedCapacity())//已经装的最多的先装，满足先来先走
                            Game.creeps[name].memory.carrier = creep.id;
                    }
                    else if(Game.creeps[name].store.getUsedCapacity() > it) {
                        creep.moveTo(Game.creeps[name].pos);
                        it = Game.creeps[name].store.getUsedCapacity();
                    }
                }
            }
        }

    }
}

module.exports = roleCarrier;
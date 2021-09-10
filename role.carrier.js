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
            if(creep.transfer(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.container).pos)
            }
        }
        else if(creep.memory.target){
            let flag = Game.flags[creep.memory.target];
            for(name in flag.memory.harvester){
                if(!Game.creeps[name]){
                    delete flag.memory.harvester[name];
                    
                }else{
                    if(creep.pos.getRangeTo(Game.creeps[name].pos) <= 1 && Game.creeps[name].store.getUsedCapacity() > 0)
                        Game.creeps[name].memory.carrier = creep.id;
                    else if(Game.creeps[name].store.getUsedCapacity() > 0)
                        creep.moveTo(Game.creeps[name].pos);
                }
            }
        }

    }
}

module.exports = roleCarrier;
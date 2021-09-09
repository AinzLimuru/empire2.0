var roleCarrier = {
    run: function (creep) {
        if(!creep.memory.hasOwnProperty('sending')){
            creep.memory.sending = false;
        }

        if(creep.memory.sending && creep.store.getUsedCapacity() == 0){
            creep.memory = false;
            creep.say('getting');
        }

        if(!creep.memory.sending && creep.store().getFreeCapacity() == 0){
            creep.memory = true;
            creep.say('sending');
        }

        if(creep.memory.sending){
            if(creep.transfer(Game.getObjectById(creep.memory.sending)) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.sending))
            }
        }
        else if(creep.memory.target){
            for(name in Game.getObjectById(creep.memory.target).memory.harvester){
                Game.creeps[name].memory.carrier = creep.id;
            }
        }

    }
}

module.exports = roleCarrier;

module.exports = roleCarrier;
var roleHarvester = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0){
            let source = Game.getObjectById(creep.memory.target);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,{visuallizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if(creep.Memory.hasOwnProperty('carrier')){//附近有carrier
            creep.transfer(Game.getObjectById(creep.carrier),RESOURCE_ENERGY);
            delete creep.Memory['carrier'];
        }
    }
}

module.exports = roleHarvester;
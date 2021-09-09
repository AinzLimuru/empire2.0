function harvesterRegister(creep) {//向Source注册
    if(creep.memory.hasOwnProperty('registed') && creep.memory.registed)
        return;
    let flag = Game.flags[creep.memory.target];
    if(!Game.getObjectById(flag.memory.target).memory.hasOwnProperty('harvester'))
        Game.getObjectById(flag.memory.target).memory.harvester = {};
    Game.getObjectById(flag.memory.target).memory.harvester[creep.name] = creep.id;
    cree.memory.registed = true;
}

var roleHarvester = {
    run: function(creep) {
        harvesterRegister(creep);
        let flag = Game.flags[creep.memory.target];
        if(creep.store.getFreeCapacity() > 0){
            let source = Game.getObjectById(flag.memory.target);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,{visuallizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if(creep.memory.hasOwnProperty('carrier')){//附近有carrier
            creep.transfer(Game.getObjectById(creep.carrier),RESOURCE_ENERGY);
            delete creep.memory['carrier'];
        }
    }
}

module.exports = roleHarvester;
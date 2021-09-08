var roleHarvester = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0){
            let source = Game.getObjectById(creep.target);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,{visuallizePathStyle: {stroke: '#ffaa00'}});
            }else {
                for(let id in Memory.countainer.target) {
                    let container = Game.getObjectById(id);
                    if(container.store.getFreeCapacity(RESOURCE_ENERGY) > 0){//找到一个可用的容器就可以了
                        if(creep.transfer(countainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(countainer, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        break;
                    }
                }
            }
        }
    }
}

module.exports = roleHarvester;
var roleCarrier = {
    run: function (creep) {
        if(creep.store.getFreeCapacity() > 0){//这里可以完善判断逻辑，储量不足则取出所有后返回
            let target = Game.getObjectById(creep.memory.fromTarget);
            if(creep.withdraw(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            let target = Game.getObjectById(creep.memory.toTarget);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

module.exports = roleCarrier;
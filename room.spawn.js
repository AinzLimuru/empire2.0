var RoomSpawn = {
    init: function () {
        _.assign(StructureSpawn.prototype, this.spawnExtension)
    },
    spawnExtension: {
        getAvailableEnergy: function () {
            let extensions = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            let total = this.store.getUsedCapacity();
            for(let extension in extensions){
                total += extension.store.getUsedCapacity();
            }
            return total;
        },
        getTotalCapacity: function() {
            let extensions = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            let total = this.store.getCapacity();
            for(let extension in extensions){
                total += extension.store.getCapacity();
            }
            return total;
        }
    },
    addSpawnPlan: function (body,info) {
        console.log('new ' + info.role);
        let name = info.role + Game.time;
        if(!Game.spawns['Spawn1'].memory.hasOwnProperty('spawnPlan')){
            Game.spawns['Spawn1'].memory.spawnPlan = [];
        }
        Game.spawns['Spawn1'].memory.spawnPlan.push({'body':body,'info':info});
    },
    spawn: function () {
        if(!Game.spawns['Spawn1'].memory.hasOwnProperty('spawnPlan')){
            Game.spawns['Spawn1'].memory.spawnPlan = [];
        }
        if(!Game.spawns['Spawn1'].spawning && Game.spawns['Spawn1'].memory.spawnPlan.length){
            let creepInfo = Game.spawns['Spawn1'].memory.spawnPlan[0];
            if(Game.spawns['Spawn1'].spawnCreep(creepInfo.body, creepInfo.info.role + Game.time, {memory: creepInfo.info}) == OK){
                Game.spawns['Spawn1'].memory.spawnPlan.shift();
            }
        }
    }

}

module.exports = RoomSpawn;

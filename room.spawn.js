var RoomSpawn = {
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
            let creepInfo = Game.spawns['Spawn1'].memory.spawnPlan.shift();
            Game.spawns['Spawn1'].spawnCreep(creepInfo.body, creepInfo.info.role + Game.time, {memory: creepInfo.info});
        }
    }
}

module.exports = RoomSpawn;

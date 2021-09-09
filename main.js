const roleBuilder = require('role.builder');
const roleCarrier = require('role.carrier');
const roleHarvester = require('role.harvester');
const roleRepairer = require('role.repairer');
const roleUpgrader = require('role.upgrader');
const roomSpawn = require('room.spawn');

module.exports.loop = function() {
    let cbuilder = 0,ccarrier = 0,charvester = 0,crepairer = 0,cupgrader = 0;
    for(var name in Memory.creeps) {//统计并清理死亡creep
        if(!Game.creeps[name]) {
            switch(Game.creeps[name].role){
                case 'harvester':
                    roomSpawn.addSpawnPlan([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],{role:'harvester',target:Memory.creeps[name].target});
                    delete Game.getObjectById(Memory.creeps[name].target).memory.harvesters[name];
                    break;
                case 'builder':
                    roomSpawn.addSpawnPlan([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],{role:'builder',target:Memory.creeps[name].target});
                    break;
                case 'carrier':
                    roomSpawn.addSpawnPlan([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],{role:'carrier',target:Memory.creeps[name].target})
                    break;
                case 'repairer':
                    roomSpawm.addSpawnPlan([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],{role:'repairer',target:Memory.creeps[name].target});
                    break;
                case 'upgrader':
                    roomSpawm.addSpawnPlan([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],{role:'upgrader',target:Memory.creeps[name].target});
                    break;
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }else{
            switch(Game.creeps[name].role) {
                case 'harvester':
                    charvester++;
                    break;
                case 'builder':
                    cbuilder++;
                    break;
                case 'carrier':
                    ccarrier++;
                    break;
                case 'repairer':
                    crepairer++;
                    break;
                case 'upgrader':
                    cupgrader++;
                    break;
            }
        }
    }
    /*
    控制台输出
     */
    console.log('harvester:'+charvester);
    console.log('builder:'+cbuilder);
    console.log('carrier'+ccarrier);
    console.log('repairer'+crepairer);
    console.log('upgrader:'+cupgrader);
    console.log('totalCreep:'+(charvester+cbuilder+ccarrier+crepairer+cupgrader));
    for(let name in Game.creeps){
        let creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'carrier':
                roleCarrier.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
        }
    }
    roomSpawn.spawn();
}
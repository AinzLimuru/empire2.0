const roleBuilder = require('role.builder');
const roleCarrier = require('role.carrier');
const roleHarvester = require('role.harvester');
const roleRepairer = require('role.repairer');
const roleUpgrader = require('role.upgrader');
const roleDistributor = require('role.distributor');
const roomSpawn = require('room.spawn');
/*
生产的creep body需求过高，导致无法生产（加入判断条件会比较好）
 */
module.exports.loop = function() {
    let cbuilder = 0,ccarrier = 0,charvester = 0,crepairer = 0,cupgrader = 0,cdistributor = 0;
    for(var name in Memory.creeps) {//统计并清理死亡creep
        if(!Game.creeps[name]) {
            if(!Memory.creeps[name].killedByPlayer){//被玩家杀死不复活
                switch(Memory.creeps[name].role){
                case 'harvester':
                    roomSpawn.addSpawnPlan([WORK,WORK,WORK,CARRY,MOVE],{role:'harvester',target:Memory.creeps[name].target});
                    delete Game.flags[Memory.creeps[name].target].memory.harvester[name];
                    break;
                case 'builder':
                    roomSpawn.addSpawnPlan([WORK,CARRY,MOVE],{role:'builder',target:Memory.creeps[name].target});
                    break;
                case 'carrier':
                    roomSpawn.addSpawnPlan([CARRY,CARRY,MOVE,MOVE],{role:'carrier',target:Memory.creeps[name].target,container:Memory.creeps[name].container})
                    break;
                case 'repairer':
                    roomSpawn.addSpawnPlan([WORK,CARRY,MOVE],{role:'repairer',target:Memory.creeps[name].target});
                    break;
                case 'upgrader':
                    roomSpawn.addSpawnPlan([WORK,CARRY,MOVE],{role:'upgrader',target:Memory.creeps[name].target});
                    break;
                case 'distributor':
                    roomSpawn.addSpawnPlan([WORK,CARRY,MOVE],{role:'distributor',target:Memory.creeps[name].target});
                    break;
                }
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }else{
            switch(Game.creeps[name].memory.role) {
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
                case 'distributor':
                    cdistributor++;
                    break;
            }
        }
    }
    /*
    控制台输出
     */
    console.log('harvester:'+charvester);
    console.log('builder:'+cbuilder);
    console.log('carrier:'+ccarrier);
    console.log('repairer:'+crepairer);
    console.log('upgrader:'+cupgrader);
    console.log('distributer:'+cdistributor)
    console.log('totalCreep:'+(charvester+cbuilder+ccarrier+crepairer+cupgrader+cdistributor));
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
            case 'distributor':
                roleDistributor.run(creep);
                break;
        }
        if(creep.memory.killedByPlayer){
            creep.suicide();
        }
    }
    roomSpawn.spawn();
}
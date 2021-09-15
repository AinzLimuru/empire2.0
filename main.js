const creepExtension = require('creep.extension');
const gameExtension = require('game.extension');
const spawnExtension = require('spawn.extension');
const roleBuilder = require('role.builder');
const roleCarrier = require('role.carrier');
const roleHarvester = require('role.harvester');
const roleRepairer = require('role.repairer');
const roleUpgrader = require('role.upgrader');
const roleDistributor = require('role.distributor');
const roleTowerServer = require('role.towerServer');
const roleWallRepairer = require('role.wallRepairer');
const roomTower = require('room.tower');
const roomSchedule = require('room.schedule');
/*
生产的creep body需求过高，导致无法生产（加入判断条件会比较好）
 */

creepExtension.init();
gameExtension.init();
spawnExtension.init();

module.exports.loop = function() {
    roomSchedule.run();


    let cbuilder = 0,ccarrier = 0,charvester = 0,crepairer = 0,cupgrader = 0,cdistributor = 0,ctowerServer = 0,cwallRepairer = 0;
    for(var name in Memory.creeps) {//统计并清理死亡creep
        if(!Game.creeps[name]) {
            if(!Memory.creeps[name].hasOwnProperty('killedByPlayer') || !Memory.creeps[name].killedByPlayer){//被玩家杀死不复活
                Game.newCreep("Spawn1",Memory.creeps[name].role,Memory.creeps[name]);
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
                case 'towerServer':
                    ctowerServer++;
                    break;
                case 'wallRepairer':
                    cwallRepairer++;
                    break;
            }
        }
    }
    /*
    控制台输出
     */
    console.log('***time:'+Game.time+'***')
    console.log('harvester:'+charvester);
    console.log('builder:'+cbuilder);
    console.log('carrier:'+ccarrier);
    console.log('repairer:'+crepairer);
    console.log('upgrader:'+cupgrader);
    console.log('distributer:'+cdistributor);
    console.log('towerServer: '+ctowerServer);
    console.log('wallRepairer: '+cwallRepairer);
    console.log('totalCreep:'+(charvester+cbuilder+ccarrier+crepairer+cupgrader+cdistributor+ctowerServer+cwallRepairer));
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
            case 'towerServer':
                roleTowerServer.run(creep);
                break;
            case 'wallRepairer':
                roleWallRepairer.run(creep);
                break;
        }
        if(creep.memory.killedByPlayer){
            creep.suicide();
        }
    }
    for(let name in Game.spawns){
        Game.spawns[name].spawn();
    }
    roomTower.run();
}
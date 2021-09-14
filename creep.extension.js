let creepExtension = {
    init: function () {
        _.assign(Creep.prototype, this.creepExtension);
    },
    creepExtension: {
        fetchEnergy: function (urge = 0) {
            /*
            在当前房间中取得能量：
            urge=0:仅从storage中取得能量，同时保证storage的储量大于5000
            urge=1:从storage,container中取得能量，不考虑储量
            urge=2:从所有可能的容器中取得能量(不包括spawn)
            urge=3:从所有可能的容器和harvester中取得能量
             */
        },
        fetchEnergy_0:function () {
            let saveTarget = this.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => (i.structureType == STRUCTURE_STORAGE) &&
                    i.store[RESOURCE_ENERGY] > 5000
            });
            if (saveTarget.length > 0) {//有存储罐
                let it = 0;
                for (let i = 0; i < saveTarget.length; i++) {
                    if (saveTarget[i].pos.getRangeTo(this.pos) < saveTarget[it].pos.getRangeTo(this.pos)) {
                        it = i;
                    }
                }
                if (this.withdraw(saveTarget[it], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(saveTarget[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return true;
            }else{
                return false;
            }
        },
        fetchEnergy_1:function () {
            let saveTarget = this.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => (i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            if (saveTarget.length > 0) {//有存储罐
                let it = 0;
                for (let i = 0; i < saveTarget.length; i++) {
                    if (saveTarget[i].pos.getRangeTo(this.pos) < saveTarget[it].pos.getRangeTo(this.pos)) {
                        it = i;
                    }
                }
                if (this.withdraw(saveTarget[it], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(saveTarget[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return true;
            }else{
                return false;
            }
        },
        fetchEnergy_2:function () {
            let saveTarget = this.room.find(FIND_STRUCTURES, {//找到所有非空储存罐
                filter: (i) => (i.structureType == STRUCTURE_EXTENSION ) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            if (saveTarget.length > 0) {//有存储罐
                let it = 0;
                for (let i = 0; i < saveTarget.length; i++) {
                    if (saveTarget[i].pos.getRangeTo(this.pos) < saveTarget[it].pos.getRangeTo(this.pos)) {
                        it = i;
                    }
                }
                if (this.withdraw(saveTarget[it], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(saveTarget[it].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return true;
            }else{
                return false;
            }
        },
        fetchEnergy_3:function () {
            let harvesters = Memory.rooms[this.room.name].creeps.harvester;
            if (harvesters.length > 0) {//有存储罐
                let it = 0;
                for (let i = 0; i < harvesters.length; i++) {
                    if (Game.getObjectById(harvesters[i]).store.getUsedCapacity() == 0 ||
                        (Game.getObjectById(harvesters[i]).store.getUsedCapacity() > 0 &&
                        Game.getObjectById(harvesters[i]).pos.getRangeTo(this.pos) < Game.getObjectById(harvesters[it]).pos.getRangeTo(this.pos))) {
                        it = i;
                    }
                }
                let harvester = Game.getObjectById(harvesters[it]);
                if(harvester.store.getUsedCapacity() > 0) {
                    if (this.pos.getRangeTo(harvester.pos) <= 1) {
                        if (!harvester.memory.carrier)//不干扰正常采集
                            harvester.memory.carrier = this.id;
                    }
                    else{
                        this.moveTo(harvester.pos);
                    }
                    return true;
                }
                else{
                    return false;//没有储有能量的harvester
                }
            }else{
                return false;//没有harvester
            }
        },
        getFrom: function (target) {
            /*
            从指定房间的指定地点取得资源，要求：
             */
            if(target.room && target.room != this.room.name){
                this.moveTo(Memory.rooms[this.room].to[target.room].x, Memory.rooms[this.room].to[target.room].y);
            }
            else{
                if(this.harvest(Game.getObjectById(target.id)) == ERR_NOT_IN_RANGE){
                    this.moveTo(Game.getObjectById(target.id).pos);
                }
            }
        },
        collectTheBody: function (tombstone) {
            /*
            从墓碑处收集资源
             */
        },
        inherit: function (creep) {
            /*
            继承前任creep，memory全部复制，并根据遗嘱will执行后续操作
             */
        },
        goTo: function (pos) {
            /*
            前往指定房间的指定位置
             */
            if(room && this.room.name != pos.roomName){
                this.moveTo(Memory[this.room.name].to[pos.roomName].x && Memory[this.room.name].to[pos.roomName].y);
            }else{
                this.moveTo(pos);
            }
        },
        goTo: function (x,y, room = null) {
            /*
            前往指定房间的指定位置
             */
            if(room && this.room.name != room){
                this.moveTo(Memory[this.room.name].to[room].x && Memory[this.room.name].to[room].y);
            }else{
                this.moveTo(x,y);
            }
        },
        register: function () {
            /*
            Creep向房间注册(可能离开房间,需要进行判断)
             */
            if(!Memory.rooms[this.room.name]){
                Memory.rooms[this.room.name] = {};
            }
            if(!Memory.rooms[this.room.name].creeps){
                Memory.rooms[this.room.name].creeps = {};
            }
            if(!Memory.rooms[this.room.name].creeps[this.memory.role]){
                Memory.rooms[this.room.name].creeps[this.memory.role] = {};
            }
            Memory.rooms[this.room.name].creeps[this.memory.role][this.id] = this.name;
        }
    }
}

module.exports = creepExtension;
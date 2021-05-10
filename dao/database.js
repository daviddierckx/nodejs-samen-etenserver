let db = []
let timeout = 800
let lastInsertedIndex = 0;

module.exports = {
    db,
    getAll:(callback)=> {
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    add:(item,callback)=>{
        setTimeout(() => {
            item.homeId = lastInsertedIndex++;
            db.push(item)
            callback(undefined, db);
          }, timeout);
    },
    update:(callback)=>{
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    getOne:(index,callback)=>{
        setTimeout(() => {
            callback(undefined, db[index]);
          }, timeout);
    },
    delete:(item,callback)=>{
        db.splice(item,1)
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    addUser:(index,callback)=>{
        db[index].user.push("David")
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    }
}
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
    getOne:(item,callback)=>{
        setTimeout(() => {
            callback(undefined, item);
          }, timeout);
    },
    delete:(item,callback)=>{
        db.splice(item,1)
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    }
}
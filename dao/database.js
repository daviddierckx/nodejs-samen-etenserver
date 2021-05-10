let db = []
let timeout = 800
let lastInsertedIndex = 0;
let lastInsertedMealIndex = 0;

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
            callback(undefined, db[index])
            console.log(db);
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
    },
    addMeal:(item,index,callback)=>{
        setTimeout(() => {
            try{
                db[index].meal.push(item)
            }catch(err){
               console.log('Unable to create meal')
            }
            callback(undefined, db);
          }, timeout);
    },
    updateMeal:(callback)=>{
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    getAllMeal:(callback)=>{
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    getMealDetails:(callback)=>{
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
    deleteMealDetails:(callback)=>{
        setTimeout(() => {
            callback(undefined, db);
          }, timeout);
    },
}
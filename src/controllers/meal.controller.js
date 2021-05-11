let lastInsertedMealIndex = 1;

const database = require('../dao/database')

module.exports = {
    createMeal: (req,res,next)=>{
        console.log("meal.controller.createMeal called");
        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        
        const naam = req.body.naam
        const beschrijving = req.body.beschrijving
        const aangemaaktOp = req.body.aangemaaktOp
        const aangebodenOp = req.body.aangebodenOp
        const prijs = req.body.prijs
        const allergieInfo = req.body.allergieInfo
        const ingredienten = req.body.ingredienten

        const values = {
            mealId:lastInsertedMealIndex++,
            naam: naam,
            beschrijving:beschrijving,
            aangemaaktOp: aangemaaktOp,
            aangebodenOp: aangebodenOp,
            prijs: prijs,
            allergieInfo: allergieInfo,
            ingredienten: ingredienten
        }


        database.addMeal(values,objIndex,(err,result)=>{
        
            if(err){
             res.status(400).json({
             message: 'Add meal failed' })
            }
             if(result){
                res.status(200).json({status: "succes",result:result})
            }
        })
    },
    updateMeal:(req,res,next)=>{
        console.log("meal.controller.updateMeal called");
        

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        mealIndex = database.db[objIndex].meal.findIndex((obj => obj.mealId == req.params.mealId))
        //Log object to Console.
        console.log("Before update: ", database.db[objIndex])
        
        //Update object's name property.
        database.db[objIndex].meal[mealIndex].naam = req.body.naam
        database.db[objIndex].meal[mealIndex].beschrijving  = req.body.beschrijving
        database.db[objIndex].meal[mealIndex].aangemaaktOp  = req.body.aangemaaktOp
        database.db[objIndex].meal[mealIndex].aangebodenOp  = req.body.aangebodenOp
        database.db[objIndex].meal[mealIndex].prijs  = req.body.prijs
        database.db[objIndex].meal[mealIndex].allergieInfo  = req.body.allergieInfo
        database.db[objIndex].meal[mealIndex].ingredienten  = req.body.ingredienten

        //Log object to console again.
        console.log("After update: ", database.db[objIndex])
        
        database.update((err, result)=>{
            if(err){
                console.log("error updating meal",values)
                next(err)

            }
            if(result){
                res.status(200).json({status: "succes",result:result})
            }
        })    
    },
    mealList: (req,res,next)=>{
        console.log("meal.controller.mealList called");
        let mealList = []

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        
        for (i = 0; i < database.db[objIndex].meal.length; i++) {
            mealList.push({meal:database.db[objIndex].meal[i]});
            console.log(database.db[objIndex].meal[i].naam)
          }
        
        console.log
        console.log(database.db[objIndex].meal.length)
        database.getAllMeal((err, result)=>{
            if(err){
                next(err)
            }
            if(result){
                res.status(200).json({
                    status: "succes",
                    result: mealList
                })
            }
        })
    },
    mealDetails:(req,res,next)=>{
        console.log("meal.controller.mealDetails called");
        let mealList = []

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        
        for (i = 0; i < database.db[objIndex].meal.length; i++) {
            if(database.db[objIndex].meal[i].mealId == req.params.mealId){
                mealList.push({meal:database.db[objIndex].meal[i]});
                console.log(database.db[objIndex].meal[i].naam)

            }
          }
        
        database.getMealDetails((err, result)=>{
            if(err){
                next(err)
            }
            if(result){
                res.status(200).json({
                    status: "succes",
                    result: mealList
                })
            }
        })
    },
    mealDelete:(req,res,next)=>{
        console.log("meal.controller.mealDelete called");

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        mealIndex = database.db[objIndex].meal.findIndex((obj => obj.mealId == req.params.mealId))
        
        var ar = database.db[objIndex].meal
        ar.splice(mealIndex,1)
        

        database.deleteMealDetails((err,result)=>{
            if(err){
                next(err)
            }
            if(result){
                console.log( "Delete succes" );
                res.status(200).json({
                    status:'succes',
                    result: result
                })
            }
        })
    }
}
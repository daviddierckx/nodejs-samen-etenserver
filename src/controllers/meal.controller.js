const database = require('../dao/database')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const mysqlConnection = require('../dao/database')


module.exports = {
    createMeal: (req,res,next)=>{
        console.log("meal.controller.creatMeal called");
        let emp = req.body
        let sql = "SET @ID = ?;SET @Name = ?;SET @Description = ?;SET @Ingredients = ?;SET @Allergies = ?;SET @CreatedOn = ?;SET @OfferedOn = ?;SET @Price = ?;SET @UserID = ?;SET @StudenthomeID = ?;\
        CALL MealAddOrEdit(@ID,@Name, @Description, @Ingredients, @Allergies, @CreatedOn, @OfferedOn, @Price,@UserID,@StudenthomeID);"
        mysqlConnection.query(sql,[emp.ID,emp.Name, emp.Description, emp.Ingredients, emp.Allergies, emp.CreatedOn, emp.OfferedOn, emp.Price, emp.UserID, parseInt(req.params.homeId)],(err,rows,fields)=>{
            if(emp.ID === null || emp.ID != 0){
                res.status(400).send('Failed to insert, change id to 0')
            }
            // else if((emp.Postal_Code.length !== 6 || emp.Telephone.length !== 10)
            //      || emp.Name === undefined || emp.Address === undefined || emp.House_Nr === undefined || emp.City === undefined){
            //          return res.status(400).send("Failed to post, Invalid input")
            // }
            else if(!err){
                res.status(201)
                         rows.forEach(element => {
                            if(element.constructor == Array){
                                res.send('Inserted meal with id : '+element[0].ID)
                            }
                        })
            }
            else{
                console.log(err)
            }
        })
    },
    updateMeal:(req,res,next)=>{
        console.log("meal.controller.updateMeal called");
        
        let emp = req.body
        let sql = "SET @ID = ?;SET @Name = ?;SET @Description = ?;SET @Ingredients = ?;SET @Allergies = ?;SET @CreatedOn = ?;SET @OfferedOn = ?;SET @Price = ?;SET @UserID = ?;SET @StudenthomeID = ?;\
        CALL MealAddOrEdit(@ID,@Name, @Description, @Ingredients, @Allergies, @CreatedOn, @OfferedOn, @Price,@UserID,@StudenthomeID);"
        mysqlConnection.query(sql,[parseInt(req.params.mealId),emp.Name, emp.Description, emp.Ingredients, emp.Allergies, emp.CreatedOn, emp.OfferedOn, emp.Price, emp.UserID, parseInt(req.params.homeId)],(err,rows,fields)=>{
            
            if(!err){
                res.status(201)
                         rows.forEach(element => {
                            if(element.constructor == Array){
                                res.send('Inserted meal with id : '+element[0].ID)
                            }
                        })
            }
            else{
                console.log(err)
            }
        })
        
    },
    mealList: (req,res,next)=>{
        console.log("meal.controller.mealList called");
        mysqlConnection.query("SELECT * FROM meal WHERE StudenthomeID = "+ req.params.homeId,(err,rows,fields)=>{ //WHERE StudenthomeID = req.params.homeId
            if(!err && rows.length > 0){
                res.status(200).json({
                        status:'succes',
                        result: rows
                    })
            }
            else{
                res.status(404).send("The meal with the provided ID does not exist")
                 }
            })
    },
    mealDetails:(req,res,next)=>{
        console.log("meal.controller.mealdetails called");
        mysqlConnection.query("SELECT * FROM meal WHERE ID = "+req.params.mealId + "  AND StudenthomeID = "+ req.params.homeId,(err,rows,fields)=>{
        if(!err && rows.length > 0){
            console.log(rows)
            res.status(200).json({
                    status:'succes',
                    result: rows
                })
        }
        else{
            res.status(404).send("The meal with the provided ID does not exist")
             }
        })
    },
    mealDelete:(req,res,next)=>{
        console.log("meal.controller.mealDelete called");

        mysqlConnection.query("DELETE FROM meal WHERE ID = "+req.params.mealId  +" AND StudenthomeID = "+ req.params.homeId,(err,rows,fields)=>{
            if(!err && rows.affectedRows > 0){
                res.status(200)
                res.send('deletion succeeded')
            }
            else{
                res.status(404).send("The meal with the provided ID does not exist")
            }
        })
    }
}
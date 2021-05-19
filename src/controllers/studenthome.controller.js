
const { response } = require('express');
const database = require('../dao/database')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const mysqlConnection = require('../dao/database')


module.exports = {
    getAll: (req,res,next)=>{
        console.log("studenthome.controller.getAll called");
        mysqlConnection.query("SELECT * FROM studenthome",(err,rows,fields)=>{
            if(!err){
                res.status(200).json({
                        status:'succes',
                        result: rows
                    })
            }
            else{
                console.log(err)
                next(err)
            }
        })
    },
    createOne:(req,res,next)=>{
        console.log("studenthome.controller.createOne called");
        let emp = req.body
        let sql = "SET @ID = ?;SET @Name = ?;SET @Address = ?;SET @House_Nr = ?;SET @UserID = ?;SET @Postal_Code = ?;SET @Telephone = ?;SET @City = ?;\
        CALL StudenthomeAddOrEdit(@ID,@Name, @Address, @House_Nr, @UserID, @Postal_Code, @Telephone, @City);"
        mysqlConnection.query(sql,[emp.ID,emp.Name, emp.Address, emp.House_Nr, emp.UserID, emp.Postal_Code, emp.Telephone, emp.City],(err,rows,fields)=>{
            if(emp.ID === null || emp.ID != 0){
                res.send('Failed to insert, change id to 0')
            }
            else if((emp.Postal_Code.length !== 6 || emp.Telephone.length !== 10)
                 || emp.Name === undefined || emp.Address === undefined || emp.House_Nr === undefined || emp.City === undefined){
                     return res.status(400).send("Failed to post, Invalid input")
            }
            else if(!err){
                res.status(201)
                         rows.forEach(element => {
                            if(element.constructor == Array){
                                res.send('Inserted studenthome with id : '+element[0].ID)
                            }
                        })
            }
            else{
                console.log(err)
            }
        })
    },
    updateOne:(req,res,next)=>{
        console.log("studenthome.controller.updateOne called");
        let emp = req.body
        let sql = "SET @ID = ?;SET @Name = ?;SET @Address = ?;SET @House_Nr = ?;SET @UserID = ?;SET @Postal_Code = ?;SET @Telephone = ?;SET @City = ?;\
        CALL StudenthomeAddOrEdit(@ID,@Name, @Address, @House_Nr, @UserID, @Postal_Code, @Telephone, @City);"
        mysqlConnection.query(sql,[parseInt(req.params.homeId),emp.Name, emp.Address, emp.House_Nr, emp.UserID, emp.Postal_Code, emp.Telephone, emp.City],(err,rows,fields)=>{
             if(emp.ID === null || emp.ID != 0){
                res.send('Failed to insert, change id to 0')
            }
            else if(!err){
                res.status(200)
                res.send('Updated succesfully')
            }
            else{
                console.log(err)
            }
        })
    },
   getOne:(req,res,next)=>{
    console.log("studenthome.controller.getOne called");
    mysqlConnection.query("SELECT * FROM studenthome WHERE ID = "+req.params.homeId,(err,rows,fields)=>{
        if(!err && rows.length > 0){
            res.status(200).json({
                    status:'succes',
                    result: rows
                })
        }
        else{
            res.status(404).send("The home with the provided ID does not exist")
        }
    })
   },
   delete:(req,res,next)=>{
    console.log("studenthome.controller.delete called");
    mysqlConnection.query("DELETE FROM studenthome WHERE ID = "+req.params.homeId,(err,rows,fields)=>{
        if(!err && rows.affectedRows > 0){
            res.status(200)
            res.send('deletion succeeded')
        }
        else{
            res.status(404).send("The home with the provided ID does not exist")
        }
    })
   },
   addUser:(req,res,next)=>{
    console.log("studenthome.controller.createOne called");
    let emp = req.body
    let sql = "SET @ID = ?;SET @First_Name = ?;SET @Last_Name = ?;SET @Email = ?;SET @Student_Number = ?;SET @Password = ?;\
    CALL UserAdd(@ID,@First_Name, @Last_Name, @Email, @Student_Number, @Password);"
    mysqlConnection.query(sql,[emp.ID,emp.First_Name, emp.Last_Name, emp.Email, emp.Student_Number, emp.Password],(err,rows,fields)=>{
        if(emp.ID === null || emp.ID != 0){
            res.send('Failed to insert, change id to 0')
        }
        else if(!err){
            res.status(201)
                     rows.forEach(element => {
                        if(element.constructor == Array){
                            res.send('Inserted user with id : '+element[0].ID)
                        }
                    })
        }
        else{
            console.log(err)
        }
    })
   }
}
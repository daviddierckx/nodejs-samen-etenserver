
const { response } = require('express');
const database = require('../dao/database')

module.exports = {
    getAll: (req,res,next)=>{
        console.log("studenthome.controller.getAll called");
        database.getAll((err, result)=>{
            if(err){
                next(err)
            }
            if(result){
                res.status(200).json({
                    status: "succes",
                    result: result
                })
            }
        })
    },
    createOne:(req,res,next)=>{
        console.log("studenthome.controller.createOne called");

        const name = req.body.name
        const street = req.body.street
        const houseNumber = req.body.houseNumber
        const postalcode = req.body.postalcode
        const place = req.body.place
        const telephoneNumber = req.body.telephoneNumber
        
        const values = {
              'homeId': database.db.length+1,
              'name':name,
              'street':street,
              'house_number': houseNumber,
              'postal_code': postalcode,
              'place': place,
              'telephone_number': telephoneNumber,
              'user':[],
              'meal':[]
          }
          database.add(values,(err,result)=>{
            if((values.postal_code.length !== 6 || values.telephone_number.length !== 10)
             || name === undefined || street === undefined || houseNumber === undefined || place === undefined){
                return res.status(400).send("Failed to post, Invalid input")
            }
            if(result){
                res.status(201).json({
                    status: "succes",
                    result: result
                })
            }
            })
    },
    updateOne:(req,res,next)=>{
        console.log("studenthome.controller.updateOne called");
        

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));

        //Log object to Console.
        console.log("Before update: ", database.db[objIndex])
        
        //Update object's name property.
        database.db[objIndex].name = req.body.name
        database.db[objIndex].street = req.body.street
        database.db[objIndex].houseNumber = req.body.houseNumber
        database.db[objIndex].postalcode = req.body.postalcode
        database.db[objIndex].place = req.body.place
        database.db[objIndex].telephoneNumber = req.body.telephoneNumber
        
        //Log object to console again.
        console.log("After update: ", database.db[objIndex])
        
        database.update((err, result)=>{
            if((database.db[objIndex].postalcode.length !== 6 || database.db[objIndex].telephoneNumber.length !== 10)
            || database.db[objIndex].name === undefined || database.db[objIndex].street === undefined || 
            database.db[objIndex].houseNumber === undefined || database.db[objIndex].place === undefined){
               return res.status(400).send("Failed to put, Invalid input")
           }
            if(result){
                res.status(200).json({status: "succes",result:result})
            }
        })
    },
   getOne:(req,res,next)=>{
    console.log("studenthome.controller.getOne called");

    objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
    const home = database.db.find(home => home.homeId === parseInt(req.params.homeId))

    database.getOne(objIndex,(err,result)=>{
        if(!home){
            return res.status(404).send("The home with the provided ID does not exist")
        }
        if(result){
            res.status(200).json({
                status: "succes",
                result: result
            })
        }
    })
   },
   delete:(req,res,next)=>{
    console.log("studenthome.controller.delete called");

        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        const home = database.db.find(home => home.homeId === parseInt(req.params.homeId))

        database.delete(objIndex,(err,result)=>{
            if(!home){
                return res.status(404).send("The home with the provided ID does not exist")
            }
            if(result){
                res.status(200).json({
                    status:'succes',
                    result: result
                })
            }
        })
   },
   addUser:(req,res,next)=>{
        objIndex = database.db.findIndex((obj => obj.homeId == req.params.homeId));
        
        database.addUser(objIndex,(err,result)=>{
            if(err){
                next(err)
            }
            if(result){
                res.status(200).json({
                    status:'succes',
                    result: result
                })
            }
        })
   }
}
const express = require('express')
const controller = require('../controllers/studenthome.controller')
const mysql = require('mysql')
const bodyparser = require('body-parser')

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'studenthome'
})

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeded')
    else
    console.log('DB connection failed \n Error : '+ JSON.stringify(err,undefined,2))
})



const app  = express()
app.use(bodyparser.json())
//
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Read ALL UC202 +
app.get('/studenthome',(req,res,next)=>{
    mysqlConnection.query("SELECT * FROM studenthome",(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                    status:'succes',
                    result: rows
                })
        }
        else{
            console.log(err)
        }
    })
})

//Read One UC203 +
app.get('/studenthome/:homeId',(req,res,next)=>{
    mysqlConnection.query("SELECT * FROM studenthome WHERE ID = "+req.params.homeId,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                    status:'succes',
                    result: rows
                })
        }
        else{
            console.log(err)
        }
    })
})
//Create one UC201 +
app.post('/studenthome',controller.createOne)
//Update one UC204 +
app.put('/studenthome/:homeId',controller.updateOne)
//Delete one UC205 +
app.delete('/studenthome/:homeId',controller.delete)
//Add user UC206 +
app.put('/studenthome/:homeId/user',controller.addUser)

module.exports = app;
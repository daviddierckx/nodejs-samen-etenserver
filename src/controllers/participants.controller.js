const { response } = require('express');
const database = require('../dao/database')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const mysqlConnection = require('../dao/database')

module.exports = {
    getParticipantByID: (req,res,next)=>{
        console.log("participants.controller.getParticipantsByID called");
        mysqlConnection.query("SELECT * FROM participants WHERE UserID = "+req.params.participantId,(err,rows,fields)=>{
        if(!err && rows.length > 0){
            res.status(200).json({
                    status:'succes',
                    result: rows
                })
        }
        else{
            res.status(404).send("The participant with the provided ID does not exist")
        }
    })
    },
    getAllParticipants: (req,res,next)=>{
        mysqlConnection.query("SELECT * FROM participants",(err,rows,fields)=>{
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
    }

}
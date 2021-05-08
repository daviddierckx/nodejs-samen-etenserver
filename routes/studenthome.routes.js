const express = require('express')
const database = require('../database')


const app  = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Read ALL
app.get('/studenthomesss',(req, res,next)=>{
    try{
        const items = database.db
        res.json(items)
    }catch(error){
        next(error)
    }
})

//Read One UC203 +
app.get('/studenthome/:homeId',(req, res,next)=>{
    const picked = database.db.filter(function(value){
        return value.homeId == req.params.homeId
    })

    res.json(picked)
})

//Create one UC201 +
app.post('/studenthome',(req, res,next)=>{
  const name = req.body.name
  const city = req.body.city

  const values = {
        'homeId': database.db.length+1,
        'name':name,
        'city':city
    }
 
    database.db.push(values)
    res.send(values)
    console.log(database.db)
})

//Update one
app.put('/:id',(req, res, next)=>{
    res.json({
        message:"hello update one"
    })
})

//Delete one
app.delete('/:id',(req, res,next)=>{
    res.json({
        message: "hello delete one"
    })
})
module.exports = app;
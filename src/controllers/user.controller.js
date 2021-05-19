const { create, getUsersByUserId,getUsers,getUserByUserEmail } = require("./user.service")
const {genSaltSync,hashSync,compareSync } = require("bcrypt")
const bcrypt = require("bcrypt")
const { sign, decode } = require("jsonwebtoken")
let array = []
module.exports = {
    createUser:(req, res) => {
        const body = req.body
        const salt = genSaltSync(10)
        body.password = hashSync(body.password,salt)
        create(body,(err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).json({
                    succes: 0,
                    message: "Database connection error or duplicate entry"
                })
            }
            return res.status(200).json({
                succes: 1,
                data: results
            })
        })
    },
    getUsersByUserId:(req,res)=>{
        const id = req.params.id;
        getUsersByUserId(id, (err,results)=>{
            if(err){
                console.log(err)
                return
            }
            if(!results){
                return res.json({
                    succes:0,
                    message:"record not found"
                })
            }
            return res.json({
                succes: 1,
                data: results
            })
        })
    },
    getUsers:(req,res)=>{
        getUsers((err,results)=>{
            if(err){
                console.log(err)
                return
            }
            return res.json({
                succes: 1,
                data: results
            })
        })
    },
    login: (req, res,callback) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
          if (err) {
            console.log(err);
          }
          if (!results) {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
          const result = bcrypt.compare(body.password, results.password);
          if (result) {
            results.password = undefined;
            const jsontoken = sign({ result: results }, "qwe1234", {
              expiresIn: "1h"
            });
             res.json({
              success: 1,
              message: "login successfully",
              token: jsontoken
            });
            const decoded = decode(jsontoken)
            const UserID = decoded.result.ID
            array.push(UserID)
            
          } else {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
        });
    },
    array
} 
const pool = require('../dao/database')


module.exports = {
    create: (data, callback) =>{
        pool.query(
            `Insert into user(First_Name, Last_Name, Email, Student_Number, Password) values(?,?,?,?,?)`,
            [
                data.first_name,
                data.last_name,
                data.email,
                data.student_number,
                data.password
            ],
            (error,results,fields) =>{
                if(error){
                    callback(error)
                }
                return(null,results)
            }
        )
    },
    getUsers: callback =>{
        pool.query(
            `SELECT * FROM user`,
            [],
            (error,results,fields) =>{
                if(error){
                   return callback(error);
                }
                return callback(null, results)
            }
        )
    },
    getUsersByUserId:(id,callback) =>{
        pool.query(
            `SELECT * FROM user WHERE ID = ?`,
            [id],
            (error,results,fields) =>{
                if(error){
                   return callback(error);
                }
                return callback(null, results[0])
            }
        )
    },
    getUserByUserEmail:(email,callback)=>{
        pool.query(
            `SELECT * FROM user WHERE email = ?`,
            [email],
            (error,results,fields)=>{
                if(error){
                    callback(error)
                }
                return callback(null,results[0])
            }
        )
    }
}
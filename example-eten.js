const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'studenthome_user',
  password : 'secret',
  database : 'studenthome'
});
 
connection.connect();
 
connection.query('SELECT * FROM studenthome',  (error, results, fields) =>{
  if (error) throw error;
  if(results){
  console.log('The solution is: ', results);
  }
});
 
connection.end();
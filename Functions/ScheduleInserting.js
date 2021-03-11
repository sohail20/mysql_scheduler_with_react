const mysql = require("mysql")

const db = mysql.createPool({
    host :"localhost",
    user:"root",
    password:null,
    database:"testinguser"
    })
    

module.exports = function (){
    /* DATABASE */
        //Creating table if not exists
        var sql = "CREATE TABLE IF Not EXISTS userarchives (id INT AUTO_INCREMENT PRIMARY KEY,firstName VARCHAR(255), lastName VARCHAR(255),email VARCHAR(255) UNIQUE NOT NULL,gender VARCHAR(255),birth VARCHAR(255))";
        db.query(sql, function (err, result) {
          if (err)
            res.send(err) ;
          else
            console.log("Table created");
        });
    
        //Fetching data from users table and inserting in userarchives tables
        db.query("select * from users",(err,result)=>{
            result && result.map((val)=>{
                db.query("insert into userarchives (id,firstName,lastName,email,gender,birth) values (?,?,?,?,?,?)",[null,val.firstName,val.lastName,val.email,val.gender,val.birth],(err,result)=>{
                    if(err)
                        console.log(err.message)
                    else
                        return true;
                 })
            })
            //res.send(result)
        })
     /* DATABASE */
}
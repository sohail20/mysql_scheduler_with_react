const express = require('express');
const cors = require("cors")
const mysql = require("mysql")
const path = require("path")
var schedule = require('node-schedule');
const app = express(),
      bodyParser = require("body-parser");
      PORT = 3080;

//Creting connection between database and web app
const db = mysql.createPool({
host :"localhost",
user:"root",
password:null,
database:"testinguser"
})

var Subject = require("./DesignPattern/ObserverDesignPattern")
var scheduleFunction = require("./Functions/ScheduleInserting") //function to insert users into userArchive table

app.use(express.static(path.join(__dirname, 'build')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



//runs every one minute
schedule.scheduleJob('1 * * * * *', function(){
  //Firing the function and unSubscribe the function "scheduleFunction()" 
    const subject = new Subject()
    subject.subscribeObserver(scheduleFunction)   
    subject.fire() 
    subject.unSubscribeObserver(scheduleFunction)
})

//Rules for scheduling the function

/* const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 00;
rule.minute = 43;

const job = schedule.scheduleJob(rule, function(){

    subject.fire()
    subject.unSubscribeObserver(scheduleFunction)

}); */
app.use(cors())
app.use(bodyParser.json());

app.get('/api/getUser', (req, res) => {
        //Fetching data from users table 
        db.query("select * from users",(err,result)=>{
            if(err)
                throw err;
            res.send(result)
        })
});


app.post('/api/insertUser', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const gender = req.body.gender;
    const birth = req.body.birth;

    //Inserting data in users table
    db.query("insert into users (id,firstName,lastName,email,gender,birth) values (?,?,?,?,?,?)",[null,firstName,lastName,email,gender,birth],(err,result)=>{
        if(err){
            res.send(err.message)
        }else{
            console.log("Data sent")
        }
    })
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on the port::${port}`);
    //Creating table users if not exists
    var sql = "CREATE TABLE IF Not EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,firstName VARCHAR(255), lastName VARCHAR(255),email VARCHAR(255) UNIQUE NOT NULL,gender VARCHAR(255),birth VARCHAR(255))";
    db.query(sql, function (err, result) {
      if(err) throw err;
    });
});

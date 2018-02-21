const { Client } = require('pg');
var db;

var dbUser = process.env.POSTGRESQL_USER;
var dbPass = process.env.POSTGRESQL_PASSWORD;
var dbName = process.env.POSTGRESQL_NAME;
var dbHost = "";
var dbPort = "";
var testFlag = process.env.TEST_FLAG;

if (testFlag == "test"){
    //test
    dbHost = process.env.POSTGRESQLTEST_SERVICE_HOST;
    dbPort = process.env.POSTGRESQLTEST_SERVICE_PORT;    
    
} else {
    //prod
    dbHost = process.env.POSTGRESQL_SERVICE_HOST;
    dbPort = process.env.POSTGRESQL_SERVICE_PORT;
}

function connectDatabase(){
    if (!db){
        db = new Client({
            user: dbUser,
            host: dbHost,
            database: dbName,
            password: dbPass,
            port: dbPort,
        });
        db.connect(function(err){
            if (!err){
                console.log('Database is connected!');
            } else {
                console.log('Error connecting databse')
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
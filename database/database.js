var Sequelize = require('sequelize');
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
        db = new Sequelize(dbName, dbUser, dbPass, {
            host: dbHost,
            port: dbPort,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            "define": {
                "createdAt": "created",
                "updatedAt": "last_updated"
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
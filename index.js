const initDataAsync = require('./sequelize/data-initializer');
const express = require('express');
const mysql = require('mysql2/promise');
fileUpload = require('express-fileupload');
const db = require('./sequelize/models');
var cors = require('cors')
const exceptionHandlerMiddleware = require('./middlewares/exceptions-handler-middleware');
const authenticationMiddleware = require('./middlewares/authentication-middleware');

(async () => {
    try {
        // sync models to database
        await syncDatabaseAsync(db.sequelize);
        console.log('Syncing Database Succesfully.');
    } catch (error) {
        console.log('Syncing Database Failed.');
        throw error;
    }

    try {
        // initializing data
        await initDataAsync();
        console.log('Initializing data Succesfully.');
    } catch (error) {
        console.log('Initializing data Failed.');
        throw error;
    }
    const PORT = process.env.PORT || 5000;

    const app = express();

    app.disable('x-powered-by');

    app.use(express.json());
    app.use(cors());

    // Routing
    app.use('/api/auths', require('./routers/auths-router'));
    app.use('/api', authenticationMiddleware, require('./routers'));

    // Handle undefined routes
    app.all("*", (req, res, next) => {
        next(
            // TODO: Hoang need to review
            // errorHelper(
            //     404,
            //     "error",
            //     `Can't find ${req.method} ${req.originalUrl} on this server!`,
            // ),
        );
    });

    // Handling exceptions
    app.use(exceptionHandlerMiddleware);
    app.use(fileUpload());
    app.listen(PORT);
})().catch(error => {
    console.log("Unexpected error, Server is shutted down. Exception:");
    console.log(error);
    return;
});

async function syncDatabaseAsync(sequelize) {
    //  get database server config from Sequelize
    const { host, port, username, password, database } = sequelize.config;

    // create database if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // sync all models with database
    await sequelize.sync({ alter: true });
}
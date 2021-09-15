const initDataAsync = require('./sequelize/data-initializer');
const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./sequelize/models');
const exceptionHandlerMiddleware = require('./middlewares/exceptions-handler-middleware');

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
    const PORT = 5000;

    const app = express();

    app.disable('x-powered-by');

    app.use(express.json());

    // Handling initialize executedBy
    app.use((req, res, next) => {
        req.body.executedBy = '00000000-0000-0000-0000-000000000000';

        next();
    });

    // Routing
    const routes = require('./routes');
    app.use('/api', routes);

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
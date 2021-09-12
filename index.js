const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./databases/models');

(async () => {
    try {
        // sync models to database
        await syncDatabaseAsync(db.sequelize);
        console.log('Syncing Database Succesfully.');
    } catch (error) {
        console.log('Syncing Database Failed.');
        throw error;
    }
    const PORT = 5000;

    const app = express();

    app.disable('x-powered-by');

    app.use(express.json());

    // Routing
    const routes = require('./routes');

    app.use('/api', routes);

    // Handle undefined routes
    app.all("*", (req, res, next) => {
        next(
            errorHelper(
                404,
                "error",
                `Can't find ${req.method} ${req.originalUrl} on this server!`,
            ),
        );
    });

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
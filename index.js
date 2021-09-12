const express = require('express');

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

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// error handling

// page not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});
// log errors to console
app.use(logErrors);
//
app.use(clientErrorHandler);
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message,
        },
    });
});

// log errors to console
function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}
// error handling for xhr request
function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
        console.log("xhr request");
        res.status(400).send({ error: err.message })
    } else {
        next(err)
    }
}

module.exports = app
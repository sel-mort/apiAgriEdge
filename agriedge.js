const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

/*const indexRouter = require('./api/routes/index');*/
const usersRouter = require('./api/routes/users');
const appRouter = require('./api/routes/app');

const app = express();

mongoose.connect("mongodb+srv://oussama:tf3laychf@agriedge.idzlf.mongodb.net/apiagriedge?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Config socket.io
const server = require('http').createServer(app);

server.listen(4000);


// Enable CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use('/', indexRouter);*/
app.use('/api/users', usersRouter);
app.use('/api/app', appRouter);

app.use((req, res, next) => {
  const error = new Error('resource not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  // console.log(error);
  res.status(error.status || 500).send({
    message: error.message
  });
});

module.exports = app;

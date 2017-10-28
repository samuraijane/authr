require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const {router: authRouter, basicStrategy, localStrategy, jwtStrategy} = require('./auth');
// const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
const {router: charactersRouter} = require('./characters');
const {router: usersRouter} = require('./users');

const app = express();

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(passport.initialize());
// passport.use(basicStrategy);
passport.use(localStrategy);
passport.use(jwtStrategy);


app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/src', express.static(__dirname + '/src'));

app.get('/heartbeat', function(req, res) {
  res.json({
    is: 'working'
  })
});

app.use('/characters', charactersRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/protected', passport.authenticate('jwt', {
  session: false}), (req, res) => {
    // res.sendFile(path.join(__dirname+'/src/views/protected.html'));
    // res.json({is: 'working'});
    res.sendFile(__dirname+'/src/views/protected.html');
  }
);

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  let promise = new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
          console.log(`The server is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
  return promise;
}

function closeServer() {
  return mongoose.disconnect()
    .then(() => {
      let promise = new Promise((resolve, reject) => {
        console.log('Closing server...');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        })
      });
      return promise;
    });
}

if (require.main === module) {
  runServer()
    .catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};

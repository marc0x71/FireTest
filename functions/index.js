const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const productApi = require('./routes/product-api');
const { firebaseApp } = require('./firebaseConfig');
const bodyParser = require('body-parser');
const ev = require('express-validation');

function getNations() {
    const ref = firebaseApp.database().ref('nations');
    return ref.once('value').then(snap => {
        return snap.val();
    });
}

function updateLastAction() {
    const timestamp = new Date().getTime();
    const ref = firebaseApp.database().ref('lastAction');
    ref.set(timestamp);
}

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/product', productApi);

app.use(bodyParser.json());

app.use(function (err, req, res, next) {
    // specific for validation errors
    if (err instanceof ev.ValidationError) {
        console.log(err);
        return res.status(err.status).json({ success: false, error: 'validation error'});
    }
    // other type of errors, it *might* also be a Runtime Error
    // example handling
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).send(err.stack);
    } else {
      return res.status(500);
    }
  });
    
app.get('/', (request, response) => {
    updateLastAction();
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getNations().then(nations => {
        response.render('index', { nations });
    })
});
app.get('/nations.json', (request, response) => {
    updateLastAction();
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getNations().then(nations => {
        response.send({ nations });
    })
});
app.get('/timestamp', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});

exports.app = functions.https.onRequest(app);



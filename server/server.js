require('./config/config');

const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();
const bodyParser = require('body-parser');

// parser application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ));

// parse application/json
app.use( bodyParser.json() );

// import user routes
app.use( require('./routes/user'));

// Data base connection
mongoose.connect( process.env.URLDB, ( err, res) => {
    if ( err ) throw err;
    console.log('Data base ONLINE');
});

// Listening the port 
app.listen( process.env.PORT, () => {
    console.log('Listen the port: ', process.env.PORT);
} );


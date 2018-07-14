require('./config/config');

const express = require( 'express' );
const mongoose = require( 'mongoose' );
const path = require( 'path' );

const app = express();

const bodyParser = require('body-parser');

// parser application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ));

// parse application/json
app.use( bodyParser.json() );

// import global configuration of routes
app.use( require('./routes/index'));

// enabling the public folder
app.use( express.static( path.resolve( __dirname, '../public' )));


// Data base connection
mongoose.connect( process.env.URLDB, ( err, res) => {
    if ( err ) throw err;
    console.log('Data base ONLINE');
});

// Listening the port 
app.listen( process.env.PORT, () => {
    console.log('Listen the port: ', process.env.PORT);
} );


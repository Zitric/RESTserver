const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );
const app = express();

app.post( '/login', ( req, res ) => {

    let body = req.body;

    User.findOne({ email: body.email }, ( err, userDB ) => {

        if ( err ) {
            return res.status( 500 ).json({
                ok: false,
                err
            });
        } else if ( !userDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'the user or password are not correct'
                }
            });
        } else if ( !bcrypt.compareSync( body.password, userDB.password )) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'the user or password are not correct'
                }
            });
        }

        let authentication = jwt.sign({
           user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            authentication
        });
    });
});


module.exports = app;
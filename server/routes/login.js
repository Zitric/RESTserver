const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


// Google configurations
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post( '/google', async ( req, res ) => {

    let token = req.body.idtoken;

    let googleUser = await verify( token )
        .catch( err => {
           res.status( 403 ).json({
               ok: false,
               error: err
           })
        });

    User.findOne({ email: googleUser.email}, ( err, userDB ) => {

        if ( err ) {
            return res.status( 500 ).json({
                ok: false,
                err
            });
        }

        if ( userDB ) {
             if ( userDB.google === false ) {
                 return res.status( 400 ).json({
                     ok: false,
                     err: {
                         message: 'Must use normal authentication'
                     }
                 })
             } else {
                 let authentication = jwt.sing({
                     user: userDB
                 }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                 return res.json({
                     ok: true,
                     user: userDB,
                     authentication
                 })
             }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save( ( err, userDB ) => {

                if ( err ) {
                    return res.status( 500 ).json({
                        ok: false,
                        err
                    });
                } else {
                    let authentication = jwt.sing({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                    return res.json({
                        ok: true,
                        user: userDB,
                        authentication
                    })
                }
            });
        }
    });
});




module.exports = app;
const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const User = require( '../models/user' );
const _ = require( 'underscore' );
const { verifyToken, verifyAdminRole } = require( '../middlewares/authentication');

const app = express();



// Get user
app.get( '/user', verifyToken, ( req, res ) => {

   let from = req.query.from || 0;
   from = Number( from );

   let limit = req.query.limit || 5;
   limit = Number( limit );

   User.find({ status: true }, 'name email role status google img')
       .skip(from)
       .limit(limit)
       .exec( ( err, users ) => {

       if ( err ) {
           return res.status( 500 ).json({
               ok: false,
               err
           });
       }

       User.count({ status: true }, ( err, count ) => {
           res.json({
               ok: true,
               users,
               count
           });

       });
   });

});


// Create user
app.post( '/user', [ verifyToken, verifyAdminRole ], function ( req, res ) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    user.save( ( err, userDB ) => {

        if ( err ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });
});


// Update user
app.put( '/user/:id', [ verifyToken, verifyAdminRole ], function ( req, res ) {

    let id = req.params.id;
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate( id, body, { new: true, runValidators: true },
                            ( err, userBD ) => {

        if ( err ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userBD
        });
    });

});


// Delete user
app.delete( '/user/:id', verifyToken, function ( req, res ) {

    let id = req.params.id;
    let changeStatus = { status: false };

    // To remove completly the data of user
    // User.findByIdAndRemove( id, ( err, deletedUser ) => {

    // To change the status to false of user
    User.findByIdAndUpdate( id, changeStatus, { new: true }, ( err, deletedUser ) => {


        if ( err ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        } else if ( !deletedUser ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'user did not find'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        });

    });

});


module.exports = app;
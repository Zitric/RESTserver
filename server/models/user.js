const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let enabledRoles = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a enabled role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [ true, 'The name is required' ]
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'The email is required' ]
    },
    password: {
        type: String,
        required: [ true, 'The password is required' ]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: enabledRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} must be unique'} );

module.exports = mongoose.model( 'user', userSchema );
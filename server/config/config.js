
// =============================
// Port
// =============================
process.env.PORT = process.env.PORT || 3000;


// =============================
// Enviroment
// =============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============================
// Expire date of token
// =============================
// 60 seconds * 60 minutes * 24 hours * 30 days

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;


// =============================
// Seed of authentication
// =============================

process.env.SEED = process.env.SEED || 'This is the seed of development';


// =============================
// Data base
// =============================

let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URL_COFFEE;
}

process.env.URLDB = urlDB;


// =============================
// Google client
// =============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1072945280741-9t198hv4eo6cdq4gm0n9qdf25cnp7d57.apps.googleusercontent.com';





// =============================
// Port
// =============================
process.env.PORT = process.env.PORT || 3000;



// =============================
// Enviroment
// =============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============================
// Data base
// =============================

let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = 'mongodb://coffee-user:abc123@ds235251.mlab.com:35251/coffee';
}

process.env.URLDB = urlDB;

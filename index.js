const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// console.log( process.env );// Lee algunar variables incluidas las del archivo .env como el PORT

// Crear el servidor / aplicación de express
const app = express();

//Conexion Base de datos
dbConnection();

//Directorio publico
app.use( express.static('public') );

// CORS
app.use( cors() );

// Lectura y parseo del body - todo lo que usa use son midleware
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth'));

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en puerto ${ process.env.PORT }` );
});
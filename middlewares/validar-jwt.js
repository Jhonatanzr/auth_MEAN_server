const { response } = require('express'); //Lo importamos para hacer que res sea de tipo response
const jwt = require('jsonwebtoken')

const validarJWT = ( req, res = response, next ) => {
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        });
    }
    try {
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        req.uid = uid;
        req.name = name; //Sirve para enviar estos datos del middleware al req del controller
        //console.log( uid, name );
    } catch (error) {
        //console.log( error );
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        }); 
    }
    next();// Permite que una vex la validacion sea buena continue a devolver una respuesta a la peticion
}

module.exports = {
    validarJWT
}
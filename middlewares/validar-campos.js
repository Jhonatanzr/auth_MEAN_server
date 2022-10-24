const { response } = require('express'); //Lo importamos para hacer que res sea de tipo response
const { validationResult } = require('express-validator');


const validarCampos = ( req, res = response, next ) => {
    const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();// Permite que una vex la validacion sea buena continue a devolver una respuesta a la peticion
}

module.exports = {
    validarCampos
}
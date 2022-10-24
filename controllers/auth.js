const { response } = require('express'); //Lo importamos para hacer que res sea de tipo response
const { validationResult } = require('express-validator');
// y poder acceder a sus atributos
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async( req, res = response ) => {
    
    const { name, email, password } = req.body
    // console.log( req.body );
    // console.log( name, email, password );

    try {
        
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

    //Verificar email (Que no exista el email)
    const usuario = await Usuario.findOne({ email });

    if ( usuario ) {
        return res.status(400).json({ //El 400 es bad request
            ok: false,
            msg: 'El usuario ya existe'
        });
    }

    //Crear usuario con el modelo
    const dbUser = new Usuario( req.body );

    //Hashear la contraseña (Encryptarla)
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( password, salt );

    //Generar el JWT
    const token = await generarJWT( dbUser.id, name );

    //Crear usuario de DB
    await dbUser.save();

    //Generar respuesta exitosa
    return res.status(201).json({// 201 se creo un nuevo registro
        ok: true,
        uid: dbUser.id,
        name,
        token
    });


    // return res.json({
    //     ok: true,
    //     msg: 'Crear usuario /new'
    // });

}

const loginUsuario = async( req, res = response ) => {
    
    const { email, password } = req.body;
    try {
        const dbUser = await Usuario.findOne({ email });
        if (!dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas correo'
            });
        }
        //Validar si el password hace math
        const validarPassword = bcrypt.compareSync( password, dbUser.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas password'
            });
        }
        //Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );
        //Respuesta del servicio
        return res.json({// No se pone Status por que como es exitoso devuelve el 200 por defecto
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Debe hablar con el admin'
        });
    }
}

const renovarToken = async( req, res = response ) => {

    const { uid, name } = req; // Obtengo los datos que envie del middleware

    //Renovar token
    const token = await generarJWT( uid, name );

    return res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}
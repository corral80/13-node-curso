const { request , response} = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req = request, res = response) =>{
    
    const {correo, password} = req.body

    try {
        
        //Validar si existe email
        const usuario = await Usuario.findOne({ correo })

        if( !usuario ){

            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - correo'
            })
        }

        //validar si user está activo
        if( !usuario.estado ){

            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - estado false'
            })
        }
        
        //Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password)
        if( !validPassword ){
            
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - password'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id )


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : 'Error en el login'
        })
    }
}

const googleSingIn = async (req = request, res= response) =>{

    const { id_token } = req.body


    try {
        
        const { nombre, img, correo } = await googleVerify( id_token )
        
        let usuario = await Usuario.findOne({ correo })
        
        if ( !usuario ){
            //Si el usuario no existe, se creará

            const data = {
                nombre,
                correo,
                password:'(:',
                img,
                google : true,
                rol:'USER_ROLE'
            }

            usuario = new Usuario( data )
            await usuario.save()
        }


        if ( !usuario.estado ){
            return res.status(404).json({
                msg : 'Contacte al administrador - usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id )


        res.json({
            usuario,
            token
        })

    } catch (error) {
        
        res.status(400).json({
            ok:false,
            msg: 'El Token no pudo verificar'
        })
    }

}


module.exports = {
    login,
    googleSingIn
}
const { response, request } = require('express')
const bcryptjs = require('bcryptjs')


const Usuario = require('../models/usuario')

const usuariosGet = async(req = request, res = response) =>{

    const {limite=5, desde=0} = req.query
    const query = {estado:true}

    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite))

    //const total = await Usuario.countDocuments(query)

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) =>{


    const { nombre, correo, password, rol} = req.body
    
    const usuario = new Usuario({nombre, correo, password, rol});

    //Verificar si correo existe
    // const existeEmail = await Usuario.findOne({ correo })

    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'El correo ya está registrado'
    //     })    
    // }
    //Encriptar contraseña (hash)
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt)

    //Guardar en BD
    await usuario.save()

    res.json({
        msg: 'post API - Controlador',
        usuario
    })
}

const usuariosPut = async (req = request, res = response) =>{

    const { id } = req.params

    const { _id, password, google, correo, ...resto } = req.body

    //TODO : validar contra BD
    if(password){
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt)
        
    }
    
    const usuario = await Usuario.findByIdAndUpdate( id, resto , {new: true})    
    
    res.json(usuario)
}

const usuariosPatch = (req = request, res = response) =>{

    res.json({
        msg: 'patch API - Controlador'
    })
}

const usuariosDelete = async (req = request, res = response) =>{

    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false}, {new:true})
    //const usuarioAutenticado = req.usuario
    
    res.json(usuario)
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
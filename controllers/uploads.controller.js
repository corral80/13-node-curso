const { request, response } = require("express");
const path = require('node:path')
const fs = require('node:fs')

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) =>{

    //extensiones permitidas Imagenes no se envía nada en la funcion "await subirArchivo (req.files)"
    //Para permitir otras extensiones se envía en los argumentos
    try {
        
        //const nombreArchivo = await subirArchivo( req.files , ['txt','md'], 'textos')
        const nombreArchivo = await subirArchivo( req.files , undefined , 'imgs')
        res.json({
            nombreArchivo
        })
    } catch (error) {
        res.status(400).json({
            msg : error
        })
    }
}


const actualizarImagen = async (req = request, res = response) =>{


    const { id, coleccion } = req.params

    let modelo

    switch ( coleccion ) {
        case 'usuarios':
        
            modelo = await Usuario.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':

            modelo = await Producto.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un producto con el id ${id}`
                })
            }

        break;

        default:
            return res.status(500).json({ msg : 'Coleccion no permitida'})
    }

    //Limpiar imagenes previas
    if( modelo.img ){
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if ( fs.existsSync( pathImagen) ){
            fs.unlinkSync( pathImagen )
        }
    }


    const nombre = await subirArchivo( req.files , undefined, coleccion)
    modelo.img = nombre

    await modelo.save()

    res.json( modelo )

}


const mostrarImagen = async (req = request, res = response)=>{

    const { id, coleccion } = req.params

    let modelo

    switch ( coleccion ) {
        case 'usuarios':
        
            modelo = await Usuario.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':

            modelo = await Producto.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe un producto con el id ${id}`
                })
            }

        break;

        default:
            return res.status(500).json({ msg : 'Coleccion no permitida'})
    }

    //Limpiar imagenes previas
    if( modelo.img ){
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img )
        if ( fs.existsSync( pathImagen) ){
            
            return res.sendFile( pathImagen )

        }
    }

    const pathImagen = path.join( __dirname, '../assets','no-image.jpg' )

    res.sendFile( pathImagen )
    
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}
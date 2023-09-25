const { request, response } = require("express")
const { Categoria, Usuario } = require('../models')


// obtenercategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    //pagina - total
    const {limite=5, desde=0} = req.query
    const query = {estado:true}

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre',Usuario)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })

}

//Obtener categoria po rid
const obtenerCategoria = async (req = request, res = response) => {

    //retornar el objeto de la categoria
    const {id } = req.params
    const categoria = await Categoria.findById(id).populate('usuario','nombre',Usuario)

    res.json(categoria)

}



const crearCategoria = async( req = request, res = response) =>{

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({ nombre })

    if ( categoriaDB ){

        return res.status(404).json({

            msg : `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }
    //Generar data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data )

    //Guardar en BD
    await categoria.save()

    res.status(201).json(categoria)

}


//Actualizar categoria
const actualizarCategoria = async (req = request, res = response) =>{

    const { id } = req.params
    const { estado, usuario , ...data} = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new :true})
    
    res.status(200).json(categoria)

    // console.log( nombre);
    // const usuario = await Categoria.findById(id)

    // if( !usuario ){
    //     return res.status(400).json({
    //         msg : 'Categoria no existe'
    //     })
    // }
    
    // const categoria = await Categoria.findByIdAndUpdate( id, {nombre} , {new: true})    


}

//Borrar categoria
const borrarCategoria = async(req = request, res = response) =>{

    const { id } = req.params
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, {estado:false}, {new:true})

    res.status(200).json(categoriaBorrada)

}






module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria
    
}
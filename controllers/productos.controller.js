const { request, response } = require("express")
const { Producto, Usuario, Categoria } = require('../models')


// obtenercategorias - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    //pagina - total
    const { limite=5, desde=0 } = req.query
    const query = {estado:true}

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre',Usuario)
        .populate('categoria','nombre',Categoria)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })

}

//Obtener categoria po rid
const obtenerProducto = async (req = request, res = response) => {

    //retornar el objeto de la categoria
    const {id } = req.params
    const producto = await Producto.findById(id)
                                    .populate('usuario','nombre',Usuario)
                                    .populate('categoria','nombre',Categoria)

    res.json(producto)

}


const crearProducto = async( req = request, res = response) =>{


    const { estado, usuario, ...body } = req.body

    const productoDB = await Producto.findOne({ nombre:body.nombre })

    if ( productoDB ){

        return res.status(404).json({

            msg : `El producto ${ productoDB.nombre }, ya existe`
        })
    }
    //Generar data a guardar

    const data = {
        ...body,
        nombre : body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data )

    //Guardar en BD
    await producto.save()

    res.status(201).json(producto)

}

//Actualizar categoria
const actualizarProducto = async (req = request, res = response) =>{

    const { id } = req.params
    const { estado, usuario , ...data} = req.body

    if ( data.nombre ){

        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate( id, data, {new :true})
    
    res.status(200).json(producto)

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
const borrarProducto = async(req = request, res = response) =>{

    const { id } = req.params
    const productoBorrado = await Producto.findByIdAndUpdate( id, {estado:false}, {new:true})

    res.status(200).json(productoBorrado)

}






module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
    
}

const { Schema, model } = require('mongoose')

/**
{
    nombre: 'asd',
    correo: 'algo@gmail.com',
    password: 'hash--asdandass',
    img: 'asdadasd',
    rol: 'admin,user,etc',
    estado: boolean (eliminado o no sin borrar),
    google: boolean (si se creó con google o mi server)
}
*/

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'Correo obligatorio'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'Contraseña obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'Rol obligatorio'],
        //enum:['ADMIN_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }
})


UsuarioSchema.methods.toJSON = function(){

    const { __v, _id, password, ...usuario } = this.toObject()
    usuario['uid'] = _id
    return usuario

}


module.exports = model( 'Ususario' , UsuarioSchema)
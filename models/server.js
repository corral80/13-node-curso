
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config.db')

const auth = require('../routes/auth.routes')
const usuario = require('../routes/usuarios.routes')
const categorias = require('../routes/categorias.routes')
const productos = require('../routes/productos.routes')
const buscar = require('../routes/buscar.routes')
const uploads = require('../routes/uploads.routes')




class Server {


    constructor(){

        this.app = express()
        this.port = process.env.PORT || 3000
        
        this.paths = {
            auth :       '/api/auth',
            buscar :       '/api/buscar',
            usuarios:    '/api/usuarios',
            productos:    '/api/productos',
            categorias : '/api/categorias',
            uploads : '/api/uploads',

        }
        
        //Conexión base de datos
        this.conexionDB()
        //Middlewares
        this.middlewares()

        //Rutas de la app
        this.routes()
    }

    async conexionDB(){

        await dbConnection()
    }
    

    middlewares(){

        //CORS
        this.app.use( cors() )
        //Lectura parseo del body
        this.app.use ( express.json() )
        //Carpeta publica
        this.app.use(express.static('public'))

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir: '/tmp/',
            createParentPath : true
        }))

    }

    routes(){

        this.app.use(this.paths.auth,auth)
        this.app.use(this.paths.buscar,buscar)
        this.app.use(this.paths.usuarios,usuario)
        this.app.use(this.paths.productos,productos)
        this.app.use(this.paths.categorias,categorias)
        this.app.use(this.paths.uploads,uploads)

    }

    listen(){

        this.app.listen(this.port,()=>{
            console.log('run en puerto '+this.port)
        })
    }
}




module.exports = Server
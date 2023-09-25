const path = require('node:path')
const { v1: uuidv4 } = require('uuid')


const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) =>{

    return new Promise((resolve, reject)=>{
        
        const { archivo }  = files

        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]

        //Extensiones validas
        if( !extensionesValidas.includes(extension) ){

            return reject(`Extensión ${extension} no válida, solo se permiten ${extensionesValidas}`)
        }
        

        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp )

        archivo.mv(uploadPath, (err) => {

            
            if (err){
                return reject(err)
            }

            //resolve( uploadPath )
            resolve( nombreTemp )
        })
    })

}


module.exports = {
    subirArchivo
}
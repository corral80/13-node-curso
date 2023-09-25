const { request, response } = require("express")


const validarArchivoSubir = (req = request, res = response, next) =>{

    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo){
        return res.status(404).json({
            msg : 'No hay archivos por subir - archivo'
        })
    }

    next()

}




module.exports = {
    validarArchivoSubir
}
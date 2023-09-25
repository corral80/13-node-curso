
const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarArchivoSubir } = require('../middlewares')
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads.controller')
const { coleccionesPermitidas } = require('../helpers')

const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], actualizarImagen)

module.exports = router
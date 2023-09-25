const { Router, request, response } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/')
const { crearCategoria, actualizarCategoria, obtenerCategorias, obtenerCategoria, borrarCategoria } = require('../controllers/categorias.controller')
const { existeCategoriaPorId } = require('../helpers/db-validators')


const router = Router()


/**
 *  {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener 1 categoria por id - publico
router.get('/:id', [
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],
obtenerCategoria)

//Crear categoria - privado - cuaqlquier rol con token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria)

//Actualizar - privado cualquier con token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],
actualizarCategoria)

//Borrar una categoria - Admin|
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],borrarCategoria)


module.exports = router
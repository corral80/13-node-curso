const { Router, request, response } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/')
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller')
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators')


const router = Router()


/**
 *  {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerProductos)

//Obtener 1 categoria por id - publico
router.get('/:id', [
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
obtenerProducto)

//Crear categoria - privado - cuaqlquier rol con token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
] , crearProducto)

//Actualizar - privado cualquier con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria','No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
actualizarProducto )

//Borrar una categoria - Admin|
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos
],borrarProducto)


module.exports = router


// module.exports = require('./categoria')
// module.exports = require('./role')
// module.exports = require('./server')
// module.exports = require('./usuario')

const Role = require('./role')
const Usuario = require('./usuario')
const Categoria = require('./categoria')
const Producto = require('./producto')
const Server = require('./server')

module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
}



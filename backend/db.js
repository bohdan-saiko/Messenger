const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '!strongSQLpasswordq]z/!25022008',
    database: 'messenger'
})

module.exports = pool;
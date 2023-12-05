const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'tcc',
    connectionLimit: 10
})

pool.getConnection().then((conexao) => {
   console.log('Conexão ao BD com sucesso!')
   conexao.release
}).catch((erro) => {
    console.log('Falha ao conectar ao BD...')
    console.log(erro)
})

module.exports = pool
// Autenticação do Token
require('dotenv').config()

const auth = function(req, res, next){

    if(req.headers.token == process.env.TOKEN){
        next()
        return
    }

    res.status(401).send({
        auth: "Não autorizado!"
    })
}

// Servidor Express
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()

app.use(cors({origin: "*"}))
app.use(express.json())
app.use(auth)

const server = http.createServer(app)
server.listen(process.env.PORT, (err) => {
    if(err) throw err
    console.log("Servidor Express Live!! Porta:", process.env.PORT)
})

// Conexão com Banco de Dados
const mysql = require('mysql2')

const con = mysql.createPool({
    host: process.env.DBHOST    ,
    port: process.env.DBPORT    ,
    user: process.env.DBUSER    ,
    password: process.env.DBPASS,
    database: process.env.DBDATA
})

con.getConnection((err, con) => {
    if(err) throw err
    console.log("Banco de Dados conectado com sucesso!")
    con.release()
})
// Mensagens respostas padrão
const msg = {

}

// Exporta os módulos
module.exports = {
    app: app,
    con: con,
    msg: msg
}
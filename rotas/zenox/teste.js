const { app, con, msg } = require('../../server')

app.get('/:tabela/:id_entidade/codigo', async(req, res) => {

    let tabela = req.params.tabela.toUpperCase()

    let [data] = await con.promise().execute(
        `SELECT
            COALESCE(MAX(CD_${tabela}), 0) +1 AS CD_${tabela}
        FROM ${tabela}`,
        [req.params.id_entidade]
    )

    res.send(data)
})

app.post('/:tabela/:id_entidade/insert', async(req, res) => {

    let keys = Object.keys(req.body)

    let key = ''
    let value = ''
    for(let i = 0; i < keys.length; i++){
        key += ', ' + keys[i]
        value += ', ' + req.body[keys[i]]
    }

    let sql = `INSERT INTO ${req.params.tabela} (ID_ENTIDADE${key}) VALUES (${req.params.id_entidade}${value})`

    let [data] = await con.promise().execute()

    res.send({
        sucesso: true,
        mensagem: 'TESTANDO'
    })
})
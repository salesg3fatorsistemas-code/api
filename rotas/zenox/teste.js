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
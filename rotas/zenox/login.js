const { app, con, msg } = require('../../server')

app.get('/sessao/:alias/entidade', async(req, res) => {

    let [data] = await con.promise().execute(
        `SELECT * FROM ENTIDADES WHERE CD_ALIAS = ?`,
        [req.params.alias]
    )

    res.status(200).send(data[0])
})

//app.post('/sessao/:id_entidade/login')
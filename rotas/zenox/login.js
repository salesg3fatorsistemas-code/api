const { app, con, msg } = require('../../server')
const bcrypt = require('bcrypt')

app.get('/sessao/:alias/entidade', async(req, res) => {

    let [data] = await con.promise().execute(
        `SELECT ID_ENTIDADE, NM_ENTIDADE FROM ENTIDADES WHERE CD_ALIAS = ?`,
        [req.params.alias]
    )

    res.status(200).send(data[0])
})

app.post('/sessao/:id_entidade/userlogin', async(req, res) => {

    let { CD_USUARIO, HS_SENHA } = req.body

    let [data] = await con.promise().execute(
        `SELECT * FROM USUARIOS WHERE CD_USUARIO = ? AND ID_ENTIDADE = ?`,
        [CD_USUARIO, req.params.id_entidade]
    )

    if(data.length < 1){
        res.status(200).send({
            sucesso: false,
            message: "Usuário não encontrado!"
        })
        return
    }

    let hash = bcrypt.compare(HS_SENHA, data[0].HS_SENHA, (err, sucesso) => {
        if(err){
            console.log(err)
            res.status(500).send({
                sucesso: false,
                message: "Erro interno!"
            })
            return
        };

        if(sucesso){
            res.status(200).send({
                sucesso: true,
                ID_USUARIO: data[0].ID_USUARIO,
                NM_USUARIO: data[0].NM_USUARIO
            })
            return
        }
        else{
            res.status(200).send({
                sucesso: false,
                message: "Senha incorreta!"
            })
            return
        }
    })
})
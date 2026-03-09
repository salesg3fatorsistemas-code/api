const { app, con, msg } = require('../../server')
const bcrypt = require('bcrypt')

app.get('/sessao/:alias/entidade', async(req, res) => {

    let [data] = await con.promise().execute(
        `SELECT ID_ENTIDADE, NM_ENTIDADE FROM ENTIDADES WHERE CD_ALIAS = ?`,
        [req.params.alias]
    )

    let [anos] = await con.promise().execute(
        `SELECT DISTINCT ID_ANO FROM FECHAMENTO WHERE ID_ENTIDADE = ?`,
        [data[0].ID_ENTIDADE]
    )

    res.status(200).send({
        entidade: data[0],
        anos: anos
    })
})

app.post('/sessao/:id_entidade/userlogin', async(req, res) => {

    let { CD_USUARIO, HS_SENHA, ID_MES, ID_ANO} = req.body

    let [data] = await con.promise().execute(
        `SELECT
            *
        FROM USUARIOS US
            INNER JOIN FECHAMENTO FE ON FE.ID_ENTIDADE = US.ID_ENTIDADE
        WHERE US.CD_USUARIO = ? AND US.ID_ENTIDADE = ?
        AND FE.ID_MES = ? AND FE.ID_ANO = ?`,
        [CD_USUARIO, req.params.id_entidade, ID_MES, ID_ANO]
    )

    if(data.length < 1){
        res.status(200).send({
            sucesso: false,
            message: "Usuário não encontrado!"
        })
        return
    }

    bcrypt.compare(HS_SENHA, data[0].HS_SENHA, (err, sucesso) => {
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
                NM_USUARIO: data[0].NM_USUARIO,
                ID_MES: data[0].ID_MES,
                ID_ANO: data[0].ID_ANO,
                DS_MES: data[0].DS_MES
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
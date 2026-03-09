const { app, con, msg } = require('../../server')

app.post('/:tabela/:id_entidade/grid', async(req, res) => {

    let colunas = req.body.colunas; 
    
    let sqlBusca = colunas.map(coluna => `${coluna.field} LIKE ?`).join(' OR ');

    let sql = `SELECT * FROM ${req.params.tabela} WHERE ID_ENTIDADE = ? AND (${sqlBusca})`;

    let valores = [req.params.id_entidade];
    colunas.forEach(() => valores.push(`%${req.body.termo}%`));

    let [data] = await con.promise().execute(sql, valores);

    res.status(200).send(data);
})

app.get('/:tabela/:id_entidade/codigo', async(req, res) => {

    let tabela = req.params.tabela.toUpperCase()

    let [data] = await con.promise().execute(
        `SELECT
            COALESCE(MAX(CD_${tabela}), 0) +1 AS CD_${tabela}
        FROM ${tabela} WHERE ID_ENTIDADE = ?`,
        [req.params.id_entidade]
    )

    res.send(data)
})



app.post('/:tabela/:id_entidade/insert', async(req, res) => {

    let chaves = Object.keys(req.body);
    let valores = Object.values(req.body);

    let strColunas = chaves.length > 0 ? `, ${chaves.join(', ')}` : '';
    let strInterrogacoes = chaves.length > 0 ? `, ${chaves.map(() => '?').join(', ')}` : '';

    let sql = `INSERT INTO ${req.params.tabela} (ID_ENTIDADE${strColunas}) VALUES (?${strInterrogacoes})`;

    let parametrosDaQuery = [req.params.id_entidade, ...valores];

    try{
        let [data] = await con.promise().execute(sql, parametrosDaQuery);

        res.send({
            sucesso: true,
            mensagem: "Registro Salvo com Sucesso!"
        })

    }
    catch(err){
        console.log(err)
        res.send({
            sucesso: false,
            mensagem: "Erro interno!"
        })
        return
    }
})
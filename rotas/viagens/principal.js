
const { app, con, msg } = require('../../server')

app.post('/viagens/insert', async(req, res) => {

    let {
        id, name, city, startDate, endDate, companions, notes, days
    } = req.body.trips[0]

    let [data] = await con.promise().execute(
        `INSERT INTO VIAGENS VALUES(?, ?, ?, ?, ?, ?)`,
        [id, name, city, startDate, endDate, notes]
    )

    res.status(200).send({
        sucesso: "Parabéns, Zé mané"
    })
})

app.post('/roteiros/insert', async(req, res) => {
    
    let {
        id, days
    } = req.body.trips

    
})

app.get('/viagens/consultar', async(req, res) => {

    let [data] = await con.promise().execute(
        `SELECT * FROM VIAGENS`
    )

    res.send(data)
})
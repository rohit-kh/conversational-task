const express = require('express')
const findTopTenWords = require('./find-top-ten-words')
const dictionaryService = require('./dictionary-service')

const app = express()
const port = process.env.PORT

app.get('/task', async (req, res) => {
    try{
        const url = 'http://norvig.com/big.txt'
        // const url = 'http://25.io/toau/audio/sample.txt'
        const response = await findTopTenWords(url)
        if(!response.status){
            res.status(400).send({error: 'Unable to read file from server'})
        }
        const dictionaryResponse = await dictionaryService(response.data)

        if(!dictionaryResponse.status){
            res.status(400).send({error: 'Unable to get data from dictionary api'})
        }
        res.status(200).send(dictionaryResponse.data)
    }catch (e) {
        res.status(400).send({error: 'Something went wrong'})
    }
})

app.use(express.json())

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})


app.timeout = 1000 * 60 * 5;
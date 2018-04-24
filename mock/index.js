const express = require('express')
const cors = require('cors')
const compression = require('compression')
const app = express()

app.use(cors())
app.use(compression())

app.get('/v2/movie/search', (req, res) => {
  const list = require('./list')
  const { start, count } = req.query

  res.send({ subjects: list.slice(start, +start + +count) })
})

app.get('/v2/movie/subject/:id', (req, res) => {
  const subjects = require('./subject')
  const index = Math.floor(Math.random() * subjects.length)

  res.send(subjects[index])
})

app.listen(8081, () => {
  console.log('Example app listening on port 8081!')
})

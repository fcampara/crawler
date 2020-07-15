const express = require('express')
const CrawerAnimeController = require('./controller/CrawlerAnime')
const app = express()

app.listen(3000)

app.get('/crawler/anime', CrawerAnimeController.index)

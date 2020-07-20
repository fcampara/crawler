const express = require('express')
const CrawerAnimeController = require('./controller/CrawlerAnime')
const CrawlerGithubController = require('./controller/CrawlerGithub')
const app = express()

app.listen(3000)

app.get('/crawler/anime', CrawerAnimeController.index)
app.get('/crawler/github', CrawlerGithubController.index)

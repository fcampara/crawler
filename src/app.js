const express = require('express')
const CrawerAnimeController = require('./controller/CrawlerAnime')
const CrawlerWebWhatsAppController = require('./controller/CrawlerWhatsapp')
const CrawlerTranslateController = require('./controller/CrawlerTranslate')
const app = express()

app.listen(3000)

app.get('/crawler/anime', CrawerAnimeController.index)
app.get('/crawler/whatsapp/elephants', CrawlerWebWhatsAppController.elephants)
app.get('/crawler/google/translate', CrawlerTranslateController.translate)

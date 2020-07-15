const { Parser } = require('json2csv')
const puppeteer = require('puppeteer')
const path = require('path')

class CrawlerAnime {
  async index(req, res) {
    const { name, pathname, start, max, download } = req.query
    const fileName = `${name || 'crawler-urls'}.csv`

    const links = []
    const fullUrl = 'https://animesonline.cc/anime/' + pathname
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: path.join(__dirname, 'ChromeSession')
    })

    const page = await browser.newPage()
    await page.goto(fullUrl, {
      waitUntil: 'networkidle2'
    })

    await page.waitForSelector('.episodios', { visible: true })
    let list = await page.$$eval('.episodiotitle', (elements) =>
      elements.map((e) => e.querySelector('a').href)
    )

    const START_NUMBER = Number(start)
    if (START_NUMBER > 0) {
      const MAX_NUMBER = Number(max)
      list = list.filter((url) => {
        const episodio = url.match(/episodio-(?<episodio>\d+)/).groups.episodio
        return (
          Number(episodio) >= START_NUMBER &&
          Number(episodio) <= START_NUMBER + MAX_NUMBER
        )
      })
    }

    for (let i = 0; i < list.length; i++) {
      try {
        await page.goto(list[i], {
          timeout: 0,
          waitUntil: 'load'
        })
        await page.on('load')

        await page.waitForSelector('.metaframe')
        const src = await page.$eval('iframe', (e) => e.src)
        links.push({ url: list[i], link: src })
      } catch (e) {
        console.log('erro: ', list[i], i)
      }
    }

    browser.close()

    if (download) {
      const json2csv = new Parser({ fields: ['url', 'link'] })
      const csv = json2csv.parse(links)

      res.header('Content-Type', 'text/csv')
      res.attachment(fileName)
      return res.send(csv)
    }

    return res.status(200).json(links)
  }
}

module.exports = new CrawlerAnime()

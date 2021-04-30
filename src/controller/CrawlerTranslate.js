const puppeteer = require('puppeteer')
const path = require('path')

class CrawlerTranslate {
  async translate(req, res) {
    const { word } = req.query

    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: path.join(__dirname, 'ChromeSession')
    })

    const pagePromises = await [
      {
        language: 'es',
        code: 'es-ES',
        URL: `https://translate.google.com/?sl=pt&tl=es&text=${word}&op=translate`
      },
      {
        language: 'de',
        code: 'de-DE',
        URL: `https://translate.google.com/?sl=pt&tl=de&text=${word}&op=translate`
      },
      {
        language: 'pt',
        code: 'pt-BR',
        URL: `https://translate.google.com/?sl=pt&tl=pt&text=${word}&op=translate`
      },
      {
        language: 'pt',
        code: 'pt-PT',
        URL: `https://translate.google.com/?sl=pt&tl=pt&text=${word}&op=translate`
      },
      {
        language: 'en',
        code: 'en-US',
        URL: `https://translate.google.com/?sl=pt&tl=en&text=${word}&op=translate`
      },
      {
        language: 'fr',
        code: 'fr-FR',
        URL: `https://translate.google.com/?sl=pt&tl=fr&text=${word}&op=translate`
      }
    ].map(async ({ URL, language, code }) => {
      const page = await browser.newPage()
      await page.goto(URL, {
        waitUntil: 'networkidle2'
      })
      await page.waitForSelector('[data-phrase-index="0"]')
      const text = await page.$eval(
        '[data-phrase-index="0"]',
        (el) => el.innerText
      )

      await page.close()
      return { text, language, code }
    })

    const pages = await Promise.all(pagePromises)
    await browser.close()
    return res.status(200).json(pages)
  }
}

module.exports = new CrawlerTranslate()

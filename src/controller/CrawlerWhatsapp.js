const puppeteer = require('puppeteer')
const path = require('path')

class CrawlerWhatsApp {
  async elephants(req, res) {
    const { contact, total = 10 } = req.query

    const fullUrl = 'https://web.whatsapp.com/'
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: path.join(__dirname, 'ChromeSession')
    })

    const page = await browser.newPage()
    await page.goto(fullUrl, {
      waitUntil: 'networkidle2'
    })

    await page.waitForSelector('#side', { visible: true })
    await page.click(`span[title="${contact}"]`)

    for (let i = 0; i < total; i++) {
      await (
        await page.waitForSelector('footer .copyable-text.selectable-text')
      ).click()
      const position = i + 1
      await page.keyboard.type(
        `${position} elefante${position > 1 ? 's' : ''} ${`incomoda${
          position > 1 ? 'm' : ''
        } `.repeat(position)}${position > 1 ? 'muito mais' : 'muita gente'}...`
      )
      await page.click('span[data-testid="send"]')
    }

    return res.status(200).json(contact)
  }
}

module.exports = new CrawlerWhatsApp()

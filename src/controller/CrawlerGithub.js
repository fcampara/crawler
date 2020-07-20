const puppeteer = require('puppeteer')
const path = require('path')

class CrawlerReadme {
  async index(req, res) {
    // const pages = new Set()
    // const mdFiles = new Set()
    const fullUrl = 'https://github.com/getify/You-Dont-Know-JS'
    const browser = await puppeteer.launch({
      headless: true,
      userDataDir: path.join(__dirname, 'ChromeSession')
    })

    const page = await browser.newPage()
    await page.goto(fullUrl, {
      waitUntil: 'networkidle0'
    })

    const page1 = await page.pdf({ format: 'A4' })

    await page.goto('https://github.com/fcampara', {
      waitUntil: 'networkidle0'
    })

    const page2 = await page.pdf({ format: 'A4' })
    const total = page1.length + page2.length
    console.log(total)
    const buffer = Buffer.concat([page2, page1], total)

    res.type('application/pdf')
    res.send(buffer)

    return browser.close()

    // await page.waitForSelector('.js-navigation-item')
    // const listUrls = await page.$$eval('.js-navigation-open', (elements) =>
    //   elements.map((element) => element.href)
    // )

    // listUrls.forEach((href) => {
    //   const isMDFile = href.match(/.md$/g)
    //   isMDFile ? mdFiles.add(href) : pages.add(href)
    // })

    // const buffer = await page.pdf({ format: 'A4' })
    // res.type('application/pdf')
    // res.send(buffer)

    // browser.close()

    // return res.status(200).json({
    //   mdFiles: [...mdFiles.values()],
    //   pages: [...pages.values()]
    // })
  }
}

module.exports = new CrawlerReadme()

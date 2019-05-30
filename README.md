# Scraper

Scrap website with a configuration

## Usage 
``` npm i @iryu54/scraper ```


## Crawl page
``` javascript
const Scraper = require('@iryu54/scraper')
const html = await Scraper.fetch('<URL>')
```

## Scrap with a config
``` javascript
// index.js
const config = require('../test.conf')
const Scraper = require('@iryu54/scraper')
const parsedSite = await Scraper.scrapUrl('<URL>', config)
```

``` javascript
// test.conf.js
module.exports = [
  { // find .name-title and insert value in name field. Value is include in innerText of HTMLElement
    "title": "name",
    "value": ".main-title",
    "text": true
  },
  { // find .wrapper img and insert value in img field. Value is include in src attributes
    "title": "img",
    "value": ".wrapper img",
    "attr": "src"
  },
  { // find .count and insert value in nbPerson field. Value is include in value attributes then transform to a number
    "title": "nbPerson",
    "value": ".count input",
    "attr": "value",
    "transform": value => +value
  },
  { // find .list and insert value in preparation field. Value is include in innerText then transform on CheerioStatic is applied 
    "title": "preparation",
    "value": ".list",
    "text": true,
    html: value => {
      return value.toArray()
        .map(($preparation, i) => {
          $preparation = cheerio.load(cheerio.html($preparation))
          $preparation('h3').remove()
          return `<h3>Etape ${i + 1}</h3>\n<p>${$preparation('.recipe-item').text().trim()}</p>`
        }).join('\n')
    }
  },
  { // Execute instructions inside .list HTMLElement and put result in array on ingredients field
    "title": "ingredients",
    "value": ".list",
    "children": [
      {
        "title": "quantity",
        "value": ".recipe-ingredient-qt",
        "text": true
      },
      {
        "title": "name",
        "value": ".ingredient",
        "text": true
      }
    ]
  }
]
```

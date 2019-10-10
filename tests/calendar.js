/**
 *    Scenario:
 *  1. Открыть в браузере страницу Экономического календаря
 *  2. Отфильтровать события календаря по следующим параметрам:
 *    Period - Current month,  Importance - Medium, Currency - CHF - Swiss frank
 *  3. Открыть первое событие в отфильтрованном списке с CHF валютой.
 *  4. Проверить, что приоритет и страна отображаемого события соответствуют выбранным фильтрам.
 *  5. Вывести в лог историю события за последние 12 месяцев в виде таблицы.
 *      | Date        | Actual  | Forecast  | Previous  |
 *      | 31 May 2019 | -0.7&   | 0.3%      | 0.0%      |
 *  6*. Используя lst.to API (https://lst.to/en/api) сократить ссылку открытого события и
 *  созданную короткую ссылку вместе с полученным Response DTO вывести в лог.
 *  После короткую ссылку нужно обязательно удалить через API.
 *  Примечание: Rest Client при работе с API должен использовать Googlebot юзер агента в хедерах.
 *
 */
const fs = require('fs');
const file = 'event.log';

module.exports = {
  after: function (browser) {
    browser.end();
  },

  '#EC_10 set page filters': function (browser) {
    browser.url(browser.launchUrl);
    let curPage = browser.page.calendar();

    curPage
      .waitForElementVisible('@pageTitle', 'Page title loaded')
      .assert.containsText('@pageTitle', curPage.title(), 'Page title: ' + curPage.title());

    curPage.click('@closeCookiesPan');

    curPage
      .setPeriod('Current month')
      .setImportance('Medium')
      .setCurrency('CHF - Swiss frank')
      .api.pause(500)
  },
  '#EC_20 open item page': function (browser) {

    browser.page.calendar().click('@firstItem');

    let curPage = browser.page.event();

    curPage
      .waitForElementVisible('@importance', 'Importance here')
      .waitForElementVisible('@country', 'Country here');

    curPage.assert.containsText('@importance', 'MEDIUM', 'Importance: ok');
    curPage.assert.containsText('@country', 'Switzerland', 'Country: ok');

    curPage
      .waitForElementVisible('@tabHistory', 'History tab here')
      .click('@tabHistory')
      .waitForElementVisible('@historyTable', 'History table here');

    fs.writeFile(file,  '| Date | Actual | Forecast | Previous |\n', function (err) {
      if (err) {
        return console.log(err);
      }
    });

    let line = '';
    for (let i = 1; i < 13; i++) {
      curPage
        .getText(curPage.elements.line1Date.selector.replace('(1)', `(${i})`), function (result) {
          line = `| ${result.value} |`;
        })
        .getText(curPage.elements.line1Act.selector.replace('(1)', `(${i})`), function (result) {
          line += result.value + ' | ';
        })
        .getText(curPage.elements.line1Fore.selector.replace('(1)', `(${i})`), function (result) {
          line += result.value + ' | ';
        })
        .getText(curPage.elements.line1Prev.selector.replace('(1)', `(${i})`), function (result) {
          line += result.value + ' |\n';
        })
        .perform(function () {
          fs.appendFile(file, line, function (err) {
            if (err) {
              return console.log(err);
            }
          });
        });
    }
  },
  '#EC_30 make short link': function (browser) {
    const token = 'e8487465350a377da4cc74ce';
    const agent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

    browser.perform(function (done) {
      browser.url(function (result) {
        const request = require('request');
        const options = {
          timeout: 600000,
          headers: {
            'X-Auth-Token': token,
            'Content-Type': 'application/json',
            'User-Agent': agent
          },
          json: {
            "data": {
              "type": "link",
              "url": result.value
            }
          }
        };
        request.post('https://lst.to/api/v1/link', options, function (error, response, body) {
          if (error) {
            console.log("request.post error: " + error);
            return done();
          }

          browser.assert.equal(response.statusCode, 200, "POST Response status: " + response.statusCode);
          if (response.statusCode !== 200) {
            return done();
          }

          fs.appendFile(file, JSON.stringify(body), function (err) {
            if (err) {
              return console.log(err);
            }
          });

          let sh = body.data.short.replace('https://lst.to/', '');

          const options = {
            timeout: 600000,
            headers: {
              'X-Auth-Token': token,
              'User-Agent': agent
            }
          };

          request.del(`https://lst.to/api/v1/link/${sh}`, options, function (error, response) {
            if (error) {
              console.log("request.delete error: " + error);
              return done();
            }

            browser.assert.equal(response.statusCode, 200, "DELETE Response status: " + response.statusCode);
            done();
          });

        });
      });
    })
  }
};
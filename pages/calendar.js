
pageCommands = {
  fn: function () {
    return this;
  },

  title: function () {
    return "Economic calendar";
  },

  setPeriod: function (p) {
    const el = `//*[@id="economicCalendarFilterDate"]/li/label[text() = "${p}"]`;
    this
      .api.useXpath()
      .waitForElementVisible(el, `Date ${p} filter here`)
      .click(el, function (response) {
        this.assert.ok(typeof response == "object", "Click: We got a response object.");
        this.verify.ok(response.status === 0, "Click: ok");
      })
      .assert.attributeContains(el, 'class', 'checked', 'Period changed to ' +p)
      .useCss();

    return this;
  },

  setImportance: function (imp) {
    this
      .waitForElementVisible('@cbImportance', 'Importance filter here')
      .api.elements('css selector', this.elements.cbImportance.selector, function (result) {
      for (let i = 0; i < result.value.length; i++) {
        this.elementIdText(result.value[i].ELEMENT, function(res){
          if(res.value !== imp){
            this.elementIdClick(result.value[i].ELEMENT);
          }
        });
      }
    });

    return this;
  },

  setCurrency: function (cur) {
    this
      .waitForElementVisible('@cbCurrency', 'Currency filter here')
      .api.elements('css selector', this.elements.cbCurrency.selector, function (result) {
        for (let i = 0; i < result.value.length; i++) {
          this.elementIdText(result.value[i].ELEMENT, function(res){
            if(res.value !== cur){
              this.elementIdClick(result.value[i].ELEMENT);
            }
          });
        }
      });

    return this;
  },

};
module.exports = {
  commands: [pageCommands],
  elements: {
    pageTitle: {selector: '#calendarContentPanel h1.ec__header__title'},

    closeCookiesPan: {selector: '.float-vertical-panel__cross'},
    cbImportance: {selector: '#economicCalendarFilterImportance > li > label'},
    cbCurrency:   {selector: '#economicCalendarFilterCurrency > li > label'},
    firstItem: {selector: '#economicCalendarTable .ec-table__item a'}

  },
};







pageCommands = {
  fn: function () {
    return this;
  },

};
module.exports = {
  commands: [pageCommands],
  elements: {
    importance: {selector: '#eventContentPanel > div.economic-calendar__event > table > tbody > tr:nth-child(1) > td.event-table__importance'},
    country: {selector: '#eventContentPanel > div.economic-calendar__event > div > div > div:nth-child(1) > div > a'},
    tabHistory: {selector: '#calendar-tabs > li.item[data-content="history"]'},
    historyTable: {selector: '#eventHistoryContent'},
    line1Date: {selector: '.event-table-history__item:nth-child(1) .event-table-history__date'},
    line1Act:  {selector: '.event-table-history__item:nth-child(1) .event-table-history__actual'},
    line1Fore: {selector: '.event-table-history__item:nth-child(1) .event-table-history__forecast'},
    line1Prev: {selector: '.event-table-history__item:nth-child(1) .event-table-history__previous'},
  },
};






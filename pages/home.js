const searchCommands = {
  submit() {
    this
      .sendKeys('@searchBar', [this.api.Keys.ENTER]);

    return this; // Return page object for chaining
  }
};

module.exports = {
  url: 'https://www.google.ru/',
  commands: [searchCommands],
  elements: {
    searchBar: {selector: 'input[name=q]'},
    submitButton: {selector: 'input[value="Google Search"]'}
  }
};

const StringsComparator = require('./strings-comparator');

class SearchEngine {
  constructor(stackMaxLength=3) {
    this.stringsComparator = new StringsComparator();
    this.stack = [];
    this.stackMaxLength = stackMaxLength;
  }

  search(sample, list, extractCallback=null) {
    this._checkArgumentType(sample, 'string', 'sample');
    this._checkArgumentType(list, 'object', 'list');

    if (extractCallback !== null) {
      this._checkArgumentType(extractCallback, 'function', 'extractCallback');
    }
    else {
      extractCallback = (item) => {return item;};
    }

    this.stack = [];

    for (let idx in list) {
      let item = list[idx];
      let string = extractCallback(item);
      let pattern = this.stringsComparator.compare(sample, string, true);
      let symbols = pattern.replace(/\*/g, '');

      let stringBundle = {
        sample_string: sample,
        tested_string: string,
        pattern: pattern,
        symbols: symbols.length,
        gaps: pattern.length - symbols.length
      };

      this._pushStringBundle(stringBundle);
    }
    return this.stack;
  }

  setStackMaxLength(stackMaxLength) {
    this._checkArgumentType(stackMaxLength, 'number', 'stackLength');
    this.stackMaxLength = stackMaxLength;
  }

  _pushStringBundle(stringBundle) {
    let stackLength = this.stack.length;

    if (stackLength >= this.stackMaxLength) {
      let lastBundle = this.stack[this.stackMaxLength - 1];
      let result = this._compareBundles(stringBundle, lastBundle);

      if (result) {
        this.stack[this.stackMaxLength - 1] = stringBundle;
      }
      else {
        return;
      }
    }
    else {
      this.stack.push(stringBundle);
    }

    let maxIndex = this.stack.length - 2;

    for (let index = maxIndex; index >= 0; index--) {
      let currentBundle = this.stack[index];
      let previousBundle = this.stack[index + 1];
      let result = this._compareBundles(previousBundle, currentBundle);

      if (result) {
        this.stack[index + 1] = currentBundle;
        this.stack[index] = previousBundle;
      }
      else {
        return;
      }
    }
  }

  _compareBundles(stringBundle, lastBundle) {
    return ((stringBundle.symbols - stringBundle.gaps) > (lastBundle.symbols - lastBundle.gaps));
  }

  _checkArgumentType(argument, type, argumentName) {
    if ((typeof argument !== type) || (argument === null && type !== 'null')) {
      throw new Error(`Argument '${argumentName}' isn't ${type}`);
    }
  }
}

module.exports = SearchEngine;

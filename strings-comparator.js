const RELATION_TYPE_ABSORBING = 2;
const RELATION_TYPE_CROSSING = 1;
const RELATION_TYPE_INDEPENDENCE = 0;

class StringsComparator {
  compare(xString='', yString='', simpleView=false) {
    this._checkArgumentType(xString, 'string', 'xString');
    this._checkArgumentType(yString, 'string', 'yString');
    this._checkArgumentType(simpleView, 'boolean', 'simpleView');

    let allVectors = this._getVectors(yString, xString);
    let orderedVectors = this._orderCompetingVectors(allVectors);
    orderedVectors.sort((a, b) => {return a['y_start'] - b['y_start'];});

    return this._buildTemplate(yString, xString, orderedVectors, simpleView);
  }

  _getVectors(yString, xString) {
    let yLength = yString.length;
    let xLength = xString.length;
    let vectors = {};

    for (let yIndex = 0; yIndex < yLength; yIndex++) {
      let yStringSymbol = yString.charAt(yIndex);

      for (let xIndex = 0; xIndex < xLength; xIndex++) {
        let xStringSymbol = xString.charAt(xIndex);

        if (yStringSymbol !== xStringSymbol) {
          continue;
        }

        let yIndexPrevious = yIndex - 1;
        let xIndexPrevious = xIndex - 1;
        let previousKey = `_${yIndexPrevious}_${xIndexPrevious}`;
        let newKey = `_${yIndex}_${xIndex}`;

        if (previousKey in vectors) {
          let vector = vectors[previousKey];
          delete vectors[previousKey];
          vector['y_end'] = yIndex;
          vector['x_end'] = xIndex;
          vector['length']++;
          vectors[newKey] = vector;
        }
        else {
          vectors[newKey] = {
            'y_start': yIndex,
            'y_end': yIndex,
            'x_start': xIndex,
            'x_end': xIndex,
            'length': 1
          };
        }
      }
    }
    return Object.keys(vectors).map((key) => {
      return vectors[key];
    });
  }

  _orderCompetingVectors(vectors) {
    vectors.sort((a, b) => {return b['length'] - a['length'];});

    let orderedVectors = [];
    let vectorsCount = vectors.length;

    for (let vectorsIndex = 0; vectorsIndex < vectorsCount; vectorsIndex++) {
      let forcedOut = false;
      let orderedVectorsCount = orderedVectors.length;

      for (let orderedVectorsIndex = 0; orderedVectorsIndex < orderedVectorsCount; orderedVectorsIndex++) {
        let relations = this._getRelationsOfVectors(orderedVectors[orderedVectorsIndex], vectors[vectorsIndex]);

        if (relations['type'] === RELATION_TYPE_ABSORBING) {
          forcedOut = true;
        }

        else if (relations['type'] === RELATION_TYPE_CROSSING) {

          if (relations['cut_from_left'] > 0) {
            vectors[vectorsIndex]['y_start'] += relations['cut_from_left'];
            vectors[vectorsIndex]['x_start'] += relations['cut_from_left'];
            vectors[vectorsIndex]['length'] -= relations['cut_from_left'];
          }
          else if (relations['cut_from_right'] > 0) {
            vectors[vectorsIndex]['y_end'] -= relations['cut_from_right'];
            vectors[vectorsIndex]['x_end'] -= relations['cut_from_right'];
            vectors[vectorsIndex]['length'] -= relations['cut_from_right'];
          }

          vectors.sort((a, b) => {return b['length'] - a['length'];});
          vectorsIndex--;
          forcedOut = true;
        }
      }

      if (forcedOut) {
        continue;
      }
      orderedVectors.push(vectors[vectorsIndex]);
    }
    return orderedVectors;
  }

  _getRelationsOfVectors(orderedVector, vector) {
    let yRelations = this._getRelationsOfVectorsByAxis(
      orderedVector['y_start'],
      orderedVector['y_end'],
      vector['y_start'],
      vector['y_end']
    );

    let xRelations = this._getRelationsOfVectorsByAxis(
      orderedVector['x_start'],
      orderedVector['x_end'],
      vector['x_start'],
      vector['x_end']
    );

    return (yRelations['type'] > xRelations['type']) ? yRelations : xRelations;
  }

  _getRelationsOfVectorsByAxis(orderedVectorStart, orderedVectorEnd, vectorStart, vectorEnd) {
    let relations = {
      'type': RELATION_TYPE_INDEPENDENCE,
      'cut_from_left': 0,
      'cut_from_right': 0
    };

    let pointIsInside = (yPoint, xPoint, testPoint) => {
      return (testPoint >= yPoint && testPoint <= xPoint);
    };
    let vectorStartIsInside = pointIsInside(orderedVectorStart, orderedVectorEnd, vectorStart);
    let vectorEndIsInside = pointIsInside(orderedVectorStart, orderedVectorEnd, vectorEnd);

    if (vectorStartIsInside && vectorEndIsInside) {
      relations['type'] = RELATION_TYPE_ABSORBING;
    }
    else if (vectorStartIsInside) {
      relations['type'] = RELATION_TYPE_CROSSING;
      relations['cut_from_left'] = orderedVectorEnd - vectorStart + 1;
    }
    else if (vectorEndIsInside) {
      relations['type'] = RELATION_TYPE_CROSSING;
      relations['cut_from_right'] = vectorEnd - orderedVectorStart + 1;
    }

    return relations;
  }

  _buildTemplate(yString, xString, orderedVectors, simpleView) {
    let result = '';
    let previousVector = null;
    let currentVector = null;
    let maximalValue = orderedVectors.length + 1;

    for (let counter = 1; counter <= maximalValue; counter++) {
      previousVector = currentVector;
      currentVector = (counter < maximalValue) ? orderedVectors[counter - 1] : null;
      let spaceBetweenVectors = this._getSpaceBetweenVectors(
        yString,
        xString,
        previousVector,
        currentVector,
        simpleView
      );
      result += spaceBetweenVectors;

      if (counter < maximalValue) {
        result += yString.substring(currentVector['y_start'], currentVector['y_end'] + 1);
      }
    }
    return result;
  }

  _getSpaceBetweenVectors(yString, xString, previousVector, currentVector, simpleView) {
    let spaceXStart = (previousVector !== null) ? previousVector['x_end'] + 1 : 0;
    let spaceYStart = (previousVector !== null) ? previousVector['y_end'] + 1 : 0;
    let spaceXEnd = (currentVector !== null) ? currentVector['x_start'] : xString.length;
    let spaceYEnd = (currentVector !== null) ? currentVector['y_start'] : yString.length;
    let contentX = xString.substring(spaceXStart, spaceXEnd);
    let contentY = yString.substring(spaceYStart, spaceYEnd);

    if ((!contentX) && (!contentY)) {
      return '';
    }
    return (!simpleView) ? `[${contentX}|${contentY}]` : '*';
  }

  _checkArgumentType(argument, type, argumentName) {
    if ((typeof argument !== type) || (argument === null && type !== 'null')) {
      throw new Error(`Argument '${argumentName}' isn't ${type}`);
    }
  }
}

module.exports = StringsComparator;



/**
 * Converts binary array to decimal number.
 * @param binaryArray Array of 0/1 values to convert.
 * @returns {number} Result is a decimal number.
 */
function binaryArrayToNumber(binaryArray) {
    var num = 0;
    var exponent = binaryArray.length - 1;
    for (var i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i]) {
            num += Math.pow(2, exponent);
        }
        exponent--;
    }
    return num;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Decodes array of numbers 0 or 1 into array of variables.
 * @param binaryArray Array of 0,1 values that represents a chromosome (array of genes).
 * The length of the array must be divisible by numberOfVariables.
 * @param numberOfVariables The number of variables encoded in binary array.
 * @param ranges An array of two element arrays containing ranges of values,
 * first element in each array is starting value, second element is ending value.
 * @returns {number[]} Returns array of floating point numbers encoded in {@param binaryArray}.
 */
function decodeBinaryChromosome(binaryArray, numberOfVariables, ranges) {
    if (binaryArray.length % numberOfVariables > 0) {
        throw new Error('Invalid number of variables or binary array length. ' +
            'The length of the array must be divisible by number of variables.');
    }
    var result = [];
    var variableSize = binaryArray.length / numberOfVariables;
    for (var i = 0; i < numberOfVariables; i++) {
        var binArray = binaryArray.slice(i * variableSize, i * variableSize + variableSize);
        var decimalValue = binaryArrayToNumber(binArray);
        var value = ranges[i][0] + decimalValue * (ranges[i][1] - ranges[i][0]) / (Math.pow(2, variableSize) - 1);
        result.push(value);
    }
    return result;
}

/**
 * Encodes given variables into binary array of given ranges, with fixed number of bits for each of variables.
 * @param values Floating point values to be encoded.
 * @param variableSize Size of the single variable in bits.
 * @param ranges An array of two element arrays containing ranges of values,
 * first element in each array is starting value, second element is ending value.
 * @returns {number[]} An array of 0,1 values representing a chromosome.
 */
function encodeBinaryChromosome(values, variableSize, ranges) {
    var finalBinaryString = '';
    for (var i = 0; i < values.length; i++) {
        var range = ranges[i];
        var decValue = Math.round((Math.pow(2, variableSize) - 1) * (values[i] - range[0]) / (range[1] - range[0]));
        var binaryString = decValue.toString(2);
        var missingNumberOfZeroes = variableSize - binaryString.length;
        finalBinaryString += Array(missingNumberOfZeroes + 1).join('0') + binaryString;
    }
    return Array.from(finalBinaryString.split(''), Number);
}
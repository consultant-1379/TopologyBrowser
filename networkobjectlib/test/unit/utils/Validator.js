define([
    'networkobjectlib/utils/Validator',
], function(Validator) {
    'use strict';

    describe('utils/Validator', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('validate()', function() {
            var constraints;

            beforeEach(function() {
                constraints = {
                    isNullable: false,
                    valueRangeConstraints: [
                        {
                            minValue: 0,
                            maxValue: 5
                        }
                    ]
                };
                sandbox.spy(Validator, 'validate');
            });

            it('Should throw error "Not a number" for: null', function() {
                constraints.checkInteger = true;
                try {
                    Validator.validate(null,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Not a number');
                }
                expect(Validator.validate.threw()).to.equal(true);

            });

            it('Should not throw error "Input cannot be null" for: abc', function() {
                Validator.validate('abc',constraints);

                expect(Validator.validate.threw()).to.equal(false);
            });

            it('Should throw error "Not a number" for: "abc"', function() {
                constraints.checkInteger = true;
                try {
                    Validator.validate('abc',constraints);
                } catch (e) {
                    expect(e.message).to.equal('Not a number');
                }
                expect(Validator.validate.threw()).to.equal(true);

            });

            it('Should not throw error "Not a number" for: 123', function() {
                constraints.checkInteger = true;
                try {
                    Validator.validate(123,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Not a number');
                }
                expect(Validator.validate.threw()).to.equal(false);

            });

            it('Should throw error "Number is out of range" for: 123', function() {
                constraints.checkInteger = true;
                constraints.checkNumberRange = true;

                try {
                    Validator.validate(123,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Number is out of range');
                }
                expect(Validator.validate.threw()).to.equal(true);
            });

            it('Should not throw error "Number is out of range" for: 1', function() {
                constraints.checkInteger = true;
                constraints.checkNumberRange = true;

                try {
                    Validator.validate(1,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Number is out of range');
                }
                expect(Validator.validate.threw()).to.equal(false);
            });

            it('Should throw error "Invalid string length" for: "qwerty"', function() {
                constraints.checkRange = true;
                try {
                    Validator.validate('qwerty',constraints);
                } catch (e) {
                    expect(e.message).to.equal('Invalid string length');
                }
                expect(Validator.validate.threw()).to.equal(true);
            });

            it('Should not throw error "String is invalid range" for: qwer', function() {
                constraints.checkRange = true;
                try {
                    Validator.validate('qwer',constraints);
                } catch (e) {
                    expect(e.message).to.equal('String is invalid range');
                }
                expect(Validator.validate.threw()).to.equal(false);
            });

            it('Should throw error "Input does not match regular exp" for: 123', function() {
                constraints.checkRegex = true;
                constraints.validContentRegex = '^[0-9]$';
                try {
                    Validator.validate(123,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Input does not match regular exp');
                }
                expect(Validator.validate.threw()).to.equal(true);
            });

            it('Should not throw error "Input does not match regular exp" for: 5', function() {
                constraints.checkRegex = true;
                constraints.validContentRegex = '^[0-9]$';
                try {
                    Validator.validate(5,constraints);
                } catch (e) {
                    expect(e.message).to.equal('Input does not match regular exp');
                }
                expect(Validator.validate.threw()).to.equal(false);
            });

            it('Should throw error "Input cannot be null" for: <null>', function() {
                try {
                    Validator.validate('<null>',constraints);
                } catch (e) {
                    expect(e.message).to.equal('Input cannot be null');
                }
                expect(Validator.validate.threw()).to.equal(true);
            });
        });

        describe('isNull()', function() {
            var constraintsToValidate = {};

            beforeEach(function() {
                sandbox.spy(Validator, 'isNull');
            });

            it('Should return true for: null', function() {
                var response = Validator.isNull(null, constraintsToValidate);

                expect(response).to.equal(true);
            });

            it('Should return true for: undefined', function() {
                var response = Validator.isNull(undefined, constraintsToValidate);

                expect(response).to.equal(true);
            });

            it('Should return false for: abc', function() {
                var response = Validator.isNull('abc', constraintsToValidate);

                expect(response).to.equal(false);
            });

            it('Should return false for: 123', function() {
                var response = Validator.isNull(123, constraintsToValidate);

                expect(response).to.equal(false);
            });

            it('Should return false for: {} (object)', function() {
                var response = Validator.isNull({}, constraintsToValidate);

                expect(response).to.equal(false);
            });

            it('Should return false for: [] (array)', function() {
                var response = Validator.isNull([], constraintsToValidate);

                expect(response).to.equal(false);
            });
        });

        describe('isValidEnum()', function() {
            var possibleValues = [
                { value: 'abc' },
                { value: 123 },
                { value: 0 }
            ];

            beforeEach(function() {
                sandbox.spy(Validator, 'isValidEnum');
            });

            it('Should return false for: null', function() {
                var response = Validator.isValidEnum(null, possibleValues);

                expect(response).to.equal(false);
            });

            it('Should return false for: undefined', function() {
                var response = Validator.isValidEnum(undefined, possibleValues);

                expect(response).to.equal(false);
            });

            it('Should return false for: "" (empty string)', function() {
                var response = Validator.isValidEnum('', possibleValues);

                expect(response).to.equal(false);
            });

            it('Should return true for: abc', function() {
                var response = Validator.isValidEnum('abc', possibleValues);

                expect(response).to.equal(true);
            });

            it('Should return true for: 123', function() {
                var response = Validator.isValidEnum(123, possibleValues);

                expect(response).to.equal(true);
            });

            it('Should return true for: 0', function() {
                var response = Validator.isValidEnum(0, possibleValues);

                expect(response).to.equal(true);
            });

            it('Should return false for: "0"', function() {
                var response = Validator.isValidEnum('0', possibleValues);

                expect(response).to.equal(false);
            });

            it('Should return false for: {} (object)', function() {
                var response = Validator.isValidEnum({}, possibleValues);

                expect(response).to.equal(false);
            });

            it('Should return false for: [] (array)', function() {
                var response = Validator.isValidEnum([], possibleValues);

                expect(response).to.equal(false);
            });
        });

        describe('isNumber()', function() {
            beforeEach(function() {
                sandbox.spy(Validator, 'isNumber');
            });
            it('Should return true for: 7', function() {
                var response = Validator.isNumber('7');

                expect(response).to.equal(true);
            });

            it('Should return false for: 7.5', function() {
                var response = Validator.isNumber('7.5');

                expect(response).to.equal(true);
            });

            it('Should throw error with message Not a number for: abc', function() {
                try {
                    Validator.isNumber('abc');
                } catch (e) {
                    expect(e.message).to.equal('Not a number');
                }

            });

            it('Should throw error with message Not a number for: null', function() {
                try {
                    Validator.isNumber(null);
                } catch (e) {
                    expect(e.message).to.equal('Not a number');
                }

            });
        });

        describe('isValidRange()', function() {
            var range;

            beforeEach(function() {
                range  = [
                    {
                        minValue: 0,
                        maxValue: 255
                    },
                    {
                        minValue: 300,
                        maxValue: 400
                    }
                ];

                sandbox.spy(Validator, 'isValidRange');
            });

            it('Should return false for: null', function() {
                var response = Validator.isValidRange(null, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: undefined', function() {
                var response = Validator.isValidRange(undefined, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: "" (empty string)', function() {
                var response = Validator.isValidRange('', range);

                expect(response).to.equal(false);
            });

            it('Should return false for: abc', function() {
                var response = Validator.isValidRange('abc', range);

                expect(response).to.equal(false);
            });

            it('Should return true for: 123', function() {
                var response = Validator.isValidRange(123, range);

                expect(response).to.equal(true);
            });

            it('Should return true for: 350', function() {
                var response = Validator.isValidRange(350, range);

                expect(response).to.equal(true);
            });

            it('Should return false for: -1', function() {
                var response = Validator.isValidRange(-1, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: 260', function() {
                var response = Validator.isValidRange(260, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: 500', function() {
                var response = Validator.isValidRange(500, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: {} (object)', function() {
                var response = Validator.isValidRange({}, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: [] (array)', function() {
                var response = Validator.isValidRange([], range);

                expect(response).to.equal(false);
            });

            it('Should return true for: 1.1', function() {
                range  = [
                    {
                        minValue: 0.9,
                        maxValue: 10,
                        isFraction: true
                    }
                ];

                var response = Validator.isValidRange(1.1, range);

                expect(response).to.equal(true);
            });

            it('Should return false for: 0', function() {
                range  = [
                    {
                        minValue: 0.9,
                        maxValue: 10,
                        isFraction: true
                    }
                ];

                var response = Validator.isValidRange(0, range);

                expect(response).to.equal(false);
            });

            it('Should return false for: 0.8', function() {
                range  = [
                    {
                        minValue: 0.9,
                        maxValue: 10,
                        isFraction: true
                    }
                ];

                var response = Validator.isValidRange(0.8, range);

                expect(response).to.equal(false);
            });
        });

        describe('isValidRegex()', function() {
            var regex = [
                '^(yes|no)$',
                '^[0-9]$'
            ];

            beforeEach(function() {
                sandbox.spy(Validator, 'isValidRegex');
            });

            it('Should return false for: null', function() {
                var response = Validator.isValidRegex(null, regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: undefined', function() {
                var response = Validator.isValidRegex(undefined, regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: "" (empty string)', function() {
                var response = Validator.isValidRegex('', regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: abc', function() {
                var response = Validator.isValidRegex('abc', regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: 123', function() {
                var response = Validator.isValidRegex(123, regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: {} (object)', function() {
                var response = Validator.isValidRegex({}, regex);

                expect(response).to.equal(false);
            });

            it('Should return false for: [] (array)', function() {
                var response = Validator.isValidRegex([], regex);

                expect(response).to.equal(false);
            });

            it('Should return true for: 0', function() {
                var response = Validator.isValidRegex(0, regex);

                expect(response).to.equal(true);
            });

            it('Should return true for: yes', function() {
                var response = Validator.isValidRegex('yes', regex);

                expect(response).to.equal(true);
            });
        });

        describe('isValidResolution()', function() {

            function testToString(array) {
                return array.reduce(function(acc, curr, index, arr) {
                    return acc + '{minValue: ' + curr.minValue + ', maxValue: ' + curr.maxValue +'}' + (arr.length - 1 !== index ? ', ': '');
                }, '[') + ']';
            }

            beforeEach(function() {
                sandbox.spy(Validator, 'isValidResolution');
            });

            [
                //Check for null/undefined ranges
                {resolution: '2', ranges: null, value: 10, expectedValue: true},
                {resolution: '2', ranges: undefined, value: 10, expectedValue: true}

            ].forEach(function(test) {
                it('Should return ' + test.expectedValue + ' for resolution: ' + test.resolution + ', ranges: ' +
                    test.ranges  + ', value: ' + test.value, function() {

                    //Action
                    var response = Validator.isValidResolution(test.value, test.resolution, test.ranges);

                    //Assert
                    expect(response).to.equal(test.expectedValue);
                });
            });

            [
                //empty range check
                {resolution: '2', ranges: [], value: 10, expectedValue: true},
                {resolution: '2', ranges: [], value: 9, expectedValue: false},
                {resolution: '1', ranges: [], value: 5, expectedValue: true},
                {resolution: '30', ranges: [], value: 90, expectedValue: true},
                {resolution: '31', ranges: [], value: 90, expectedValue: false},

                //null range check
                {resolution: '1', ranges: [{minValue: 0, maxValue: null}], value: 1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: null, maxValue: 5}], value: -1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: 0, maxValue: undefined}], value: 1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: undefined, maxValue: 5}], value: -1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: 0, maxValue: ''}], value: 1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: '', maxValue: 5}], value: -1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: null, maxValue: null}], value: 1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: '', maxValue: ''}], value: -1, expectedValue: true},
                {resolution: '1', ranges: [{minValue: undefined, maxValue: undefined}], value: 1, expectedValue: true},
                {resolution: '2', ranges: [{minValue: undefined, maxValue: undefined}], value: 2, expectedValue: true},
                {resolution: '2', ranges: [{minValue: undefined, maxValue: undefined}], value: 1, expectedValue: false},
                {resolution: '2', ranges: [{minValue: null, maxValue: null}], value: 1, expectedValue: false},
                {resolution: '2', ranges: [{minValue: null, maxValue: null}], value: 1, expectedValue: false},

                //odd test
                {resolution: '2', ranges: [{minValue: -119, maxValue: -25}], value: -119, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -119, maxValue: -25}], value: -25, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -119, maxValue: -25}], value: -99, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -119, maxValue: -25}], value: -108, expectedValue: false},

                //even test
                {resolution: '2', ranges: [{minValue: -140, maxValue: -44}], value: -140, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -140, maxValue: -44}], value: -44, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -140, maxValue: -44}], value: -94, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -140, maxValue: -44}], value: -45, expectedValue: false},

                //multiple ranges
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 55}], value: 47, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 55}], value: 45, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 55}], value: 55, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 55}], value: 30, expectedValue: false},

                //same value range
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 45}], value: 45, expectedValue: true},
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 45}], value: 46, expectedValue: false},
                {resolution: '2', ranges: [{minValue: -45, maxValue: 25}, {minValue: 45, maxValue: 45}], value: 44, expectedValue: false},

                //multiple resolution
                {resolution: '1', ranges: [{minValue: -45, maxValue: 25}], value: 9, expectedValue: true},
                {resolution: '3', ranges: [{minValue: -45, maxValue: 27}, {minValue: 45, maxValue: 57}], value: 50, expectedValue: false},
                {resolution: '3', ranges: [{minValue: -45, maxValue: 27}, {minValue: 45, maxValue: 57}], value: 51, expectedValue: true},

            ].forEach(function(test) {
                it('Should return ' + test.expectedValue + ' for resolution: ' + test.resolution + ', ranges: ' +
                    testToString(test.ranges) + ', value: ' + test.value, function() {

                    //Action
                    var response = Validator.isValidResolution(test.value, test.resolution, test.ranges);

                    //Assert
                    expect(response).to.equal(test.expectedValue);
                });
            });
        });

        describe('listOfNonUniqueValues()', function() {
            var arrayWithNothingRepeated = [
                'one',
                'two'
            ];

            var arrayWithOneRepeated = [
                'one',
                'two',
                'one'
            ];

            var arrayWithTwoRepeated= [
                'one',
                'one',
                'two',
                'three',
                'three',
            ];

            beforeEach(function() {
                sandbox.spy(Validator, 'listOfNonUniqueValues');
            });

            it('Should return empty list', function() {
                var response = Validator.listOfNonUniqueValues(arrayWithNothingRepeated);
                expect(response.toString()).to.equal('');
            });

            it('Should return 1 item', function() {
                var response = Validator.listOfNonUniqueValues(arrayWithOneRepeated);
                expect(response.toString()).to.equal('one');
            });

            it('Should return 2 items', function() {
                var response = Validator.listOfNonUniqueValues(arrayWithTwoRepeated);
                expect(response.toString()).to.equal('one,three');
            });

        });

        describe('validateSequence()', function() {
            var constraints = {
                valueRangeConstraints: [{minValue: 3, maxValue: 7}]
            };

            var sequenceWithTooManyMembers = [
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight'
            ];

            var sequenceWithTooFewMembers = [
                'one',
                'two'
            ];

            var sequenceWithValidMembers = [
                'one',
                'two',
                'three',
                'four',
                'five'
            ];

            beforeEach(function() {
                sandbox.spy(Validator, 'validateSequence');
            });

            it('Should validate sequence with too many members', function() {
                var errorMessage = 'There are too many entries in the sequence';
                try {
                    Validator.validateSequence(sequenceWithTooManyMembers,constraints);
                } catch (e) {
                    expect(e.message).to.equal(errorMessage);
                }
                expect(Validator.validateSequence.threw()).to.equal(true);

            });

            it('Should validate sequence with too few members', function() {
                var errorMessage = 'There are too few entries in the sequence';
                try {
                    Validator.validateSequence(sequenceWithTooFewMembers,constraints);
                } catch (e) {
                    expect(e.message).to.equal(errorMessage);
                }
                expect(Validator.validateSequence.threw()).to.equal(true);
            });

            it('Should validate sequence', function() {
                Validator.validateSequence(sequenceWithValidMembers,constraints);
                expect(Validator.validateSequence.threw()).to.equal(false);
            });
        });

        describe('validateEnums()', function() {
            var modifiedValue = 'AUTO';
            var modifiedValueInvalid = 'BEGIN';
            var enumAttribute = [{key: 'OFF'},{key: 'MANUAL'},{key: 'AUTO'}];

            beforeEach(function() {
                sandbox.spy(Validator, 'validateEnums');
            });

            it('Should validate enum with incorrectMember', function() {
                var isValid = Validator.validateEnums(enumAttribute, modifiedValueInvalid);
                expect(isValid).to.equal(false);
            });

            it('Should validate enum', function() {
                var isValid = Validator.validateEnums(enumAttribute, modifiedValue);
                expect(isValid).to.equal(true);
            });
        });

        describe('isValidDecimalNumber()', function() {
            var modifiedValue = 3.4;
            var typeFLOAT = 'FLOAT', typeINTEGER = 'INTEGER', typeDOUBLE = 'DOUBLE', typeBYTE = 'BYTE';
            var errorMessage = 'Not a valid number';

            beforeEach(function() {
                sandbox.spy(Validator, 'isValidDecimalNumber');
            });

            it('Should validate INTEGER', function() {
                try {
                    Validator.isValidDecimalNumber(typeINTEGER, modifiedValue);
                } catch (e) {
                    expect(e.message).to.equal(errorMessage);
                }
            });

            it('Should validate DOUBLE', function() {
                Validator.isValidDecimalNumber(typeDOUBLE, modifiedValue);
                expect(Validator.isValidDecimalNumber.threw()).to.equal(false);
            });

            it('Should validate FLOAT', function() {
                Validator.isValidDecimalNumber(typeFLOAT, modifiedValue);
                expect(Validator.isValidDecimalNumber.threw()).to.equal(false);
            });

            it('Should validate BYTE', function() {
                try {
                    Validator.isValidDecimalNumber(typeBYTE, modifiedValue);
                } catch (e) {
                    expect(e.message).to.equal(errorMessage);
                }
            });
        });
    });
});

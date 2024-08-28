define([
    'networkobjectlib/widgets/FormWidgets/YANG/YANGUnionWidget/YANGUnionWidget',
    'networkobjectlib/widgets/FormWidgets/StringInputFormWidget/StringInputFormWidget',
    'networkobjectlib/widgets/FormWidgets/NumberInputFormWidget/NumberInputFormWidget',
    'networkobjectlib/widgets/FormWidgets/EnumComboBoxWidget/EnumComboBoxWidget',
    'networkobjectlib/widgets/FormWidgets/EnumDropdownWidget/EnumDropdownWidget',
    'networkobjectlib/widgets/FormWidgets/BitsComboMultiSelectWidget/BitsComboMultiSelectWidget',
    'test/resources/mockJSON/YANG/Union/ENUM_BOOL',
    'test/resources/mockJSON/YANG/Union/ENUM_ENUM_INTEGER',
    'test/resources/mockJSON/YANG/Union/ENUM_SHORT',
    'test/resources/mockJSON/YANG/Union/ENUM_STRING',
    'test/resources/mockJSON/YANG/Union/ENUM_STRING_LIST_MEMBERS',
    'test/resources/mockJSON/YANG/Union/SHORT_LONG_DOUBLE',
    'test/resources/mockJSON/YANG/Union/STRING_LONG',
    'test/resources/mockJSON/YANG/Union/STRING_STRING',
    'test/resources/mockJSON/YANG/Union/STRING_BITS',
    'test/resources/mockJSON/YANG/Union/STRING_IP_ADDRESS'
], function(Union, StringInput, NumberInput, Combobox, Dropdown, BitsComboMultiSelect, MockedENUM_BOOL, MockedENUM_ENUM_INTEGER,
            MockedENUM_SHORT, MockedENUM_STRING, MockedENUM_STRING_LIST_MEMBERS,
            MockedSHORT_LONG_DOUBLE, MockedSTRING_LONG, MockedSTRING_STRING, STRING_BITS, MockedSTRING_IP_ADDRESS) {
    'use strict';

    describe('widgets/FormWidgets/YANG/YANGUnionWidget', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('constructor()', function() {

            beforeEach(function() {
                sandbox.spy(Union);
            });

            it('Should return Combobox for: [ENUM, BOOL]', function() {
                var widget = new Union(MockedENUM_BOOL);

                expect(widget).to.be.instanceof(Dropdown);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.enumeration.enumMembers.length).to.equal(7);
                expect(widget.options.enumeration.enumMembers[2]).to.deep.equal({separator: true});
            });

            it('Should return StringInput for: [ENUM, ENUM, INTEGER]', function() {
                var widget = new Union(MockedENUM_ENUM_INTEGER);

                expect(widget).to.be.instanceof(Combobox);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.constraints.numberValueRangeConstraints).to.deep.equal([{
                    isFraction: false,
                    isNumeric: true,
                    minValue: 1,
                    maxValue: 65535
                }]);
                expect(widget.options.enumeration.enumMembers.length).to.equal(3);
                expect(widget.options.enumeration.enumMembers[1]).to.deep.equal({separator: true});
            });

            it('Should return Combobox for: [ENUM, SHORT]', function() {
                var widget = new Union(MockedENUM_SHORT);

                expect(widget).to.be.instanceof(Combobox);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.constraints.numberValueRangeConstraints).to.deep.equal([{
                    isFraction: false,
                    isNumeric: true,
                    minValue: 0,
                    maxValue: 255
                }]);
            });

            it('Should return Combobox for: [ENUM, STRING]', function() {
                var widgets = [new Union(MockedENUM_STRING), new Union(MockedENUM_STRING_LIST_MEMBERS)];

                widgets.forEach(function(widget) {
                    expect(widget).to.be.instanceof(Combobox);
                    expect(widget.options.constraints.nullable).to.equal(true);
                    expect(widget.options.constraints.validContentRegex).to.equal('(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\p{N}\p{L}]+)?');
                });
            });

            it('Should return Combobox for: [SHORT, LONG, DOUBLE]', function() {
                var widget = new Union(MockedSHORT_LONG_DOUBLE);

                expect(widget).to.be.instanceof(NumberInput);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.constraints.valueRangeConstraints).to.deep.equal([
                    {
                        minValue: 0,
                        maxValue: 1
                    },
                    {
                        minValue: 2,
                        maxValue: 100
                    },
                    {
                        minValue: 100.1,
                        maxValue: 1000
                    }
                ]);
            });

            it('Should return NumberInput for: [STRING, LONG]', function() {
                var widget = new Union(MockedSTRING_LONG);

                expect(widget).to.be.instanceof(StringInput);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.constraints.numberValueRangeConstraints).to.deep.equal([{
                    isFraction: false,
                    isNumeric: true,
                    minValue: 1,
                    maxValue: 4294967295
                }]);
                expect(widget.options.constraints.validContentRegex).to.equal('(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\\p{N}\\p{L}]+)?');
            });

            it('Should return NumberInput for: [STRING, STRING]', function() {
                var widget = new Union(MockedSTRING_STRING);

                expect(widget).to.be.instanceof(StringInput);
                expect(widget.options.constraints.nullable).to.equal(true);
                expect(widget.options.constraints.validContentRegex).to.deep.equal([
                    '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/(([0-9])|([1-2][0-9])|(3[0-2]))',
                    '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\s+(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])',
                ]);
            });

            it('Should return ComboMultiSelect for: [STRING, BITS]', function() {
                var widget = new Union(STRING_BITS);
                expect(widget).to.be.instanceof(BitsComboMultiSelect);
            });

            it('should return StringInput for: [STRING, IP_ADDRESS]', function() {
                var widget = new Union(MockedSTRING_IP_ADDRESS);
                expect(widget).to.be.instanceof(StringInput);
            });
        });
    });
});

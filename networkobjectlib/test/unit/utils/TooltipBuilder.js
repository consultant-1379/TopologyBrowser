define([
    'networkobjectlib/utils/TooltipBuilder',
], function(TooltipBuilder) {
    'use strict';

    describe('TooltipBuilder', function() {
        var sandbox;

        before(function() {
            sandbox = sinon.sandbox.create();
            sandbox.spy(TooltipBuilder, 'build');
        });

        after(function() {
            sandbox.restore();
        });


        describe('build()', function() {

            // type
            it('Should return "Type: MO_REF" for: Type: MO_REF', function() {
                var options = { type: 'MO_REF' };

                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: MO_REF');
            });

            // default value
            it('Should return "defaultValue: 1" for: defaultValue: 1', function() {
                var options = {
                    type: 'MO_REF',
                    defaultValue: '1'
                };

                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: MO_REF, Default: 1');
            });

            // range
            it('Should return "Range: 0 .. 4294967295" for: type: LONG', function() {
                var options = {
                    type: 'LONG',
                    constraints: {
                        valueRangeConstraints: [
                            {
                                maxValue: 4294967295,
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: LONG, Range: 0 .. 4294967295');
            });

            // length
            it('Should return "Length: 0 .. 10" for type: STRING', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        valueRangeConstraints: [
                            {
                                maxValue: 10,
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: 0 .. 10');
            });

            // nullable
            it('Should return "Can be null: true" for: nullable: true', function() {
                var options = {
                    type: 'LONG',
                    constraints:
                    {
                        nullable: 'true'
                    }
                };

                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: LONG, Can be null: true');
            });

            // greater than one constraint
            it('Should return a comma after a value when there is more than one constraint', function() {
                var options = {
                    type: 'LONG',
                    constraints: {
                        nullable: true,
                        valueRangeConstraints: [
                            {
                                maxValue: 4294967295,
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: LONG, Range: 0 .. 4294967295, Can be null: true');
            });

            // Type, Length, and Null
            it('Should return "Type", "Length", and "Can be Null"', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        nullable: true,
                        defaultValue: '1',
                        valueRangeConstraints: [
                            {
                                maxValue: 10,
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: 0 .. 10, Can be null: true');
            });

            // Min constraint
            it('Should return "Min:0" for a single minValue constraint', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        defaultValue: '1',
                        valueRangeConstraints: [
                            {
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: Min: 0');
            });

            // Max constraint
            it('Should return "Max:10" for a single maxValue constraint', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        defaultValue: '1',
                        valueRangeConstraints: [
                            {
                                maxValue: 10
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: Max: 10');
            });

            // Equal Min and Max
            it('Should return "Length: 0" for equal Min and Max constraints', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        defaultValue: '1',
                        valueRangeConstraints: [
                            {
                                maxValue: 0,
                                minValue: 0
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: 0');
            });

            // Equal Min and Max in differing objects
            it('Should return "Length: 0/10" for two different object ranges', function() {
                var options = {
                    type: 'STRING',
                    constraints: {
                        defaultValue: '1',
                        valueRangeConstraints: [
                            {
                                maxValue: 0,
                                minValue: 0
                            },
                            {
                                maxValue: 10,
                                minValue: 10
                            }
                        ]
                    }
                };
                var response = TooltipBuilder.build(options);
                expect(response).to.equal('Type: STRING, Length: 0/10');
            });

            //Union
            describe('buildUnion()', function() {

                it('Should return "Type: UNION" for: Type: UNION', function() {
                    var options = {
                        type: 'UNION',
                        memberTypes: [
                            {
                                type: 'STRING',
                                constraints: {
                                    valueRangeConstraints: [
                                        {
                                            maxValue: 10,
                                            minValue: 0
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'LONG',
                                constraints: {
                                    nullable: true,
                                    valueRangeConstraints: [
                                        {
                                            maxValue: 4294967295,
                                            minValue: 0
                                        }
                                    ]
                                }
                            }
                        ]
                    };
                    var response = TooltipBuilder.buildUnion(options);
                    expect(response).to.equal('Type: UNION, Member Types: [Type: STRING, Length: 0 .. 10], [Type: LONG, Range: 0 .. 4294967295, Can be null: true]');
                });

            });


            //Union
            describe('fixTitleLabel()', function() {

                it('Should return Fix the long spaceless strings', function() {
                    var actualText = 'qwerty uiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewq';
                    var expectedText = 'qwerty uiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfds&#10;apoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvc&#10;xzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm01234567891011121314151&#10;61718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101&#10;112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm012&#10;3456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjkl&#10;zxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrewqqwertyuio&#10;pasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfdsapoiuytrew&#10;qqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvcxzlkjhgfds&#10;apoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101112131415161718mnbvc&#10;xzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm01234567891011121314151&#10;61718mnbvcxzlkjhgfdsapoiuytrewqqwertyuiopasdfghjklzxcvbnm0123456789101&#10;112131415161718mnbvcxzlkjhgfdsapoiuytrewq&#10;';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

                it('Should return the original string for long and white-spaced strings', function() {
                    var actualText = 'Type: LIST, Default: false,false,false,false,false, Range: 0 .. 5, Can be null: true';
                    var expectedText = 'Type: LIST, Default: false,false,false,false,false, Range: 0 .. 5, Can be null: true';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

                it('Should return the original string for long and carriage-return strings', function() {
                    var actualText = 'Type: LIST, Default: false,false,false,false,false,false,\nfalse,false,false,false,false, Range: 0 .. 5, Can be null: true';
                    var expectedText = 'Type: LIST, Default: false,false,false,false,false,false,\nfalse,false,false,false,false, Range: 0 .. 5, Can be null: true';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

                it('Should return the original string for short strings', function() {
                    var actualText = 'Type: INTEGER, Default: 0, Range: 0 .. 20';
                    var expectedText = 'Type: INTEGER, Default: 0, Range: 0 .. 20';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

            });

            // title with numeric description
            describe('wrapLineText()', function() {

                it('Should return wrapped tooltip for NUMERIC description', function() {
                    var actualText = 7;
                    var expectedText = '7';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

                it('Should return wrapped tooltip for NULL description', function() {
                    var actualText = null;
                    var expectedText = 'null';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

                it('Should return wrapped tooltip for UNDEFINED description', function() {
                    var actualText = undefined;
                    var expectedText = '';
                    var response = TooltipBuilder.fixTitleLabel(actualText);
                    expect(expectedText).to.equal(response);
                });

            });


        });
    });
});

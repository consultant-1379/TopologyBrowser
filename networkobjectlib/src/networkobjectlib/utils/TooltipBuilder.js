define([
], function() {
    'use strict';

    return {
        /*
         * hideNullableTooltip should be removed later
         * it only exists because OnOffSwitch and EnumDropDown
         * does not have a way to set to null
         */
        build: function(options, hideNullableTooltip) {
            return wrapLineText(build(options, hideNullableTooltip));
        },

        buildUnion: function(options) {
            var tooltip = this.build(options);

            tooltip += buildMemberTypes(options.memberTypes ? options.memberTypes : options.listMembers);
            return wrapLineText(tooltip);
        },
        fixTitleLabel: wrapLineText
    };
    function wrapLineText(nativeDescription) {
        var MAX_BLOCK_SIZE = 70;
        var MAX_SPACE_TOLERANCE = 10;
        var BLOCK_TERMINATOR_TEXT = '&#10;';
        var description = nativeDescription===undefined?'':String(nativeDescription);

        var BLOCK_TERMINATOR_LENGTH = BLOCK_TERMINATOR_TEXT.length;
        var fixedDescription = '';
        if (description && MAX_BLOCK_SIZE<description.length) {
            var index = MAX_BLOCK_SIZE;
            var totalLength = description.length;
            fixedDescription = description.substring(0, MAX_BLOCK_SIZE);
            var nextBreakBlock = (fixedDescription.lastIndexOf(' ')<fixedDescription.length-(MAX_BLOCK_SIZE/2) && fixedDescription.lastIndexOf('\n')<fixedDescription.length-(MAX_BLOCK_SIZE/2));
            while (index < totalLength) {
                var sliceBlock = description.substring(index, index+MAX_BLOCK_SIZE);
                if (nextBreakBlock) {
                    var spaceIndex = sliceBlock.indexOf(' ');
                    if (!spaceIndex || spaceIndex>MAX_SPACE_TOLERANCE) {
                        fixedDescription += BLOCK_TERMINATOR_TEXT + sliceBlock;
                    }
                    else {
                        fixedDescription += sliceBlock.substring(0, spaceIndex) + BLOCK_TERMINATOR_TEXT + sliceBlock.substring(spaceIndex, sliceBlock.length);
                    }
                }
                else {
                    fixedDescription += sliceBlock;
                }
                nextBreakBlock = (sliceBlock.lastIndexOf(' ')<sliceBlock.length-(MAX_BLOCK_SIZE/2) && sliceBlock.lastIndexOf('\n')<sliceBlock.length-(MAX_BLOCK_SIZE/2));
                index += MAX_BLOCK_SIZE;
                totalLength += BLOCK_TERMINATOR_LENGTH;
            }
        }
        else {
            fixedDescription = description;
        }
        return fixedDescription;
    }
    function build(options, hideNullableTooltip) {
        var tooltip = [];
        var constraints = [];

        tooltip.push(buildType(options.type));

        // default value
        if (options.hasOwnProperty('defaultValue') && options.defaultValue !== null) {
            constraints.push(buildDefaultValue(options.defaultValue));
        }

        // range/length
        if (options.constraints && options.constraints.valueRangeConstraints) {
            if (['INTEGER', 'LONG', 'DOUBLE', 'FLOAT', 'SHORT', 'LIST'].indexOf(options.type) > -1) {
                constraints.push(buildNumericRangeTooltip(options.constraints.valueRangeConstraints));
            }
            else {
                constraints.push(buildTextRangeTooltip(options.constraints.valueRangeConstraints));
            }
        }

        // nullable
        if (options.constraints && options.constraints.hasOwnProperty('nullable') && !hideNullableTooltip) {
            constraints.push(buildNullable(options.constraints.nullable));
        }

        if (constraints.length > 0) {
            tooltip.push(constraints.join(', '));
        }

        return tooltip.join(', ');
    }

    function buildType(type) {
        return 'Type: ' + type;
    }

    function buildDefaultValue(value) {
        return 'Default: ' + value;
    }

    function buildNullable(value) {
        return 'Can be null: ' + value;
    }

    function buildMemberTypes(memberTypes) {
        var tooltip = memberTypes.length ? ', Member Types: ' : '';
        var members = [];

        memberTypes.forEach(function(memberType) {
            members.push('['+build(memberType)+']');
        });

        return tooltip + members.join(', ');
    }

    function buildNumericRangeTooltip(range) {
        return 'Range: ' + buildRangeTooltip(range);
    }

    function buildTextRangeTooltip(range) {
        return 'Length: ' + buildRangeTooltip(range);
    }

    function buildRangeTooltip(range) {
        return range.reduce(function(prev, curr) {
            if (curr.minValue !== undefined && curr.maxValue !== undefined) {
                var valueText;
                if (curr.minValue === curr.maxValue) {

                    if (prev === '') {
                        valueText = curr.minValue;
                    }
                    else {
                        valueText = prev + '/' + curr.minValue;
                    }
                    return valueText;
                }
                else {
                    if (prev === '') {
                        valueText = curr.minValue + ' .. ' + curr.maxValue;
                    }
                    else {
                        valueText = prev + '/' + curr.minValue + ' .. ' + curr.maxValue;
                    }
                    return valueText;
                }
            }
            //Presuming there will only be one such member of value range constraints, is this right?
            else {
                if (curr.maxValue !== undefined) {
                    return 'Max: ' + curr.maxValue;
                }
                if (curr.minValue !== undefined) {
                    return 'Min: ' + curr.minValue;
                }
            }
        }, '');
    }

});

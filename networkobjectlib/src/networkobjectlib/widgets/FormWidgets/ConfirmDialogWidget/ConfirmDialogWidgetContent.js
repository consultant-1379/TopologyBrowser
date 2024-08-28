/*global define*/
define([
    'widgets/WidgetCore',
    './ConfirmDialogWidgetContentView',
    'tablelib/plugins/ResizableHeader',
    'widgets/Accordion',
    '../TreeTable/TreeTable',
    '../TreeTable/tree-table-cell/TreeTableCell',
    '../TreeTable/ProposedChangesCell/ProposedChangesCell',
    '../../../utils/TopologyUtility',
    'i18n!networkobjectlib/dictionary.json'
], function(WidgetCore, ContentView, ResizableHeader, Accordion, TreeTable, TreeTableCell, ProposedChangesCell, Utility, i18n) {
    'use strict';

    return WidgetCore.extend({

        View: ContentView,

        setChanges: function(original, changes, networkDisturbances) {
            if (this.table && this.accordion) {
                this.table.destroy();
                this.accordion.destroy();
            }

            var data, 
                columns = [
                    {title: i18n.treeTable.attribute, attribute: 'key', width: '149px', resizable: true, cellType: TreeTableCell},
                    {title: i18n.treeTable.currentValue, attribute: 'prevValue', width: '149px', resizable: true},
                    {title: i18n.treeTable.proposedChanges, attribute: 'valueArray', width: '149px', resizable: true, cellType: ProposedChangesCell}
                ];

            if (networkDisturbances && networkDisturbances.length > 0) {
                columns.push({title: i18n.treeTable.disturbance, attribute: 'disturbance', width: '299px', resizable: true});
            }

            data = buildTreeData(original, changes, 0);

            var table = new TreeTable({
                data: data,
                columns: columns,
                plugins: [
                    new ResizableHeader()
                ],
                modifiers: [
                    {name: 'striped'} // Applying a different table style
                ],
                tooltips: true
            });

            var accordion = new Accordion({
                title: i18n.treeTable.title + ' (' + data.length + ')',
                content: table
            });

            accordion.attachTo(this.getElement());

            this.accordion = accordion;
            this.table = table;
        },

    });

    function buildTreeData(originalList, changedList, networkDisturbances, indent) {
        // iterate list of changes
        var data = changedList.map(function(changed, index) {
            var originalValue;
            var changedValue;
            var changedKey;
            var children = null;
            var changeDisturbance = '';
            var splitValue;
            var description;
            var original;

            if (changed.key) {
                if (originalList !== null && typeof originalList !== 'undefined') {
                    // find original by key
                    original = originalList.find(function(original) {
                        return original.key === changed.key;
                    });

                    if (typeof original === 'undefined') {
                        originalValue = null;
                    } else if (changed.dataType === 'CHOICE') {
                        var caseAttributes = [].concat.apply([], original.cases.map(function(c) {
                            return c.attributes;
                        }));
                        originalValue = caseAttributes;
                    } else {
                        originalValue = original.value;
                    }
                } else {
                    originalValue = null;
                }

                if (changed.disturbance) {
                    changeDisturbance = changed.disturbance;
                }

                changedValue = changed.value;
                changedKey = changed.key;
            }
            else {
                // find original by index
                if (originalList !== null && typeof originalList[index] !== 'undefined') {
                    originalValue = originalList[index];
                }
                else {
                    originalValue = null;
                }

                changedValue = changed;
                changedKey = index;
            }

            if (Array.isArray(changedValue)) {
                children = buildTreeData(originalValue, changedValue, indent+1);

                // if something was removed append to children
                // var removedItems = originalValue.length - changedValue.length;
                //
                // for (var i = 0; i < removedItems; i++) {
                //     children.push({
                //         key: 'Removed',
                //         prevValue: null,
                //         newValue: null,
                //         indent: indent+1,
                //         children: null
                //     });
                // }

                originalValue = '-';
                changedValue = '-';
            }

            splitValue = String(Utility.extractEnumMember(changedValue));
            description = String(Utility.getEnumMemberDescription(changed,original));
            var valueArray = Utility.getValueArray(splitValue,description);

            return {
                key: changedKey,
                prevValue: String(originalValue),
                newValue: String(changedValue),
                valueArray: valueArray,
                disturbance: changeDisturbance,
                indent: indent,
                children: children
            };
        });

        return data;
    }

});

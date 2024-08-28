define([
], function() {
    var compareKeys = function(key, search) {
        return (!key && !search) || (!!key && !!search && (key.toLowerCase().lastIndexOf(search.toLowerCase(), 0) === 0));
    };

    var filterList = function(filterString, e) {
        var response = false;
        if (compareKeys(e.key, filterString) || compareKeys(e.keyValue, filterString)) {
            response = true;
        }
        else if (e.listReference && e.listReference.complexRef && e.listReference.complexRef.attributes && !isEmptyList(e)) {
            e.listReference.complexRef.attributes.forEach(function(attribute) {
                if (compareKeys(attribute.key, filterString) || compareKeys(attribute.keyValue, filterString)) {
                    response = true;
                }
            }.bind(this));
        }
        return response;
    };

    var filterChoice =  function(filterString, e) {
        var response = false;
        if (compareKeys(e.key, filterString) || compareKeys(e.keyValue, filterString)) {
            response = true;
        }
        else if (e.cases) {
            e.cases.forEach(function(choiceCase) {
                if (compareKeys(choiceCase.name, filterString)) {
                    response = true;
                }
                else if (choiceCase.attributes && typeof choiceCase.attributes.forEach === 'function') {
                    choiceCase.attributes.forEach(function(caseAttribute) {
                        if (Filter.filterFormAttribute(filterString, caseAttribute)) {
                            response = true;
                        }
                    });
                }
            });
        }
        return response;
    };
    var filterComplex = function(filterString, e) {
        var response = false;
        if (compareKeys(e.key, filterString) || compareKeys(e.keyValue, filterString)) {
            response = true;
        }
        else if (e.complexRef && e.complexRef.attributes) {
            e.complexRef.attributes.forEach(function(attribute) {
                if (compareKeys(attribute.key, filterString) || compareKeys(attribute.keyValue, filterString)) {
                    response = true;
                }
            }.bind(this));
        }
        return response;
    };

    var isEmptyList = function(e) {
        return  !!((e.value === null) || (e.value === undefined) || (e.value.length <= 0));
    };

    var filterDefault = function(filterString, e) {

        return compareKeys(e.key, filterString) || compareKeys(e.keyValue, filterString);
    };

    /*
     * @returns {Object}
     *  {boolean} filterReadOnlyAttribute - matches if a read only panel attribute option is found in a search text
     *  {boolean} filterEditableAttribute - matches if a read only panel attribute option is found in a search text
     */
    var Filter = {
        filterFormAttribute: function(filterString, e) {
            var response = false;
            switch (e.type) {
            case 'LIST':
                response = filterList(filterString, e);
                break;
            case 'CHOICE':
                response = filterChoice(filterString, e);
                break;
            case 'COMPLEX_REF':
                response = filterComplex(filterString, e);
                break;
            default:
                response = filterDefault(filterString, e);
            }
            return response;
        }
    };

    return Filter;
});

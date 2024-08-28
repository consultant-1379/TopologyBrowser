define([
],
function() {
    return {
        /*
         * overwrites value with key
         */
        buildEnumeration: function(data) {
            if (data.enumMembers && data.enumMembers.length) {
                data.enumMembers.forEach(function(elem) {
                    elem.value = elem.key;
                });
            }
            return data;
        }
    };
});

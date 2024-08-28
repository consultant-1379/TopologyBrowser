define([], function() {
    'use strict';
    return {
        setMemory: function(memory, objs) {
            objs.forEach(function(obj) {
                obj = JSON.parse(JSON.stringify(obj));
                memory.addObject(obj.id, obj, obj.parent);
            });
        }
    };
});

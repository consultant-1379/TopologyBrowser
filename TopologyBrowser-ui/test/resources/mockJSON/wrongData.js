if (typeof define !== 'function') {
    var define = require('../../../tools/node_modules/amdefine')(module);
}

define(function() {

    return {
        'name': 'START',
        'childrens': [
            {
                'name': 'Parent 1',
                'childrens': [
                    {
                        'name': 'Child 1',
                        'childrens': [
                            {
                                'name': 'Child 1.1',
                                'childrens': [
                                    {
                                        'name': 'Child 1.1.1'
                                    },
                                    {
                                        'name': 'Child 1.1.2'
                                    }
                                ]
                            },
                            {
                                'name': 'Child 1.2'
                            },
                            {
                                'name': 'Child 1.3'
                            }
                        ]
                    },
                    {
                        'name': 'Child 2',
                        'childrens': [
                            {
                                'name': 'Child 2.1'
                            },
                            {
                                'name': 'Child 2.2'
                            },
                            {
                                'name': 'Child 2.3'
                            }
                        ]
                    },
                    {
                        'name': 'Child 3',
                        'childrens': [
                            {
                                'name': 'Child 3.1'
                            },
                            {
                                'name': 'Child 3.2'
                            },
                            {
                                'name': 'Child 3.3'
                            }
                        ]
                    }
                ]
            }
        ]
    };
});

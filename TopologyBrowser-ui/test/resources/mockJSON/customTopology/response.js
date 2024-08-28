if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        custom_topology: {
            post: {
                400: {
                    'userMessage': {
                        'title': 'Too many levels',
                        'body': 'A collection can be nested up to 10 levels only!'
                    },
                    'internalErrorCode': 9999
                },
                401: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'No user information was provided!'
                    },
                    'internalErrorCode': 10019
                },
                403: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'This user does not have access to this feature!'
                    },
                    'internalErrorCode': 10024
                },
                404: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'The collection with the given ID was not found'
                    },
                    'internalErrorCode': 10007
                },
                409: {
                    'userMessage': {
                        'title': 'Name already exists',
                        'body': 'The name <NAME> is already in use in another collection!'
                    },
                    'internalErrorCode': 10011
                },
                422: {
                    'userMessage': {
                        'title': 'Invalid Collection name',
                        'body': 'Collection name supports only the following characters pattern: [a-z 0-9]!'
                    },
                    'internalErrorCode': 10031
                },
                500: {
                    'userMessage': {
                        'title': 'Unknown Error',
                        'body': 'An unexpected error happened!'
                    },
                    'internalErrorCode': -1
                }
            },
            get: {
                400: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'The collection with the given ID was not found'
                    },
                    'internalErrorCode': 10007
                },
                401: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'No user information was provided!'
                    },
                    'internalErrorCode': 10019
                },
                403: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'This user does not have access to this feature!'
                    },
                    'internalErrorCode': 10024
                },
                404: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'The collection with the given ID was not found'
                    },
                    'internalErrorCode': 10007
                },
                500: {
                    'userMessage': {
                        'title': 'Unknown Error',
                        'body': 'An unexpected error happened!'
                    },
                    'internalErrorCode': -1
                }
            },
            delete: {
                403: {
                    'userMessage': {
                        'title': 'Exception title',
                        'body': 'Descriptive error message'
                    },
                    'internalErrorCode': 10024
                },
                404: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'Descriptive error message'
                    },
                    'internalErrorCode': 10007
                },
                500: {
                    'userMessage': {
                        'title': 'Unknown Error',
                        'body': 'An unexpected error happened!'
                    },
                    'internalErrorCode': -1
                }
            },
            put: {
                400: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'The collection with the given ID was not found'
                    },
                    'internalErrorCode': 10007
                },
                401: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'No user information was provided!'
                    },
                    'internalErrorCode': 10019
                },
                403: {
                    'userMessage': {
                        'title': 'Access Forbidden',
                        'body': 'This user does not have access to this feature!'
                    },
                    'internalErrorCode': 10024
                },
                404: {
                    'userMessage': {
                        'title': 'Collection Not Found',
                        'body': 'The collection with the given ID was not found'
                    },
                    'internalErrorCode': 10007
                },
                409: {
                    'userMessage': {
                        'title': 'Name already exists',
                        'body': 'The name is already in use in another collection!'
                    },
                    'internalErrorCode': 10011
                },
                500: {
                    'userMessage': {
                        'title': 'Unknown Error',
                        'body': 'An unexpected error happened!'
                    },
                    'internalErrorCode': -1
                }
            },

        },
        collections: {
            get: {
                403: {
                    'userMessage': {
                        'title': 'Exception title',
                        'body': 'Descriptive error message'
                    },
                    'internalErrorCode': 12345
                },
                404: {
                    'userMessage': {
                        'title': 'Exception title',
                        'body': 'Descriptive error message'
                    },
                    'internalErrorCode': 10007
                },
                500: {
                    'userMessage': {
                        'title': 'Exception title',
                        'body': 'Descriptive error message'
                    },
                    'internalErrorCode': 12345
                }
            },
        }

    };
});

define([
    'networkobjectlib/utils/ErrorHandler',
    'i18n!networkobjectlib/dictionary.json'
], function(ErrorHandler,i18n) {
    'use strict';

    describe('utils/ErrorHandler', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getErrorFromResponse()', function() {


            beforeEach(function() {
                sandbox.spy(ErrorHandler, 'getErrorFromResponse');
            });

            it('Should handle failure when status occurs 404', function() {
                var xhr = {
                    getStatus: function() { return 404; }
                };

                var response = ErrorHandler.getErrorFromResponse(xhr);

                expect(response).to.equal(i18n.errors.persistentObjectNotFound);

            });

            it('Should handle failure when status occurs 500', function() {
                var xhr = {
                    getStatus: function() { return 500; },
                    getResponseJSON: function() { return null; }
                };

                var response = ErrorHandler.getErrorFromResponse(xhr);

                expect(response).to.equal(i18n.errors.persistentObjectError);

            });

            it('Should handle failure when status occurs 500 with status: RetryFailed', function() {
                var xhr = {
                    getStatus: function() { return 500; },
                    getResponseJSON: function() {
                        return {
                            body: 'status: RetryFailed'
                        };
                    }
                };

                var response = ErrorHandler.getErrorFromResponse(xhr);

                expect(response).to.equal(i18n.errors.databaseUnavailable);

            });

            it('Should handle failure when status occurs 503', function() {
                var xhr = {
                    getStatus: function() { return 503; },
                    getResponseJSON: function() { return null; }
                };

                var response = ErrorHandler.getErrorFromResponse(xhr);

                expect(response).to.equal(i18n.errors.persistentObjectError);

            });

            it('Should handle failure when status occurs default', function() {
                var xhr = {
                    getStatus: function() { return; },
                };

                var response = ErrorHandler.getErrorFromResponse(xhr);

                expect(response).to.equal(i18n.errors.persistentObjectError);

            });

        });

    });
});

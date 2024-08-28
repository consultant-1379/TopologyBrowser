define([
    'topologybrowser/utils/Utils',
], function(Utils) {
    'use strict';

    describe('Utils', function() {
        var sandbox, username;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            username = 'username';
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getCurrentUser()', function() {
            it('Should return the current user from the document', function() {
                // Setup
                sandbox.stub(document, 'querySelector').returns({innerText: username});

                // Run
                var currentUser = Utils.getCurrentUser();

                // Expect
                expect(currentUser).to.equal(username);
                sinon.assert.calledOnce(document.querySelector);
                sinon.assert.calledWithExactly(document.querySelector, '.eaUserProfileMenu-button');
            });

            it('Should generate and return a test user name if document query selector throws an error', function() {
                // Setup
                sandbox.stub(document, 'querySelector').throws(new Error());

                // Run
                var currentUser = Utils.getCurrentUser();

                // Expect
                expect(currentUser).to.match(/^testUser\d+/);
                sinon.assert.calledOnce(document.querySelector);
                sinon.assert.calledWithExactly(document.querySelector, '.eaUserProfileMenu-button');
            });
        });
    });
});

define([
    'jscore/core',
    'container/api',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/widgets/RefreshNotification/RefreshNotification'
], function(core, Container, i18n, RefreshNotification) {
    'use strict';

    describe('RefreshNotification', function() {
        var sandbox, notification;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            notification = new RefreshNotification({
                collectionName: 'test-collection'
            });
        });

        afterEach(function() {
            sandbox.restore();
        });


        describe('init()', function() {
            it('should initialize the refresh notification widget', function() {
                expect(notification).to.not.be.undefined;
                expect(notification.data.label).to.eql('Collection "test-collection" is not up to date.');
                expect(notification.data.link).to.eql(i18n.refreshNotification.link);
                expect(notification.autoDismiss).to.eql(undefined);
                expect(notification.autoDismissDuration).to.eql(10000);
            });

            it('should initialize the refresh notification widget with non default autoDismissDuration and non default autoDismiss', function() {
                notification = new RefreshNotification({
                    collectionName: 'test-collection',
                    autoDismiss: false,
                    autoDismissDuration: 20000
                });

                expect(notification).to.not.be.undefined;
                expect(notification.autoDismiss).to.eql(false);
                expect(notification.autoDismissDuration).to.eql(20000);
            });
        });

        describe('onViewReady()', function() {
            [{
                scenario: 'should call onAutoDismiss',
                autoDismiss: true,
                expectedAutoDismissCallCount: 1
            }, {
                scenario: 'should not call onAutoDismiss',
                autoDismiss: false,
                expectedAutoDismissCallCount: 0
            }].forEach(function(testData) {
                it('should add event listeners and ' + testData.scenario, function() {
                    notification.autoDismiss = testData.autoDismiss;
                    sandbox.spy(notification, 'onAutoDismiss');

                    notification.onViewReady();

                    expect(notification.onAutoDismiss.callCount).to.eql(testData.expectedAutoDismissCallCount);
                    expect(notification.onAutoDismiss.calledWith(10000)).to.eql(testData.autoDismiss);
                });
            });
        });

        describe('onDismiss()', function() {
            it('should apply transition css and destroy the widget', function() {
                sandbox.spy(notification, 'onDismiss');

                notification.onAutoDismiss();

                setTimeout(function() {
                    expect(notification.onDismiss.callCount).to.eql(1);
                });
            });
        });

        describe('onRefresh()', function() {
            it('should call event bus publish to refresh the topology tree', function() {
                sandbox.spy(Container.getEventBus(), 'publish');
                sandbox.spy(notification, 'onDismiss');

                notification.onRefresh();

                expect(Container.getEventBus().publish.callCount).eql(1);
                expect(notification.onDismiss.callCount).eql(1);
            });
        });

    });
});

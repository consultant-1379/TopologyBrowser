define([
    'jscore/core'
], function(core) {

    return {
        /**
         * generates a random uuid
         *
         * @returns {string}
         */
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        /**
         *
         * @param testSteps
         * @param done
         */
        runTestSteps: function(testSteps, done) {
            var currentStep = Promise.resolve(testSteps[0]());

            for (var i = 1; i < testSteps.length; i++) {
                currentStep = currentStep.then(testSteps[i]);
            }

            currentStep
                .catch(function(e) {
                    done(new Error(e));
                })
                .then(function() {
                    done();
                });
        },

        /**
         * use it when you want to wait some drawing to happen in the screen
         *
         * @param count how many frames to skip (default 3)
         * @returns {Promise}
         */
        skipFrames: function(count) {
            function fn(callback, count) {
                if (count > 0) {
                    requestAnimationFrame(fn.bind(null, callback, count - 1));
                } else {
                    callback();
                }
            }

            count = Number.isInteger(count) ? count : 3;

            return new Promise(function(resolve) {
                fn(resolve, count);
            });
        },

        buildTreeNodes: function(length, moType) {
            var data = [];

            for (var i = 0; i < length; i++) {
                var id = this.uuid();
                data.push({
                    id: id,
                    moName: 'Item ' + String(i) + ' - ' + id,
                    moType: moType || 'SubNetwork',
                    iconType: '',
                    noOfChildrens: 1,
                    childrens: null,
                    syncStatus: ''
                });
            }
            return data;
        },

        /**
         * wait for some miliseconds
         *
         * @param ms
         * @returns {Promise}
         */
        wait: function(ms) {
            return new Promise(function(resolve) {
                setTimeout(resolve, ms || 500);
            });
        },

        waitForElementVisible: function(selector, timeout, parentEl, index) {
            index = index || 0;
            return new Promise(function(resolve, reject) {
                var count = 0;
                var waitInterval = setInterval(function() {
                    var el;
                    if (selector.nodeName) {
                        el = [selector];
                    } else if (selector.getNative) {
                        el = [selector.getNative()];
                    } else if (parentEl) {
                        el = parentEl.querySelectorAll(selector);
                    } else {
                        el = document.querySelectorAll(selector);
                    }

                    if ((el !== null && el.length > index && el[index].offsetParent !== null) || count >= timeout/100)  {
                        clearInterval(waitInterval);
                        if (el && el.length === 1) {
                            resolve(el[index]);
                        } else {
                            resolve(el);
                        }
                    } else if (count >= timeout/100) {
                        clearInterval(waitInterval);
                        reject('No matching elements found and visible');
                    }
                    count++;
                }.bind(this), 100);
            });
        },

        clickElement: function(el) {
            if (el.length) {
                el = el[0];
            }
            if (!el.getNative) {
                el = core.Element.wrap(el);
            }
            el.trigger('click');
            return Promise.resolve();
        },

        ctrlClickElement: function(el) {
            if (el.length) {
                el = el[0];
            }
            if (!el.getNative) {
                el = core.Element.wrap(el);
            }
            el.trigger('click', { ctrlKey: true });
            return Promise.resolve();
        },

        rightClickElement: function(el) {
            if (el.length) {
                el = el[0];
            }
            if (!el.getNative) {
                el = core.Element.wrap(el);
            }
            el.trigger('contextmenu');
            return Promise.resolve();
        },

        isElementVisible: function(el) {
            if (!el) { return false; }
            if (el.constructor === ''.constructor) {
                el = document.querySelector(el);
            }
            if (!el) { return false; }
            if (el.length) { el = el[0]; }
            return !(el === null ||
            el.style === undefined ||
            el.style.display === undefined ||
            el.style.display === 'none' ||
            window.getComputedStyle(el).display === 'none' ||
            el.style.visibility === 'hidden' ||
            window.getComputedStyle(el).visibility === 'hidden' ||
            (
                el.getBoundingClientRect().top === 0 &&
                el.getBoundingClientRect().left === 0
            ) ||
            (
                el.offsetHeight === 0 ||
                el.offsetWidth === 0
            ));
        }
    };
});

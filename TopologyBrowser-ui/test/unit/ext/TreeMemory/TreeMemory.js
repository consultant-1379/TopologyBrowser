define([
    'topologybrowser/ext/TreeMemory/TreeMemory',
], function(TreeMemory) {
    'use strict';

    describe('TreeMemory', function() {
        var sandbox,
            memory;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            memory = TreeMemory;
        });

        afterEach(function() {
            sandbox.restore();
            memory.clearAll();
        });

        describe('all()', function() {
            it('Should return all memory', function() {
                memory.clearAll();
                var objects = [
                    {id: 1, name: 'parent', parent: -2},
                    {id: 2, name: 'child', parent: 1}
                ];

                objects.forEach(function(object) {
                    memory.addObject(object.id, object, object.parent);
                });

                var objectsInMemory = memory.all();
                expect(Object.keys(objectsInMemory).length).to.equal(objects.length);
                expect(objectsInMemory[1].name).to.equal('parent');
                expect(objectsInMemory[2].name).to.equal('child');
            });
        });

        describe('get()', function() {
            it('Should return element from memory', function() {

                memory.addObject(1, {name: 'parent'}, -2);
                expect(memory.get(1).name).to.equal('parent');
            });
        });

        describe('getChildren()', function() {
            it('Should return children from element', function() {

                memory.addObject(1, {name: 'parent'}, -2);
                memory.addObject(2, {name: 'child'}, 1);

                expect(memory.getChildren(1)[0].name).to.equal('child');
                expect(memory.getChildren(-2)[0].name).to.equal('parent');
            });
        });

        describe('addObject()', function() {
            it('Should add to memory', function() {

                var obj =
                    {
                        'id': '281474979214847',
                        'parent': '-2'
                    };

                memory.addObject(obj.id, obj, obj.parent);
                expect(memory.has(obj.id)).to.equal(true);
            });
        });

        describe('has()', function() {

            it('Should return true when memory holds an object', function() {
                var obj =
                    {
                        'id': '281474979214847',
                        'parent': '-2'
                    };
                memory.addObject(obj.id, obj, obj.parent);
                expect(memory.has(obj.id)).to.equal(true);
            });

            it('Should return false when memory does not hold an object', function() {
                expect(memory.has('123')).to.equal(false);
            });

        });

        describe('hasChildren()', function() {
            it('Should return true if there are children in memory', function() {

                var obj =
                    {
                        'id': '281474979214847',
                        'parent': '-2'
                    };

                memory.addObject(obj.id, obj, obj.parent);
                expect(memory.hasChildren(-2)).to.equal(true);
            });

            it('Should return false if there are no children in memory', function() {
                expect(memory.hasChildren('12345')).to.equal(false);
            });
        });

        describe('clearChildren()', function() {
            it('Should clear children from the parent', function() {

                memory.addObject(1, {name: 'parent'}, -2);
                memory.addObject(2, {name: 'child'}, 1);

                expect(memory.hasChildren(1)).to.equal(true);

                memory.clearChildren(1);
                expect(memory.hasChildren(1)).to.equal(false);
            });
        });

        describe('clearAll()', function() {
            it('Should clear all memory', function() {

                memory.addObject(1, {name: 'parent'}, -2);
                memory.addObject(2, {name: 'child'}, 1);

                expect(memory.all()[1].name).to.equal('parent');
                expect(memory.all()[2].name).to.equal('child');
                expect(Object.keys(memory.all()).length).to.equal(2);

                memory.clearAll();
                expect(Object.keys(memory.all()).length).to.equal(0);

            });
        });

    });
});

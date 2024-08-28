define([
    'networkobjectlib/regions/topologyTree/TreeMemory',
], function(TreeMemory) {
    'use strict';

    describe('TreeMemory', function() {
        var sandbox,
            memory;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            memory = new TreeMemory();
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

            it('Should return all descendants from element', function() {
                memory.addObject(1, {name: 'A'}, -2);
                memory.addObject(2, {name: 'A1'}, 1);
                memory.addObject(3, {name: 'A1.1'}, 2);
                memory.addObject(4, {name: 'A1.1.1'}, 3);
                memory.addObject(5, {name: 'A1.2'}, 2);
                memory.addObject(6, {name: 'A2'}, 1);
                memory.addObject(7, {name: 'B'}, -2);

                var descendants = memory.getChildren(2, true);

                expect(descendants).to.have.lengthOf(3);
                expect(descendants[0].name).to.equal('A1.1');
                expect(descendants[1].name).to.equal('A1.1.1');
                expect(descendants[2].name).to.equal('A1.2');
            });

            it('Should return empty if no children in memory', function() {
                var children = memory.getChildren(2);
                expect(children).to.have.lengthOf(0);
            });

            it('Should return empty if no descendants in memory', function() {
                var descendants = memory.getChildren(2, true);
                expect(descendants).to.have.lengthOf(0);
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

        describe('addObjects()', function() {
            it('Should add multiple objects to memory', function() {
                var objects =[
                    {
                        'id': '281474979214847',
                        'parent': '-2'
                    },
                    {
                        'id': '281474979214848',
                        'parent': '-2'
                    },
                    {
                        'id': '281474979214849',
                        'parent': '-2'
                    }];
                memory.addObjects(objects);
                expect(memory.has(objects[0].id)).to.equal(true);
                expect(memory.has(objects[1].id)).to.equal(true);
                expect(memory.has(objects[2].id)).to.equal(true);
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

            it('Should clear children from the parent recursively', function() {
                memory.addObject(1, {name: 'A'}, null);
                memory.addObject(2, {name: 'B'}, null);
                memory.addObject(3, {name: 'A1'}, 1);
                memory.addObject(4, {name: 'A1.1'}, 3);
                memory.addObject(5, {name: 'A1.2'}, 3);
                memory.addObject(6, {name: 'A1.1.1'}, 4);
                memory.addObject(7, {name: 'A1.1.2.1'}, 5);

                expect(memory.hasChildren(1)).to.equal(true);
                expect(memory.hasChildren(3)).to.equal(true);
                expect(Object.keys(memory.all()).length).to.equal(7);

                memory.clearChildren(1, true);

                expect(memory.hasChildren(1)).to.equal(false);
                expect(memory.hasChildren(3)).to.equal(false);
                expect(Object.keys(memory.all()).length).to.equal(2);
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

        describe('remove', function() {
            it('should remove item from memory', function() {
                memory.addObject(1, {name: 'A'}, null);
                memory.addObject(2, {name: 'B'}, null);
                memory.addObject(3, {name: 'A1'}, 1);
                memory.addObject(4, {name: 'A2'}, 1);

                expect(memory.getChildren(1).length).to.equal(2);
                expect(Object.keys(memory.all()).length).to.equal(4);

                memory.remove(3, 1);

                expect(memory.getChildren(1).length).to.equal(1);
                expect(Object.keys(memory.all()).length).to.equal(3);
            });

            it('should do nothing if item or parent not in memory', function() {
                memory.addObject(1, {name: 'A'}, null);

                expect(Object.keys(memory.all()).length).to.equal(1);

                memory.remove(2, 3);

                expect(Object.keys(memory.all()).length).to.equal(1);
            });
        });

    });
});

var subTrees = require('./test/resources/mockJSON/subTrees');
var grandParentSubTree = require('./test/resources/mockJSON/grandParentSubTree');
var parentAndGPSubTree = require('./test/resources/mockJSON/parentAndGPSubTree');
var moAttributes = require('./test/resources/mockJSON/moAttributes');
var poidDoesNotExistResponse = require('./test/resources/mockJSON/poidDoesNotExistResponse');
var actionData = require('./test/resources/mockJSON/actionData');

var realisticDataSubTrees1 = require('./test/resources/mockJSON/realisticDataSubTrees1');
var realisticDataSubTrees12 = require('./test/resources/mockJSON/realisticDataSubTrees12');
var realisticMOAttributes12 = require('./test/resources/mockJSON/realisticMOAttributes12');
var realisticDataSubTrees123 = require('./test/resources/mockJSON/realisticDataSubTrees123');

var realisticMeContextAttributesDefinitions = require('./test/resources/mockJSON/MeContextAttributesDefinitions');
var realisticENodeBFunctionAttributesDefinitions = require('./test/resources/mockJSON/ENodeBFunctionAttributesDefinitions');
var realisticENodeBFunctionAttributes= require('./test/resources/mockJSON/ENodeBFunctionAttributes');
var realisticMeContextAttributes = require('./test/resources/mockJSON/MeContextAttributes');

var customTopologyResponse = require('./test/resources/mockJSON/customTopology/response');
var customTopologyData = require('./test/resources/mockJSON/customTopology/CustomTopologyData');
var createCollection = require('./test/resources/mockJSON/createCollection');
var networkData = require('./test/resources/mockJSON/networkData/NetworkData');
var modelInfoData = require('./test/resources/mockJSON/networkData/ModelInfoData');
var persistentObjectDataBase = require('./test/resources/mockJSON/networkData/PersistentObjectDB');
var DataBase = require('./test/resources/MemoryDB');
var UserSettings = require('./test/resources/UserSettings');
var NodeDataBase = require('./test/resources/NodeDB');
var RestErrorData = require('./test/resources/RestErrorMock');
var supervisionNotificationDataBase = require('./test/resources/mockJSON/supervisionNotification');

module.exports = function(app) {

    var errorResponse;
    var findAndLocateResponse;
    var customTopologyStore = new DataBase();
    var userSettingsStore = new UserSettings();
    var networkDataStore = new NodeDataBase();
    var PODataStore = new persistentObjectDataBase();
    var supervisionNotificationStore = new supervisionNotificationDataBase();
    networkDataStore.setData(networkData['defaultData']);

    //********************************************************************************
    //************************* Test Support API Section *****************************
    //********************************************************************************

    //Clear customTopologyDB
    app.get('/test/custom-topology-db/clear', function(req, res) {
        customTopologyStore.clearAll();
        res.status(200).send(JSON.stringify('OK'));
    });

    // Set data on custom topology database
    app.get('/test/custom-topology-db/set-data/:id', function(req, res) {
        customTopologyStore.setData(customTopologyData[req.params.id]);
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(customTopologyData[req.params.id]));
        customTopologyStore.print();
    });

    // remove specific object from database
    app.get('/test/custom-topology-db/remove/:poid', function(req, res) {
        customTopologyStore.getParentId(req.params.poid);
        customTopologyStore.remove(req.params.poid,customTopologyStore.getParentId(req.params.poid));
        return res.status(204).send();
    });

    //Clear networkDataDB
    app.get('/test/network-data-db/clear', function(req, res) {
        networkDataStore.clearAll();
        res.status(200).send(JSON.stringify('OK'));
    });

    // Set data on network data database
    app.get('/test/network-data-db/set-data/:id', function(req, res) {
        networkDataStore.setData(networkData[req.params.id]);
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(networkData[req.params.id]));
        networkDataStore.print();
    });

    // Delete a node from network
    app.get('/test/network-data-db/delete-data/:id', function(req, res) {
        var data = networkDataStore.getPoid(req.params.id);
        if (data) {
            networkDataStore.remove(req.params.id);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(data));
            networkDataStore.print();
        } else {
            res.status(404).send(JSON.stringify({message: 'Node cannot find'}));
        }

    });

    // Add a node to network
    app.get('/test/network-data-db/add-data/:id', function(req, res) {
        var node = networkData.addData[req.params.id];
        networkDataStore.addNode(node);
        networkDataStore.print();
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(node));
    });

    //Set error response
    app.get('/test/errorResponse/set/:errorName/:statusCode', function(req, res) {
        errorResponse = {};
        errorResponse.error = RestErrorData[req.params.errorName] ? RestErrorData[req.params.errorName] : RestErrorData.default;
        errorResponse.statusCode = req.params.statusCode ? parseInt(req.params.statusCode) : 500;
        console.log('errorResponse set. Status Code : ' + errorResponse.statusCode + ' : Error Response: '  + errorResponse.error.title);
        res.status(200).send(JSON.stringify(errorResponse));
    });

    //Reset error response
    app.get('/test/errorResponse/reset', function(req, res) {
        errorResponse = false;
        console.log('errorResponse set to false');
        res.status(200).send(JSON.stringify('OK'));
    });

    //restoreDefaultDetailsPanelData
    app.get('/test/network-data-db/restore', function(req, res) {
        networkDataStore.setData(networkData['defaultData']);
        PODataStore.reset();
        res.status(200).send(JSON.stringify('OK'));
    });

    //********************************************************************************
    //*********************** Test Support API Section End ***************************
    //********************************************************************************


    //----------------------- Custom Topology Section -------------------------
    // Creates a new nested collection as a child of the topology with the given id.
    app.post('/object-configuration/custom-topology/v1/:id', function(req, res) {
        // req.body should be {"name":"Leaf_001","category":"Public","type":"LEAF"}

        res.set('Content-Type', 'application/json');

        //parent id not exist
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.post[404]));
        }
        //check name already exist
        if (customTopologyStore.hasNode(req.body.name)) {
            return res.status(409).send(JSON.stringify(customTopologyResponse.custom_topology.post[409]));
        }
        //too many levels. Exceed nested up level 10 (0 - 9)
        //real backend only support for level 9 only
        if (customTopologyStore.getLevel(req.params.id) > 8) {
            return res.status(400).send(JSON.stringify(customTopologyResponse.custom_topology.post[400]));
        }
        //invalid Collection name
        if (!/^[a-zA-Z0-9._-]*$/.test(req.body.name)) {
            return res.status(422).send(JSON.stringify(customTopologyResponse.custom_topology.post[422]));
        }

        var data = {
            id: customTopologyStore.getUuid().toString(),
            parentId: req.params.id,
            name: req.body.name,
            category: req.body.category,
            type: 'NESTED',
            subType: req.body.type
        };
        customTopologyStore.addNode(req.params.id, data);

        res.status(201).send(JSON.stringify(data));
    });

    app.post('/object-configuration/custom-topology/v2/:id', function(req, res) {
        // req.body should be {"name":"Leaf_001","category":"Public","type":"LEAF"}

        res.set('Content-Type', 'application/json');

        //parent id not exist
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.post[404]));
        }
        //check name already exist
        if (customTopologyStore.hasNode(req.body.name)) {
            return res.status(409).send(JSON.stringify(customTopologyResponse.custom_topology.post[409]));
        }
        //too many levels. Exceed nested up level 10 (0 - 9)
        //real backend only support for level 9 only
        if (customTopologyStore.getLevel(req.params.id) > 8) {
            return res.status(400).send(JSON.stringify(customTopologyResponse.custom_topology.post[400]));
        }
        //invalid Collection name
        if (!/^[a-zA-Z0-9._-]*$/.test(req.body.name)) {
            return res.status(422).send(JSON.stringify(customTopologyResponse.custom_topology.post[422]));
        }

        var data = {
            id: customTopologyStore.getUuid().toString(),
            parentId: req.params.id,
            name: req.body.name,
            category: req.body.category,
            type: 'NESTED',
            subType: req.body.subType,
            query: req.body.query
        };
        customTopologyStore.addNode(req.params.id, data);

        res.status(201).send(JSON.stringify(data));
    });

    app.get('/object-configuration/custom-topology/v2/:id', function(req, res) {
        res.set('Content-Type', 'application/json');
        // parent id not exist
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.get[404]));
        }

        res.status(200).send(JSON.stringify(customTopologyStore.getNode(req.params.id)));

    });

    app.post('/object-configuration/custom-topology/v1/', function(req, res) {

        var data = {
            id: customTopologyStore.getUuid().toString(),
            parentId: null,
            name: req.body.name,
            category: req.body.category,
            type: 'NESTED',
            subType: req.body.type
        };
        customTopologyStore.addRoot(data);
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    });

    app.get('/object-configuration/collections/v3/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.collections.get[404]));
        }

        var dataFromDb = customTopologyStore.getLeafChildren(req.params.id);
        if (!dataFromDb) {
            dataFromDb = {objects: []};
        }
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(dataFromDb));
    });

    app.delete('/object-configuration/collections/v4', function(req, res) {
        var data = req.body.collectionIds;
        var errors = [];

        data.forEach(function(id) {
            var children = customTopologyStore.getChildren(id);
            if (children && children.length > 0) {
                errors.push({
                    id: id,
                    title: 'Cannot delete collection',
                    body: 'The collection with id ' + id + ' can\'t be deleted as it has other collections as children',
                    internalErrorCode: 10034
                });
            } else {
                customTopologyStore.remove(id,customTopologyStore.getParentId(id));
            }
        });

        return errors.length > 0 ? res.status(200).send(errors) : res.status(204).send();
    });

    app.get('/object-configuration/collections/v2/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.collections.get[404]));
        }
        var dataFromDb = customTopologyStore.getLeafChildren(req.params.id);
        if (!dataFromDb) {
            dataFromDb = {objects: []};
        }
        res.set('Content-Type', 'application/json');
        res.status(200).send(dataFromDb);
    });

    app.put('/object-configuration/v1/collections/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.collections.get[404]));
        }
        var parent = customTopologyStore.getNode(req.params.id);

        var data = {
            category: req.body.category,
            id: parent.id,
            parentId: parent.parentId,
            name: parent.name,
            objects: req.body.objects
        };

        customTopologyStore.updateNode(data);
        customTopologyStore.addLeafChildren(parent.id, data);

        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    });

    app.put('/object-configuration/custom-topology/v1/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.put[404]));
        }
        if (customTopologyStore.hasNode(req.body.name)) {
            return res.status(409).send(JSON.stringify(customTopologyResponse.custom_topology.put[409]));
        }

        var node = {
            id: req.params.id,
            name: req.body.name,
            category: req.body.category
        };
        var updatedNode = customTopologyStore.updateNode(node);

        var data = {
            category: updatedNode.category,
            id: updatedNode.id,
            name: updatedNode.name,
            parentId: updatedNode.parentId,
            type: updatedNode.type
        };
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    });

    app.put('/object-configuration/custom-topology/v2/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.put[404]));
        }
        if (customTopologyStore.hasNode(req.body.name)) {
            return res.status(409).send(JSON.stringify(customTopologyResponse.custom_topology.put[409]));
        }

        var updatedNode = customTopologyStore.getNode(req.params.id);
        var data = {
            category: updatedNode.category,
            id: updatedNode.id,
            name: updatedNode.name,
            parentId: updatedNode.parentId,
            type: updatedNode.type,
            subType: updatedNode.subType,
            objects: req.body.objects
        };

        customTopologyStore.addLeafChildren(updatedNode.id, data);

        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    });

    app.post('/object-configuration/v1/collections', function(req, res) {
        createCollection[0].name = req.params.name;
        createCollection[0].category = req.params.category;
        var data = createCollection;
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    });

    app.get('/object-configuration/custom-topology/v2?', function(req, res) {
        if (req.query.parentId) {
            if (!customTopologyStore.hasNodeById(req.query.parentId)) {
                return res.status(200).send(JSON.stringify([]));
            }
            var dataFromDb = customTopologyStore.getChildren(req.query.parentId);
            if (!dataFromDb) {
                dataFromDb = [];
            }

            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(dataFromDb));
        } else {
            var root = customTopologyStore.getRoots();
            res.set('Content-Type', 'application/json');
            return res.status(200).send(JSON.stringify(root));
        }


    });

    app.get('/object-configuration/custom-topology/v1?', function(req, res) {
        if (req.query.parentId) {
            if (!customTopologyStore.hasNodeById(req.query.parentId)) {
                return res.status(200).send(JSON.stringify([]));
            }
            var dataFromDb = customTopologyStore.getChildren(req.query.parentId);
            if (!dataFromDb) {
                dataFromDb = [];
            }

            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(dataFromDb));
        } else {
            var root = customTopologyStore.getRoots();
            res.set('Content-Type', 'application/json');
            return res.status(200).send(JSON.stringify(root));
        }


    });

    app.delete('/object-configuration/custom-topology/v1/:poid', function(req, res) {
        customTopologyStore.getParentId(req.params.poid);
        customTopologyStore.remove(req.params.poid,customTopologyStore.getParentId(req.params.poid));
        return res.status(204).send();
    });

    app.put('/object-configuration/custom-topology/v1/:id/:parentId', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.put[404]));
        }
        if (req.params.id === '281474978841234') {
            return res.status(500).send(JSON.stringify({internalErrorCode: 11003}));
        }
        customTopologyStore.removeCollection(req.params.id,req.params.parentId);
        return res.status(200).send();
    });

    //----------------------- Network Explorer Import Section -------------------------
    app.post('/network-explorer-import/v1/collection/export', function(req, res) {
        var data = {
            sessionId: 'r6732069-9938-4173-84b6-9e6666412047',
            startTime: 1528450705214,
            timeZone: 'Europe/Dublin'
        };
        res.set('Content-Type', 'application/json');
        res.status(202).send(JSON.stringify(data));
    });

    app.post('/network-explorer-import/v1/collection/export/nested', function(req, res) {
        var data = {
            sessionId: 'r6732069-9938-4173-84b6-9e6666412048',
            startTime: 1528450705215,
            timeZone: 'Europe/Dublin'
        };
        res.set('Content-Type', 'application/json');
        res.status(202).send(JSON.stringify(data));
    });

    app.get('/network-explorer-import/v1/collection/export/status/:sessionId', function(req, res) {
        if (req.params.sessionId) {
            var data = {
                'status': 'COMPLETED_WITH_SUCCESS',
                'failure': [],
                'processed': 1,
                'total': 1
            };
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(data));
        } else {
            var errorMessage = {
                'internalErrorCode': 10036,
                'userMessage': {
                    'title': 'Session identifier is invalid.',
                    'body': 'The session identifier is empty.'
                }
            };
            res.set('Content-Type', 'application/json');
            return res.status(400).send(JSON.stringify(errorMessage));
        }
    });

    //--------------------- Persistent Object Section ------------------------

    app.post('/persistentObject/v1/perform-mo-action/:fdn', function(req, res) {
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(
            {
                'title': 'Performed sync action successfully', 'body': 'SUCCESS FDN :' + req.body.fdn
            }));
    });

    app.post('/persistentObject/network/poids', function(req, res) {
        res.set('Content-Type', 'application/json');

        var data = req.body.poids.map(function(poid) {
            var node = networkDataStore.getPoid(poid);
            if (node && node.id === '281475029126198') {
                node.managementState='NORMAL';
            }
            return node;
        });
        res.status(200).send(JSON.stringify({treeNodes: data}));
    });

    app.get('/persistentObject/network/:poId', function(req, res) {
        var poId = req.params.poId;
        if (errorResponse) {
            return res.status(errorResponse.statusCode).send(JSON.stringify(errorResponse.error));
        }
        switch (poId) {
        case '-1':
            res.send(JSON.stringify({treeNodes: networkDataStore.getRoot()}));
            break;
        case '-2':
            res.send(JSON.stringify({treeNodes: networkDataStore.getOtherRoot()}));
            break;
        default:
            var data = networkDataStore.getNode(poId);
            var children = networkDataStore.getChildren(poId);
            data.childrens = children ? children : [];
            data.noOfChildrens = data.childrens.length;
            data.totalNodeCount = data.childrens.length;
            res.send(JSON.stringify({treeNodes: [data]}));
            break;
        }
    });

    app.get('/persistentObject/network/:poId/subTrees', function(req, res) {
        console.log('rest started' +req);
        if (errorResponse) {
            return res.status(errorResponse.statusCode).send(JSON.stringify(errorResponse.error));
        }
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(subTrees));
    });

    app.post('/persistentObject/rootAssociations/', function(req, res) {
        var netList = [];
        req.body.poList.forEach(function(po, index) {
            switch (po) {
            case '281475075348630':
                res.status(403).send(JSON.stringify({
                    'title': 'Failure: GUI should not see this',
                    'body': 'Mock 403 Message: User Forbidden with node Id: ' + req.params.poId
                }));
                return;
            case '281475075348631':
                res.status(401).send(JSON.stringify({
                    'title': 'Failure: GUI should not see this',
                    'body': 'Mock 401 Message: Unauthorized with node Id: ' + req.params.poId
                }));
                return;
            case '281475075348632':
                res.status(503).send(JSON.stringify({
                    'title': 'Failure: GUI should not see this',
                    'body': 'Mock 503 Message: DataBase Unavailable with node Id: ' + req.params.poId
                }));
                return;
            case '281475075348633':
                res.status(500).send(JSON.stringify({
                    'title': 'Failure: GUI should not see this',
                    'body': 'Mock 500 Message: Generic Exception with node Id: ' + req.params.poId
                }));
                return;
            default:
                netList.push({
                    'name': 'LTE49dg2ERBS0000' + index,
                    'type': 'NetworkElement',
                    'poId': parseInt(po),
                    'id': po,
                    'fdn': 'NetworkElement=LTE49dg2ERBS0000' + index,
                    'namespace': null,
                    'namespaceVersion': null,
                    'neType': null,
                    'attributes': null,
                    'networkDetails': null
                });
            }
        });
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(netList));
    });

    app.put('/persistentObject/:poId/', function(req, res) {
        if (errorResponse) {
            return res.status(errorResponse.statusCode).send(JSON.stringify(errorResponse.error));
        }
        res.set('Content-Type', 'application/json');
        switch (req.params.poId) {
        case '281475075348626':
            res.status(403).send(JSON.stringify({
                'title': 'Failure: GUI should not see this',
                'body': 'Mock 403 Message: User Forbidden with node Id: ' + req.params.poId
            }));
            return;
        case '281475075348627':
            res.status(401).send(JSON.stringify({
                'title': 'Failure: GUI should not see this',
                'body': 'Mock 401 Message: Unauthorized with node Id: ' + req.params.poId
            }));
            return;
        case '281475075348628':
            res.status(503).send(JSON.stringify({
                'title': 'Failure: GUI should not see this',
                'body': 'Mock 503 Message: DataBase Unavailable with node Id: ' + req.params.poId
            }));
            return;
        case '281475075348629':
            res.status(500).send(JSON.stringify({
                'title': 'Failure: GUI should not see this',
                'body': 'Mock 500 Message: Generic Exception with node Id: ' + req.params.poId
            }));
            return;
        default:
            if (req.body.attributes.filter(function(attribute) { return attribute.key === 'networkManagedElementId'; }).length > 0) {
                res.status(403).send(JSON.stringify({title: 'Error', body: 'Unauthorised error'}));
            } else {
                var data = {
                    title: 'Success',
                    body: 'Updated Persistent Object with Id: ' + PODataStore.updateObject(req.params.poId, req.body.attributes)
                };
                res.status(200).send(JSON.stringify(data));
            }
        }
    });

    app.get('/object-configuration/collections/v4/search/*:query?', function(req, res) {
        if (req.query.query === 'empty') {
            findAndLocateResponse = {objects: []};
        } else if (req.query.query === 'RNC01MSRBS-V2259') {
            findAndLocateResponse = {objects: []};
        } else if (req.query.query === 'ieatnetsimv6035-12_RNC01RBS03') {
            findAndLocateResponse = {objects: [{poId: 281475029105735, nodeName: 'ieatnetsimv6035-12_RNC01RBS03', path: [281474978623585,281474978846998]}]};
        } else if (req.query.query === 'iea') {
           findAndLocateResponse = {objects: [
               {poId: 281475029105735, nodeName: 'ieatnetsimv6035-12_RNC01RBS03', path: [281474978623585,281474978846998]},
               {poId: 281475029148688, nodeName: 'ieatnetsimv6035-12_RNC01RBS13', path: [281474978623585,281474978846999]},
               {poId: 281475029126429, nodeName: 'ieatnetsimv6035-12_RNC01RBS16', path: [281474978623585,281474978846999]}
           ]};
        } else {
            //path1: TransportTopology >> Branch1>>Branch2>>Leaf1>>poid=281475075346449
            //path2: TransportTopology >> NextBranch1>> NextBranch2>>LeafA
            //path3: TransportTopology >> LeafAB
            findAndLocateResponse = [
                    {'poid': '281475075346449', 'nodeName': 'RNC01MSRBS-V2259', 'path': '[800074978623583, 900000000000001, 900000000000002,900000000000003]'},
                    {'poid': '281475029105738', 'nodeName': 'ieatnetsimv6035-12_M01', 'path': '[800074978623583, 900000000000004, 900000000000005,900000000000006]'},
                    {'poid': '281475029105735', 'nodeName': 'ieatnetsimv6035-12_RNC01RBS03', 'path': '[800074978623583, 900000000000007]'}
            ];
        }
        return res.status(200).send(JSON.stringify(findAndLocateResponse));
    });


    app.get('/persistentObject/fdn/:fdn', function(req, res) {
        if (errorResponse) {
            return res.status(errorResponse.statusCode).send(JSON.stringify(errorResponse.error));
        }

        if (req.params.fdn === 'wrong_fdn') {
            return res.status(404).send(JSON.stringify({
                title: 'Could not find requested object.',
                body: 'We cannot find the requested object. It may have been removed or is not available at this time. Please try again later.',
                errorCode: 10009,
                detail: 'Persistent Object with FDN = ERBS_SubNetwork not found'
            }));
        }
        else {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(
                {
                    'name': 'RNC01MSRBS-V2259',
                    'type': 'ManagedElement',
                    'poId': '281475075346449',
                    'id': '281475075346449',
                    'fdn': 'SubNetwork=RNC01,ManagedElement=RNC01MSRBS-V2259',
                    'namespace': 'ComTop',
                    'namespaceVersion': '10.20.0',
                    'neType': 'RadioNode',
                    'attributes': [{'key': 'networkManagedElementId','value': null,'datatype': null}],
                    'networkDetails': [{'key': 'syncStatus','value': 'SYNCHRONIZED'},{'key': 'ipAddress','value': '192.168.101.194'}]
                }));
        }
    });

    app.get('/persistentObject/:poid?', function(req, res) {
        res.send(JSON.stringify(PODataStore.getObject(req.params.poid)));
    });

    app.get('/persistentObject/model/:neType/*', function(req, res) {
        res.status(200).send(JSON.stringify(modelInfoData.getModelInfo(req.params.neType, null)));
    });

    // Legacy model info call for fall back
    // app.get('/modelInfo/model/:neType/*', function(req, res) {
    //     res.status(200).send(JSON.stringify(modelInfoData.getModelInfo(req.params.neType, null)));
    // });

    //Get actions
    app.get('/oss/uiaccesscontrol/resources/:resource/actions', function(req, res) {
        if (req.params.resource === 'searchExecutor') {
            res.status(200).send(JSON.stringify({'resource': 'searchExecutor', 'actions': ['read']}));
        }
        else if (req.params.resource === 'topologySearchService') {
            res.status(200).send(JSON.stringify({'resource': 'topologySearchService', 'actions': ['read']}));
        } else if (req.params.resource === 'persistentobjectservice') {
            res.status(200).send(JSON.stringify({'resource': 'persistentobjectservice', 'actions': ['read', 'update']}));
        } else {
            res.status(200).send(JSON.stringify({'resource': req.params.resource, 'actions': ['read', 'update','execute', 'create', 'delete']}));
        }
    });

    //Get Scoping Panel Actions
        app.get('/oss/uiaccesscontrol/resources/', function(req, res) {
            res.status(200).send(JSON.stringify([
                {'resource': 'persistentobjectservice', 'actions': ['read', 'update']},
                {'resource': 'Collections_Public', 'actions': ['read', 'update', 'create', 'delete']},
                {'resource': 'Collections_Private', 'actions': ['read', 'update', 'create', 'delete']},
                {'resource': 'CollectionsOthers_Public', 'actions': ['read', 'update', 'delete']},
                {'resource': 'CollectionsOthers_Private', 'actions': ['read', 'update', 'delete']},
                {'resource': 'searchExecutor', 'actions': ['read']},
                {'resource': 'topologySearchService', 'actions': ['read']},
                {'resource': 'SavedSearch_Public', 'actions': ['read']},
                {'resource': 'SavedSearch_Private', 'actions': ['read', 'update', 'create', 'delete']},
                {'resource': 'SavedSearchOthers_Public ', 'actions': ['read', 'update', 'delete']},
                {'resource': 'SavedSearchOthers_Private', 'actions': ['read', 'update', 'delete']},
            ]));
        });

    // Get dropdown settings
    app.get('/rest/ui/settings/topologybrowser/dropdownSettings', function(req, res) {
        res.status(200).send(JSON.stringify(userSettingsStore.getDropdownSettings()));
    });

    // Update dropdown settings
    app.put('/rest/ui/settings/topologybrowser/dropdownSettings', function(req, res) {
        userSettingsStore.saveDropdownSettings(req.body);
        res.status(204).send();
    });

    // Reset dropdown settings
    app.get('/rest/ui/settings/topologybrowser/dropdownSettings/reset', function(req, res) {
        userSettingsStore.resetDropdownSettings();
        res.status(200).send('Dropdown settings reset.');
    });

    // Get Recent Actions
    app.get('/rest/ui/settings/topologybrowser/recentactions', function(req, res) {
        res.set('Content-Type', 'application/json');
        var data = [
            {
                id: 'Monitor Alarms',
                value: '1574259310688',
                created: 1574259310771,
                lastUpdated: null
            },
            {
                id: 'Edit State',
                value: '1574246391351',
                created: 1574246391475,
                lastUpdated: null
            },
            {
                id: 'Add to a Collection',
                value: '1574259287289',
                created: 1574259287341,
                lastUpdated: null
            }];
        res.send(JSON.stringify(data));
    });

    // Update recent actions
    app.put('/rest/ui/settings/topologybrowser/recentactions', function(req, res) {
        res.set('Content-Type', 'application/json');
        var data = [{
            id: 'Initiate CM Sync',
            value: '1574259425118',
            created: 1574259425274,
            lastUpdated: null
        }];
        res.send(JSON.stringify(data));
    });

    // Get Actions for action framework
    app.post('/rest/v1/apps/action-matches', function(req, res) {
        var data = req.body;
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(actionData.getResponseData(data)));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+123+'/subTrees',function(req,res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticDataSubTrees123));
    });

    app.get('/managedObjects/topology/'+12+'/subTrees',function(req,res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticDataSubTrees12));
    });

    app.get('/managedObjects/topology/'+1+'/subTrees',function(req,res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticDataSubTrees1));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+123+'/attributes', function(req, res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticENodeBFunctionAttributes));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+12+'/attributes', function(req, res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticMOAttributes12));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+1+'/attributes', function(req, res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticMeContextAttributes));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+1234+'/subTrees',function(req,res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(subTrees));
    });

    //Valid Request
    app.get('/managedObjects/topology/'+1234+'/attributes', function(req, res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(moAttributes));
    });

    //Click on Parent, ie Stockholm 2
    app.get('/managedObjects/topology/:poId/subTrees',function(req,res) {
        console.log('rest started' +req);
        res.set('Content-Type', 'application/json');


        var poId = req.params.poId;

        console.log(req.query.relativeDepth.substring(0,req.query.relativeDepth.indexOf(',')));
        console.log('Request Poid : '+ poId) ;

        setTimeout(function() {
            if (req.query.relativeDepth === '-2' && poId === 8444249301369264) {
                res.send(JSON.stringify(grandParentSubTree));
            }

            if (req.query.relativeDepth === '-1:-2' && poId === 8444249301369249) {
                res.send(JSON.stringify(parentAndGPSubTree));
            }
            else  {
                res.send('[]');
            }
        }, 1000);

    });

    //No such Poid
    app.get('/managedObjects/topology/'+9999, function(req, res) {
        console.log('rest started' +req);
        res.status('404');
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(poidDoesNotExistResponse));
    });

    //No such Poid
    app.get('/managedObjects/topology/'+500, function(req, res) {
        console.log('rest started' +req);
        res.status('500');
        res.set('Content-Type', 'application/json');
        res.send('[]');
    });

    //Valid Request for MeContext attribute Definition
    app.get('/managedObjects/model/MeContext/*/attributes', function(req, res) {
        console.log('rest started' +req);
        res.status('200');
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticMeContextAttributesDefinitions));
    });

    //Valid Request for ENodeBFunction attribute Definition
    app.get('/managedObjects/model/ENodeBFunction/*/attributes', function(req, res) {
        console.log('rest started' +req);
        res.status('200');
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(realisticENodeBFunctionAttributesDefinitions));
    });

    //Valid Request
    //Put in a Regex for MeContext and another for ENodeBFunction
    app.get('/managedObjects/topology/:fdn/attributes', function(req, res) {
        console.log('rest started' +req);

        var fdn = req.params.fdn;

        //Check if EnodeBfunction ro MeCOntext matches the last token
        if (fdn.match(/.*(ENodeBFunction)=[\w]+$/)) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(realisticENodeBFunctionAttributes));
        }
        else if (fdn.match(/.*(MeContext)=[\w]+$/)) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(realisticMeContextAttributes));
        }
        else {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(moAttributes));
        }

    });

    app.get('/managedObjects/query?', function(req, res) {
        console.log('rest started' + req);
        if (req.query.searchQuery) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({
                'poList': ['281475075346449']
            }));
        }
    });

    app.get('/managedObjects/find?', function(req, res) {
        console.log('rest started' + req);
        if (req.query.searchQuery) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify([
                { poId: 281475059730200},
                { poId: 281475059730933}
            ]));
        }
    });

    app.get('/rest/ui/settings/networkexplorer/favorites', function(req, res) {
        console.log('rest started' + req);

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify([
            { 'id': '1', 'value': true }
        ]));
    });

    app.get('/editprofile', function(req, res) {
        console.log('rest started' + req);

        var userProfile = {
            'username': 'administrator',
            'firstName': 'security',
            'lastName': 'admin',
            'email': 'security@administor.com',
            'userType': 'enmUser',
            'status': 'enabled',
            '_id': 'administrator',
            '_rev': '11',
            'isMemberOf': 'SECURITY_ADMIN,ADMINISTRATOR',
            'lastLogin': '20150901145848+0000'
        };

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(userProfile));
    });

    app.get('/oss/idm/usermanagement/users/administrator/privileges', function(req, res) {
        console.log('rest started' + req);

        var administratorUserPermissions = [{
            'user': 'administrator',
            'role': 'ADMINISTRATOR',
            'targetGroup': 'ALL'
        }, {
            'user': 'administrator',
            'role': 'SECURITY_ADMIN',
            'targetGroup': 'ALL'
        }];

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(administratorUserPermissions));
    });

    app.get('/rest/system/time', function(req, res) {
        console.log('rest started' + req);

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({
            'timestamp': new Date().getTime(),
            'utcOffset': 1.0,
            'timezone': 'IST',
            'serverLocation': 'Europe/Dublin'
        }));
    });

    app.get('/topologyCollections/savedSearches', function(req, res) {
        console.log('rest started' + req);

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify([
            {
                'type': 'SavedSearch',
                'poId': '3688849860347916',
                'name': 'EUtranCells',
                'searchQuery': 'EUtranCellFDD',
                'attributes': {
                    'searchQuery': 'EUtranCellFDD',
                    'name': 'EUtranCells',
                    'timeCreated': '1422461900446',
                    'userId': 'testUser',
                    'category': 'Private'
                }
            }]));
    });

    app.get('/object-configuration/collections/v4/:id?includeContents=true', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.collections.get[404]));
        }
        var data = customTopologyStore.getNode(req.params.id);
        var formattedData;
        var dataFromDb = customTopologyStore.getLeafChildren(req.params.id);
        res.set('Content-Type', 'application/json');
        if (!dataFromDb) {
            dataFromDb = {objects: []};
        }
        data.objects = dataFromDb.objects;
        formattedData = customTopologyStore.convertToV4Collection([data], false);
        res.status(200).send(JSON.stringify(formattedData[0]));
    });

    app.get('/object-configuration/collections/v4/:id', function(req, res) {
        if (!customTopologyStore.hasNodeById(req.params.id)) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.collections.get[404]));
        }
        var data = customTopologyStore.getNode(req.params.id);
        var formattedData;
        if (data && data.subType === 'BRANCH') {
            formattedData  = customTopologyStore.convertToV4Collection([data], false);
            res.status(200).send(JSON.stringify(formattedData[0]));
        }
        else if (data && data.subType === 'LEAF' || data && data.subType === 'SEARCH_CRITERIA') {
            var dataFromDb = customTopologyStore.getLeafChildren(req.params.id);
            res.set('Content-Type', 'application/json');
            if (!dataFromDb) {
                dataFromDb = {objects: []};
            }
            data.objects = dataFromDb.objects;
            formattedData = customTopologyStore.convertToV4Collection([data], false);
            res.status(200).send(JSON.stringify(formattedData[0]));
        }
    });

    app.post('/object-configuration/collections/search/v4', function(req, res) {
        var formattedData;
        if (req.body.clauses && req.body.clauses[0].type === 'CUSTOM_TOPOLOGY') {
            var tempRoot = customTopologyStore.getRoots();
            formattedData = customTopologyStore.convertToV4Collection(tempRoot, true);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(formattedData));
        }
        else if (req.body && req.body.parentId) {
            var children = customTopologyStore.getChildren(req.body.parentId);
            if (!children) {
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify([]));
            }
            else {
                formattedData = customTopologyStore.convertToV4Collection(children, false);
                res.set('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(formattedData));
            }
        }
    });

    app.post('/object-configuration/collections/v4/', function(req, res) {

        res.set('Content-Type', 'application/json');

        //parent id not exist
        if (!customTopologyStore.hasNodeById(req.body.parentIds[0])) {
            return res.status(404).send(JSON.stringify(customTopologyResponse.custom_topology.post[404]));
        }
        //check name already exist
        if (customTopologyStore.hasNode(req.body.name)) {
            return res.status(409).send(JSON.stringify(customTopologyResponse.custom_topology.post[409]));
        }
        //too many levels. Exceed nested up level 10 (0 - 9)
        //real backend only support for level 9 only
        //in collections v4 we only have the parentId so we check against that
        if (customTopologyStore.getLevel(req.body.parentIds[0]) > 8) {
            return res.status(400).send(JSON.stringify(customTopologyResponse.custom_topology.post[400]));
        }
        //invalid Collection name
        if (!/^[a-zA-Z0-9._-]*$/.test(req.body.name)) {
            return res.status(422).send(JSON.stringify(customTopologyResponse.custom_topology.post[422]));
        }

        var formattedData;
        var data = {
            id: customTopologyStore.getUuid().toString(),
            parentId: req.body.parentIds[0],
            name: req.body.name,
            category: req.body.sharing,
            type: 'NESTED',
            subType: req.body.type,
            stereotypes: req.body.stereotypes
        };
        formattedData = customTopologyStore.convertToV4Collection([data], false);
        customTopologyStore.addNode(data.parentId, data);

        res.status(201).send(JSON.stringify(formattedData[0]));

    });

    app.get('/object-configuration/labels/v1', function(req, res) {
        res.set('Content-Type', 'application/json');
        var labelsObj = [
            {
                'name': 'label01'
            }
        ];
        res.status(200).send(JSON.stringify(labelsObj));
    });

    app.get('/network-visualization/v1/network-elements/get-current-notifications/*', function(req, res) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(supervisionNotificationStore.getSupervisionNotifications()));
    });

    app.post('/network-visualization/v1/network-elements/clear-current-notifications', function(req, res) {
        supervisionNotificationStore.removeSupervisionNotifications(req.body.enableNodesList, req.body.disableNodesList);
        res.set('Content-Type', 'application/json');
        res.send('SUCCESS');
    });
};

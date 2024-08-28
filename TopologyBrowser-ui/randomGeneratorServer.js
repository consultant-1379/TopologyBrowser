//Start by navigating to http://localhost:8585/#topologybrowser?poid=1

module.exports = function (app) {

    //Root of generated tree
    var totalTree ={
        "moName":"1",
        "moType":null,
        "poId":"1",
        "fdn":"VERYVERYLONGFDNNAME1",
        "items":null
    };

    //Parameters for Depth, and Number of Child nodes (up to ten)
    var nodeDepth = 6;
    var numberOfChildren = 10;

    createChildrenArray(totalTree);

    //Function creates children for node
    function createChildrenArray(object){
        console.log(object);
        if(object["moName"].length>nodeDepth*2)return;
        else{
            var childrenArray = new Array();

            //For Random number fo chidlren
            var x = Math.floor((Math.random()*numberOfChildren+1));
            //For specific number of children
           //var x = numberOfChildren;

            for(var i=0;i<x;i++){
                childrenArray.push({
                    "moName":object.moName +"."+i,
                    "moType":"Type: "+object.moName +"."+i,
                    "poId":object.poId+ "" + i,
                    "fdn":object.fdn +",VERYVERYLONGFDNNAME" + i,
                    "items":null
                });
            }
            childrenArray.forEach(function(e){
                createChildrenArray(e);
            });
            object.childrens = childrenArray;
        }
    }

    //Recursive Brute force search of generated tree
    //Returns grandparent, parent and selected node subtrees
    function returnSubtreesForPoid(poid, treeToSearch){

        var gpSubTree, pSubTree,selectedSubTree;
        var toReturn = [];

        if(treeToSearch.childrens) {
            treeToSearch.childrens.forEach(function(e){
                if(e.childrens) {
                    e.childrens.forEach(function(f){
                        if(f.poId == poid){
                            gpSubTree={};
                            pSubTree={};
                            selectedSubTree={};
                            selectedSubTree.moName = f.moName;
                            selectedSubTree.poId = f.poId;
                            selectedSubTree.moType = f.moType;
                            selectedSubTree.fdn = f.fdn;

                            var selectedChildren =[];
                            if(f.childrens){
                                f.childrens.forEach(function(x){
                                    selectedChildren.push({
                                        "moName" : x.moName,
                                        "poId" : x.poId,
                                        "moType" : x.moType,
                                        "fdn" : x.fdn
                                    })
                                });
                            }
                            selectedSubTree.childrens = selectedChildren;

                            pSubTree.moName = e.moName;
                            pSubTree.poId = e.poId;
                            pSubTree.moType = e.moType;
                            pSubTree.fdn = e.fdn;

                            //psub children = e children without their children
                            var parentChildren =[];
                            e.childrens.forEach(function(x){
                               parentChildren.push({
                                    "moName" : x.moName,
                                    "poId" : x.poId,
                                    "moType" : x.moType,
                                    "fdn" : x.fdn
                               })
                            });
                            pSubTree.childrens = parentChildren;

                            gpSubTree.moName = treeToSearch.moName;
                            gpSubTree.poId = treeToSearch.poId;
                            gpSubTree.moType = treeToSearch.moType;
                            gpSubTree.fdn = treeToSearch.fdn;
                            //gsub children = e children without their children

                            var grandParentChildren =[];
                            treeToSearch.childrens.forEach(function(x){
                                grandParentChildren.push({
                                    "moName" : x.moName,
                                    "poId" : x.poId,
                                    "moType" : x.moType,
                                    "fdn" : x.fdn
                                })
                            });
                            gpSubTree.childrens =  grandParentChildren;

                        }
                    });
                }
            });
        }

        if(gpSubTree != undefined  && pSubTree!= undefined  && selectedSubTree!= undefined ){
            if(gpSubTree.moName ==null){
                gpSubTree = null;
            }
            if(pSubTree.moName ==null){
                pSubTree = null;
            }
            toReturn = [selectedSubTree, pSubTree ,gpSubTree];
            return toReturn;
        }
        else {
            var numChildrens = treeToSearch.childrens? treeToSearch.childrens.length: 0;

            for(var j=0 ;j<numChildrens;j++){
                var temp = returnSubtreesForPoid(poid, treeToSearch.childrens[j]);
                if(temp !=undefined ){
                    return temp;
                }
            }
        }
    }

    //Returns Requested SubTrees for POid
    app.get('/managedObjects/topology/:poId/subTrees',function(req,res){
        console.log("rest started" +req);

        res.set('Content-Type', 'application/json');
        var poId = req.params.poId;

        var subTrees = returnSubtreesForPoid(poId,
            {
                "moName":null,
                "poId":null,
                "childrens":
                    [{
                        "moName": null,
                        "poId":null,
                        "childrens":[totalTree]
                    }
                ]
            }
        );
        /**
         * Possible Cases:
         * 0
         * 0,-2
         * 0:-2
         */

        //Parse out relative depth portion of query string, ie up to childDepth
        var treesRequested = req.query.relativeDepth;//.substring(0,req.query.relativeDepth.indexOf('c')-1);

        var indexes =[];

        //Comma case
        if(treesRequested.indexOf(',') !== -1){
            indexes = treesRequested.split(',');

        }
        //Colon Case
        else if(treesRequested.indexOf(':') !== -1){

            var z = treesRequested.split(':');
            console.log("In colon branch -"+z);

            for(var q= parseInt(z[0]); q>=parseInt(z[1]);q--) {
                indexes.push(q+"");
            }
            console.log("Before Parse: "+indexes);
        }

        //Base case
        else{
            indexes =[treesRequested];
        }

        //Convert indexes to positive numbers
        indexes.forEach(function(e,i){
            indexes[i] = parseInt(e)*-1;
        });
        var treeNodes =[];

        //Push to treeNodes the subTree at each of our rerquested indexes
        indexes.forEach(function(e){
            treeNodes.push(subTrees[e]);
        })

        res.send({"treeNodes":treeNodes});

    });

    //Attributes: Needs improvement
    //Parses Poid and creates moName as for subTrees
    app.get('/managedObjects/topology/:poId/attributes',function(req,res){
        console.log("rest started" +req);

        res.set('Content-Type', 'application/json');
        var poId = req.params.poId;

        var number = poId.toString();

        var moName = number.split("").reduce(function(prev,curr){
                return prev+"."+curr;
            },"").substr(1);

        var subTrees = returnSubtreesForPoid(poId,
            {
                "moName":null,
                "poId":null,
                "childrens":
                    [{
                        "moName": null,
                        "poId":null,
                        "childrens":[totalTree]
                    }
                    ]
            }
        );

        var fdn = subTrees[0].fdn;

        var attributes = {
                "moName":moName,
                "Type":"RandomType",
                "poId":poId,
                "fdn": fdn,
                "items":[
                    {
                        "key":"Attribute Key1",
                        "value":"Attribute Value1"
                    },
                    {
                        "key":"Attribute Key2",
                        "value":"Attribute Value2"
                    }
                ]
            };

        res.send(attributes);

    });

    //Test Function: Gives Full Tree
    app.get('/treeTest', function (req, res) {
        console.log("rest started" +req);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(totalTree));
    });

    //Test Function for SubsTrees
    app.get('/searchTest/:number', function (req, res) {
        console.log("rest started" +req);
        var number = req.params.number;
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(returnSubtreesForPoid(number,
            {
                "moName":null,
                "poId":null,
                "childrens":
                    [{
                        "moName": null,
                        "poId":null,
                        "childrens":[totalTree]
                    }
                    ]
            }
        )));
    });
}

define([], function() {
    return {
        //Takes a xml doc and xpath and returns teh count
        xpathCount: function(xmlDocument, xpath) {
            var x =[];
            var text = xmlDocument.evaluate(xpath,xmlDocument,null,7,null);
            for (var i=0 ; i < text.snapshotLength; i++)
            {
                x.push(text.snapshotItem(i));
            }
            return x.length;
        },

        //takes an xml and xpath and
        xpathFindsMatch: function(xmlDocument, xpath) {
            var x =[];
            var text = xmlDocument.evaluate(xpath,xmlDocument,null,7,null);
            for (var i=0 ; i < text.snapshotLength; i++)
            {
                x.push(text.snapshotItem(i));
            }
            return x.length>0;
        },

        //Takes a xml doc and xpath and returns array of results
        xpathItems: function(xmlDocument, xpath) {
            var x =[];
            var text = xmlDocument.evaluate(xpath,xmlDocument,null,7,null);
            for (var i=0 ; i < text.snapshotLength; i++)
            {
                x.push(text.snapshotItem(i));
            }
            return x;
        }
    };
});

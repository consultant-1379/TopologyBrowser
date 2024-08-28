define(function() {
    function LocationState() {

		// Handle app name correctly in url creation/parsing

        var attributes = {};

        function hasAttribute(id) {
            return attributes.hasOwnProperty(id);
        }

        this.reset = function() {
            Object.keys(attributes).forEach(function(attributeName) {
                attributes[attributeName].changed = false;
            });
        };

        this.set = function(id, value) {
            var changed = false;

			// To have empty strings instead of undefined internally
            if (value === undefined || value === null) {
                value = '';
            }

            if (!hasAttribute(id)) {
                changed = true;
            } else if (hasAttribute(id) && attributes[id].value !== value) {
                changed = true;
            }

            attributes[id] = {value: value, changed: changed};
        };

        this.get = function(id) {
            var result = '';

            if (hasAttribute(id)) {
                result = attributes[id].value;
            }

            return result;
        };

        this.hasChanged = function(id) {
            var result = false;

            if (hasAttribute(id) && attributes[id].changed) {
                result = true;
            }

            return result;
        };

        this.flatten = function() {
            var result = {};

            Object.keys(attributes).forEach(function(attrName) {
                result[attrName] = this.get(attrName);
            }, this);
            return result;
        };

        this.extractParams = function(hash) {

            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                url = hash,
                params = [],
                match;
            while ((match = regex.exec(url)) !== null) {
                params[match[1]] = match[2];
            }

            var appName = /#?\w*/g.exec(hash)[0];
            appName = appName.replace('#', '');
            params.appName = appName;

            var urlParts = hash.split('#topologybrowser', 2);
            var urlParts1 = hash.split('/', 2);
            var urlParts2 = hash.split('?', 3);

            if (urlParts.length > 1 && urlParts1.length < 2) {
                params.mode = urlParts[0] + urlParts[1];
            } else if (urlParts1.length > 1) {
                params.mode0 = urlParts1[0];
                params.mode1 = urlParts2[1] + '?' + urlParts2[2];
            }

            return params;
        };

        this.getMode = function() {
            return this.get('mode');
        };

        this.getName = function() {
            return this.get('name');
        };

        this.getSortAttribute = function() {
            return this.get('sortby');
        };

        this.updateFromHash = function(hash) {

            var params = this.extractParams(hash);

            if (params.appName) {
                this.set('appName', params.appName);
            }

            if (params.name && params.name !== '') {
                this.set('name', params.name);
            }

            if (params.mode && params.mode !== '') {
                this.set('mode', params.mode);
            }

            if (params.page && params.page !== '') {
                this.set('page', parseInt(params.page, 10));
            }

            if (params.items && params.items !== '') {
                if (params.items !== 'All') {
                    this.set('items', parseInt(params.items,10));
                } else {
                    this.set('items', 'All');
                }
            }

            if (params.sortmode && params.sortmode !== '') {
                this.set('sortmode', params.sortmode);
            }

            if (params.sortby && params.sortby !== '') {
                if (params.sortby !== 'name' && params.sortby !== 'type' && params.sortby !== 'status') {
                    this.set('sortby', 'name');
                } else {
                    this.set('sortby', params.sortby);
                }
            }

            if (params.uniqueIdentifier && params.uniqueIdentifier !== '') {
                this.set('uniqueIdentifier', params.uniqueIdentifier);
            } else {
                this.set('uniqueIdentifier', 'undefined');
            }

            if (params.status && params.status !== '') {
                this.set('status', params.status);
            } else {
                this.set('status', 'undefined');
            }

            if (params.currentTab && params.currentTab !== '') {
                this.set('currentTab', params.currentTab);
            } else {
                this.set('currentTab', 'undefined');
            }
        };

        this.toUrl = function() {
            var urlParts = [this.get('appName'), this.getMode()];
            var params = [];
            if (hasAttribute('name') && this.get('name') !== null) {
                var name = this.get('name');
                params.push('name=' + name);
            }
            if (hasAttribute('explorer') && this.get('explorer') !== null) {
                var explorer = this.get('explorer');
                params.push('explorer=' + explorer);
            }

            if (hasAttribute('returnType') && this.get('returnType') !== null) {
                var returnType = this.get('returnType');
                params.push('returnType=' + returnType);
            }
			// Put all again together so that URL is created that will be updated in application
            //return urlParts.join('/') + (params.length > 0 ? ("/?" + params.join('&')) : "");

            return urlParts.join('') + (params.length > 0 ? ('&' + params.join('&')) : '');
        };
    }

    return LocationState;
});

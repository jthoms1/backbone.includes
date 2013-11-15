(function(root, factory) {
    "use strict";

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function(Backbone, _) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            factory(Backbone, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'),
        Backbone = require('backbone');

        factory(Backbone, _);

    // Finally, as a browser global.
    } else {
        factory(root.Backbone, root._);
    }

}(this, function(Backbone, _) {
    "use strict";

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var CommonIncludesMixin = {
        getModelName: function () {
            return this.modelName || this.model.modelName;
        },
        setIncludes: function () {
            this._includesList = {};

            _.each(arguments, function (includedItem) {
                var subIncludes = [];
                if (_.isArray(includedItem)) {
                    var tmpItem = includedItem.shift();
                    subIncludes = includedItem;
                    includedItem = tmpItem;
                }
                this._includesList[includedItem.prototype.getModelName()] = {
                    "modelOrCollection": includedItem,
                    "subIncludes": subIncludes
                };
            }, this);

            return this;
        },
        // Default build process for including sub models and collections
        _buildIncludes: function (_includesList) {
            var includeList = [];
            _.each(_includesList, function (includedItem, modelName) {
                var includeString = modelName;
                if (includedItem.subIncludes.length > 0) {
                    includeString += '/' + (includedItem.subIncludes[0].prototype.getModelName());
                }
                includeList.push(includeString);
            });
            return includeList.join();
        }
    };

    var ModelIncludesMixin = {
        set: _.wrap(Backbone.Model.prototype.set, function (bbpSet, key, val, options) {
            bbpSet.call(this, key, val, options);
            this._updateIncludesMethods();
            return this;
        }),
        _updateIncludesMethods: function () {
            var listToIterate = {};
            if (this._includesList) {
                listToIterate = this._includesList;
            } else if (this.collection && this.collection._includesList) {
                listToIterate = this.collection._includesList;
            }

            _.each(listToIterate, function (includedItem, modelName) {
                this._includeMethod(includedItem.modelOrCollection, modelName, includedItem.subIncludes);
            }, this);
        },
        _includeMethod: function (Resource, modelName, subIncludes) {
            var methodName = 'get' + capitaliseFirstLetter(modelName);

            if (_.isArray(this.get(modelName))) {
                methodName += 's';
            } else {
                Resource = Resource.prototype.model || Resource;
            }

            this[methodName] = this._getAttributeMethod(Resource, modelName, subIncludes);
        },
        _getAttributeMethod: function (Resource, modelName, subIncludes) {
            var _this = this;

            return function () {
                this._includedListValues = this._includedListValues || {};

                // If the item has already been created then return its reference.
                if (_this._includedListValues[modelName]) {
                    return _this._includedListValues[modelName];
                }
                
                var subItem = _this._includedListValues[modelName] = new Resource();
                subItem.setIncludes.apply(subItem, subIncludes);
                subItem.set(_this.get(modelName));
                return subItem;
            };
        },
        sync: _.wrap(Backbone.Model.prototype.sync, function (bbSync, method, item, options) {
            if (this._includesList) {
                options.data = _.extend({
                    "includes": this._buildIncludes(this._includesList)
                }, options.data || {});
            }
            return bbSync.call(this, method, item, options);
        })
    };

    var CollectionIncludesMixin = {
        sync: _.wrap(Backbone.Collection.prototype.sync, function (bbSync, method, item, options) {
            if (this._includesList) {
                options.data = _.extend({
                    "includes": this._buildIncludes(this._includesList)
                }, options.data || {});
            }
            return bbSync.call(this, method, item, options);
        })
    };

    _.extend(Backbone.Model.prototype, ModelIncludesMixin, CommonIncludesMixin);
    _.extend(Backbone.Collection.prototype, CollectionIncludesMixin, CommonIncludesMixin);
}));
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
        var underscore = require('underscore'),
            Backbone = require('backbone');

        factory(Backbone, underscore);

    // Finally, as a browser global.
    } else {
        factory(root.Backbone, root._);
    }

}(this, function(Backbone, _) {
    "use strict";

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Mixin that will be used in both Models and Collections
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
        }
    };

    _.extend(Backbone.Model.prototype, ModelIncludesMixin, CommonIncludesMixin);
    _.extend(Backbone.Collection.prototype, CommonIncludesMixin);
}));
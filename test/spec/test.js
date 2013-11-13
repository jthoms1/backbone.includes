(function (Backbone) {
    "use strict";

    test("object attributes are models", 4, function() {
        var User = Backbone.Model.extend({}, {
            modelName: 'user'
        });
        var Role = Backbone.Model.extend({}, {
            modelName: 'role'
        });
        var Roles = Backbone.Collection.extend({
            model: Role
        });
        var user = new User();
        user.setIncludes(Roles);
        user.set({
            'id': 1,
            'firstName': 'John',
            'lastName': 'Jackson',
            'role': {
                'id': 10,
                'name': 'admin'
            }
        });

        // Is a Backbone.View.
        ok(user.getRole() instanceof Backbone.Model, "Is a Backbone.Model");

        // Ensure the layout has a views object container.
        ok(_.isObject(user.get('role')), "attribute still exists within model");

        equal(user.getRole().get('id'), 10, "model generated ID is the same as the attribute");
        equal(user.get('role').id, user.getRole().toJSON().id, "Model data is not modified");
    });

    test("array attributes are collections", 2, function() {
        var User = Backbone.Model.extend({}, {
            modelName: 'user'
        });
        var Role = Backbone.Model.extend({}, {
            modelName: 'role'
        });
        var Roles = Backbone.Collection.extend({
            model: Role
        });
        var user = new User();
        user.setIncludes(Roles);
        user.set({
            'id': 1,
            'firstName': 'John',
            'lastName': 'Jackson',
            'role': [
                {
                    'id': 10,
                    'name': 'admin'
                }
            ]
        });

        equal(user.getRoles().at(0).get('id'), 10);
        equal(user.get('role')[0].id, user.getRoles().at(0).toJSON().id, "Model data is not modified");
    });

})(window.Backbone);
(function (Backbone, _) {
    "use strict";

    var User,
        Users,
        Role,
        Roles,
        Organization,
        Organizations,
        user,
        server;

    module( "Model XHR tests", {
        setup: function() {
            User = Backbone.Model.extend({
                urlRoot: '/api/user'
            }, {
                modelName: 'user'
            });
            Role = Backbone.Model.extend({
                urlRoot: '/api/role'
            }, {
                modelName: 'role'
            });
            Roles = Backbone.Collection.extend({
                model: Role
            });
            Organization = Backbone.Model.extend({
                urlRoot: '/api/organization'
            }, {
                modelName: 'organization'
            });
            Organizations = Backbone.Collection.extend({
                model: Organization
            });

            server = sinon.fakeServer.create();

            this.setServerData = function (testData) {
                server.respondWith("GET", "/api/user/1", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(testData)]);
            }
        },
        teardown: function () {
            server.restore();
        }
    });

    test("object attributes are models", 4, function() {
        this.setServerData({
            'id': 1,
            'firstName': 'John',
            'lastName': 'Jackson',
            'role': {
                'id': 10,
                'name': 'admin'
            }
        });

        user = new User({'id': 1});
        user.setIncludes(Roles);
        user.fetch();
        server.respond();

        ok(user.getRole() instanceof Backbone.Model, "Is a Backbone.Model");
        ok(_.isObject(user.get('role')), "attribute still exists within model");
        equal(user.getRole().get('id'), 10, "model generated ID is the same as the attribute");
        equal(user.get('role').id, user.getRole().toJSON().id, "Model data is not modified");
    });

    test("array attributes are collections", 4, function() {
        this.setServerData({
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

        user = new User({'id': 1});
        user.setIncludes(Roles);
        user.fetch();
        server.respond();

        ok(user.getRoles() instanceof Backbone.Collection, "Is a Backbone.Collection");
        ok(_.isArray(user.get('role')), "attribute still exists within model");
        equal(user.getRoles().at(0).get('id'), 10);
        equal(user.get('role')[0].id, user.getRoles().at(0).toJSON().id, "Model data is not modified");
    });

    test("multiple relationships", 8, function () {
        this.setServerData({
            'id': 1,
            'firstName': 'John',
            'lastName': 'Jackson',
            'role': [
                {
                    'id': 10,
                    'name': 'admin'
                }
            ],
            'organization': {
                'id': 4,
                'name': 'Backbone Group'
            }
        });

        user = new User({'id': 1});
        user.setIncludes(Roles, Organizations);
        user.fetch();
        server.respond();

        ok(user.getRoles() instanceof Backbone.Collection, "Is a Backbone.Collection");
        ok(_.isArray(user.get('role')), "attribute still exists within model");
        equal(user.getRoles().at(0).get('id'), 10);
        equal(user.get('role')[0].id, user.getRoles().at(0).toJSON().id, "Model data is not modified");

        ok(user.getOrganization() instanceof Backbone.Model, "Is a Backbone.Model");
        ok(_.isObject(user.get('organization')), "attribute still exists within model");
        equal(user.getOrganization().get('id'), 4, "model generated ID is the same as the attribute");
        equal(user.get('organization').id, user.getOrganization().toJSON().id, "Model data is not modified");
    });

    test("deep relationships", 8, function () {
        this.setServerData({
            'id': 1,
            'firstName': 'John',
            'lastName': 'Jackson',
            'organization': {
                'id': 4,
                'name': 'Backbone Group',
                'role': [
                    {
                        'id': 10,
                        'name': 'admin'
                    }
                ]
            }
        });

        user = new User({'id': 1});
        user.setIncludes([Organizations, Roles]);
        user.fetch();
        server.respond();

        ok(user.getOrganization() instanceof Backbone.Model, "Is a Backbone.Model");
        ok(_.isObject(user.get('organization')), "attribute still exists within model");
        equal(user.getOrganization().get('id'), 4, "model generated ID is the same as the attribute");
        equal(user.get('organization').id, user.getOrganization().toJSON().id, "Model data is not modified");

        ok(user.getOrganization().getRoles() instanceof Backbone.Collection, "Is a Backbone.Collection");
        ok(_.isArray(user.get('organization').role), "attribute still exists within model");
        equal(user.getOrganization().getRoles().at(0).get('id'), 10);
        equal(user.get('organization').role[0].id, user.getOrganization().getRoles().at(0).toJSON().id, "Model data is not modified");
    });

})(window.Backbone, window._);
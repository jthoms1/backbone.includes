[![Build
Status](https://travis-ci.org/jthoms1/backbone.includes.png?branch=master)](https://travis-ci.org/jthoms1/backbone.includes)


backbone.includes
=================

Simple library that helps manage sub models/collections within backbone.

Usage
==================
```JavaScript
/* 
 * Static attribute modelName is used to identify the model
 * as attribute as a sub model/collection within other models
 */
var User = Backbone.Model.extend({
}, {
	modelName: 'user'
});

var Role = Backbone.Model.extend({
}, {
	modelName: 'role'
});
var RoleList = Backbone.Collection.extend({
	model: Role
});

var Organization = Backbone.Model.extend({
}, {
	modelName: 'organization'
});
var OrganizationList = Backbone.Collection.extend({
	model: Organization
});

/*
 * Create model, define expected sub models/collections that will be included.
 * Passing reference to the submodels collections always backbone.includes to choose
 * whether a model or collection should be used based on whether the attribute is a
 * collection or an object.
 */
var user = new User();
user.setIncludes(OrganizationList, RoleList);
user.set({
	'id': 1,
	'firstName': 'John',
	'lastName': 'Jackson',
	'organization': [
		{
			'id': 1,
			'name': 'Earthling Interactive',
		},
		{
			'id': 4,
			'name': 'Press Box Whatups'
		}
	],
	'role': {
		'id': 10,
		'name': 'admin'
	}
});

/*
 * returns OrganizationList collection containing the User's organizations
 * - notice that the method uses plural form since this will return a collection of
 *   organizations.
 */
user.getOrganizations();

/*
 * returns Role model containing the User's role
 * - notice that the method is not in plural form since the method will return a single model
 */
user.getRole();
```
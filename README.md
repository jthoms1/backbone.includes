[![Build
Status](https://travis-ci.org/jthoms1/backbone.includes.png?branch=master)](https://travis-ci.org/jthoms1/backbone.includes)


backbone.includes
=================

Simple library that helps manage sub models/collections within backbone.

Usage
==================
```JavaScript
var User = Backbone.Model.extend({
}, {
	modelName: 'user'
});

var Role = Backbone.Model.extend({
}, {
	modelName: 'role'
});

var Organization = Backbone.Model.extend({
}, {
	modelName: 'organization'
});

var OrganizationList = Backbone.Collection.extend({
	model: Organization
});


var user = new User()
user.setIncludes(Organizations, Roles);
user.set({
	'id': 1,
	'firstName': 'John',
	'lastName': 'Jackson',
	'organizations': [
		{
			'id': 1,
			'name': 'Earthling Interactive',
			''
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
 */
user.getOrganizations();

/*
 * returns Role model containing the User's role
 */
user.getRole();
```
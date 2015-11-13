'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module( 'myApp', ['myApp.filters', 'myApp.directives'] );


app.userConfigs = {};
app.userConfigs.apiPath = "http://53007-appdev/CardTest/api/";
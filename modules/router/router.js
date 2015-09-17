'use strict';

var read = require('pages/read/read');

/**
 * Route configuration for the RDash module.
 */
angular.module('douban').config(function ($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('app/index');

    // Application routes
    $stateProvider
    	.state('app', {
			abstract: true,
			url: '/app',
			template: __inline('./../main/main.html')
		})
        .state('app.index', read);
        
});
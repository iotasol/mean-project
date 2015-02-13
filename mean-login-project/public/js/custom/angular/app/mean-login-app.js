'use-strict';
/*App Module*/
angular.module('mean-login-service', []);
angular.module('mean-login-controller', ['mean-login-service']);
angular.module('mean-login-app', [ 'ngResource', 'mean-login-service', 'mean-login-controller', 'angularUtils.directives.dirPagination']);

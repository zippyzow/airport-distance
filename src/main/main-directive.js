airModule.directive('airMain', function() {
  return {
    restrict: 'E',
    templateUrl: 'main/main.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  };
});
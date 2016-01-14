var app = angular.module("signInApp", ['firebase']);

app.controller("ListCtrl", function($scope, $firebaseArray, $firebaseAuth) {
	var ref = new Firebase("https://moli-checkin.firebaseio.com/");
	//$scope.authObj = $firebaseAuth(ref);
	$scope.lists = $firebaseArray(ref.child('list')); 
});